import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================
// 1. TOPIC CATEGORIES — Exam-weighted curriculum categories
// ============================================================
interface CategorySeed {
  subjectCode: string;
  name: string;
  nameTh: string;
  description: string;
  weightPercentage: number;
  categoryType: "core" | "supplementary";
  sortOrder: number;
}

const CATEGORIES: CategorySeed[] = [
  // ===== MATH =====
  {
    subjectCode: "math",
    name: "Quantitative Problem Solving",
    nameTh: "การแก้ปัญหาเชิงปริมาณ",
    description: "Basic Operations (Fractions, Decimals, Percentages), Proportions & Ratios, Exponents & Scientific Notation, Geometry (Area, Perimeter, Volume)",
    weightPercentage: 45,
    categoryType: "core",
    sortOrder: 0,
  },
  {
    subjectCode: "math",
    name: "Algebraic Problem Solving",
    nameTh: "การแก้ปัญหาเชิงพีชคณิต",
    description: "Equations & Inequalities, Polynomials & Quadratics, Functions, Graphing Linear Equations (Slope, y=mx+b)",
    weightPercentage: 55,
    categoryType: "core",
    sortOrder: 1,
  },
  {
    subjectCode: "math",
    name: "Calculator Mastery & Formula Sheet",
    nameTh: "การใช้เครื่องคิดเลขและสูตรคณิตศาสตร์",
    description: "TI-30XS MultiView techniques (fractions, x², √x, change syntax), Formula Sheet reference and application",
    categoryType: "supplementary",
    weightPercentage: 0,
    sortOrder: 2,
  },

  // ===== RLA =====
  {
    subjectCode: "rla",
    name: "Reading Comprehension",
    nameTh: "การอ่านเพื่อความเข้าใจ",
    description: "Informational Texts (70%): Main Idea, Author's Purpose, Central Claim, Supporting Details. Literary Texts (30%): Characters, Tone, Figurative Language, Plot. Evidence Evaluation: Validity, Biases",
    weightPercentage: 80,
    categoryType: "core",
    sortOrder: 0,
  },
  {
    subjectCode: "rla",
    name: "Language & Grammar",
    nameTh: "ภาษาและไวยากรณ์",
    description: "Punctuation (Commas, Apostrophes, Semicolons), Sentence Structure (Run-on, Fragments, Parallelism), Usage Rules (Subject-Verb Agreement, Pronoun Match, Verb Tenses)",
    weightPercentage: 15,
    categoryType: "core",
    sortOrder: 1,
  },
  {
    subjectCode: "rla",
    name: "Extended Response / Essay",
    nameTh: "การเขียนเรียงความวิเคราะห์",
    description: "Argumentative Essay: Reading 2 opposing passages and writing analysis to identify the better-supported argument",
    weightPercentage: 15,
    categoryType: "core",
    sortOrder: 2,
  },
  {
    subjectCode: "rla",
    name: "High-Impact Vocabulary & Essay Templates",
    nameTh: "คลังคำศัพท์สำคัญและโครงสร้าง Essay",
    description: "80% High-Impact Vocab: college-level vocabulary most frequently tested. Essay Template (Score 4-6): ready-made essay structure for high-scoring responses",
    categoryType: "supplementary",
    weightPercentage: 0,
    sortOrder: 3,
  },

  // ===== SCIENCE =====
  {
    subjectCode: "science",
    name: "Life Science",
    nameTh: "วิทยาศาสตร์ชีวภาพ",
    description: "Cell & Biology (Cell, DNA, RNA), Human Body & Health (Body Systems, Nutrition, Diseases), Genetics & Evolution (Punnett Squares), Ecosystems (Food Webs, Photosynthesis)",
    weightPercentage: 40,
    categoryType: "core",
    sortOrder: 0,
  },
  {
    subjectCode: "science",
    name: "Physical Science",
    nameTh: "วิทยาศาสตร์กายภาพ",
    description: "Chemistry Fundamentals (Atoms, Periodic Table), Chemical Reactions & Conservation of Mass, Physics & Motion (Newton's Laws), Energy & Waves (Kinetic/Potential)",
    weightPercentage: 40,
    categoryType: "core",
    sortOrder: 1,
  },
  {
    subjectCode: "science",
    name: "Earth & Space Science",
    nameTh: "วิทยาศาสตร์โลกและอวกาศ",
    description: "Earth Systems (Plate Tectonics, Natural Disasters), Weather & Climate (Water Cycle, Climate Systems), Astronomy (Solar System, Basic Astronomy)",
    weightPercentage: 20,
    categoryType: "core",
    sortOrder: 2,
  },
  {
    subjectCode: "science",
    name: "Scientific Method & Math in Science",
    nameTh: "วิธีวิทยาศาสตร์และคณิตศาสตร์ในวิทยาศาสตร์",
    description: "Scientific Method Engine: Identifying Independent Variable, Dependent Variable, Control Group. Math in Science: Mean/Median/Mode, Probability, Simple Energy Equations",
    categoryType: "supplementary",
    weightPercentage: 0,
    sortOrder: 3,
  },

  // ===== SOCIAL STUDIES =====
  {
    subjectCode: "ss",
    name: "Civics & Government",
    nameTh: "พลเมืองและรัฐบาล",
    description: "Constitution & Rights (US Constitution, Bill of Rights), Government Branches (Executive, Legislative, Judicial, Checks & Balances), Political Process (Elections, Political Parties)",
    weightPercentage: 50,
    categoryType: "core",
    sortOrder: 0,
  },
  {
    subjectCode: "ss",
    name: "U.S. History",
    nameTh: "ประวัติศาสตร์สหรัฐอเมริกา",
    description: "Early America (Colonization, American Revolution), Civil War & Reconstruction, Modern History (World War I & II, Cold War)",
    weightPercentage: 20,
    categoryType: "core",
    sortOrder: 1,
  },
  {
    subjectCode: "ss",
    name: "Economics",
    nameTh: "เศรษฐศาสตร์",
    description: "Micro/Macro Economics (Demand & Supply, Price Mechanisms), Economic Systems (Capitalism vs Socialism), Financial Concepts (Inflation, Taxes, Budgets)",
    weightPercentage: 15,
    categoryType: "core",
    sortOrder: 2,
  },
  {
    subjectCode: "ss",
    name: "Geography & World History",
    nameTh: "ภูมิศาสตร์และประวัติศาสตร์โลก",
    description: "Geography (Map Reading, Population Graphs, Settlement Patterns), World History (Key Global Events)",
    weightPercentage: 15,
    categoryType: "core",
    sortOrder: 3,
  },
  {
    subjectCode: "ss",
    name: "Historical Source Analysis & Critical Thinking",
    nameTh: "การวิเคราะห์แหล่งข้อมูลทางประวัติศาสตร์และการคิดอย่างมีวิจารณญาณ",
    description: "Historical Source Analysis: Primary Source vs Secondary Source. Fact vs. Opinion Engine: Analyzing facts, opinions, and biases in historical media",
    categoryType: "supplementary",
    weightPercentage: 0,
    sortOrder: 4,
  },
];

