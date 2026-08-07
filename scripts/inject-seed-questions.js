const fs = require('fs');
const path = require('path');

// Read the exported questions
const questions = JSON.parse(fs.readFileSync('/tmp/all_questions.json', 'utf8'));

// Group by lesson title
const byLesson = {};
for (const q of questions) {
  if (!byLesson[q.lessonTitle]) byLesson[q.lessonTitle] = [];
  byLesson[q.lessonTitle].push(q);
}

// Read seed.ts
const seedPath = path.join(__dirname, '..', 'prisma', 'seed.ts');
let seed = fs.readFileSync(seedPath, 'utf8');

// For each lesson that has questions in the DB, find it in seed.ts and add questions
// The seed has lessons with 'questions: [...]' arrays
// We need to add the NEW questions (beyond what's already there)

// Read the original 16 questions from the first 16 lines of each lesson's questions array
const originalCounts = {};
const lessonPattern = /title:\s*"([^"]+)",\s*slug:/g;
let match;
while ((match = lessonPattern.exec(seed)) !== null) {
  const lessonTitle = match[1];
  if (byLesson[lessonTitle]) {
    originalCounts[lessonTitle] = (originalCounts[lessonTitle] || 0) + 1;
  }
}

// Build the additional questions for each lesson
// We'll append them to the seed file before the closing of SUBJECTS

// Instead of parsing the complex nested structure, let's add a post-seed step
// that adds questions based on lesson title matching

// Generate the post-seed code
let postSeedCode = `
// ============================================================
// ADDITIONAL QUESTIONS (beyond original 2 per lesson)
// ============================================================

async function seedAdditionalQuestions() {
  const questionsByLesson = ${JSON.stringify(byLesson, null, 2)};

  let totalAdded = 0;
  for (const [lessonTitle, qs] of Object.entries(questionsByLesson)) {
    const lesson = await prisma.lesson.findFirst({
      where: { title: lessonTitle },
      include: { topic: { include: { module: { include: { subject: true } } } } }
    });
    if (!lesson) { console.log('  SKIP: ' + lessonTitle); continue; }

    // Count existing questions for this lesson
    const existing = await prisma.question.count({ where: { lessonId: lesson.id } });
    if (existing >= qs.length) {
      console.log('  OK (already ' + existing + '): ' + lessonTitle);
      continue;
    }

    // Add only the new ones
    const toAdd = qs.slice(existing);
    for (const q of toAdd) {
      const parsedTags = typeof q.tags === 'string' ? q.tags : JSON.stringify(q.tags);
      await prisma.question.create({
        data: {
          questionType: q.questionType || 'multiple_choice',
          difficulty: q.difficulty || 'medium',
          questionText: q.questionText,
          explanation: q.explanation || '',
          hintText: q.hintText || '',
          tags: parsedTags,
          isActive: true,
          points: q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1,
          subjectId: lesson.topic.module.subject.id,
          lessonId: lesson.id,
          answers: {
            create: q.answers.map((a, i) => ({
              content: a.content,
              isCorrect: a.isCorrect,
              sortOrder: a.sortOrder !== undefined ? a.sortOrder : i,
            }))
          }
        }
      });
      totalAdded++;
    }
    console.log('  +' + toAdd.length + ': ' + lessonTitle);
  }
  console.log('Total additional questions added: ' + totalAdded);
}
`;

// Now inject this into the seed file
// Find the 'seed()' function call and add the additional step

// Replace the seed() call to include additional questions
const oldSeedCall = `seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });`;

const newSeedCall = `seed()
  .then(async () => {
    await seedAdditionalQuestions();
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });`;

if (seed.includes(oldSeedCall)) {
  // Insert the function before the seed() call
  const insertPoint = seed.indexOf(oldSeedCall);
  seed = seed.slice(0, insertPoint) + postSeedCode + '\n' + newSeedCall;
  fs.writeFileSync(seedPath, seed);
  console.log('Successfully injected additional questions into seed.ts');
} else {
  // Try to find just the seed() call
  const seedCallIdx = seed.lastIndexOf('seed()');
  if (seedCallIdx !== -1) {
    seed = seed.slice(0, seedCallIdx) + postSeedCode + '\n' + newSeedCall;
    fs.writeFileSync(seedPath, seed);
    console.log('Injected (fallback) additional questions into seed.ts');
  } else {
    console.log('ERROR: Could not find seed() call in seed.ts');
  }
}
