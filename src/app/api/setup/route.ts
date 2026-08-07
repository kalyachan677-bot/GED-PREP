import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

/** Fallback setup: create demo user if not exists, report DB status */
export async function GET() {
  try {
    const subjectCount = await db.subject.count();
    const qCount = await db.question.count({ where: { isActive: true } });
    const lessonCount = await db.lesson.count();
    const userCount = await db.user.count();

    // Ensure demo user exists
    if (userCount === 0) {
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
      return NextResponse.json({
        status: "demo_user_created",
        subjects: subjectCount,
        lessons: lessonCount,
        questions: qCount,
        message: "Demo user created. If no subjects, re-deploy to run seed.",
      });
    }

    return NextResponse.json({
      status: subjectCount > 0 ? "ready" : "no_data",
      subjects: subjectCount,
      lessons: lessonCount,
      questions: qCount,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup] Error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
