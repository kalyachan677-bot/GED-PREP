import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function makeBody(heading: string, sections: { sub: string; body: string }[]): string {
  const blocks: any[] = [];
  blocks.push({ id: `h_${Math.random().toString(36).slice(2, 8)}`, block_type: "heading", content: heading, level: 2 });
  for (const s of sections) {
    blocks.push({ id: `sh_${Math.random().toString(36).slice(2, 8)}`, block_type: "heading", content: s.sub, level: 3 });
    blocks.push({ id: `p_${Math.random().toString(36).slice(2, 8)}`, block_type: "paragraph", content: s.body });
  }
  return JSON.stringify(blocks);
}

interface LessonSeed {
  subjectCode: string;
  categoryName: string;
  title: string;
  slug: string;
  body: string;
  duration: number;
}

const MISSING_LESSONS: LessonSeed[] = [
  // ===== RLA: Extended Response / Essay =====
  {
    subjectCode: "rla",
    categoryName: "Extended Response / Essay",
    title: "Understanding the Argumentative Essay Task",
    slug: "rla-essay-task-overview",
    body: makeBody("Understanding the Argumentative Essay Task", [
      { sub: "What the GED Essay Asks You to Do", body: "On the GED RLA test, you will read two passages that present opposing arguments on the same topic. Your job is to analyze both arguments and determine which one is better supported by evidence and reasoning. You do NOT need to argue your own opinion — you must evaluate the strength of the arguments presented." },
      { sub: "Scoring Criteria", body: "The essay is scored on a 0-6 scale by two readers. A score of 3 or higher is needed to pass. Readers evaluate: (1) <strong>Claim</strong> — Do you clearly state which argument is better supported? (2) <strong>Evidence</strong> — Do you cite specific evidence from the passages? (3) <strong>Organization</strong> — Is your essay well-structured with introduction, body, and conclusion? (4) <strong>Language</strong> — Is your writing clear and grammatically correct?" },
      { sub: "Time Management", body: "You have 45 minutes for the extended response. Spend 5-7 minutes reading both passages, 5 minutes planning your essay, 25-28 minutes writing, and 5 minutes proofreading. The recommended length is 250-500 words." },
    ]),
    duration: 12,
  },
  {
    subjectCode: "rla",
    categoryName: "Extended Response / Essay",
    title: "Identifying Claims and Evidence",
    slug: "rla-claims-evidence",
    body: makeBody("Identifying Claims and Evidence", [
      { sub: "What is a Claim?", body: "A <strong>claim</strong> is the main argument or position an author takes. In a GED passage, look for thesis statements like 'This policy should be adopted because...' or 'The evidence clearly shows that...' The claim is what the author wants you to believe." },
      { sub: "Evaluating Evidence Quality", body: "Strong evidence includes: specific statistics or data, expert quotes, research study results, concrete examples, and logical reasoning. Weak evidence includes: personal anecdotes, emotional appeals without facts, vague generalizations, and unsupported opinions." },
      { sub: "Finding the Better-Supported Argument", body: "Compare the two passages side by side. Ask: Which passage provides more specific evidence? Which author addresses counterarguments? Which passage uses more reliable sources? The passage with stronger, more specific, and more relevant evidence is the better-supported argument." },
    ]),
    duration: 12,
  },
  {
    subjectCode: "rla",
    categoryName: "Extended Response / Essay",
    title: "Writing a High-Scoring Essay",
    slug: "rla-writing-essay",
    body: makeBody("Writing a High-Scoring Essay", [
      { sub: "Paragraph 1: Introduction", body: "Start with a brief reference to the topic. Then clearly state your thesis: which argument is better supported and why. Use specific reasons. Example: 'While both authors present valid perspectives on mandatory voting, Anderson's argument is better supported because she provides statistical evidence from multiple countries and addresses the opposition's concerns directly.'" },
      { sub: "Paragraph 2: Evidence for Your Position", body: "Dedicate one paragraph to the evidence from the passage you chose. Cite 2-3 specific pieces of evidence. Use phrases like 'According to the passage...', 'The author states that...', 'For example, the passage notes that...'" },
      { sub: "Paragraph 3: Why the Other Argument is Weaker", body: "Acknowledge the opposing passage but explain why its evidence is less convincing. Use phrases like 'While the other passage argues that...', 'However, this claim is less convincing because...', 'Unlike the stronger passage, this one fails to...'" },
      { sub: "Paragraph 4: Conclusion", body: "Restate your thesis in different words. Briefly summarize your two main reasons. End with a strong closing statement. Example: 'Based on the evidence provided, Anderson's argument is clearly better supported by concrete data and thorough analysis.'" },
    ]),
    duration: 15,
  },

  // ===== SCIENCE: Earth & Space Science =====
  {
    subjectCode: "science",
    categoryName: "Earth & Space Science",
    title: "Plate Tectonics and Earth's Structure",
    slug: "sci-plate-tectonics",
    body: makeBody("Plate Tectonics and Earth's Structure", [
      { sub: "Earth's Layers", body: "The Earth has three main layers: the <strong>crust</strong> (thin outer shell, 5-70 km thick), the <strong>mantle</strong> (thick middle layer, about 2,900 km, made of semi-solid rock), and the <strong>core</strong> (center, made of iron and nickel — outer core is liquid, inner core is solid). The crust and uppermost mantle form the <strong>lithosphere</strong>." },
      { sub: "Plate Tectonics Theory", body: "Earth's lithosphere is broken into large pieces called <strong>tectonic plates</strong> that float on the semi-fluid asthenosphere below. These plates move slowly (2-15 cm/year) due to convection currents in the mantle. There are three types of plate boundaries: <strong>convergent</strong> (plates collide), <strong>divergent</strong> (plates move apart), and <strong>transform</strong> (plates slide past each other)." },
      { sub: "Natural Disasters and Plate Boundaries", body: "Most earthquakes and volcanoes occur at plate boundaries. <strong>Convergent boundaries</strong> can form mountains and cause deep earthquakes. <strong>Divergent boundaries</strong> create mid-ocean ridges and rift valleys. <strong>Transform boundaries</strong> cause shallow earthquakes (e.g., San Andreas Fault)." },
    ]),
    duration: 14,
  },
  {
    subjectCode: "science",
    categoryName: "Earth & Space Science",
    title: "Weather, Climate, and the Water Cycle",
    slug: "sci-weather-climate",
    body: makeBody("Weather, Climate, and the Water Cycle", [
      { sub: "The Water Cycle", body: "The water cycle describes how water moves through Earth's systems: <strong>evaporation</strong> (water becomes vapor from heat), <strong>condensation</strong> (vapor cools to form clouds), <strong>precipitation</strong> (rain, snow, etc.), and <strong>collection/runoff</strong> (water flows back to oceans and groundwater). The sun drives the entire cycle." },
      { sub: "Weather vs. Climate", body: "<strong>Weather</strong> is short-term atmospheric conditions (today's temperature, rain). <strong>Climate</strong> is long-term average weather patterns over decades. Key factors affecting climate: latitude (distance from equator), altitude (elevation), ocean currents, and greenhouse gases in the atmosphere." },
      { sub: "Climate Change", body: "Increased CO2 and other greenhouse gases trap heat in the atmosphere (greenhouse effect). This leads to global warming: rising temperatures, melting ice caps, rising sea levels, and more extreme weather events. Human activities like burning fossil fuels are the primary cause of increased CO2." },
    ]),
    duration: 14,
  },
  {
    subjectCode: "science",
    categoryName: "Earth & Space Science",
    title: "The Solar System and Basic Astronomy",
    slug: "sci-solar-system-astronomy",
    body: makeBody("The Solar System and Basic Astronomy", [
      { sub: "Our Solar System", body: "Our solar system consists of the <strong>Sun</strong> (a medium-sized star) and everything that orbits it: 8 planets, dwarf planets, moons, asteroids, and comets. The inner rocky planets are Mercury, Venus, Earth, and Mars. The outer gas/ice giants are Jupiter, Saturn, Uranus, and Neptune." },
      { sub: "Key Facts to Remember", body: "<strong>Jupiter</strong> is the largest planet. <strong>Saturn</strong> has prominent rings. <strong>Earth</strong> is the only planet known to support life. <strong>Mars</strong> is called the 'Red Planet' due to iron oxide. <strong>Venus</strong> is the hottest planet due to its thick CO2 atmosphere. The asteroid belt is between Mars and Jupiter." },
      { sub: "Moon Phases and Tides", body: "The Moon orbits Earth every ~27.3 days. Moon phases are caused by the relative positions of the Sun, Earth, and Moon: New Moon → Waxing Crescent → First Quarter → Waxing Gibbous → Full Moon → Waning Gibbous → Third Quarter → Waning Crescent. Ocean tides are caused by the Moon's gravitational pull." },
    ]),
    duration: 14,
  },

  // ===== SS: Economics =====
  {
    subjectCode: "ss",
    categoryName: "Economics",
    title: "Supply, Demand, and Price Mechanisms",
    slug: "ss-supply-demand",
    body: makeBody("Supply, Demand, and Price Mechanisms", [
      { sub: "The Law of Demand", body: "<strong>Demand</strong> is the willingness and ability of consumers to buy goods at various prices. The Law of Demand states that as price increases, quantity demanded decreases (inverse relationship). A <strong>demand curve</strong> slopes downward. Factors that shift demand: income, preferences, price of related goods, number of buyers." },
      { sub: "The Law of Supply", body: "<strong>Supply</strong> is the willingness and ability of producers to sell goods at various prices. The Law of Supply states that as price increases, quantity supplied increases (direct relationship). A <strong>supply curve</strong> slopes upward. Factors that shift supply: production costs, technology, number of sellers, government policies." },
      { sub: "Market Equilibrium", body: "<strong>Equilibrium price</strong> is where supply meets demand — the price at which quantity supplied equals quantity demanded. If price is above equilibrium: surplus (excess supply) → price falls. If price is below equilibrium: shortage (excess demand) → price rises." },
    ]),
    duration: 12,
  },
  {
    subjectCode: "ss",
    categoryName: "Economics",
    title: "Economic Systems and Financial Concepts",
    slug: "ss-economic-systems",
    body: makeBody("Economic Systems and Financial Concepts", [
      { sub: "Types of Economic Systems", body: "<strong>Traditional economy</strong>: customs and traditions decide what/where/how to produce. <strong>Command economy</strong>: government makes all economic decisions (e.g., North Korea). <strong>Market economy (Capitalism)</strong>: individuals and businesses make decisions based on supply and demand (e.g., USA). <strong>Mixed economy</strong>: combines market and government intervention (most modern economies)." },
      { sub: "Capitalism vs. Socialism", body: "<strong>Capitalism</strong> emphasizes private ownership, free markets, competition, and profit motive. <strong>Socialism</strong> emphasizes government ownership of key industries, wealth redistribution, and social welfare programs. The US is primarily capitalist with some social programs (Social Security, Medicare)." },
      { sub: "Inflation, Taxes, and Budgets", body: "<strong>Inflation</strong> is a general increase in prices, decreasing purchasing power. Measured by Consumer Price Index (CPI). <strong>Taxes</strong> fund government services: income tax (progressive — higher earners pay higher %), sales tax (regressive), property tax. A <strong>budget</strong> plans income vs. expenses — governments create federal budgets; a deficit occurs when spending exceeds revenue." },
    ]),
    duration: 14,
  },

  // ===== SS: Geography & World History =====
  {
    subjectCode: "ss",
    categoryName: "Geography & World History",
    title: "Reading Maps and Understanding Population Data",
    slug: "ss-maps-population",
    body: makeBody("Reading Maps and Understanding Population Data", [
      { sub: "Map Reading Skills", body: "On the GED, you must read various types of maps: <strong>political maps</strong> (show borders, cities), <strong>physical maps</strong> (show mountains, rivers), <strong>thematic maps</strong> (show data like population density or climate zones). Always read the title, legend/key, compass rose, and scale. The scale tells you the relationship between map distance and real distance." },
      { sub: "Population Graphs and Demographics", body: "<strong>Population pyramids</strong> show age/gender distribution. A wide base = high birth rate (developing country). A more rectangular shape = low birth rate (developed country). Key terms: <strong>birth rate</strong>, <strong>death rate</strong>, <strong>population density</strong> (people per unit area), <strong>urbanization</strong> (movement to cities), <strong>migration</strong> (movement of people)." },
      { sub: "Settlement Patterns", body: "Human settlements are influenced by: water access (rivers, coasts), climate (moderate climates attract more people), natural resources, trade routes, and political factors. <strong>Urbanization</strong> is the increasing proportion of people living in cities. On the GED, you may be asked to interpret a map showing population density or migration patterns." },
    ]),
    duration: 12,
  },
  {
    subjectCode: "ss",
    categoryName: "Geography & World History",
    title: "Key Events in World History",
    slug: "ss-world-history-events",
    body: makeBody("Key Events in World History", [
      { sub: "Major Global Events to Know", body: "<strong>Ancient Civilizations</strong>: Mesopotamia, Egypt, Greece, Rome — foundations of government, law, and culture. <strong>Renaissance</strong> (14th-17th century): rebirth of art and science in Europe. <strong>Age of Exploration</strong>: European colonization of Americas, Africa, Asia. <strong>Industrial Revolution</strong> (18th-19th century): transition to factory manufacturing." },
      { sub: "20th Century Global Events", body: "<strong>World War I</strong> (1914-1918): caused by alliances, imperialism, nationalism. <strong>World War II</strong> (1939-1945): Holocaust, atomic bombs, creation of the United Nations. <strong>Cold War</strong> (1947-1991): USA vs USSR rivalry, nuclear arms race, space race, proxy wars (Korea, Vietnam). <strong>Globalization</strong> (late 20th century+): interconnected economies, internet, international trade." },
      { sub: "GED Strategy", body: "On the GED Social Studies test, world history questions often include a short passage, map, or timeline. Focus on cause-and-effect relationships and understanding WHY events happened, not just memorizing dates. Connect historical events to their lasting impacts on modern society." },
    ]),
    duration: 14,
  },
];

