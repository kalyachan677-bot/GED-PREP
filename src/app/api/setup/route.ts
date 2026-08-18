export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { MIGRATION_SQL } from "@/lib/migration-sql";
import { EXTRA_QUESTIONS } from "@/lib/extra-questions";
import { GED_VOCABULARY } from "@/lib/vocab-data";

export const dynamic = "force-dynamic";

let isSeeding = false;

// ==========================================================================
// HELPERS: batch SQL support
// ==========================================================================
function genId(): string {
  const a = "abcdefghijklmnopqrstuvwxyz0123456789";
  const ts = Math.floor(Date.now() / 1000).toString(36);
  let id = ts;
  for (let i = id.length; i < 25; i++) id += a[Math.floor(Math.random() * a.length)];
  return id;
}

function esc(val: string | null | undefined): string {
  if (val == null) return "NULL";
  return "'" + String(val).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
}

// ==========================================================================
// HANDLERS
// ==========================================================================
export async function GET(request: NextRequest) {
  try {
    if (isSeeding) {
      return NextResponse.json({ status: "seeding", message: "Seeding in progress..." });
    }

    const { searchParams } = new URL(request.url);
    const forceParam = searchParams.get("force");

    try {
      const count = await db.user.count();
      if (count > 0) {
        const totalQ = await db.question.count();
        const nullQ = await db.question.count({ where: { questionText: { in: [null, ""] as any } } });
        const totalA = await db.answer.count();
        const diagnostics = { totalQuestions: totalQ, nullTextQuestions: nullQ, totalAnswers: totalA };

        if (forceParam === "1" || nullQ > 0 || totalQ === 0) {
          isSeeding = true;
          try {
            const res = await forceReseedQuestionsBatch();
            // Also ensure flashcards exist on force reseed
            const fc = await db.flashcard.count();
            let flashcardResult: string | undefined;
            if (fc === 0) {
              await seedFlashcards();
              flashcardResult = `seeded ${await db.flashcard.count()} flashcards`;
            }
            const newTotal = await db.question.count();
            const newNull = await db.question.count({ where: { questionText: { in: [null, ""] as any } } });
            return NextResponse.json({
              status: "reseeded",
              ...diagnostics,
              reseedResult: res,
              flashcardResult,
              afterReseed: { totalQuestions: newTotal, nullTextQuestions: newNull },
            });
          } finally {
            isSeeding = false;
          }
        }

        return NextResponse.json({ status: "ready", ...diagnostics });
      }
    } catch {
      // Tables don't exist yet
    }

    isSeeding = true;
    try {
      await fullSetup();
    } finally {
      isSeeding = false;
    }

    const subjects = await db.subject.count();
    const questions = await db.question.count({ where: { isActive: true } });
    const users = await db.user.count();
    return NextResponse.json({ status: "seeded", users, subjects, questions, message: "Setup complete!" });
  } catch (error: unknown) {
    isSeeding = false;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup] Error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let forceReseed = false;
    try {
      const body = await request.json();
      forceReseed = body?.force === true;
    } catch { /* no body */ }

    if (forceReseed) {
      const result = await forceReseedQuestionsBatch();
      return NextResponse.json(result);
    }

    return GET(request);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup] POST Error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}

