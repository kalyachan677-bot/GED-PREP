export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const lesson = await db.lesson.findUnique({
      where: { id },
      include: {
        topic: {
          include: {
            module: {
              include: {
                subject: true,
              },
            },
          },
        },
        questions: {
          where: { isActive: true },
          include: {
            answers: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // Parse bodyContent JSON
    let parsedBodyContent: unknown
    try {
      parsedBodyContent = JSON.parse(lesson.bodyContent)
    } catch {
      parsedBodyContent = lesson.bodyContent
    }

    return NextResponse.json({
      data: {
        ...lesson,
        bodyContent: parsedBodyContent,
        topic: lesson.topic
          ? {
              ...lesson.topic,
              module: lesson.topic.module
                ? {
                    ...lesson.topic.module,
                    subject: lesson.topic.module.subject,
                  }
                : null,
            }
          : null,
      },
    })
  } catch (error) {
    console.error('[GET /api/lessons/:id] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}