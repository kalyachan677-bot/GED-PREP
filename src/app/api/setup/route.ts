import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subjectCount = await db.subject.count();
    if (subjectCount > 0) {
      const qCount = await db.question.count({ where: { isActive: true } });
      const lessonCount = await db.lesson.count();
      return NextResponse.json({
        status: "already_seeded",
        subjects: subjectCount,
        lessons: lessonCount,
        questions: qCount,
      });
    }

    // Import and run the full seed
    console.log("[setup] No subjects found, running seed...");
    const { seed } = await import("../../../../prisma/seed.js");
    await seed();

    const afterSubjects = await db.subject.count();
    const afterQuestions = await db.question.count({ where: { isActive: true } });
    return NextResponse.json({
      status: "seeded",
      subjects: afterSubjects,
      questions: afterQuestions,
      message: "Database seeded! Refresh the page and login.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup] Seed error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
