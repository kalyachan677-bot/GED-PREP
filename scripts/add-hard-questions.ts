import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

type Q = [string, [string, boolean][], "easy" | "medium" | "hard", string, string[]];

const HARD_QUESTIONS: Record<string, Q[]> = {
  // SCIENCE HARD
  "Cell Structure and Organelles": [
    ["If a cell's mitochondria were destroyed, which process would be most affected?", [["ATP production (cellular respiration)", true], ["Protein synthesis", false], ["DNA replication", false], ["Cell division", false]], "hard", "Without mitochondria, the cell cannot perform aerobic respiration to produce ATP energy.", ["biology", "cell", "organelle", "mitochondria"]],
    ["Which statement correctly describes the endosymbiotic theory?", [["Mitochondria and chloroplasts were once free-living prokaryotes", true], ["All organelles evolved from bacteria", false], ["Eukaryotic cells became prokaryotic", false], ["The nucleus was the first organelle to evolve", false]], "hard", "The endosymbiotic theory explains that mitochondria and chloroplasts originated as independent prokaryotes.", ["biology", "cell", "endosymbiotic-theory"]],
  ],
  "Chemical Reactions": [
    ["In the reaction 2Na + 2H2O -> 2NaOH + H2, what type of reaction is this?", [["Single replacement", true], ["Double replacement", false], ["Synthesis", false], ["Decomposition", false]], "hard", "Na replaces H in H2O - one element replaces another in a compound = single replacement.", ["chemistry", "reactions", "types"]],
    ["A 50g sample of CaCO3 decomposes producing 28g of CaO and 22g of CO2. This demonstrates:", [["Law of Conservation of Mass", true], ["Law of Definite Proportions", false], ["Charles's Law", false], ["Boyle's Law", false]], "hard", "50g = 28g + 22g. Mass is conserved in the chemical reaction.", ["chemistry", "reactions", "conservation-of-mass"]],
  ],
  "DNA and Genes": [
    ["If a DNA strand has the sequence ATTCGGA, what is the complementary strand?", [["TAAGCCT", true], ["ATTCGGA", false], ["UAAGCCU", false], ["GCCTAAT", false]], "hard", "A pairs with T, T pairs with A, C pairs with G, G pairs with C. Complement of ATTCGGA = TAAGCCT.", ["biology", "dna", "base-pairing"]],
    ["A mutation changes a codon from GAA to GUA. What type of mutation is this?", [["Missense mutation", true], ["Silent mutation", false], ["Nonsense mutation", false], ["Frameshift mutation", false]], "hard", "GAA (Glu) to GUA (Val) changes the amino acid = missense mutation.", ["biology", "dna", "mutation"]],
  ],
  "Newton's Laws of Motion": [
    ["A 2000 kg car at rest is pushed with 400 N of force. If friction is 100 N, what is the acceleration?", [["0.15 m/s squared", true], ["0.2 m/s squared", false], ["0.05 m/s squared", false], ["0.25 m/s squared", false]], "hard", "Net force = 400 - 100 = 300 N. a = F/m = 300/2000 = 0.15 m/s squared.", ["physics", "newton-laws", "friction"]],
  ],
  "Speed, Velocity, and Acceleration": [
    ["A ball is thrown upward at 20 m/s. How high does it go before falling back? (g = 10 m/s squared)", [["20 meters", true], ["10 meters", false], ["40 meters", false], ["5 meters", false]], "hard", "At max height: v = 0. v squared = u squared - 2gh. 0 = 400 - 20h. h = 20 m.", ["physics", "kinematics", "projectile"]],
    ["A car accelerates from rest at 2 m/s squared for 8 seconds. How far does it travel?", [["64 meters", true], ["16 meters", false], ["32 meters", false], ["128 meters", false]], "hard", "d = ut + 1/2 at squared = 0 + 0.5(2)(64) = 64 meters.", ["physics", "kinematics", "equations-of-motion"]],
  ],
  "Cell Division: Mitosis and Meiosis": [
    ["A cell with 24 chromosomes undergoes meiosis. How many chromosomes does each resulting cell have?", [["12", true], ["24", false], ["6", false], ["48", false]], "hard", "Meiosis halves the chromosome number: 24/2 = 12 chromosomes per gamete.", ["biology", "meiosis", "chromosomes"]],
    ["If a cell has 20 chromosomes during G2 phase, how many chromosomes will each daughter cell have after mitosis?", [["20", true], ["10", false], ["40", false], ["30", false]], "hard", "Mitosis preserves chromosome number. G2 = 20 (already replicated). Daughter cells also have 20.", ["biology", "mitosis", "cell-cycle"]],
  ],
  "Atoms and the Periodic Table": [
    ["An element has atomic number 17 and mass number 35. How many neutrons does it have?", [["18", true], ["17", false], ["35", false], ["52", false]], "hard", "Neutrons = Mass number - Atomic number = 35 - 17 = 18. (This is Chlorine-35.)", ["chemistry", "atoms", "isotopes"]],
  ],
  "Punnett Squares": [
    ["In sex-linked inheritance (X-linked recessive), a carrier mother (XNXn) and normal father (XNY) have a son. What is the chance the son has the trait?", [["50%", true], ["25%", false], ["100%", false], ["0%", false]], "hard", "Son gets Y from father, X from mother. 50% chance of getting Xn (affected) vs XN (carrier).", ["biology", "genetics", "sex-linked"]],
  ],

  // RLA HARD
  "Making Inferences": [
    ["'The company's quarterly profits dropped 40%, and the CEO announced mandatory 'vacation days' next month.' Best inference:", [["The company is likely preparing for layoffs disguised as vacation", true], ["Employees are getting a bonus", false], ["The company is doing well", false], ["The CEO is generous", false]], "hard", "Profits dropped 40% + mandatory 'vacation' suggests cost-cutting, likely layoffs.", ["reading", "inference", "critical-thinking"]],
  ],
  "Author's Purpose": [
    ["'The new highway will cut travel time by 20 minutes but will destroy the only wetland in the county, home to 15 endangered species.' The author's purpose is most likely to:", [["Persuade readers to oppose the highway project", true], ["Inform about highway construction schedules", false], ["Entertain with a story about wildlife", false], ["Describe wetland geography", false]], "hard", "Presenting benefits vs. devastating environmental cost = persuasive against the project.", ["reading", "authors-purpose", "persuasion"]],
  ],
  "Subject-Verb Agreement": [
    ["'None of the evidence ___ to support the defendant's claim.' Which verb fits both formal and informal usage?", [["points (formal) / point (informal) are both acceptable", true], ["Only 'points' is correct", false], ["Only 'point' is correct", false], ["Neither is correct; use 'pointing'", false]], "hard", "'None' can be singular or plural. Formal grammar prefers singular ('points'). Informal allows plural ('point').", ["grammar", "subject-verb-agreement", "none"]],
  ],
  "Comma Rules": [
    ["Which sentence correctly uses commas with a complex sentence?", [["Because the storm was approaching, we boarded up the windows.", true], ["We boarded up the windows, because the storm was approaching.", false], ["Because the storm was approaching we, boarded up the windows.", false], ["Because, the storm was approaching, we boarded up the windows.", false]], "hard", "When a dependent clause comes first, use a comma after it before the independent clause.", ["grammar", "punctuation", "commas", "complex-sentence"]],
  ],
  "Point of View": [
    ["A story is told using 'he' and follows one character's thoughts, but the narrator is NOT that character. This is:", [["Third person limited", true], ["First person", false], ["Second person", false], ["Third person omniscient", false]], "hard", "Third person limited: narrator uses he/she, follows one character's perspective but is an outside observer.", ["reading", "point-of-view"]],
  ],
  "Complete Sentences vs. Fragments": [
    ["Which of the following is NOT a fragment?", [["Having studied all night, she felt prepared for the exam.", true], ["Having studied all night.", false], ["Because she had studied all night.", false], ["Studying all night, despite being exhausted.", false]], "hard", "The first option has a complete independent clause ('she felt prepared') after the introductory phrase.", ["grammar", "sentences", "fragments"]],
  ],
  "Apostrophes and Quotation Marks": [
    ["Which sentence is correct?", [["The Joneses' house is the one on the corner.", true], ["The Jones's house is the one on the corner.", false], ["The Jone's house is the one on the corner.", false], ["The Joneses house is the one on the corner.", false]], "hard", "Joneses = plural of Jones. Joneses' = possessive of plural = correct form for a family named Jones.", ["grammar", "apostrophe", "plural-possessive"]],
  ],
  "Finding the Main Idea": [
    ["Read: 'While social media connects people globally, studies show it increases feelings of loneliness and depression, especially among teenagers. Algorithms designed to maximize engagement often promote extreme content.' What is the main idea?", [["Social media has significant negative mental health effects despite its connectivity benefits", true], ["Algorithms are bad technology", false], ["Teenagers use social media too much", false], ["Global connection is impossible without social media", false]], "hard", "The passage contrasts connectivity benefits with mental health harms - the main idea encompasses both.", ["reading", "main-idea", "critical-thinking"]],
  ],

  // SOCIAL STUDIES HARD
  "The Declaration of Independence": [
    ["Which Enlightenment philosopher most influenced the Declaration's idea of 'unalienable rights'?", [["John Locke", true], ["Thomas Hobbes", false], ["Jean-Jacques Rousseau", false], ["Montesquieu", false]], "hard", "Locke's 'natural rights' (life, liberty, property) directly inspired Jefferson's 'life, liberty, and the pursuit of happiness'.", ["history", "declaration", "enlightenment"]],
    ["The Declaration argues that governments get their power from:", [["The consent of the governed", true], ["God", false], ["The military", false], ["Wealthy landowners", false]], "hard", "'Governments are instituted among Men, deriving their just powers from the consent of the governed.'", ["history", "declaration", "social-contract"]],
  ],
  "The U.S. Constitution": [
    ["Which amendment abolished slavery?", [["13th Amendment", true], ["12th Amendment", false], ["14th Amendment", false], ["15th Amendment", false]], "hard", "13th (1865) abolished slavery. 14th = equal protection. 15th = voting regardless of race.", ["civics", "constitution", "amendments", "reconstruction"]],
    ["The 'supremacy clause' (Article VI) establishes that:", [["Federal law overrides conflicting state laws", true], ["The President is supreme over Congress", false], ["State laws override federal laws", false], ["The Supreme Court can create laws", false]], "hard", "Article VI's Supremacy Clause: the Constitution and federal laws are the 'supreme Law of the Land'.", ["civics", "constitution", "supremacy-clause"]],
  ],
  "The Civil Rights Movement Overview": [
    ["The doctrine of 'separate but equal' was established by which case?", [["Plessy v. Ferguson (1896)", true], ["Brown v. Board of Education (1954)", false], ["Dred Scott v. Sandford (1857)", false], ["Regents of UC v. Bakke (1978)", false]], "hard", "Plessy v. Ferguson (1896) established 'separate but equal', which Brown v. Board later overturned.", ["history", "civil-rights", "supreme-court"]],
    ["The 24th Amendment (1964) eliminated:", [["Poll taxes in federal elections", true], ["Literacy tests", false], ["Grandfather clauses", false], ["White primaries", false]], "hard", "The 24th Amendment specifically banned poll taxes, which were used to disenfranchise poor (especially Black) voters.", ["history", "civil-rights", "voting-rights"]],
  ],
  "Key Figures: MLK and Rosa Parks": [
    ["MLK's 'Letter from Birmingham Jail' defended which strategy?", [["Nonviolent direct action against unjust laws", true], ["Armed self-defense", false], ["Gradual legislative change only", false], ["Economic boycotts as the only tool", false]], "hard", "The letter defended the strategy of nonviolent direct action, explaining why 'wait' meant 'never'.", ["history", "civil-rights", "MLK"]],
  ],
  "Legislative Branch: Congress": [
    ["A bill passes the House but fails in the Senate. What happens?", [["The bill dies and must start over", true], ["It goes to the President anyway", false], ["The House can override the Senate", false], ["It goes to conference committee automatically", false]], "hard", "Both chambers must pass identical versions. If one rejects it, the bill dies unless a conference committee reconciles differences.", ["civics", "congress", "legislative-process"]],
  ],
  "Executive and Judicial Branches": [
    ["Which president expanded the executive power through the 'imperial presidency'?", [["Richard Nixon (Watergate era)", true], ["George Washington", false], ["Abraham Lincoln", false], ["Jimmy Carter", false]], "hard", "Nixon's expanded use of executive privilege, impoundment, and domestic spying exemplified 'imperial presidency'.", ["civics", "president", "executive-power"]],
    ["Which case established that the President is not above the law?", [["United States v. Nixon (1974)", true], ["Marbury v. Madison", false], ["Bush v. Gore", false], ["Clinton v. Jones", false]], "hard", "US v. Nixon forced Nixon to turn over the Watergate tapes, establishing that executive privilege has limits.", ["civics", "judicial-branch", "supreme-court"]],
  ],
  "How Elections Work": [
    ["What happens if no candidate gets 270 electoral votes?", [["The House of Representatives chooses the President", true], ["The Senate chooses the President", false], ["There is a runoff election", false], ["The incumbent stays in office", false]], "hard", "If no majority in Electoral College, the House elects the President (each state delegation gets 1 vote).", ["civics", "elections", "electoral-college", "contingent-election"]],
  ],
  "Political Parties and the Two-Party System": [
    ["The Federalist Party, one of the first two U.S. parties, was led by:", [["Alexander Hamilton", true], ["Thomas Jefferson", false], ["James Madison", false], ["George Washington", false]], "hard", "Federalists (Hamilton) favored strong central government. Democratic-Republicans (Jefferson) favored states' rights.", ["civics", "political-parties", "history"]],
    ["What is 'gerrymandering'?", [["Redrawing district boundaries to favor one party", true], ["Voting more than once", false], ["Campaigning in multiple states", false], ["Changing party affiliation", false]], "hard", "Gerrymandering = manipulating electoral district boundaries for political advantage. Named after Governor Gerry (1812).", ["civics", "elections", "gerrymandering"]],
  ],
};

