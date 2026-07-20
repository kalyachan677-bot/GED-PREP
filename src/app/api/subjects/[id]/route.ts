import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const subject = await db.subject.findUnique({
      where: { id },
      include: {
        modules: {
          where: { status: 'published' },
          orderBy: { sortOrder: 'asc' },
          include: {
            topics: {
              where: { status: 'published' },
              orderBy: { sortOrder: 'asc' },
              include: {
                lessons: {
                  where: { status: 'published' },
                  orderBy: { sortOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    })

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    // Parse bodyContent JSON for each lesson
    const parsedModules = subject.modules.map((mod) => ({
      ...mod,
      topics: mod.topics.map((topic) => ({
        ...topic,
        lessons: topic.lessons.map((lesson) => ({
          ...lesson,
          bodyContent: safeJsonParse(lesson.bodyContent),
        })),
      })),
    }))

    return NextResponse.json({
      data: {
        ...subject,
        modules: parsedModules,
      },
    })
  } catch (error) {
    console.error('[GET /api/subjects/:id] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subject' },
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