// ==========================================================================
// BATCH RESEED — 730 individual queries → 6 queries (fast, no timeout)
// ==========================================================================
async function forceReseedQuestionsBatch() {
  try {
    console.log("[setup] Batch reseed: cleaning...");
    // Only delete answer-dependent records, NOT QuizAttempt (preserve user history)
    await db.$executeRawUnsafe(`DELETE FROM "QuizAttemptAnswer"`);
    await db.$executeRawUnsafe(`DELETE FROM "SpacedRepetition"`);
    await db.$executeRawUnsafe(`DELETE FROM "Answer"`);
    await db.$executeRawUnsafe(`DELETE FROM "Question"`);

    // Get lessons
    const lessons = await db.lesson.findMany({
      select: { id: true, title: true, subjectId: true, slug: true, subject: { select: { code: true, id: true } } },
    });

    const lessonByTitle = new Map<string, { id: string; subjectId: string }>();
    const lessonBySlug = new Map<string, { id: string; subjectId: string }>();
    const lessonsBySubjectCode = new Map<string, { id: string; subjectId: string }[]>();

    for (const l of lessons) {
      lessonByTitle.set(l.title, { id: l.id, subjectId: l.subjectId });
      if (l.slug) lessonBySlug.set(l.slug, { id: l.id, subjectId: l.subjectId });
      const code = l.subject?.code || "";
      if (!lessonsBySubjectCode.has(code)) lessonsBySubjectCode.set(code, []);
      lessonsBySubjectCode.get(code)!.push({ id: l.id, subjectId: l.subjectId });
    }

    // Build all SQL rows in memory (no DB calls)
    const qRows: string[] = [];
    const aRows: string[] = [];
    let created = 0;
    let skipped = 0;
    const matchedLessons: string[] = [];
    const skippedLessons: string[] = [];

    for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
      let info: { id: string; subjectId: string } | undefined;

      // Strategy 1: Exact title
      info = lessonByTitle.get(lessonTitle);

      // Strategy 2: Slug match
      if (!info) {
        const meta = SUBJECT_LESSON_MAP[lessonTitle];
        if (meta) info = lessonBySlug.get(meta.slug);
      }

      // Strategy 3: Fallback to first lesson in subject
      if (!info) {
        const meta = SUBJECT_LESSON_MAP[lessonTitle];
        if (meta) {
          const arr = lessonsBySubjectCode.get(meta.code);
          if (arr?.length) info = arr[0];
        }
      }

      if (!info) { skippedLessons.push(lessonTitle); skipped++; continue; }
      matchedLessons.push(lessonTitle);

      for (const [qText, answers, difficulty, explanation, tags] of questions) {
        const text = qText as string;
        if (!text) continue;
        const qId = genId();
        const pts = (difficulty as string) === "hard" ? 3 : (difficulty as string) === "medium" ? 2 : 1;
        qRows.push(
          `('${qId}',${esc(info.id)},${esc(info.subjectId)},'multiple_choice',${esc(difficulty as string)},${pts},${esc(text)},${esc(explanation as string)},NULL,true,NULL,${esc(JSON.stringify(tags as string[]))},NULL,NOW(),NOW())`
        );
        for (let i = 0; i < (answers as [string, boolean][]).length; i++) {
          const [content, isCorrect] = (answers as [string, boolean][])[i];
          aRows.push(`('${genId()}','${qId}',${esc(content)},${isCorrect},${i},NULL,NOW())`);
        }
        created++;
      }
    }

    // Execute batch inserts (chunked to avoid query size limits)
    const Q_COLS = `"id","lessonId","subjectId","questionType","difficulty","points","questionText","explanation","hintText","isActive","sourceTag","tags","relatedConceptId","createdAt","updatedAt"`;
    for (let i = 0; i < qRows.length; i += 50) {
      await db.$executeRawUnsafe(`INSERT INTO "Question" (${Q_COLS}) VALUES ${qRows.slice(i, i + 50).join(",")}`);
    }

    const A_COLS = `"id","questionId","content","isCorrect","sortOrder","explanation","createdAt"`;
    for (let i = 0; i < aRows.length; i += 100) {
      await db.$executeRawUnsafe(`INSERT INTO "Answer" (${A_COLS}) VALUES ${aRows.slice(i, i + 100).join(",")}`);
    }

    console.log(`[setup] Batch reseed done: ${created} Q, ${aRows.length} A in ~6 queries`);
    return {
      status: "reseeded",
      createdQuestions: created,
      createdAnswers: aRows.length,
      matchedLessons: matchedLessons.length,
      skippedLessons,
      skippedLessonNames: skippedLessons,
      dbLessonCount: lessons.length,
      message: `Batch re-seeded ${created} questions (${aRows.length} answers)`,
    };
  } catch (e) {
    console.error("[setup] Batch reseed FAILED:", e);
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}

