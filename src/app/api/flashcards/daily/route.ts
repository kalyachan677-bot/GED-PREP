export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// GET /api/flashcards/daily?userId=xxx&subjectCode=yyy&count=5
// Returns 5 random flashcards (optionally filtered by subject)
// Checks if user already completed daily quiz today
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const subjectCode = searchParams.get('subjectCode') // optional filter
    const count = Math.min(Math.max(parseInt(searchParams.get('count') ?? '5', 10) || 5, 1), 20)

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    // Check if already completed today
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayLogs = await db.dailyFlashcardQuizLog.findMany({
      where: {
        userId,
        answeredAt: { gte: todayStart },
      },
      select: { flashcardId: true },
    })

    const alreadyDoneToday = todayLogs.length >= 5

    // Build the where clause
    const where: Record<string, unknown> = {}
    if (subjectCode) {
      const subject = await db.subject.findUnique({ where: { code: subjectCode } })
      if (subject) where.subjectId = subject.id
    }

    // Get all flashcards matching filter, then randomly pick
    const allCards = await db.flashcard.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })

    // Fisher-Yates shuffle
    const shuffled = [...allCards]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    const cards = shuffled.slice(0, count).map((c) => ({
      id: c.id,
      term: c.term,
      translation: c.translation,
      meaning: c.meaning,
    }))

    return NextResponse.json({
      data: {
        cards,
        alreadyDoneToday,
        todayAnsweredCount: todayLogs.length,
      },
    })
  } catch (error) {
    console.error('[GET /api/flashcards/daily] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch daily flashcards' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST /api/flashcards/daily
// Submit an answer for a daily flashcard quiz
// Body: { userId, flashcardId, userAnswer, isCorrect }
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, flashcardId, userAnswer, isCorrect } = body

    if (!userId || !flashcardId || userAnswer === undefined || isCorrect === undefined) {
      return NextResponse.json({ error: 'userId, flashcardId, userAnswer, isCorrect are required' }, { status: 400 })
    }

    const log = await db.dailyFlashcardQuizLog.create({
      data: { userId, flashcardId, userAnswer, isCorrect },
    })

    // Get the correct answer for feedback
    const flashcard = await db.flashcard.findUnique({ where: { id: flashcardId } })

    return NextResponse.json({
      data: {
        logId: log.id,
        isCorrect: log.isCorrect,
        correctTranslation: flashcard?.translation ?? '',
        correctMeaning: flashcard?.meaning ?? '',
      },
    })
  } catch (error) {
    console.error('[POST /api/flashcards/daily] Error:', error)
    return NextResponse.json({ error: 'Failed to submit flashcard answer' }, { status: 500 })
  }
}
