export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// GET /api/flashcards/due?userId=xxx&limit=20
// Returns spaced repetition cards due for review
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') ?? '20', 10) || 20, 1), 100)

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    const now = new Date()

    const dueCards = await db.spacedRepetition.findMany({
      where: {
        userId,
        nextReviewAt: { lte: now },
      },
      orderBy: { nextReviewAt: 'asc' },
      take: limit,
      include: {
        question: {
          include: {
            answers: {
              orderBy: { sortOrder: 'asc' },
            },
            subject: {
              select: { id: true, code: true, title: true, colorHex: true },
            },
          },
        },
      },
    })

    const result = dueCards.map((card) => ({
      id: card.id,
      questionId: card.questionId,
      srStatus: card.srStatus,
      easeFactor: card.easeFactor,
      intervalDays: card.intervalDays,
      repetitions: card.repetitions,
      nextReviewAt: card.nextReviewAt,
      lastReviewAt: card.lastReviewAt,
      lastRating: card.lastRating,
      question: {
        id: card.question.id,
        questionType: card.question.questionType,
        difficulty: card.question.difficulty,
        points: card.question.points,
        explanation: card.question.explanation,
        hintText: card.question.hintText,
        tags: safeJsonParse(card.question.tags),
        subject: card.question.subject,
        answers: card.question.answers.map((a) => ({
          id: a.id,
          content: a.content,
          isCorrect: a.isCorrect,
          sortOrder: a.sortOrder,
          explanation: a.explanation,
        })),
      },
    }))

    return NextResponse.json({
      data: result,
      pagination: {
        returned: result.length,
        limit,
      },
    })
  } catch (error) {
    console.error('[GET /api/flashcards/due] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch due flashcards' },
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