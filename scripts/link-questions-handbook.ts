import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

/**
 * Link existing questions to Handbook Topics via relatedConceptId.
 * Uses a slug-based mapping to match questions to the right concept.
 */
async function main() {
  console.log('Linking questions to handbook topics...');

  // Get all handbook topics
  const topics = await db.handbookTopic.findMany({
    select: { id: true, subjectId: true, title: true, categoryType: true },
  });

  // Get subjects
  const subjects = await db.subject.findMany({
    select: { id: true, code: true },
  });
  const subjectMap = Object.fromEntries(subjects.map(s => [s.id, s.code]));

  // Build a lookup: subjectCode -> categoryType -> topic id
  const lookup: Record<string, Record<string, string>> = {};
  for (const t of topics) {
    const code = subjectMap[t.subjectId] || '';
    if (!lookup[code]) lookup[code] = {};
    // Map by keyword in title
    if (t.title.includes('Number Operations') || t.title.includes('Fractions')) {
      lookup[code]['number-ops'] = t.id;
    }
    if (t.title.includes('Algebra') || t.title.includes('Linear')) {
      lookup[code]['algebra'] = t.id;
    }
    if (t.title.includes('Geometry') || t.title.includes('Data')) {
      lookup[code]['geometry'] = t.id;
    }
    if (t.title.includes('Life Science') || t.title.includes('Cells')) {
      lookup[code]['life-science'] = t.id;
    }
    if (t.title.includes('Physical Science') || t.title.includes('Chemistry')) {
      lookup[code]['physical-science'] = t.id;
    }
    if (t.title.includes('Earth') || t.title.includes('Space')) {
      lookup[code]['earth-space'] = t.id;
    }
    if (t.title.includes('Reading Comprehension')) {
      lookup[code]['reading'] = t.id;
    }
    if (t.title.includes('Grammar') || t.title.includes('Sentence')) {
      lookup[code]['grammar'] = t.id;
    }
    if (t.title.includes('Civics') || t.title.includes('Constitution')) {
      lookup[code]['civics'] = t.id;
    }
    if (t.title.includes('History') || t.title.includes('Economics')) {
      lookup[code]['history'] = t.id;
    }
  }

  // Get all questions
  const questions = await db.question.findMany({
    select: { id: true, subjectId: true, questionText: true, tags: true },
  });

  let updated = 0;
  for (const q of questions) {
    const code = subjectMap[q.subjectId] || '';
    const text = (q.questionText || '').toLowerCase();
    const tagsRaw = q.tags || '[]';
    let tags: string[] = [];
    try { tags = JSON.parse(tagsRaw); } catch {}
    const allText = text + ' ' + tags.join(' ');

    let conceptId: string | null = null;

    if (code === 'math') {
      if (/\b(fraction|decimal|percent|ratio|proportion|whole number|order of operation|pemdas)\b/.test(allText)) conceptId = lookup['math']?.['number-ops'] || null;
      else if (/\b(algebra|equation|linear|inequal|slope|variable|solve for x|system)\b/.test(allText)) conceptId = lookup['math']?.['algebra'] || null;
      else if (/\b(geometry|area|perimeter|volume|circle|triangle|pythagorean|mean|median|probability|statistic)\b/.test(allText)) conceptId = lookup['math']?.['geometry'] || null;
    } else if (code === 'science') {
      if (/\b(cell|dna|gene|genetic|evolution|species|organism|mitosis)\b/.test(allText)) conceptId = lookup['science']?.['life-science'] || null;
      else if (/\b(atom|electron|proton|chemical|reaction|energy|kinetic|velocity|force|mass)\b/.test(allText)) conceptId = lookup['science']?.['physical-science'] || null;
      else if (/\b(earth|plate tectonic|weather|climate|planet|solar|moon|season|volcano)\b/.test(allText)) conceptId = lookup['science']?.['earth-space'] || null;
    } else if (code === 'rla') {
      if (/\b(read|comprehension|passage|main idea|inference|author|tone|purpose)\b/.test(allText)) conceptId = lookup['rla']?.['reading'] || null;
      else if (/\b(gramm|sentence|punctuat|verb|subject|pronoun|comma|clause|tense)\b/.test(allText)) conceptId = lookup['rla']?.['grammar'] || null;
    } else if (code === 'ss') {
      if (/\b(constitution|amendment|congress|supreme court|president|bill of rights|civic|branch|vote)\b/.test(allText)) conceptId = lookup['ss']?.['civics'] || null;
      else if (/\b(history|colonial|revolution|civil war|depression|world war|econ|supply|demand|gdp|market)\b/.test(allText)) conceptId = lookup['ss']?.['history'] || null;
    }

    if (conceptId) {
      await db.question.update({ where: { id: q.id }, data: { relatedConceptId: conceptId } });
      updated++;
    }
  }

  console.log(`Linked ${updated} of ${questions.length} questions to handbook topics.`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
