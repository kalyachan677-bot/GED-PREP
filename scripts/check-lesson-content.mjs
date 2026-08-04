import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  // Check first 2 lessons' bodyContent
  const lessons = await db.lesson.findMany({
    take: 2,
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true, bodyContent: true, status: true }
  });

  for (const l of lessons) {
    console.log('---');
    console.log('Lesson:', l.title);
    console.log('Status:', l.status);
    console.log('BodyContent (first 300 chars):', l.bodyContent?.slice(0, 300));

    // Try parsing as JSON
    try {
      const parsed = JSON.parse(l.bodyContent);
      console.log('Parsed type:', typeof parsed, Array.isArray(parsed) ? 'array' : '');
      if (Array.isArray(parsed)) {
        console.log('Blocks count:', parsed.length);
        console.log('First block:', JSON.stringify(parsed[0]).slice(0, 200));
      }
    } catch(e) {
      console.log('Parse error:', e.message);
    }
  }
}

main().then(() => db.$disconnect()).catch(e => { console.error(e); db.$disconnect(); });
