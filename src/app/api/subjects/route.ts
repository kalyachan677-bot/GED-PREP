export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      where: { status: 'published' },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: {
            modules: {
              where: { status: 'published' },
            },
          },
        },
      },
    })

    // Enrich with topic and lesson counts (Prisma doesn't support deep nested _count across relations easily)
    const subjectIds = subjects.map((s) => s.id)

    const publishedModules = await db.module.findMany({
      where: {
        subjectId: { in: subjectIds },
        status: 'published',
      },
      select: {
        id: true,
        subjectId: true,
        _count: {
          select: {
            topics: {
              where: { status: 'published' },
            },
          },
        },
      },
    })

    const moduleIds = publishedModules.map((m) => m.id)

    const publishedTopics = await db.topic.findMany({
      where: {
        moduleId: { in: moduleIds },
        status: 'published',
      },
      select: {
        id: true,
        moduleId: true,
        _count: {
          select: {
            lessons: {
              where: { status: 'published' },
            },
          },
        },
      },
    })

    // Build lookup maps
    const topicLessonCounts: Record<string, number> = {}
    for (const topic of publishedTopics) {
      topicLessonCounts[topic.id] = topic._count.lessons
    }

    const moduleTopicCounts: Record<string, number> = {}
    const moduleLessonTotals: Record<string, number> = {}
    for (const mod of publishedModules) {
      moduleTopicCounts[mod.id] = mod._count.topics

      // Sum lesson counts for this module's topics
      const moduleTopics = publishedTopics.filter((t) => t.moduleId === mod.id)
      moduleLessonTotals[mod.id] = moduleTopics.reduce((sum, t) => sum + topicLessonCounts[t.id], 0)
    }

    const result = subjects.map((subject) => {
      const subjectModules = publishedModules.filter((m) => m.subjectId === subject.id)
      const moduleCount = subjectModules.length
      const topicCount = subjectModules.reduce((sum, m) => sum + moduleTopicCounts[m.id], 0)
      const lessonCount = subjectModules.reduce((sum, m) => sum + moduleLessonTotals[m.id], 0)

      return {
        id: subject.id,
        code: subject.code,
        title: subject.title,
        description: subject.description,
        iconUrl: subject.iconUrl,
        colorHex: subject.colorHex,
        sortOrder: subject.sortOrder,
        status: subject.status,
        createdAt: subject.createdAt,
        updatedAt: subject.updatedAt,
        _count: {
          modules: moduleCount,
          topics: topicCount,
          lessons: lessonCount,
        },
      }
    })

    return NextResponse.json({ data: result })
  } catch (error) {
    console.error('[GET /api/subjects] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}