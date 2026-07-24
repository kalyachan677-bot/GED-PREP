import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Accurate slug -> category mapping based on actual DB slugs
const SLUG_TO_CATEGORY: Record<string, string> = {
  // MATH - Quantitative Problem Solving
  "rectangle-triangle-basics": "math|Quantitative Problem Solving",
  "pythagorean-theorem-intro": "math|Quantitative Problem Solving",
  "pythagorean-applications": "math|Quantitative Problem Solving",
  "circles-composite-shapes": "math|Quantitative Problem Solving",

  // MATH - Algebraic Problem Solving
  "what-is-linear-equation": "math|Algebraic Problem Solving",
  "solving-inequalities": "math|Algebraic Problem Solving",
  "substitution-method": "math|Algebraic Problem Solving",
  "elimination-method": "math|Algebraic Problem Solving",

  // RLA - Reading Comprehension
  "finding-main-idea": "rla|Reading Comprehension",
  "authors-purpose": "rla|Reading Comprehension",
  "making-inferences": "rla|Reading Comprehension",
  "point-of-view": "rla|Reading Comprehension",

  // RLA - Language & Grammar
  "comma-rules": "rla|Language & Grammar",
  "apostrophes-quotation-marks": "rla|Language & Grammar",
  "sentences-vs-fragments": "rla|Language & Grammar",
  "subject-verb-agreement": "rla|Language & Grammar",

  // SCIENCE - Life Science
  "cell-structure-organelles": "science|Life Science",
  "cell-division-mitosis-meiosis": "science|Life Science",
  "dna-and-genes": "science|Life Science",
  "punnett-squares": "science|Life Science",

  // SCIENCE - Physical Science
  "atoms-periodic-table": "science|Physical Science",
  "chemical-reactions": "science|Physical Science",
  "newtons-laws-motion": "science|Physical Science",
  "speed-velocity-acceleration": "science|Physical Science",

  // SS - Civics & Government
  "us-constitution": "ss|Civics & Government",
  "legislative-branch-congress": "ss|Civics & Government",
  "executive-judicial-branches": "ss|Civics & Government",
  "how-elections-work": "ss|Civics & Government",
  "political-parties": "ss|Civics & Government",

  // SS - U.S. History
  "declaration-of-independence": "ss|U.S. History",
  "civil-rights-movement-overview": "ss|U.S. History",
  "mlk-rosa-parks": "ss|U.S. History",
};

async function main() {
  // Build categoryId lookup
  const categories = await prisma.topicCategory.findMany();
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    const subject = await prisma.subject.findUnique({ where: { id: c.subjectId } });
    if (subject) {
      catMap[`${subject.code}|${c.name}`] = c.id;
    }
  }

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [slug, catKey] of Object.entries(SLUG_TO_CATEGORY)) {
    const catId = catMap[catKey];
    if (!catId) {
      console.log(`  NO CAT: ${catKey}`);
      notFound++;
      continue;
    }

    const lesson = await prisma.lesson.findUnique({ where: { slug } });
    if (!lesson) {
      console.log(`  NO LESSON: ${slug}`);
      notFound++;
      continue;
    }

    if (lesson.topicCategoryId) {
      skipped++;
      continue;
    }

    await prisma.lesson.update({
      where: { id: lesson.id },
      data: { topicCategoryId: catId, lessonType: "core_topic" },
    });
    updated++;
    console.log(`  LINKED: ${slug} -> ${catKey}`);
  }

  const total = await prisma.lesson.count({ where: { topicCategoryId: { not: null } } });
  const unlinked = await prisma.lesson.count({ where: { topicCategoryId: null, lessonType: "core_topic" } });
  console.log(`\n=== LINKING COMPLETE ===`);
  console.log(`Updated: ${updated}, Skipped (already linked): ${skipped}, Not found: ${notFound}`);
  console.log(`Total lessons with category: ${total}`);
  console.log(`Core lessons still unlinked: ${unlinked}`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
