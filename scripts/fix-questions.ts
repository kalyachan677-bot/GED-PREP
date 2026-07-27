import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Question texts derived from explanations, hints, and answer patterns
const QUESTION_TEXTS: string[] = [
  // 1-2: What is a Linear Equation?
  "Solve the equation 3x + 7 = 22. What is the value of x?",
  "Solve the equation 2(x + 4) = 18. What is the value of x?",
  // 3-4: Solving Inequalities
  "Solve the inequality -2x > -10. Which answer is correct?",
  "Solve the inequality 3x - 3 ≤ 9. Which answer is correct?",
  // 5-6: Substitution Method
  "Solve the system x + y = 10 and y = 2x + 1. Which point (x, y) is the solution?",
  "If x = 3 in the system 3x + 2y = 13, what is the value of y?",
  // 7-8: Elimination Method
  "Solve the system x + y = 4 and x - y = 2. Which point is the solution?",
  "If you add two linear equations and get 0 = 5, what does this mean about the system?",
  // 9-10: Rectangle and Triangle Basics
  "What is the area of a rectangle with length 6 and width 5?",
  "What is the area of a triangle with base 8 and height 3?",
  // 11-12: Circles and Composite Shapes
  "What is the circumference of a circle with radius 5? (Express your answer in terms of π)",
  "What is the area of a circle with radius 4? (Express your answer in terms of π)",
  // 13-14: Understanding the Theorem (Pythagorean)
  "A right triangle has legs of lengths 5 and 12. What is the length of the hypotenuse?",
  "A right triangle has one leg of length 3 and a hypotenuse of length √90. What is the other leg?",
  // 15-16: Applications and Word Problems
  "A 15-foot ladder leans against a wall. The base is 8 feet from the wall. How high does the ladder reach?",
  "A square has a diagonal of length 20. What is the length of each side?",
  // 17-18: Cell Structure and Organelles
  "Which organelle is known as the \"powerhouse of the cell\" because it produces energy (ATP)?",
  "Which of the following is a key characteristic of prokaryotic cells?",
  // 19-20: Cell Division: Mitosis and Meiosis
  "What is the result of mitosis in a human cell?",
  "What is the primary purpose of meiosis?",
  // 21-22: DNA and Genes
  "What is the shape of a DNA molecule?",
  "What are alleles?",
  // 23-24: Punnett Squares
  "In a monohybrid cross between two heterozygous parents (Aa × Aa), what is the probability of offspring being homozygous recessive (aa)?",
  "What is the difference between genotype and phenotype?",
  // 25-26: Atoms and the Periodic Table
  "Which subatomic particle determines the identity of an element?",
  "What does the atomic number of an element represent?",
  // 27-28: Chemical Reactions
  "Which statement best describes the Law of Conservation of Mass?",
  "The reaction 2Na + Cl₂ → 2NaCl is an example of which type of chemical reaction?",
  // 29-30: Newton's Laws of Motion
  "Which formula represents Newton's Second Law of Motion?",
  "A ball on a table stays still until someone pushes it. Which of Newton's laws does this demonstrate?",
  // 31-32: Speed, Velocity, and Acceleration
  "What is the key difference between speed and velocity?",
  "What is the SI unit for acceleration?",
  // 33-34: Finding the Main Idea
  "Where is the main idea of a paragraph most commonly found?",
  "What is the primary purpose of supporting details in a passage?",
  // 35-36: Making Inferences
  "What is an inference in reading comprehension?",
  "What does \"tone\" refer to in a passage?",
  // 37-38: Author's Purpose
  "An editorial arguing that the city should build more parks is primarily written to do what?",
  "A passage that describes events in chronological order and explains why they happened uses which organizational structure?",
  // 39-40: Point of View
  "A passage that uses \"I\" and \"we\" is written in which point of view?",
  "What is a key characteristic of a third-person omniscient narrator?",
  // 41-42: Complete Sentences vs. Fragments
  "What makes a sentence a fragment?",
  "Which of the following is an example of a run-on sentence (comma splice)?",
  // 43-44: Subject-Verb Agreement
  "The team ___ to the stadium early. (Choose the correct verb form)",
  "Each student should bring ___ own calculator. (Choose the correct pronoun)",
  // 45-46: Comma Rules
  "Which sentence correctly uses commas in a list of three or more items?",
  "What is the best way to fix a comma splice between two independent clauses?",
  // 47-48: Apostrophes and Quotation Marks
  "Which of the following shows correct use of an apostrophe for possession?",
  "What is the difference between \"its\" and \"it's\"?",
  // 49-50: The Declaration of Independence
  "When was the Declaration of Independence adopted?",
  "Which unalienable rights are mentioned in the Declaration of Independence?",
  // 51-52: The U.S. Constitution
  "How many branches of government are established by the U.S. Constitution?",
  "What is the primary purpose of the system of checks and balances?",
  // 53-54: The Civil Rights Movement Overview
  "What did the Supreme Court rule in Brown v. Board of Education (1954)?",
  "In what year was the Civil Rights Act signed into law?",
  // 55-56: Key Figures: MLK and Rosa Parks
  "Which famous speech was delivered by Dr. Martin Luther King Jr. during the March on Washington?",
  "Which event was sparked by Rosa Parks' refusal to give up her bus seat?",
  // 57-58: Legislative Branch: Congress
  "How many members are in the U.S. Senate?",
  "How are House of Representatives seats allocated among states?",
  // 59-60: Executive and Judicial Branches
  "What role does the President serve as head of the U.S. military?",
  "What is the primary power of judicial review held by the Supreme Court?",
  // 61-62: How Elections Work
  "How many electoral votes are needed to win the U.S. presidential election?",
  "Which amendments expanded voting rights by eliminating barriers based on race, sex, and age?",
  // 63-64: Political Parties and the Two-Party System
  "What are the two major political parties in the United States?",
  "What is the primary purpose of a primary election?",
];

async function main() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  let updated = 0;
  for (let i = 0; i < questions.length && i < QUESTION_TEXTS.length; i++) {
    await prisma.question.update({
      where: { id: questions[i].id },
      data: { questionText: QUESTION_TEXTS[i] },
    });
    updated++;
  }

  console.log(`Updated ${updated} questions with questionText out of ${questions.length} total`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