// ==========================================================================
// Subject mapping for EXTRA_QUESTIONS keys
// ==========================================================================
const SUBJECT_LESSON_MAP: Record<string, { code: string; module: string; topic: string; slug: string }> = {
  // MATH
  "What is a Linear Equation?":          { code: "math", module: "Algebraic Foundations", topic: "Solving Linear Equations", slug: "what-is-linear-equation" },
  "Solving Inequalities":                { code: "math", module: "Algebraic Foundations", topic: "Solving Inequalities", slug: "solving-inequalities" },
  "Working with Units and Measurement":   { code: "math", module: "Number Sense", topic: "Measurement", slug: "units-and-measurement" },
  "Geometry Basics":                    { code: "math", module: "Geometry", topic: "Basic Shapes", slug: "geometry-basics" },
  "The Coordinate Plane and Graphing":   { code: "math", module: "Algebraic Foundations", topic: "Graphing", slug: "coordinate-plane" },
  "Data Analysis and Statistics":         { code: "math", module: "Data Analysis", topic: "Statistics", slug: "data-analysis-statistics" },
  "Introduction to Probability":        { code: "math", module: "Data Analysis", topic: "Probability", slug: "introduction-probability" },
  "Percentages, Ratios, and Proportions": { code: "math", module: "Number Sense", topic: "Percents and Ratios", slug: "percentages-ratios" },
  "Functions and Graphs":               { code: "math", module: "Algebraic Foundations", topic: "Functions", slug: "functions-and-graphs" },
  "Polynomials and Exponents":           { code: "math", module: "Algebraic Foundations", topic: "Polynomials", slug: "polynomials-exponents" },
  "Quadratic Equations":                 { code: "math", module: "Algebraic Foundations", topic: "Quadratics", slug: "quadratic-equations" },
  "Number Sense and Operations":          { code: "math", module: "Number Sense", topic: "Basic Operations", slug: "number-sense" },
  // SCIENCE
  "Cell Structure and Organelles":       { code: "science", module: "Life Science", topic: "Cell Biology", slug: "cell-structure" },
  "Chemical Reactions":                  { code: "science", module: "Physical Science", topic: "Chemistry", slug: "chemical-reactions" },
  "DNA and Genes":                      { code: "science", module: "Life Science", topic: "Genetics", slug: "dna-and-genes" },
  "Newton's Laws of Motion":            { code: "science", module: "Physical Science", topic: "Physics", slug: "newtons-laws" },
  "Speed, Velocity, and Acceleration":   { code: "science", module: "Physical Science", topic: "Motion", slug: "speed-velocity-acceleration" },
  "Cell Division: Mitosis and Meiosis":  { code: "science", module: "Life Science", topic: "Cell Division", slug: "cell-division" },
  "Atoms and the Periodic Table":        { code: "science", module: "Physical Science", topic: "Chemistry Basics", slug: "atoms-periodic-table" },
  "Punnett Squares":                    { code: "science", module: "Life Science", topic: "Heredity", slug: "punnett-squares" },
  "The Scientific Method":              { code: "science", module: "General Science", topic: "Scientific Method", slug: "scientific-method" },
  "Energy and Work":                     { code: "science", module: "Physical Science", topic: "Energy", slug: "energy-and-work" },
  "Ecology and Ecosystems":               { code: "science", module: "Earth Science", topic: "Ecology", slug: "ecology-ecosystems" },
  // RLA
  "Making Inferences":                  { code: "rla", module: "Reading Comprehension", topic: "Inferences", slug: "making-inferences" },
  "Author's Purpose":                   { code: "rla", module: "Reading Comprehension", topic: "Author Purpose", slug: "authors-purpose" },
  "Subject-Verb Agreement":              { code: "rla", module: "Grammar", topic: "Verb Agreement", slug: "subject-verb-agreement" },
  "Comma Rules":                        { code: "rla", module: "Grammar", topic: "Punctuation", slug: "comma-rules" },
  "Point of View":                       { code: "rla", module: "Reading Comprehension", topic: "Perspective", slug: "point-of-view" },
  "Complete Sentences vs. Fragments":    { code: "rla", module: "Grammar", topic: "Sentence Structure", slug: "complete-sentences-fragments" },
  "Apostrophes and Quotation Marks":     { code: "rla", module: "Grammar", topic: "Punctuation", slug: "apostrophes-quotation-marks" },
  "Finding the Main Idea":               { code: "rla", module: "Reading Comprehension", topic: "Main Idea", slug: "finding-the-main-idea" },
  "Text Structure and Organization":      { code: "rla", module: "Reading Comprehension", topic: "Text Structure", slug: "text-structure" },
  "Vocabulary in Context":               { code: "rla", module: "Reading Comprehension", topic: "Vocabulary", slug: "vocabulary-in-context" },
  // SS
  "The Declaration of Independence":      { code: "ss", module: "American History", topic: "Founding Documents", slug: "declaration-of-independence" },
  "The U.S. Constitution":              { code: "ss", module: "American History", topic: "Founding Documents", slug: "the-us-constitution" },
  "The Civil Rights Movement Overview":  { code: "ss", module: "American History", topic: "Civil Rights", slug: "civil-rights-movement" },
  "Key Figures: MLK and Rosa Parks":     { code: "ss", module: "American History", topic: "Civil Rights", slug: "key-figures-mlk-rosa" },
  "Legislative Branch: Congress":        { code: "ss", module: "Civics", topic: "Government Structure", slug: "legislative-branch" },
  "Executive and Judicial Branches":      { code: "ss", module: "Civics", topic: "Government Structure", slug: "executive-judicial-branches" },
  "How Elections Work":                 { code: "ss", module: "Civics", topic: "Elections", slug: "how-elections-work" },
  "Political Parties and the Two-Party System": { code: "ss", module: "Civics", topic: "Political Parties", slug: "political-parties" },
  "Economics Basics":                   { code: "ss", module: "Economics", topic: "Fundamentals", slug: "economics-basics" },
  "World Wars and Global Conflicts":     { code: "ss", module: "World History", topic: "World Wars", slug: "world-wars" },
  "Maps, Geography, and Human-Environment Interaction": { code: "ss", module: "Geography", topic: "Maps and Geography", slug: "maps-geography" },
  "The Bill of Rights":                  { code: "ss", module: "American History", topic: "Founding Documents", slug: "bill-of-rights" },
};

