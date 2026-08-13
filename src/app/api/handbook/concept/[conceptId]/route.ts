export const runtime = "edge";
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

/**
 * GET /api/handbook/concept/:conceptId
 * Returns a single concept topic + its contents (for inline display in quiz review).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ conceptId: string }> }
) {
  try {
    const { conceptId } = await params;

    const topic = await db.handbookTopic.findUnique({
      where: { id: conceptId },
      include: {
        contents: { orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!topic) {
      return NextResponse.json({ error: 'Concept not found' }, { status: 404 });
    }

    return NextResponse.json({
      data: {
        id: topic.id,
        subjectId: topic.subjectId,
        title: topic.title,
        titleTh: topic.titleTh,
        titleMm: topic.titleMm,
        categoryType: topic.categoryType,
        contents: topic.contents.map((c) => ({
          id: c.id,
          contentBodyEn: c.contentBodyEn,
          contentBodyTh: c.contentBodyTh,
          contentBodyMm: c.contentBodyMm,
          keyTakeaways: JSON.parse(c.keyTakeaways || '[]'),
          formulaOrRules: JSON.parse(c.formulaOrRules || '[]'),
          sortOrder: c.sortOrder,
        })),
      },
    });
  } catch (e: unknown) {
    console.error('Concept fetch error:', e);
    return NextResponse.json({ error: 'Failed to load concept' }, { status: 500 });
  }
}
