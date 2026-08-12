import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { MIGRATION_SQL } from "@/lib/migration-sql";
import { EXTRA_QUESTIONS } from "@/lib/extra-questions";

export const dynamic = "force-dynamic";

let isSeeding = false;

export async function GET() {
  try {
    if (isSeeding) {
      return NextResponse.json({ status: "seeding", message: "Seeding in progress..." });
    }

    // Check if already set up
    try {
      const count = await db.user.count();
      if (count > 0) {
        // Data repair: fix questions with NULL questionText
        const repaired = await repairNullQuestionText();
        
        // Auto force-reseed if too many questions still have NULL text (repair can't match)
        const totalQ = await db.question.count({ where: { isActive: true } });
        const nullQ = await db.question.count({ where: { questionText: { in: [null, ""] as any }, isActive: true } });
        let reseeded = false;
        if (totalQ > 0 && nullQ > totalQ * 0.3) {
          console.log(`[setup] ${nullQ}/${totalQ} questions still NULL — auto force-reseed...`);
          const res = await forceReseedQuestions();
          reseeded = res.status === "reseeded";
        }

        const subjects = await db.subject.count();
        const questions = await db.question.count({ where: { isActive: true } });
        return NextResponse.json({
          status: reseeded ? "reseeded" : repaired ? "repaired" : "ready",
          users: count,
          subjects,
          questions,
          ...(reseeded ? { reseeded: true } : {}),
          ...(repaired ? { repaired } : {}),
        });
      }
    } catch {
      // Tables don't exist yet, run migration
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
    return NextResponse.json({
      status: "seeded",
      users,
      subjects,
      questions,
      message: "Setup complete!",
    });
  } catch (error: unknown) {
    isSeeding = false;
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup] Error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for force-reseed parameter
    let forceReseed = false;
    try {
      const body = await request.json();
      forceReseed = body?.force === true;
    } catch { /* no body, ignore */ }

    if (forceReseed) {
      console.log("[setup] Force reseed requested...");
      const result = await forceReseedQuestions();
      return NextResponse.json(result);
    }

    return GET();
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup] POST Error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}