// ==========================================================================
// FULL SEED DATA (first-time setup)
// ==========================================================================
async function fullSetup() {
  console.log("[setup] Creating tables...");
  const statements = MIGRATION_SQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await db.$executeRawUnsafe(stmt + ";");
    } catch (e) {
      console.log("[setup] SQL ok or skipped:", stmt.substring(0, 80));
    }
  }
  console.log("[setup] Tables created.");

  const existing = await db.user.findUnique({ where: { email: "demo@ged.com" } });
  if (!existing) {
    const hash = await bcrypt.hash("demo1234", 12);
    await db.user.create({
      data: {
        email: "demo@ged.com",
        passwordHash: hash,
        firstName: "Demo",
        lastName: "Student",
        displayName: "Demo Student",
        role: "student",
        status: "active",
        preferredLang: "th",
      },
    });
    console.log("[setup] Demo user created.");
  }

  const subjectCount = await db.subject.count();
  if (subjectCount === 0) {
    console.log("[setup] Seeding full data...");
    await seedAllData();
  }

  // Always ensure flashcards exist (idempotent)
  const flashcardCount = await db.flashcard.count();
  if (flashcardCount === 0) {
    console.log("[setup] Seeding flashcards...");
    await seedFlashcards();
  } else {
    console.log(`[setup] Flashcards already exist: ${flashcardCount}`);
  }
}

