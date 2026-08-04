import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function check() {
  // Check modules
  const modules = await prisma.module.findMany({ include: { subject: true, topics: { include: { lessons: true } } } });
  console.log("=== MODULES ===");
  for (const m of modules) {
    console.log(`[${m.subject.code}] Module: ${m.title} | Topics: ${m.topics.length}`);
    for (const t of m.topics) {
      console.log(`  Topic: ${t.title} | Lessons: ${t.lessons.length}`);
      for (const l of t.lessons) {
        console.log(`    Lesson: ${l.title} | slug: ${l.slug} | status: ${l.status} | type: ${l.contentType}`);
      }
    }
  }

  // Check lessons count
  const lessonCount = await prisma.lesson.count();
  console.log(`\nTotal lessons: ${lessonCount}`);

  // Check questions with lessonId
  const questionsWithLesson = await prisma.question.count({ where: { lessonId: { not: null } } });
  const questionsTotal = await prisma.question.count();
  console.log(`Questions with lessonId: ${questionsWithLesson} / ${questionsTotal}`);

  // Check lesson progress
  const progress = await prisma.lessonProgress.count();
  console.log(`Lesson progress records: ${progress}`);
}
check().then(() => prisma.$disconnect());