async function main() {
  const lessons = await prisma.lesson.findMany({
    include: { topic: { include: { module: { include: { subject: true } } } } }
  });

  let totalAdded = 0;

  for (const lesson of lessons) {
    const questionsToAdd = HARD_QUESTIONS[lesson.title];
    if (!questionsToAdd || questionsToAdd.length === 0) continue;

    const subjectCode = lesson.topic.module.subject.code;
    for (const [questionText, answers, difficulty, explanation, tags] of questionsToAdd) {
      await prisma.question.create({
        data: {
          id: uuid(),
          questionType: "multiple_choice",
          difficulty,
          questionText,
          explanation,
          hintText: "",
          tags: JSON.stringify(tags),
          isActive: true,
          points: difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1,
          subjectId: lesson.topic.module.subject.id,
          lessonId: lesson.id,
          answers: { create: answers.map((a, i) => ({ id: uuid(), content: a[0], isCorrect: a[1], sortOrder: i })) }
        }
      });
      totalAdded++;
    }
    console.log(`OK: ${subjectCode} > ${lesson.title}: +${questionsToAdd.length} hard questions`);
  }

  console.log(`\n=== Added ${totalAdded} hard questions ===`);

  const subjects = await prisma.subject.findMany({ orderBy: { sortOrder: 'asc' }, include: { questions: { where: { isActive: true } } } });
  for (const s of subjects) {
    const easy = s.questions.filter(q => q.difficulty === 'easy').length;
    const med = s.questions.filter(q => q.difficulty === 'medium').length;
    const hard = s.questions.filter(q => q.difficulty === 'hard').length;
    console.log(`  ${s.code}: ${s.questions.length} total (${easy} easy, ${med} medium, ${hard} hard)`);
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