// ==========================================================================
// Repair questions that have NULL questionText
// ==========================================================================
async function repairNullQuestionText(): Promise<boolean> {
  try {
    let totalFixed = 0;
    let batchNum = 0;
    const BATCH_SIZE = 100;

    // Loop until no more broken questions are found
    while (true) {
      batchNum++;
      const broken = await db.question.findMany({
        where: { questionText: { in: [null, ""] as any } },
        take: BATCH_SIZE,
        orderBy: { createdAt: "asc" },
      });
      if (broken.length === 0) break;

      console.log(`[setup] Repair batch ${batchNum}: ${broken.length} questions with NULL questionText...`);

      // Build a reverse map: lessonId -> [questions from EXTRA_QUESTIONS]
      const lessonIds = [...new Set(broken.map((q) => q.lessonId).filter(Boolean))];
      const lessonTitles = await db.lesson.findMany({
        where: { id: { in: lessonIds } },
        select: { id: true, title: true },
      });
      const titleToLessonId = new Map(lessonTitles.map((l) => [l.title, l.id]));

      // Match broken questions to EXTRA_QUESTIONS and backfill
      for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
        const lessonId = titleToLessonId.get(lessonTitle);
        if (!lessonId) continue;

        // Find broken questions for this lesson (from this batch)
        const lessonBroken = broken.filter((q) => q.lessonId === lessonId);
        for (let i = 0; i < lessonBroken.length && i < questions.length; i++) {
          const qText = questions[i][0];
          if (qText) {
            await db.question.update({
              where: { id: lessonBroken[i].id },
              data: { questionText: qText },
            });
            totalFixed++;
          }
        }
      }

      // For any remaining broken questions in this batch, set a generic text
      const stillBroken = await db.question.findMany({
        where: { questionText: { in: [null, ""] as any } },
        take: BATCH_SIZE,
      });
      for (const q of stillBroken) {
        const ans = await db.answer.findFirst({ where: { questionId: q.id } });
        await db.question.update({
          where: { id: q.id },
          data: { questionText: ans ? `Select the correct answer about ${ans.content}` : "Question " + q.id.slice(0, 6) },
        });
        totalFixed++;
      }
    }

    if (totalFixed > 0) {
      console.log(`[setup] Total repaired: ${totalFixed} questions across ${batchNum} batch(es).`);
    }
    return totalFixed > 0;
  } catch (e) {
    console.error("[setup] Repair failed:", e);
    return false;
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
// FULL SEED DATA
// ==========================================================================
async function fullSetup() {
  // Step 1: Create tables
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

  // Step 2: Create demo user
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

  // Step 3: Seed subjects/lessons/questions
  const subjectCount = await db.subject.count();
  if (subjectCount === 0) {
    console.log("[setup] Seeding full data...");
    await seedAllData();
  }
}

async function seedAllData() {
  // Create subjects
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

  // Track unique modules/topics
  const moduleMap = new Map<string, string>();
  const topicMap = new Map<string, string>();
  const lessonMap = new Map<string, { id: string; subjectId: string }>();

  // Create a lesson for each EXTRA_QUESTIONS key
  for (const [lessonTitle, meta] of Object.entries(SUBJECT_LESSON_MAP)) {
    const subj = subjectByCode.get(meta.code);
    if (!subj) continue;

    // Create module if needed
    const modKey = meta.code + ":" + meta.module;
    let moduleId = moduleMap.get(modKey);
    if (!moduleId) {
      const mod = await db.module.create({
        data: { subjectId: subj.id, title: meta.module, sortOrder: moduleMap.size, status: "published" },
      });
      moduleId = mod.id;
      moduleMap.set(modKey, moduleId);
    }

    // Create topic if needed
    const topKey = modKey + ":" + meta.topic;
    let topicId = topicMap.get(topKey);
    if (!topicId) {
      const top = await db.topic.create({
        data: { moduleId, title: meta.topic, sortOrder: topicMap.size, status: "published" },
      });
      topicId = top.id;
      topicMap.set(topKey, topicId);
    }

    // Create lesson
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

  // Seed questions from EXTRA_QUESTIONS
  let qCount = 0;
  for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
    const info = lessonMap.get(lessonTitle);
    if (!info) {
      console.log("[setup] WARNING: No lesson for key:", lessonTitle);
      continue;
    }
    for (const [qText, answers, difficulty, explanation, tags] of questions) {
      const text = qText as string;
      if (!text) {
        console.log("[setup] WARNING: Empty questionText for", lessonTitle);
        continue;
      }
      await db.question.create({
        data: {
          questionType: "multiple_choice",
          difficulty: difficulty as string,
          questionText: text,
          explanation: explanation as string,
          tags: JSON.stringify(tags),
          isActive: true,
          points: difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1,
          subjectId: info.subjectId,
          lessonId: info.id,
          answers: { create: (answers as [string, boolean][]).map((a, i) => ({ content: a[0], isCorrect: a[1], sortOrder: i })) },
        },
      });
      qCount++;
    }
  }
  console.log(`[setup] Seeded ${qCount} questions across ${lessonMap.size} lessons`);
}

// ==========================================================================
// Force reseed: delete ALL questions/answers and re-create from EXTRA_QUESTIONS
// ==========================================================================
async function forceReseedQuestions() {
  try {
    // Step 1: Get existing lesson mapping (title → { id, subjectId })
    const lessons = await db.lesson.findMany({
      select: { id: true, title: true, subjectId: true },
    });
    const lessonByTitle = new Map(lessons.map((l) => [l.title, { id: l.id, subjectId: l.subjectId }]));

    // Step 2: Delete ALL existing answers and questions
    const deletedAnswers = await db.answer.deleteMany();
    const deletedQuestions = await db.question.deleteMany();
    console.log(`[setup] Deleted ${deletedAnswers.count} answers, ${deletedQuestions.count} questions`);

    // Step 3: Re-create all questions from EXTRA_QUESTIONS
    let created = 0;
    let skipped = 0;
    for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
      const info = lessonByTitle.get(lessonTitle);
      if (!info) {
        skipped++;
        continue;
      }
      for (const [qText, answers, difficulty, explanation, tags] of questions) {
        const text = qText as string;
        if (!text) continue;
        await db.question.create({
          data: {
            questionType: "multiple_choice",
            difficulty: difficulty as string,
            questionText: text,
            explanation: explanation as string,
            tags: JSON.stringify(tags),
            isActive: true,
            points: difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1,
            subjectId: info.subjectId,
            lessonId: info.id,
            answers: { create: (answers as [string, boolean][]).map((a, i) => ({ content: a[0], isCorrect: a[1], sortOrder: i })) },
          },
        });
        created++;
      }
    }

    console.log(`[setup] Force reseed: created ${created} questions, skipped ${skipped} lessons`);

    return {
      status: "reseeded",
      deletedQuestions: deletedQuestions.count,
      deletedAnswers: deletedAnswers.count,
      createdQuestions: created,
      skippedLessons: skipped,
      message: `Re-seeded ${created} questions with questionText`,
    };
  } catch (e) {
    console.error("[setup] Force reseed failed:", e);
    return { status: "error", error: e instanceof Error ? e.message : String(e) };
  }
}