// ============================================================
// 2. LESSONS — Supplementary lessons per subject
// ============================================================
interface SupplementaryLessonSeed {
  subjectCode: string;
  categoryName: string;
  title: string;
  slug: string;
  bodyContent: string;
  durationMinutes: number;
}

function makeBodyContent(heading: string, sections: { sub: string; body: string }[]): string {
  const blocks: any[] = [];
  blocks.push({ id: `h_${Math.random().toString(36).slice(2, 8)}`, block_type: "heading", content: heading, level: 2 });
  for (const s of sections) {
    blocks.push({ id: `sh_${Math.random().toString(36).slice(2, 8)}`, block_type: "heading", content: s.sub, level: 3 });
    blocks.push({ id: `p_${Math.random().toString(36).slice(2, 8)}`, block_type: "paragraph", content: s.body });
  }
  return JSON.stringify(blocks);
}

const SUPPLEMENTARY_LESSONS: SupplementaryLessonSeed[] = [
  // ===== MATH SUPPLEMENTARY =====
  {
    subjectCode: "math",
    categoryName: "Calculator Mastery & Formula Sheet",
    title: "TI-30XS MultiView: Fractions & Mixed Numbers",
    slug: "math-calc-fractions",
    bodyContent: makeBodyContent("TI-30XS MultiView: Fractions & Mixed Numbers", [
      { sub: "Entering Fractions", body: "On the TI-30XS MultiView, press the <strong>n/d</strong> key (bottom-left) to enter a fraction. For example, to enter 3/4, press [3] [n/d] [4]. The calculator will display the fraction in proper form. To enter a mixed number like 2 3/4, press [2] [n/d] [3] [n/d] [4]." },
      { sub: "Simplifying Fractions", body: "The calculator automatically simplifies fractions. Enter 6/8 and it will display 3/4. If you need the unsimplified form, press [2nd] [n/d] to toggle between simplified and mixed/unsimplified forms." },
      { sub: "Fraction Operations", body: "Add, subtract, multiply, and divide fractions just like whole numbers. For 1/2 + 1/3: press [1] [n/d] [2] [+] [1] [n/d] [3] [=]. The result 5/6 appears. Use the <strong>change</strong> key to convert between fraction and decimal forms." },
    ]),
    durationMinutes: 10,
  },
  {
    subjectCode: "math",
    categoryName: "Calculator Mastery & Formula Sheet",
    title: "TI-30XS MultiView: Powers, Roots & Scientific Notation",
    slug: "math-calc-powers-roots",
    bodyContent: makeBodyContent("TI-30XS MultiView: Powers, Roots & Scientific Notation", [
      { sub: "Powers (x² and x³)", body: "The <strong>x²</strong> key (left side) squares a number instantly: [5] [x²] = 25. For other powers, use the <strong>^</strong> key: [2] [^] [5] [=] gives 32. For cubes, press [2nd] [x²] to access x³: [3] [x³] = 27." },
      { sub: "Square Roots", body: "The <strong>√x</strong> key (2nd function of x²) finds square roots: [2nd] [x²] [144] [=] gives 12. For cube roots, use [2nd] [x³] then enter the number. The calculator handles irrational results as decimals." },
      { sub: "Scientific Notation", body: "Enter scientific notation using the <strong>EE</strong> key (2nd of comma). For 3.2 × 10⁵: press [3] [.] [2] [2nd] [,] [5]. The display shows 3.2E5. To convert back, press [2nd] [SCI/ENG] to toggle display modes." },
    ]),
    durationMinutes: 10,
  },
  {
    subjectCode: "math",
    categoryName: "Calculator Mastery & Formula Sheet",
    title: "GED Math Formula Sheet: Essential Formulas",
    slug: "math-formula-sheet",
    bodyContent: makeBodyContent("GED Math Formula Sheet: Essential Formulas", [
      { sub: "Area Formulas", body: "<strong>Rectangle:</strong> A = l × w &nbsp;|&nbsp; <strong>Triangle:</strong> A = ½ × b × h &nbsp;|&nbsp; <strong>Circle:</strong> A = π × r² &nbsp;|&nbsp; <strong>Parallelogram:</strong> A = b × h &nbsp;|&nbsp; <strong>Trapezoid:</strong> A = ½ × (b₁ + b₂) × h" },
      { sub: "Perimeter & Circumference", body: "<strong>Rectangle:</strong> P = 2(l + w) &nbsp;|&nbsp; <strong>Triangle:</strong> P = a + b + c &nbsp;|&nbsp; <strong>Circle:</strong> C = 2 × π × r (or π × d)" },
      { sub: "Volume Formulas", body: "<strong>Rectangular Prism:</strong> V = l × w × h &nbsp;|&nbsp; <strong>Cylinder:</strong> V = π × r² × h &nbsp;|&nbsp; <strong>Sphere:</strong> V = (4/3) × π × r³ &nbsp;|&nbsp; <strong>Cone:</strong> V = (1/3) × π × r² × h" },
      { sub: "Pythagorean Theorem", body: "a² + b² = c² (where c is the hypotenuse of a right triangle). Used extensively in GED geometry and distance problems." },
      { sub: "Distance & Slope", body: "<strong>Distance:</strong> d = √((x₂-x₁)² + (y₂-y₁)²) &nbsp;|&nbsp; <strong>Slope:</strong> m = (y₂-y₁)/(x₂-x₁) &nbsp;|&nbsp; <strong>Midpoint:</strong> M = ((x₁+x₂)/2, (y₁+y₂)/2)" },
    ]),
    durationMinutes: 15,
  },

  // ===== RLA SUPPLEMENTARY =====
  {
    subjectCode: "rla",
    categoryName: "High-Impact Vocabulary & Essay Templates",
    title: "80% High-Impact GED Vocabulary (Part 1)",
    slug: "rla-vocab-part1",
    bodyContent: makeBodyContent("80% High-Impact GED Vocabulary (Part 1)", [
      { sub: "Words Related to Argument & Analysis", body: "<strong>Advocate</strong> (v.) — สนับสนุนอย่างเป็นระบบ | <strong>Contend</strong> (v.) — อ้าง, โต้แย้ง | <strong>Corroborate</strong> (v.) — ยืนยันด้วยหลักฐาน | <strong>Refute</strong> (v.) — หักล้าง | <strong>Substantiate</strong> (v.) — ยืนยันด้วยเหตุผล | <strong>Concede</strong> (v.) — ยอมรับ (ข้อโต้แย้ง)" },
      { sub: "Words Related to Evidence & Credibility", body: "<strong>Credible</strong> (adj.) — น่าเชื่อถือ | <strong>Bias</strong> (n.) — อคติ | <strong>Impartial</strong> (adj.) — เป็นกลาง | <strong>Anecdotal</strong> (adj.) — จากเรื่องเล่า/ประสบการณ์ส่วนตัว | <strong>Empirical</strong> (adj.) — ตามหลักฐานเชิงประจักษ์ | <strong>Speculation</strong> (n.) — การคาดเดา" },
      { sub: "Words Related to Text Structure", body: "<strong>Thesis</strong> (n.) — ข้อวางหลัก | <strong>Premise</strong> (n.) — ข้อตั้ง | <strong>Counterargument</strong> (n.) — ข้อโต้แย้ง | <strong>Elaborate</strong> (v.) — อธิบายละเอียด | <strong>Juxtapose</strong> (v.) — เทียบเคียง | <strong>Chronological</strong> (adj.) — ตามลำดับเวลา" },
    ]),
    durationMinutes: 12,
  },
  {
    subjectCode: "rla",
    categoryName: "High-Impact Vocabulary & Essay Templates",
    title: "80% High-Impact GED Vocabulary (Part 2)",
    slug: "rla-vocab-part2",
    bodyContent: makeBodyContent("80% High-Impact GED Vocabulary (Part 2)", [
      { sub: "Words Related to Tone & Style", body: "<strong>Pragmatic</strong> (adj.) — ใช้เหตุผล/ปฏิบัติจริง | <strong>Cynical</strong> (adj.) — มองโลกในแง่ร้าย | <strong>Empathetic</strong> (adj.) — เข้าใจความรู้สึก | <strong>Objective</strong> (adj.) — ไม่มีอคติ | <strong>Satirical</strong> (adj.) — เสียดสี | <strong>Didactic</strong> (adj.) — สอนบทเรียน" },
      { sub: "Words Related to Change & Impact", body: "<strong>Catalyst</strong> (n.) — ตัวเร่งปฏิกิริยา | <strong>Pivotal</strong> (adj.) — สำคัญมาก/เปลี่ยนแปลงทิศทาง | <strong>Implify</strong> (v.) — แฝงนัย | <strong>Consequence</strong> (n.) — ผลที่ตามมา | <strong>Precedent</strong> (n.) — แบบอย่าง/คดีนำ | <strong>Transition</strong> (n.) — การเปลี่ยนผ่าน" },
      { sub: "Words Related to Society & Culture", body: "<strong>Coherent</strong> (adj.) — มีเหตุผลขัดเกลา | <strong>Diverse</strong> (adj.) — หลากหลาย | <strong>Institution</strong> (n.) — สถาบัน | <strong>Legislation</strong> (n.) — กฎหมาย | <strong>Regulation</strong> (n.) — ข้อบังคับ | <strong>Reform</strong> (n.) — การปฏิรูป" },
    ]),
    durationMinutes: 12,
  },
  {
    subjectCode: "rla",
    categoryName: "High-Impact Vocabulary & Essay Templates",
    title: "GED Essay Template: Score 4-6 Structure",
    slug: "rla-essay-template",
    bodyContent: makeBodyContent("GED Essay Template: Score 4-6 Structure", [
      { sub: "Paragraph 1: Introduction (Claim)", body: "<strong>Structure:</strong> Hook + Summary of debate + Your thesis (which argument is better supported). <strong>Example:</strong> 'The debate over [topic] centers on whether [view A] or [view B] is more valid. While both sides present compelling points, [Author A]'s argument is better supported because [reason 1] and [reason 2].'" },
      { sub: "Paragraph 2: Evidence for Your Claim", body: "<strong>Structure:</strong> Topic sentence + 2 pieces of evidence from the passage + Explanation. <strong>Key phrases:</strong> 'According to the passage...', 'The author provides evidence that...', 'This is supported by...'" },
      { sub: "Paragraph 3: Address the Counterargument", body: "<strong>Structure:</strong> Acknowledge the other side + Explain why it's weaker. <strong>Key phrases:</strong> 'While [Author B] argues that...', 'However, this claim is less convincing because...', 'Unlike the previous passage, this one lacks...''" },
      { sub: "Paragraph 4: Conclusion", body: "<strong>Structure:</strong> Restate thesis (different words) + Summarize 2 main reasons + Final thought. <strong>Key phrases:</strong> 'In conclusion...', 'The stronger argument is clearly...', 'Therefore, based on the evidence provided...'" },
    ]),
    durationMinutes: 15,
  },

  // ===== SCIENCE SUPPLEMENTARY =====
  {
    subjectCode: "science",
    categoryName: "Scientific Method & Math in Science",
    title: "Scientific Method: Variables & Experimental Design",
    slug: "sci-scientific-method",
    bodyContent: makeBodyContent("Scientific Method: Variables & Experimental Design", [
      { sub: "Independent vs Dependent Variable", body: "The <strong>Independent Variable (IV)</strong> is what the scientist changes on purpose (cause). The <strong>Dependent Variable (DV)</strong> is what gets measured (effect). Example: If testing fertilizer on plant growth — IV = amount of fertilizer, DV = plant height." },
      { sub: "Control Group & Constants", body: "The <strong>Control Group</strong> receives no treatment and serves as a baseline for comparison. <strong>Constants (Controlled Variables)</strong> are factors kept the same across all groups. Example: Same soil type, same amount of water, same sunlight for all plants." },
      { sub: "Reading Tables & Graphs in Science", body: "On the GED, you will encounter data tables, bar graphs, line graphs, and scatter plots. Always read the title, axis labels, and units first. Look for trends (increase, decrease, no change) and relationships between variables." },
    ]),
    durationMinutes: 12,
  },
  {
    subjectCode: "science",
    categoryName: "Scientific Method & Math in Science",
    title: "Math in Science: Mean, Median, Mode & Probability",
    slug: "sci-math-in-science",
    bodyContent: makeBodyContent("Math in Science: Mean, Median, Mode & Probability", [
      { sub: "Measures of Central Tendency", body: "<strong>Mean (Average):</strong> Sum all values ÷ number of values. Example: 4, 6, 8 → Mean = (4+6+8)/3 = 6. <strong>Median:</strong> Middle value when data is sorted. Example: 3, 5, 7, 9, 11 → Median = 7. <strong>Mode:</strong> Most frequent value. Example: 2, 3, 3, 5, 6 → Mode = 3." },
      { sub: "Basic Probability", body: "<strong>Probability</strong> = (Number of favorable outcomes) ÷ (Total possible outcomes). Example: A bag has 3 red and 5 blue marbles. P(red) = 3/8 = 0.375 = 37.5%. Probability is always between 0 and 1." },
      { sub: "Simple Energy Equations", body: "<strong>Kinetic Energy:</strong> KE = ½mv² (m = mass, v = velocity). <strong>Gravitational Potential Energy:</strong> PE = mgh (m = mass, g = 9.8 m/s², h = height). On the GED, you often compare KE and PE — total energy (KE + PE) is conserved." },
    ]),
    durationMinutes: 12,
  },

  // ===== SOCIAL STUDIES SUPPLEMENTARY =====
  {
    subjectCode: "ss",
    categoryName: "Historical Source Analysis & Critical Thinking",
    title: "Primary Source vs Secondary Source",
    slug: "ss-source-analysis",
    bodyContent: makeBodyContent("Primary Source vs Secondary Source", [
      { sub: "Primary Sources", body: "<strong>Primary Sources</strong> are firsthand accounts created during the time period being studied. Examples: diaries, letters, speeches, photographs, original documents (Declaration of Independence), newspaper articles from the era, government records. These provide direct evidence but may contain personal bias." },
      { sub: "Secondary Sources", body: "<strong>Secondary Sources</strong> are created after the fact by people who did not witness the events. Examples: textbooks, biographies, documentaries, historical analyses, encyclopedia entries. These offer broader perspective but may interpret events through the author's lens." },
      { sub: "GED Strategy", body: "On the GED, you will be asked to: (1) Identify whether a source is primary or secondary, (2) Evaluate the reliability of each type, (3) Compare multiple sources on the same topic, (4) Recognize how the author's perspective affects the source. Always ask: Who created this? When? Why?" },
    ]),
    durationMinutes: 10,
  },
  {
    subjectCode: "ss",
    categoryName: "Historical Source Analysis & Critical Thinking",
    title: "Fact vs. Opinion & Bias Detection",
    slug: "ss-fact-vs-opinion",
    bodyContent: makeBodyContent("Fact vs. Opinion & Bias Detection", [
      { sub: "Distinguishing Fact from Opinion", body: "A <strong>Fact</strong> is a statement that can be verified with evidence (dates, statistics, names). Example: 'The Civil War ended in 1865.' An <strong>Opinion</strong> expresses a belief or judgment. Example: 'The Civil War was the most important event in American history.' On the GED, you must identify which is which." },
      { sub: "Recognizing Bias", body: "<strong>Bias</strong> is a preference or prejudice that affects judgment. Watch for: loaded language (emotional words), one-sided arguments, omission of facts, appeals to fear or patriotism. Example: A political ad only showing positive facts about one candidate shows bias by omission." },
      { sub: "Evaluating Historical Claims", body: "When evaluating a claim on the GED: (1) Check if evidence is cited, (2) Consider the source's background and potential bias, (3) Look for counter-evidence, (4) Determine if the conclusion follows logically from the evidence. Strong claims are supported by multiple credible sources." },
    ]),
    durationMinutes: 10,
  },
];

