export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// POST /api/quiz/attempt — Create a new quiz attempt
// Body: { userId, subjectId, lessonId?, quizType, questionIds: string[] }
// Returns the attempt with questions + answers (but NOT correct answers)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, subjectId, lessonId, quizType, questionIds } = body as {
      userId: string
      subjectId: string
      lessonId?: string
      quizType?: string
      questionIds: string[]
    }

    if (!userId || !subjectId || !Array.isArray(questionIds)) {
      return NextResponse.json(
        { error: 'userId, subjectId, and questionIds are required' },
        { status: 400 }
      )
    }

    if (questionIds.length === 0) {
      return NextResponse.json(
        { error: 'questionIds must not be empty' },
        { status: 400 }
      )
    }

    // Verify questions exist and are active
    const questions = await db.question.findMany({
      where: {
        id: { in: questionIds },
        isActive: true,
      },
      include: {
        answers: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No valid active questions found for the provided IDs' },
        { status: 400 }
      )
    }

    // Create the quiz attempt
    const attempt = await db.quizAttempt.create({
      data: {
        userId,
        subjectId,
        lessonId: lessonId ?? null,
        quizType: quizType ?? 'lesson_quiz',
        totalQuestions: questions.length,
        status: 'in_progress',
        startedAt: new Date(),
      },
    })

    // Return the attempt with questions and answers (but NOT isCorrect or explanation)
    const questionsForClient = questions.map((q) => ({
      id: q.id,
      questionText: q.questionText,
      lessonId: q.lessonId,
      questionType: q.questionType,
      difficulty: q.difficulty,
      points: q.points,
      hintText: q.hintText,
      explanation: q.explanation,
      tags: safeJsonParse(q.tags),
      answers: q.answers.map((a) => ({
        id: a.id,
        content: a.content,
        sortOrder: a.sortOrder,
      })),
    }))

    return NextResponse.json({
      data: {
        attempt: {
          id: attempt.id,
          userId: attempt.userId,
          subjectId: attempt.subjectId,
          lessonId: attempt.lessonId,
          quizType: attempt.quizType,
          totalQuestions: attempt.totalQuestions,
          status: attempt.status,
          startedAt: attempt.startedAt,
        },
        questions: questionsForClient,
      },
    })
  } catch (error) {
    console.error('[POST /api/quiz/attempt] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create quiz attempt' },
      { status: 500 }
    )
  }
}

function safeJsonParse(str: string): unknown {
  try {
    return JSON.parse(str)
  } catch {
    return str
  }
}