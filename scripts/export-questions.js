const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
const fs = require('fs');

(async () => {
  const questions = await p.question.findMany({
    where: { isActive: true },
    include: { answers: { orderBy: { sortOrder: 'asc' } }, lesson: { select: { title: true } } },
    orderBy: { createdAt: 'asc' }
  });
  const exportData = questions.map(q => ({
    lessonTitle: q.lesson.title,
    questionType: q.questionType,
    difficulty: q.difficulty,
    questionText: q.questionText,
    explanation: q.explanation || '',
    hintText: q.hintText || '',
    tags: q.tags,
    answers: q.answers.map(a => ({ content: a.content, isCorrect: a.isCorrect, sortOrder: a.sortOrder }))
  }));
  fs.writeFileSync('/tmp/all_questions.json', JSON.stringify(exportData, null, 2));
  console.log('Exported', exportData.length, 'questions');
  await p.$disconnect();
})();