// ============================================================
// 3. MAIN SEED FUNCTION
// ============================================================
async function main() {
  console.log("=== Seeding Topic Categories & Supplementary Lessons ===\n");

  // --- Seed Topic Categories ---
  console.log("--- Creating Topic Categories ---");
  const categoryMap: Record<string, string> = {}; // "subjectCode|categoryName" -> categoryId

  for (const cat of CATEGORIES) {
    const subject = await prisma.subject.findUnique({ where: { code: cat.subjectCode } });
    if (!subject) {
      console.log(`  SKIP: Subject '${cat.subjectCode}' not found`);
      continue;
    }

    const key = `${cat.subjectCode}|${cat.name}`;
    const existing = await prisma.topicCategory.findFirst({
      where: { subjectId: subject.id, name: cat.name },
    });

    if (existing) {
      categoryMap[key] = existing.id;
      console.log(`  EXISTS: [${cat.subjectCode}] ${cat.name}`);
      continue;
    }

    const created = await prisma.topicCategory.create({
      data: {
        subjectId: subject.id,
        name: cat.name,
        nameTh: cat.nameTh,
        description: cat.description,
        weightPercentage: cat.weightPercentage,
        categoryType: cat.categoryType,
        sortOrder: cat.sortOrder,
      },
    });
    categoryMap[key] = created.id;
    console.log(`  CREATED: [${cat.subjectCode}] ${cat.name} (${cat.categoryType}, ${cat.weightPercentage}%)`);
  }

  // --- Seed Supplementary Lessons ---
  console.log("\n--- Creating Supplementary Lessons ---");
  let lessonCount = 0;

  for (const ls of SUPPLEMENTARY_LESSONS) {
    const subject = await prisma.subject.findUnique({ where: { code: ls.subjectCode } });
    if (!subject) {
      console.log(`  SKIP: Subject '${ls.subjectCode}' not found for lesson '${ls.title}'`);
      continue;
    }

    // Check if lesson slug already exists
    const existingLesson = await prisma.lesson.findUnique({ where: { slug: ls.slug } });
    if (existingLesson) {
      console.log(`  EXISTS: ${ls.slug}`);
      // Still update topicCategoryId if not set
      const catKey = `${ls.subjectCode}|${ls.categoryName}`;
      const catId = categoryMap[catKey];
      if (catId && !existingLesson.topicCategoryId) {
        await prisma.lesson.update({ where: { id: existingLesson.id }, data: { topicCategoryId: catId } });
        console.log(`  UPDATED topicCategoryId for ${ls.slug}`);
      }
      continue;
    }

    const catKey = `${ls.subjectCode}|${ls.categoryName}`;
    const catId = categoryMap[catKey];

    // Find or create a "supplementary" topic under the first module of the subject
    const firstModule = await prisma.module.findFirst({
      where: { subjectId: subject.id },
      orderBy: { sortOrder: "asc" },
    });

    if (!firstModule) {
      console.log(`  SKIP: No module found for subject '${ls.subjectCode}'`);
      continue;
    }

    // Find or create a supplementary topic under this module
    const supTopicTitle = `Supplementary: ${ls.categoryName}`;
    let supTopic = await prisma.topic.findFirst({
      where: { moduleId: firstModule.id, title: supTopicTitle },
    });
    if (!supTopic) {
      supTopic = await prisma.topic.create({
        data: {
          moduleId: firstModule.id,
          title: supTopicTitle,
          description: `Supplementary lessons for: ${ls.categoryName}`,
          sortOrder: 999, // put at end
          status: "published",
        },
      });
    }

    await prisma.lesson.create({
      data: {
        topicId: supTopic.id,
        title: ls.title,
        slug: ls.slug,
        contentType: "text",
        bodyContent: ls.bodyContent,
        durationMinutes: ls.durationMinutes,
        sortOrder: lessonCount,
        lessonType: "supplementary_topic",
        topicCategoryId: catId || null,
        status: "published",
      },
    });
    lessonCount++;
    console.log(`  CREATED: [${ls.subjectCode}] ${ls.title}`);
  }

  // --- Link existing core lessons to their topic categories ---
  console.log("\n--- Linking Existing Lessons to Topic Categories ---");
  let linkedCount = 0;

  // Math lessons mapping
  const mathCategoryLessons: Record<string, string[]> = {
    "Quantitative Problem Solving": ["fractions-operations", "decimals-operations", "percentages", "ratios-proportions", "exponents-scientific-notation", "geometry-area-perimeter", "geometry-volume-surface-area"],
    "Algebraic Problem Solving": ["solving-linear-equations", "linear-inequalities", "polynomials-operations", "quadratic-equations", "functions-basics", "graphing-linear-equations", "slope-intercept-form"],
  };

  // RLA lessons mapping
  const rlaCategoryLessons: Record<string, string[]> = {
    "Reading Comprehension": ["main-idea", "authors-purpose", "supporting-details", "literary-texts", "tone-figurative-language", "evidence-evaluation"],
    "Language & Grammar": ["punctuation", "sentence-structure", "subject-verb-agreement", "verb-tenses", "pronoun-agreement"],
    "Extended Response / Essay": ["essay-structure", "argument-analysis", "essay-writing-tips"],
  };

  // Science lessons mapping
  const sciCategoryLessons: Record<string, string[]> = {
    "Life Science": ["cell-structure-organelles", "cell-processes", "dna-rna", "human-body-systems", "genetics-punnett-squares", "evolution-natural-selection", "ecosystems-food-webs", "photosynthesis"],
    "Physical Science": ["atoms-periodic-table", "chemical-reactions", "conservation-mass", "newtons-laws", "motion-speed-acceleration", "energy-types", "waves-properties"],
    "Earth & Space Science": ["plate-tectonics", "earth-structure", "weather-climate", "water-cycle", "solar-system", "astronomy-basics"],
  };

  // SS lessons mapping
  const ssCategoryLessons: Record<string, string[]> = {
    "Civics & Government": ["constitution-bill-of-rights", "branches-government", "checks-balances", "political-process-elections"],
    "U.S. History": ["colonial-america", "american-revolution", "civil-war-reconstruction", "world-war-1-2", "cold-war"],
    "Economics": ["supply-demand", "economic-systems", "inflation-taxes-budgets"],
    "Geography & World History": ["map-reading", "population-demographics", "world-history-events"],
  };

  const allMappings: Record<string, { subjectCode: string; mapping: Record<string, string[]> }> = {
    math: { subjectCode: "math", mapping: mathCategoryLessons },
    rla: { subjectCode: "rla", mapping: rlaCategoryLessons },
    science: { subjectCode: "science", mapping: sciCategoryLessons },
    ss: { subjectCode: "ss", mapping: ssCategoryLessons },
  };

  for (const [, { subjectCode, mapping }] of Object.entries(allMappings)) {
    for (const [catName, slugs] of Object.entries(mapping)) {
      const catKey = `${subjectCode}|${catName}`;
      const catId = categoryMap[catKey];
      if (!catId) continue;

      for (const slug of slugs) {
        const lesson = await prisma.lesson.findUnique({ where: { slug } });
        if (lesson && !lesson.topicCategoryId) {
          await prisma.lesson.update({
            where: { id: lesson.id },
            data: { topicCategoryId: catId, lessonType: "core_topic" },
          });
          linkedCount++;
        }
      }
    }
  }
  console.log(`  Linked ${linkedCount} existing lessons to topic categories`);

  // --- Summary ---
  const totalCategories = await prisma.topicCategory.count();
  const totalSuppLessons = await prisma.lesson.count({ where: { lessonType: "supplementary_topic" } });
  const totalCoreLessons = await prisma.lesson.count({ where: { lessonType: "core_topic" } });
  const totalWithCategory = await prisma.lesson.count({ where: { topicCategoryId: { not: null } } });

  console.log(`\n=== SEED COMPLETE ===`);
  console.log(`Topic Categories created:  ${totalCategories}`);
  console.log(`Core lessons linked:      ${totalCoreLessons}`);
  console.log(`Supplementary lessons:    ${totalSuppLessons}`);
  console.log(`Lessons with category:    ${totalWithCategory}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
