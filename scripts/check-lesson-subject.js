const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const l = await p.lesson.findFirst({
    select: { id: true, topicId: true },
    include: { topic: { select: { moduleId: true }, include: { module: { select: { subjectId: true } } } } }
  });
  console.log('Lesson topicId:', l.topicId, 'subjectId:', l.topic.module.subjectId);
  await p.$disconnect();
})();
