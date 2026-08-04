import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const lessons = await prisma.lesson.findMany({
    take: 5,
    orderBy: { createdAt: 'asc' },
    select: { id: true, title: true, bodyContent: true, durationMinutes: true },
  });
  for (const l of lessons) {
    let body = l.bodyContent;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = null; }
    }
    const blocks = Array.isArray(body) ? body : [];
    console.log(`--- ${l.title} (${l.durationMinutes}min) ---`);
    console.log(`  Blocks: ${blocks.length}`);
    if (blocks.length > 0) {
      console.log(`  First block: ${JSON.stringify(blocks[0]).slice(0, 150)}`);
    }
    console.log();
  }
}
check().then(() => prisma.$disconnect());
