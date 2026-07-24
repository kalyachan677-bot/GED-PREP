import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/flashcards/subject?subjectId=xxx&count=8
// Returns all flashcards for a subject (for lesson vocab review)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const count = Math.min(Math.max(parseInt(searchParams.get('count') ?? '8', 10) || 8, 1), 20)

    if (!subjectId) {
      return NextResponse.json({ error: 'subjectId is required' }, { status: 400 })
    }

    const cards = await db.flashcard.findMany({
      where: { subjectId },
      orderBy: { sortOrder: 'asc' },
      take: count,
      select: {
        id: true,
        term: true,
        translation: true,
        pronunciation: true,
        meaning: true,
      },
    })

    return NextResponse.json({ data: cards })
  } catch (error) {
    console.error('[GET /api/flashcards/subject] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch subject flashcards' }, { status: 500 })
  }
}
