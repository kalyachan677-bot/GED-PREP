import { NextResponse } from "next/server";
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
        const subjects = await db.subject.count();
        const questions = await db.question.count({ where: { isActive: true } });
        return NextResponse.json({ status: "ready", users: count, subjects, questions });
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

export async function POST() {
  return GET();
}

async function fullSetup() {
  // Step 1: Create tables
  console.log("[setup] Creating tables...");
  const statements = MIGRATION_SQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const stmt of statements) {
    try {
      await db.\$executeRawUnsafe(stmt + ";");
    } catch (e) {
      // Ignore errors for existing objects
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

// =============================================================================
// FULL SEED DATA (inline - no external file dependencies)
// =============================================================================
async function seedAllData() {
  // Create subjects
  const math = await db.subject.create({
    data: { code: "math", title: "Mathematical Reasoning", description: "Algebra, geometry, data analysis", colorHex: "#10B981", sortOrder: 0, status: "published" },
  });
  const science = await db.subject.create({
    data: { code: "science", title: "Science", description: "Life, physical, and earth & space science", colorHex: "#3B82F6", sortOrder: 1, status: "published" },
  });
  const rla = await db.subject.create({
    data: { code: "rla", title: "Reasoning Through Language Arts", description: "Reading comprehension, writing, grammar", colorHex: "#F59E0B", sortOrder: 2, status: "published" },
  });
  const ss = await db.subject.create({
    data: { code: "ss", title: "Social Studies", description: "History, civics, economics, geography", colorHex: "#EF4444", sortOrder: 3, status: "published" },
  });

  // Create minimal structure for each subject
  const subjectData = [
    { subject: math, module: "Algebraic Foundations", topic: "Solving Linear Equations", lesson: "What is a Linear Equation?", slug: "what-is-linear-equation" },
    { subject: math, module: "Algebraic Foundations", topic: "Solving Inequalities", lesson: "Solving Inequalities", slug: "solving-inequalities" },
    { subject: science, module: "Life Science", topic: "Cell Biology", lesson: "What is a Cell?", slug: "what-is-a-cell" },
    { subject: science, module: "Physical Science", topic: "Chemistry Basics", lesson: "Atoms and Molecules", slug: "atoms-and-molecules" },
    { subject: rla, module: "Reading Comprehension", topic: "Main Idea", lesson: "Finding the Main Idea", slug: "finding-the-main-idea" },
    { subject: rla, module: "Grammar", topic: "Sentence Structure", lesson: "Parts of a Sentence", slug: "parts-of-a-sentence" },
    { subject: ss, module: "American History", topic: "Founding Documents", lesson: "The US Constitution", slug: "the-us-constitution" },
    { subject: ss, module: "Civics", topic: "Government Structure", lesson: "Three Branches of Government", slug: "three-branches" },
  ];

  // Track unique modules/topics
  const moduleMap = new Map<string, string>();
  const topicMap = new Map<string, string>();
  const lessonMap = new Map<string, { id: string; subjectId: string }>();

  for (const item of subjectData) {
    const modKey = item.subject.code + ":" + item.module;
    let moduleId = moduleMap.get(modKey);
    if (!moduleId) {
      const mod = await db.module.create({
        data: { subjectId: item.subject.id, title: item.module, sortOrder: moduleMap.size, status: "published" },
      });
      moduleId = mod.id;
      moduleMap.set(modKey, moduleId);
    }

    const topKey = modKey + ":" + item.topic;
    let topicId = topicMap.get(topKey);
    if (!topicId) {
      const top = await db.topic.create({
        data: { moduleId, title: item.topic, sortOrder: topicMap.size, status: "published" },
      });
      topicId = top.id;
      topicMap.set(topKey, topicId);
    }

    const lesson = await db.lesson.create({
      data: {
        topicId,
        title: item.lesson,
        slug: item.slug,
        contentType: "text",
        bodyContent: JSON.stringify([{ id: "blk_1", block_type: "paragraph", content: "Content for " + item.lesson }]),
        durationMinutes: 15,
        sortOrder: 0,
        status: "published",
        lessonType: "core_topic",
      },
    });
    lessonMap.set(item.lesson, { id: lesson.id, subjectId: item.subject.id });
  }

  // Seed extra questions
  let qCount = 0;
  for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
    const info = lessonMap.get(lessonTitle);
    if (!info) continue;
    for (const [qText, answers, difficulty, explanation, tags] of questions) {
      await db.question.create({
        data: {
          questionType: "multiple_choice",
          difficulty: difficulty as string,
          questionText: qText as string,
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
  console.log(`[setup] Seeded ${qCount} questions across ${subjectData.length} lessons`);
}
