import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { runFullSeed } from "@/lib/seed-data";

export const dynamic = "force-dynamic";

let isSeeding = false;

export async function GET() {
  try {
    // If already seeding, return status
    if (isSeeding) {
      return NextResponse.json({ status: "seeding_in_progress", message: "Database is being seeded, please wait..." });
    }

    const subjectCount = await db.subject.count();
    const qCount = await db.question.count({ where: { isActive: true } });
    const userCount = await db.user.count();
    const lessonCount = await db.lesson.count();

    // If already seeded, just return status
    if (subjectCount > 0) {
      return NextResponse.json({
        status: "ready",
        subjects: subjectCount,
        lessons: lessonCount,
        questions: qCount,
        users: userCount,
      });
    }

    // Need to seed — run full seed
    console.log("[setup] No subjects found, running full seed...");
    isSeeding = true;

    try {
      await runFullSeed(db);
    } finally {
      isSeeding = false;
    }

    const afterSubjects = await db.subject.count();
    const afterQuestions = await db.question.count({ where: { isActive: true } });
    const afterUsers = await db.user.count();

    return NextResponse.json({
      status: "seeded",
      subjects: afterSubjects,
      questions: afterQuestions,
      users: afterUsers,
      message: "Database seeded successfully! Refresh the page.",
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
