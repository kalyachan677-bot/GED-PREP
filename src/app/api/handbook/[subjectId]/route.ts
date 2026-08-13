export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/handbook/:subjectId
 * Returns all handbook topics + contents for a subject, grouped by categoryType.
 * Accepts either a subject code ("math", "science", "rla", "ss") or a subject DB ID.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    const { subjectId: rawId } = await params;

    // Resolve: if it looks like a code (short, no hyphens), look up by code
    const VALID_CODES = new Set(['math', 'science', 'rla', 'ss']);
    const subject = VALID_CODES.has(rawId)
      ? await db.subject.findUnique({ where: { code: rawId } })
      : await db.subject.findUnique({ where: { id: rawId } });

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 });
    }

    const topics = await db.handbookTopic.findMany({
      where: { subjectId: subject.id },
      include: {
        contents: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: [{ categoryType: 'asc' }, { sortOrder: 'asc' }],
    });

    const handbook = topics.map((t) => ({
      id: t.id,
      subjectId: t.subjectId,
      title: t.title,
      titleTh: t.titleTh,
      titleMm: t.titleMm,
      categoryType: t.categoryType,
      sortOrder: t.sortOrder,
      contents: t.contents.map((c) => ({
        id: c.id,
        contentBodyEn: c.contentBodyEn,
        contentBodyTh: c.contentBodyTh,
        contentBodyMm: c.contentBodyMm,
        keyTakeaways: JSON.parse(c.keyTakeaways || '[]'),
        formulaOrRules: JSON.parse(c.formulaOrRules || '[]'),
        sortOrder: c.sortOrder,
      })),
    }));

    return NextResponse.json({ data: handbook });
  } catch (e: unknown) {
    console.error('Handbook fetch error:', e);
    return NextResponse.json({ error: 'Failed to load handbook' }, { status: 500 });
  }
}