async function main() {
  console.log("=== Seeding Missing Lessons for Empty Categories ===\n");

  // Get category ID map
  const categories = await prisma.topicCategory.findMany({
    include: { subject: { select: { code: true } } },
  });
  const catMap: Record<string, string> = {};
  for (const c of categories) {
    catMap[`${c.subject.code}|${c.name}`] = c.id;
  }

  // Find modules per subject for topic placement
  const modules = await prisma.module.findMany({
    include: { subject: { select: { code: true } } },
    orderBy: { sortOrder: "asc" },
  });
  const moduleMap: Record<string, string> = {};
  for (const m of modules) {
    if (!moduleMap[m.subject.code]) moduleMap[m.subject.code] = m.id;
  }

  let created = 0;
  for (const ls of MISSING_LESSONS) {
    const catKey = `${ls.subjectCode}|${ls.categoryName}`;
    const catId = catMap[catKey];
    const moduleId = moduleMap[ls.subjectCode];

    if (!catId || !moduleId) {
      console.log(`  SKIP: ${ls.title} (no category or module)`);
      continue;
    }

    const existing = await prisma.lesson.findUnique({ where: { slug: ls.slug } });
    if (existing) {
      if (!existing.topicCategoryId) {
        await prisma.lesson.update({ where: { id: existing.id }, data: { topicCategoryId: catId } });
        console.log(`  LINKED: ${ls.title}`);
      } else {
        console.log(`  EXISTS: ${ls.title}`);
      }
      continue;
    }

    const supTopicTitle = `Supplementary: ${ls.categoryName}`;
    let supTopic = await prisma.topic.findFirst({ where: { moduleId, title: supTopicTitle } });
    if (!supTopic) {
      supTopic = await prisma.topic.create({
        data: {
          moduleId,
          title: supTopicTitle,
          description: `Core lessons for: ${ls.categoryName}`,
          sortOrder: 998,
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
        bodyContent: ls.body,
        durationMinutes: ls.duration,
        sortOrder: created,
        lessonType: "core_topic",
        topicCategoryId: catId,
        status: "published",
      },
    });
    created++;
    console.log(`  CREATED: [${ls.subjectCode}] ${ls.title}`);
  }

  // Summary
  const emptyCats = await prisma.topicCategory.findMany({
    where: { categoryType: "core", lessons: { none: {} } },
    include: { subject: { select: { code: true } } },
  });
  console.log(`\n=== COMPLETE: ${created} lessons created ===`);
  if (emptyCats.length > 0) {
    console.log("Still empty:", emptyCats.map(c => `${c.subject.code}|${c.name}`));
  } else {
    console.log("All core categories now have lessons!");
  }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
