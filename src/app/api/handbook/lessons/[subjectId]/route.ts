export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/handbook/lessons/:subjectId
 * Returns all modules > topics > lessons for a subject (for the Handbook "Lessons" tab).
 * Accepts subject code ("math") or DB ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId: rawId } = await params;

    const VALID_CODES = new Set(['math', 'science', 'rla', 'ss']);
    const subject = VALID_CODES.has(rawId)
      ? await db.subject.findUnique({ where: { code: rawId } })
      : await db.subject.findUnique({ where: { id: rawId } });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const modules = await db.module.findMany({
      where: { subjectId: subject.id },
      include: {
        topics: {
          include: {
            lessons: {
              orderBy: { sortOrder: 'asc' },
              select: {
                id: true,
                title: true,
                slug: true,
                contentType: true,
                durationMinutes: true,
                sortOrder: true,
              },
            },
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    const data = modules.map((m) => ({
      id: m.id,
      title: m.title,
      sortOrder: m.sortOrder,
      topics: m.topics.map((t) => ({
        id: t.id,
        title: t.title,
        lessons: t.lessons,
      })),
    }));

    return NextResponse.json({ data });
  } catch (e: unknown) {
    console.error('Handbook lessons fetch error:', e);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
}
