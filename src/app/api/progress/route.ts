import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// GET /api/progress?userId=xxx
// Returns user progress dashboard data
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    // -----------------------------------------------------------------------
    // 1. Overall lesson counts
    // -----------------------------------------------------------------------
    const [totalLessonsResult, completedLessonsResult] = await Promise.all([
      db.lesson.count({
        where: { status: 'published' },
      }),
      db.lessonProgress.count({
        where: {
          userId,
          isCompleted: true,
          lesson: { status: 'published' },
        },
      }),
    ])

    const totalLessons = totalLessonsResult
    const completedLessons = completedLessonsResult
    const completionPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 10000) / 100 : 0

    // -----------------------------------------------------------------------
    // 2. Per-subject breakdown
    // -----------------------------------------------------------------------
    const publishedSubjects = await db.subject.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
    })

    const subjectBreakdowns = await Promise.all(
      publishedSubjects.map(async (subject) => {
        // Get all published lesson IDs for this subject
        const modules = await db.module.findMany({
          where: { subjectId: subject.id, status: 'published' },
          select: { id: true },
        })
        const moduleIds = modules.map((m) => m.id)

        const topics = await db.topic.findMany({
          where: { moduleId: { in: moduleIds }, status: 'published' },
          select: { id: true },
        })
        const topicIds = topics.map((t) => t.id)

        const lessons = await db.lesson.findMany({
          where: { topicId: { in: topicIds }, status: 'published' },
          select: { id: true },
        })
        const lessonIds = lessons.map((l) => l.id)
        const subjectTotalLessons = lessons.length

        // Completed lessons in this subject
        const subjectCompleted = await db.lessonProgress.count({
          where: {
            userId,
            isCompleted: true,
            lessonId: { in: lessonIds },
          },
        })

        // Average quiz score for this subject (completed attempts only)
        const completedAttempts = await db.quizAttempt.findMany({
          where: {
            userId,
            subjectId: subject.id,
            status: 'completed',
          },
          select: { scorePercent: true },
        })

        const avgScore =
          completedAttempts.length > 0
            ? Math.round(
                (completedAttempts.reduce((sum, a) => sum + a.scorePercent, 0) /
                  completedAttempts.length) *
                  100
              ) / 100
            : 0

        return {
          subject: {
            id: subject.id,
            code: subject.code,
            title: subject.title,
            colorHex: subject.colorHex,
            iconUrl: subject.iconUrl,
          },
          totalLessons: subjectTotalLessons,
          completed: subjectCompleted,
          avgScore,
          attemptsCount: completedAttempts.length,
        }
      })
    )

    // -----------------------------------------------------------------------
    // 3. Recent quiz attempts (last 10)
    // -----------------------------------------------------------------------
    const recentAttempts = await db.quizAttempt.findMany({
      where: { userId },
      orderBy: { startedAt: 'desc' },
      take: 10,
      include: {
        subject: {
          select: { id: true, code: true, title: true, colorHex: true },
        },
        lesson: {
          select: { id: true, title: true },
        },
      },
    })

    // -----------------------------------------------------------------------
    // 4. Due flashcards count
    // -----------------------------------------------------------------------
    const dueFlashcardsCount = await db.spacedRepetition.count({
      where: {
        userId,
        nextReviewAt: { lte: new Date() },
      },
    })

    // -----------------------------------------------------------------------
    // 5. Readiness score (if exists)
    // -----------------------------------------------------------------------
    const readinessScores = await db.readinessScore.findMany({
      where: { userId },
      include: {
        subject: {
          select: { id: true, code: true, title: true, colorHex: true },
        },
      },
    })

    const readinessData = readinessScores.length > 0 ? readinessScores : null

    return NextResponse.json({
      data: {
        totalLessons,
        completedLessons,
        completionPct,
        subjectBreakdowns,
        recentAttempts,
        dueFlashcardsCount,
        readiness: readinessData,
      },
    })
  } catch (error) {
    console.error('[GET /api/progress] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    )
  }
}