export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Support lookup by code or id
    const subject = await db.subject.findFirst({
      where: {
        OR: [{ code: id }, { id }],
        status: "published",
      },
      include: {
        modules: {
          where: { status: "published" },
          orderBy: { sortOrder: "asc" },
          include: {
            topics: {
              where: { status: "published" },
              orderBy: { sortOrder: "asc" },
              include: {
                lessons: {
                  where: { status: "published" },
                  orderBy: { sortOrder: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    // Fetch lesson progress if userId provided
    let progressMap: Record<string, { isCompleted: boolean; completionPct: number }> = {};
    if (userId) {
      const allLessonIds = subject.modules.flatMap((m) =>
        m.topics.flatMap((t) => t.lessons.map((l) => l.id))
      );
      if (allLessonIds.length > 0) {
        const progresses = await db.lessonProgress.findMany({
          where: { userId, lessonId: { in: allLessonIds } },
          select: { lessonId: true, isCompleted: true, completionPct: true },
        });
        for (const p of progresses) {
          progressMap[p.lessonId] = { isCompleted: p.isCompleted, completionPct: p.completionPct };
        }
      }
    }

    const parsedModules = subject.modules.map((mod) => ({
      ...mod,
      topics: mod.topics.map((topic) => ({
        ...topic,
        lessons: topic.lessons.map((lesson) => ({
          ...lesson,
          bodyContent: safeJsonParse(lesson.bodyContent),
          progress: progressMap[lesson.id] || null,
        })),
      })),
    }));

    return NextResponse.json({
      data: {
        ...subject,
        modules: parsedModules,
      },
    });
  } catch (error) {
    console.error("[GET /api/subjects/:code] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subject" },
      { status: 500 }
    );
  }
}

function safeJsonParse(str: string): unknown {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}