async function seedAllData() {
  // Create subjects (4 individual creates — fast)
  const math = await db.subject.create({
    data: { code: "math", title: "Mathematical Reasoning", description: "Algebra, geometry, data analysis", colorHex: "10B981", sortOrder: 0, status: "published" },
  });
  const science = await db.subject.create({
    data: { code: "science", title: "Science", description: "Life, physical, and earth & space science", colorHex: "3B82F6", sortOrder: 1, status: "published" },
  });
  const rla = await db.subject.create({
    data: { code: "rla", title: "Reasoning Through Language Arts", description: "Reading comprehension, writing, grammar", colorHex: "F59E0B", sortOrder: 2, status: "published" },
  });
  const ss = await db.subject.create({
    data: { code: "ss", title: "Social Studies", description: "History, civics, economics, geography", colorHex: "EF4444", sortOrder: 3, status: "published" },
  });

  const subjectByCode = new Map<string, { id: string }>([
    ["math", { id: math.id }],
    ["science", { id: science.id }],
    ["rla", { id: rla.id }],
    ["ss", { id: ss.id }],
  ]);

  const moduleMap = new Map<string, string>();
  const topicMap = new Map<string, string>();
  const lessonMap = new Map<string, { id: string; subjectId: string }>();

  // Create modules, topics, lessons (individual creates — ~70 total, acceptable)
  for (const [lessonTitle, meta] of Object.entries(SUBJECT_LESSON_MAP)) {
    const subj = subjectByCode.get(meta.code);
    if (!subj) continue;

    const modKey = meta.code + ":" + meta.module;
    let moduleId = moduleMap.get(modKey);
    if (!moduleId) {
      const mod = await db.module.create({
        data: { subjectId: subj.id, title: meta.module, sortOrder: moduleMap.size, status: "published" },
      });
      moduleId = mod.id;
      moduleMap.set(modKey, moduleId);
    }

    const topKey = modKey + ":" + meta.topic;
    let topicId = topicMap.get(topKey);
    if (!topicId) {
      const top = await db.topic.create({
        data: { moduleId, title: meta.topic, sortOrder: topicMap.size, status: "published" },
      });
      topicId = top.id;
      topicMap.set(topKey, topicId);
    }

    const lesson = await db.lesson.create({
      data: {
        topicId,
        title: lessonTitle,
        slug: meta.slug,
        contentType: "text",
        bodyContent: JSON.stringify([{ id: "blk_1", block_type: "paragraph", content: "Content for " + lessonTitle }]),
        durationMinutes: 15,
        sortOrder: 0,
        status: "published",
        lessonType: "core_topic",
      },
    });
    lessonMap.set(lessonTitle, { id: lesson.id, subjectId: subj.id });
  }

  // ★ KEY FIX: Create questions via BATCH SQL (not 730 individual creates)
  const qRows: string[] = [];
  const aRows: string[] = [];
  let qCount = 0;

  for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
    const info = lessonMap.get(lessonTitle);
    if (!info) { console.log("[setup] WARNING: No lesson for:", lessonTitle); continue; }

    for (const [qText, answers, difficulty, explanation, tags] of questions) {
      const text = qText as string;
      if (!text) continue;
      const qId = genId();
      const pts = (difficulty as string) === "hard" ? 3 : (difficulty as string) === "medium" ? 2 : 1;
      qRows.push(
        `('${qId}',${esc(info.id)},${esc(info.subjectId)},'multiple_choice',${esc(difficulty as string)},${pts},${esc(text)},${esc(explanation as string)},NULL,true,NULL,${esc(JSON.stringify(tags as string[]))},NULL,NOW(),NOW())`
      );
      for (let i = 0; i < (answers as [string, boolean][]).length; i++) {
        const [content, isCorrect] = (answers as [string, boolean][])[i];
        aRows.push(`('${genId()}','${qId}',${esc(content)},${isCorrect},${i},NULL,NOW())`);
      }
      qCount++;
    }
  }

  // Batch insert
  const Q_COLS = `"id","lessonId","subjectId","questionType","difficulty","points","questionText","explanation","hintText","isActive","sourceTag","tags","relatedConceptId","createdAt","updatedAt"`;
  for (let i = 0; i < qRows.length; i += 50) {
    await db.$executeRawUnsafe(`INSERT INTO "Question" (${Q_COLS}) VALUES ${qRows.slice(i, i + 50).join(",")}`);
  }
  const A_COLS = `"id","questionId","content","isCorrect","sortOrder","explanation","createdAt"`;
  for (let i = 0; i < aRows.length; i += 100) {
    await db.$executeRawUnsafe(`INSERT INTO "Answer" (${A_COLS}) VALUES ${aRows.slice(i, i + 100).join(",")}`);
  }

  console.log(`[setup] Seeded ${qCount} questions, ${aRows.length} answers across ${lessonMap.size} lessons (batch SQL)`);

  // Seed flashcards as part of initial setup
  await seedFlashcards();
}

// ==========================================================================
// FLASHCARD SEEDING — GED vocabulary (idempotent)
// ==========================================================================
async function seedFlashcards() {
  const subjects = await db.subject.findMany({ select: { id: true, code: true } });
  const codeToId = new Map<string, string>(subjects.map((s) => [s.code, s.id]));

  const fRows: string[] = [];
  const F_COLS = `"id","subjectId","term","translation","pronunciation","meaning","sortOrder","createdAt","updatedAt"`;
  let fCount = 0;

  for (const [code, words] of Object.entries(GED_VOCABULARY)) {
    const subjectId = codeToId.get(code);
    if (!subjectId) { console.log(`[setup] WARNING: No subject for code: ${code}`); continue; }

    for (let i = 0; i < words.length; i++) {
      const [term, translation, pronunciation, meaning] = words[i];
      const fId = genId();
      fRows.push(
        `('${fId}','${subjectId}',${esc(term)},${esc(translation)},${esc(pronunciation)},${esc(meaning)},${i},NOW(),NOW())`
      );
      fCount++;
    }
  }

  // Batch insert (chunked)
  for (let i = 0; i < fRows.length; i += 50) {
    await db.$executeRawUnsafe(`INSERT INTO "Flashcard" (${F_COLS}) VALUES ${fRows.slice(i, i + 50).join(",")}`);
  }

  console.log(`[setup] Seeded ${fCount} flashcards across ${Object.keys(GED_VOCABULARY).length} subjects`);
}
