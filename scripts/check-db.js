const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const fc = await p.flashcard.count();
  console.log('Flashcard count:', fc);
  
  const dl = await p.dailyFlashcardQuizLog.count();
  console.log('DailyLog count:', dl);
  
  const subjects = await p.subject.findMany({ select: { id: true, code: true } });
  console.log('Subjects:', JSON.stringify(subjects));
  
  if (fc > 0) {
    const grouped = await p.flashcard.groupBy({ by: ['subjectId'], _count: true });
    console.log('Flashcards by subject:', JSON.stringify(grouped));
  }
  
  // Check a sample flashcard
  const sample = await p.flashcard.findFirst();
  console.log('Sample flashcard:', sample ? JSON.stringify(sample) : 'NONE');
  
  // Check questions with null questionText
  const nullQ = await p.question.count({ where: { questionText: null } });
  const totalQ = await p.question.count();
  console.log(`Questions: ${nullQ}/${totalQ} have null questionText`);
  
  await p.$disconnect();
}

main().catch(e => { console.error(e); p.$disconnect(); });
