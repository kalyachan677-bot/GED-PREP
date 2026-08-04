import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
  // Check modules per subject
  const modules = await db.module.findMany({
    include: { subject: true, topics: { include: { lessons: true } } },
    orderBy: { sortOrder: 'asc' }
  });
  console.log('Total modules:', modules.length);
  modules.forEach(m => {
    const totalLessons = m.topics.reduce((s, t) => s + t.lessons.length, 0);
    console.log(`  ${m.subject.code} | ${m.title} | topics: ${m.topics.length} | lessons: ${totalLessons}`);
    if (m.topics.length > 0) {
      m.topics.forEach(t => {
        console.log(`    - ${t.title} (${t.lessons.length} lessons)`);
      });
    }
  });

  // Check total lessons
  const totalLessons = await db.lesson.count();
  console.log('\nTotal lessons in DB:', totalLessons);

  // Check subjects
  const subjects = await db.subject.findMany();
  console.log('\nSubjects:', subjects.map(s => s.code).join(', '));
}

main().then(() => db.$disconnect()).catch(e => { console.error(e); db.$disconnect(); });
