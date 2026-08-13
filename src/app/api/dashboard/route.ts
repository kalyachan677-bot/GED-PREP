export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// GET /api/dashboard?userId=xxx
// Returns: subjects with completion %, recent quiz scores, overall stats
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId query parameter is required" }, { status: 400 });
    }

    // 1. Published subjects
    const subjects = await db.subject.findMany({
      where: { status: "published" },
      orderBy: { sortOrder: "asc" },
    });

    // 2. Build per-subject data
    const subjectData = await Promise.all(
      subjects.map(async (subject) => {
        const modules = await db.module.findMany({
          where: { subjectId: subject.id, status: "published" },
          select: { id: true },
        });
        const moduleIds = modules.map((m) => m.id);
        const topics = await db.topic.findMany({
          where: { moduleId: { in: moduleIds }, status: "published" },
          select: { id: true },
        });
        const topicIds = topics.map((t) => t.id);
        const lessons = await db.lesson.findMany({
          where: { topicId: { in: topicIds }, status: "published" },
          select: { id: true },
        });
        const lessonIds = lessons.map((l) => l.id);
        const totalLessons = lessons.length;

        const completed = await db.lessonProgress.count({
          where: { userId, isCompleted: true, lessonId: { in: lessonIds } },
        });
        const completionPct = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

        const attempts = await db.quizAttempt.findMany({
          where: { userId, subjectId: subject.id, status: "completed" },
          orderBy: { startedAt: "desc" },
          take: 5,
          select: { id: true, scorePercent: true, correctCount: true, totalQuestions: true, quizType: true, startedAt: true, completedAt: true },
        });

        const avgScore = attempts.length > 0
          ? Math.round((attempts.reduce((s, a) => s + a.scorePercent, 0) / attempts.length) * 10) / 10
          : 0;

        return {
          id: subject.id,
          code: subject.code,
          title: subject.title,
          description: subject.description,
          colorHex: subject.colorHex,
          totalLessons,
          completedLessons: completed,
          completionPct,
          avgScore,
          totalAttempts: attempts.length,
          recentAttempts: attempts,
        };
      })
    );

    // 3. Overall stats
    const totalLessons = subjectData.reduce((s, d) => s + d.totalLessons, 0);
    const completedLessons = subjectData.reduce((s, d) => s + d.completedLessons, 0);
    const overallPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    const allAttempts = await db.quizAttempt.findMany({
      where: { userId, status: "completed" },
      orderBy: { startedAt: "desc" },
      take: 10,
      select: { id: true, scorePercent: true, correctCount: true, totalQuestions: true, quizType: true, startedAt: true, completedAt: true, subjectId: true },
    });
    const avgQuizScore = allAttempts.length > 0
      ? Math.round((allAttempts.reduce((s, a) => s + a.scorePercent, 0) / allAttempts.length) * 10) / 10
      : 0;

    return NextResponse.json({
      data: {
        subjects: subjectData,
        overall: {
          totalLessons,
          completedLessons,
          completionPct: overallPct,
          avgQuizScore,
          totalQuizAttempts: allAttempts.length,
        },
        recentQuizScores: allAttempts.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("[GET /api/dashboard] Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 });
  }
}