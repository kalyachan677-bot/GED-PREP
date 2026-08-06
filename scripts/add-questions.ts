import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

// Compact format: [questionText, [[answer, isCorrect], ...], difficulty, explanation, ...tags]
type Q = [string, [string, boolean][], "easy" | "medium" | "hard", string, string[]];

const QUESTIONS: Record<string, Q[]> = {
  // MATH
  "What is a Linear Equation?": [
    ["Which of the following is a linear equation?", [["3x + 5 = 17", true], ["x² + 2x = 8", false], ["1/x + 3 = 7", false], ["sqrt(x) = 4", false]], "easy", "A linear equation has variables only to the first power.", ["algebra", "linear-equation"]],
    ["Solve for x: 4(x - 2) = 20", [["7", true], ["5", false], ["8", false], ["6", false]], "medium", "Distribute: 4x - 8 = 20. Add 8: 4x = 28. x = 7.", ["algebra", "solving"]],
    ["If 2x + 3 = 3x - 7, what is x?", [["10", true], ["4", false], ["7", false], ["-10", false]], "medium", "Subtract 2x: 3 = x - 7. Add 7: x = 10.", ["algebra", "solving"]],
    ["What is the value of x if 5(x + 3) = 35?", [["4", true], ["7", false], ["10", false], ["5", false]], "medium", "5x + 15 = 35, 5x = 20, x = 4.", ["algebra", "distributive-property"]],
  ],
  "Solving Inequalities": [
    ["Solve: 2x - 3 > 7", [["x > 5", true], ["x > 2", false], ["x < 5", false], ["x > 4", false]], "easy", "Add 3: 2x > 10. Divide by 2: x > 5.", ["algebra", "inequalities"]],
    ["Solve: -3x <= 12", [["x >= -4", true], ["x <= -4", false], ["x >= 4", false], ["x <= 4", false]], "medium", "Divide by -3 and flip the inequality sign: x >= -4.", ["algebra", "inequalities"]],
    ["Which represents x < 3 on a number line?", [["Open circle at 3, arrow pointing left", true], ["Closed circle at 3, arrow pointing left", false], ["Open circle at 3, arrow pointing right", false], ["Closed circle at 3, arrow pointing right", false]], "easy", "Open circle (not equal) with arrow left (smaller values).", ["algebra", "inequalities", "graphing"]],
    ["Solve: 5 - 2x > 11", [["x < -3", true], ["x > -3", false], ["x > 3", false], ["x < 3", false]], "medium", "Subtract 5: -2x > 6. Divide by -2 (flip): x < -3.", ["algebra", "inequalities"]],
  ],
  "Substitution Method": [
    ["Solve: y = 2x + 1 and y = 7. What is x?", [["3", true], ["4", false], ["5", false], ["2", false]], "easy", "Set 2x + 1 = 7. 2x = 6. x = 3.", ["algebra", "systems", "substitution"]],
    ["Solve: x + y = 10 and y = 3x. What is x?", [["2.5", true], ["3", false], ["2", false], ["5", false]], "medium", "x + 3x = 10, 4x = 10, x = 2.5.", ["algebra", "systems"]],
    ["If y = x - 4 and 2x + y = 16, what is y?", [["8/3", true], ["4", false], ["2", false], ["6", false]], "medium", "2x + x - 4 = 16, 3x = 20, x = 20/3, y = 20/3 - 12/3 = 8/3.", ["algebra", "systems"]],
    ["A store sells notebooks for $3 and pens for $1.50. Buy 5 items for $12 total. How many notebooks?", [["3", true], ["2", false], ["4", false], ["1", false]], "hard", "n + p = 5, 3n + 1.5p = 12. Substitute: 3n + 1.5(5-n) = 12, 1.5n = 4.5, n = 3.", ["algebra", "systems", "word-problem"]],
  ],
  "Elimination Method": [
    ["Solve: 2x + 3y = 12 and 2x + y = 8. What is y?", [["2", true], ["3", false], ["1", false], ["4", false]], "medium", "Subtract: 2y = 4, y = 2.", ["algebra", "systems", "elimination"]],
    ["Solve: 3x + 2y = 16 and x + 2y = 10. What is x?", [["3", true], ["2", false], ["5", false], ["4", false]], "easy", "Subtract: 2x = 6, x = 3.", ["algebra", "systems"]],
    ["Solve: x + y = 7 and x - y = 3. What are x and y?", [["x = 5, y = 2", true], ["x = 4, y = 3", false], ["x = 6, y = 1", false], ["x = 3, y = 4", false]], "easy", "Add: 2x = 10, x = 5. y = 2.", ["algebra", "systems"]],
    ["A theater sold 200 tickets. Adult $8, child $5. Total $1,300. How many child tickets?", [["100", true], ["80", false], ["120", false], ["60", false]], "hard", "a + c = 200, 8a + 5c = 1300. a = 200-c. 1600 - 3c = 1300, c = 100.", ["algebra", "systems", "word-problem"]],
  ],
  "Rectangle and Triangle Basics": [
    ["A rectangle has length 12 cm and width 8 cm. What is its perimeter?", [["40 cm", true], ["96 cm", false], ["20 cm", false], ["48 cm", false]], "easy", "P = 2(l + w) = 2(12 + 8) = 40 cm.", ["geometry", "perimeter", "rectangle"]],
    ["What is the area of a triangle with base 10 cm and height 6 cm?", [["30 sq cm", true], ["60 sq cm", false], ["16 sq cm", false], ["36 sq cm", false]], "easy", "A = 1/2 * base * height = 1/2 * 10 * 6 = 30.", ["geometry", "area", "triangle"]],
    ["A rectangle has area 72 sq cm and length 9 cm. What is the width?", [["8 cm", true], ["7 cm", false], ["6 cm", false], ["10 cm", false]], "medium", "72 = 9 * w, w = 8 cm.", ["geometry", "area", "rectangle"]],
    ["The perimeter of a square is 44 cm. What is its area?", [["121 sq cm", true], ["176 sq cm", false], ["484 sq cm", false], ["44 sq cm", false]], "medium", "Side = 44/4 = 11 cm. Area = 11 * 11 = 121 sq cm.", ["geometry", "square"]],
  ],
  "Circles and Composite Shapes": [
    ["What is the circumference of a circle with radius 7 cm? (pi = 22/7)", [["44 cm", true], ["154 cm", false], ["22 cm", false], ["88 cm", false]], "easy", "C = 2 * pi * r = 2 * (22/7) * 7 = 44 cm.", ["geometry", "circles"]],
    ["What is the area of a circle with diameter 10 cm? (pi = 3.14)", [["78.5 sq cm", true], ["31.4 sq cm", false], ["50.24 sq cm", false], ["100 sq cm", false]], "medium", "Radius = 5. Area = pi * r^2 = 3.14 * 25 = 78.5 sq cm.", ["geometry", "circles", "area"]],
    ["A circle has circumference 31.4 cm. What is its radius? (pi = 3.14)", [["5 cm", true], ["10 cm", false], ["15.7 cm", false], ["3.14 cm", false]], "medium", "C = 2*pi*r, 31.4 = 6.28*r, r = 5 cm.", ["geometry", "circles"]],
    ["What is the area of a circle with radius 14 cm? (pi = 22/7)", [["616 sq cm", true], ["308 sq cm", false], ["88 sq cm", false], ["154 sq cm", false]], "medium", "A = (22/7) * 14^2 = (22/7) * 196 = 616 sq cm.", ["geometry", "circles", "area"]],
  ],
  "Understanding the Theorem": [
    ["In a right triangle with legs 5 and 12, what is the hypotenuse?", [["13", true], ["17", false], ["8", false], ["7", false]], "easy", "5^2 + 12^2 = 25 + 144 = 169 = 13^2.", ["geometry", "pythagorean"]],
    ["Which is a Pythagorean triple?", [["8, 15, 17", true], ["4, 5, 6", false], ["3, 4, 8", false], ["5, 6, 7", false]], "medium", "8^2 + 15^2 = 64 + 225 = 289 = 17^2.", ["geometry", "pythagorean-triple"]],
    ["A ladder base is 6 m from wall, reaches 8 m high. How long is the ladder?", [["10 m", true], ["14 m", false], ["12 m", false], ["8 m", false]], "medium", "6^2 + 8^2 = 36 + 64 = 100 = 10^2.", ["geometry", "pythagorean", "application"]],
    ["Right triangle: hypotenuse 25, one leg 7. What is the other leg?", [["24", true], ["18", false], ["32", false], ["12", false]], "medium", "a^2 + 49 = 625, a^2 = 576, a = 24.", ["geometry", "pythagorean"]],
  ],
  "Applications and Word Problems": [
    ["A 40-inch TV (diagonal) has width 32 inches. What is the height?", [["24 inches", true], ["20 inches", false], ["28 inches", false], ["16 inches", false]], "medium", "32^2 + h^2 = 40^2, h^2 = 576, h = 24.", ["geometry", "pythagorean", "application"]],
    ["A baseball diamond has 90-foot sides. Distance from home to second base?", [["127.3 feet", true], ["180 feet", false], ["90 feet", false], ["120 feet", false]], "hard", "Diagonal = sqrt(90^2 + 90^2) = 90*sqrt(2) = 127.3 ft.", ["geometry", "pythagorean", "application"]],
    ["Two cars leave same point: one drives 3 mi north, other 4 mi east. How far apart?", [["5 miles", true], ["7 miles", false], ["1 mile", false], ["12 miles", false]], "easy", "3-4-5 right triangle. Distance = sqrt(9+16) = 5 miles.", ["geometry", "pythagorean", "application"]],
    ["A ramp rises 2 ft over 24 ft horizontal. What is the ramp length?", [["About 24.1 ft", true], ["26 ft", false], ["22 ft", false], ["24 ft", false]], "hard", "sqrt(24^2 + 2^2) = sqrt(580) = 24.08 ft.", ["geometry", "pythagorean", "application"]],
  ],

  // SCIENCE
  "Cell Structure and Organelles": [
    ["Which organelle is the 'powerhouse of the cell'?", [["Mitochondria", true], ["Nucleus", false], ["Ribosome", false], ["Endoplasmic reticulum", false]], "easy", "Mitochondria produce ATP through cellular respiration.", ["biology", "cell", "organelle"]],
    ["What is the primary function of the cell membrane?", [["Control what enters and exits the cell", true], ["Produce energy", false], ["Store DNA", false], ["Synthesize proteins", false]], "easy", "The cell membrane is selectively permeable.", ["biology", "cell", "cell-membrane"]],
    ["Which organelle is responsible for protein synthesis?", [["Ribosome", true], ["Golgi apparatus", false], ["Lysosome", false], ["Vacuole", false]], "easy", "Ribosomes read mRNA and assemble amino acids into proteins.", ["biology", "cell", "organelle"]],
    ["Plant cells have which organelle that animal cells lack?", [["Chloroplast", true], ["Mitochondria", false], ["Nucleus", false], ["Endoplasmic reticulum", false]], "easy", "Chloroplasts contain chlorophyll for photosynthesis.", ["biology", "cell", "plant-cell"]],
  ],
  "Cell Division: Mitosis and Meiosis": [
    ["How many daughter cells does mitosis produce?", [["2 identical cells", true], ["4 different cells", false], ["1 cell", false], ["3 cells", false]], "easy", "Mitosis produces 2 genetically identical daughter cells.", ["biology", "mitosis"]],
    ["What is the purpose of meiosis?", [["Produce gametes with half the chromosomes", true], ["Produce identical body cells", false], ["Create energy for the cell", false], ["Break down waste products", false]], "medium", "Meiosis reduces chromosome number by half for sexual reproduction.", ["biology", "meiosis"]],
    ["In which phase of mitosis do chromosomes align at the center?", [["Metaphase", true], ["Prophase", false], ["Anaphase", false], ["Telophase", false]], "medium", "Metaphase: chromosomes align at the metaphase plate.", ["biology", "mitosis", "phases"]],
    ["How many cells does meiosis produce from one parent cell?", [["4", true], ["2", false], ["8", false], ["1", false]], "easy", "Meiosis involves two divisions producing 4 unique haploid cells.", ["biology", "meiosis"]],
  ],
  "DNA and Genes": [
    ["What are the four nitrogenous bases in DNA?", [["Adenine, Thymine, Guanine, Cytosine", true], ["Adenine, Uracil, Guanine, Cytosine", false], ["Adenine, Thymine, Guanine, Uracil", false], ["Thymine, Uracil, Guanine, Cytosine", false]], "easy", "DNA has A, T, G, C. RNA replaces T with U.", ["biology", "dna"]],
    ["Which base pairs with Adenine in DNA?", [["Thymine", true], ["Guanine", false], ["Cytosine", false], ["Uracil", false]], "easy", "A pairs with T (2 hydrogen bonds). G pairs with C (3 bonds).", ["biology", "dna", "base-pairing"]],
    ["What is a gene?", [["A segment of DNA that codes for a specific protein", true], ["An entire chromosome", false], ["A type of cell", false], ["A protein molecule", false]], "easy", "A gene is a DNA sequence with instructions for making a protein.", ["biology", "genetics"]],
    ["DNA replication is 'semi-conservative' because:", [["Each new DNA has one old strand and one new strand", true], ["Only half the DNA is copied", false], ["The process only happens half the time", false], ["It produces half as many cells", false]], "medium", "Each original strand serves as a template for a new complementary strand.", ["biology", "dna", "replication"]],
  ],
  "Punnett Squares": [
    ["Cross Tt x Tt (T = tall, dominant). What percent of offspring will be tall?", [["75%", true], ["50%", false], ["100%", false], ["25%", false]], "medium", "TT, Tt, Tt, tt = 3/4 tall (75%).", ["biology", "genetics", "punnett-square"]],
    ["Cross BB x bb. All offspring will be:", [["Bb (heterozygous)", true], ["BB", false], ["bb", false], ["Either BB or bb", false]], "easy", "BB x bb = all Bb. Each parent contributes one allele.", ["biology", "genetics"]],
    ["What is the genotype ratio for Aa x Aa?", [["1:2:1 (AA:Aa:aa)", true], ["3:1", false], ["2:2", false], ["1:1:1:1", false]], "medium", "AA, Aa, Aa, aa = 1:2:1 genotype ratio.", ["biology", "genetics", "punnett-square"]],
    ["In incomplete dominance, RR (red) x rr (white) produces:", [["Pink flowers (Rr)", true], ["Red flowers", false], ["White flowers", false], ["Red and white spotted", false]], "medium", "Incomplete dominance: heterozygous phenotype is a blend of both.", ["biology", "genetics", "incomplete-dominance"]],
  ],
  "Atoms and the Periodic Table": [
    ["What are the three main subatomic particles?", [["Protons, neutrons, and electrons", true], ["Atoms, molecules, and compounds", false], ["Protons, ions, and electrons", false], ["Nucleus, electrons, and isotopes", false]], "easy", "Protons (+) and neutrons (0) in nucleus; electrons (-) orbit.", ["chemistry", "atoms"]],
    ["What determines an element's position on the periodic table?", [["Number of protons (atomic number)", true], ["Number of neutrons", false], ["Number of electrons", false], ["Atomic mass", false]], "medium", "Atomic number (protons) uniquely identifies each element.", ["chemistry", "periodic-table"]],
    ["Where are metals located on the periodic table?", [["Left and center", true], ["Upper right", false], ["Bottom only", false], ["Scattered throughout", false]], "easy", "Metals are left and center. Nonmetals are upper right.", ["chemistry", "periodic-table", "metals"]],
    ["An atom has 8 protons, 8 neutrons, 10 electrons. What is its charge?", [["-2", true], ["+2", false], ["0", false], ["-8", false]], "medium", "Charge = protons - electrons = 8 - 10 = -2 (anion).", ["chemistry", "atoms", "ions"]],
  ],
  "Chemical Reactions": [
    ["In a chemical reaction, what is conserved?", [["Mass and atoms", true], ["Volume and temperature", false], ["Molecules and energy", false], ["Only atoms", false]], "medium", "Law of Conservation of Mass: mass and atoms are neither created nor destroyed.", ["chemistry", "reactions"]],
    ["Which type of reaction releases heat?", [["Exothermic", true], ["Endothermic", false], ["Nuclear", false], ["Reversible", false]], "easy", "Exothermic releases heat (e.g., combustion). Endothermic absorbs heat.", ["chemistry", "reactions", "thermodynamics"]],
    ["What is the product of 2H2 + O2 = ?", [["2H2O", true], ["H2O2", false], ["2HO", false], ["H4O", false]], "easy", "2H2 + O2 -> 2H2O (water formation).", ["chemistry", "reactions", "balancing"]],
    ["Rusting of iron is an example of:", [["Oxidation", true], ["Reduction", false], ["Synthesis only", false], ["Decomposition", false]], "medium", "Rusting (4Fe + 3O2 -> 2Fe2O3): iron loses electrons to oxygen = oxidation.", ["chemistry", "reactions", "oxidation"]],
  ],
  "Newton's Laws of Motion": [
    ["Newton's First Law is also known as the law of:", [["Inertia", true], ["Acceleration", false], ["Action-reaction", false], ["Gravity", false]], "easy", "An object at rest stays at rest unless acted on by unbalanced force.", ["physics", "newton-laws"]],
    ["According to Newton's Second Law, Force = ?", [["mass x acceleration", true], ["mass / acceleration", false], ["mass + acceleration", false], ["acceleration / mass", false]], "easy", "F = ma is the most fundamental equation in mechanics.", ["physics", "newton-laws", "force"]],
    ["When you push a wall, the wall pushes back. This is:", [["Newton's Third Law", true], ["Newton's First Law", false], ["Newton's Second Law", false], ["The law of gravity", false]], "easy", "For every action, there is an equal and opposite reaction.", ["physics", "newton-laws"]],
    ["A 5 kg object accelerates at 3 m/s^2. What force is applied?", [["15 N", true], ["8 N", false], ["1.67 N", false], ["2 N", false]], "easy", "F = ma = 5 x 3 = 15 Newtons.", ["physics", "newton-laws", "calculation"]],
  ],
  "Speed, Velocity, and Acceleration": [
    ["What is the difference between speed and velocity?", [["Velocity includes direction; speed does not", true], ["Speed includes direction; velocity does not", false], ["They are the same thing", false], ["Speed is always faster", false]], "easy", "Speed = scalar (magnitude). Velocity = vector (magnitude + direction).", ["physics", "kinematics"]],
    ["A car travels 120 miles in 2 hours. Average speed?", [["60 mph", true], ["30 mph", false], ["240 mph", false], ["90 mph", false]], "easy", "Speed = distance/time = 120/2 = 60 mph.", ["physics", "kinematics", "calculation"]],
    ["A car goes from 0 to 60 mph in 5 seconds. What is its acceleration?", [["12 mph/s", true], ["5 mph/s", false], ["60 mph/s", false], ["300 mph/s", false]], "medium", "Acceleration = (60-0)/5 = 12 mph per second.", ["physics", "kinematics", "acceleration"]],
    ["An object moving in a circle at constant speed is:", [["Accelerating (changing direction)", true], ["Not accelerating", false], ["Decelerating", false], ["Moving in a straight line", false]], "medium", "Circular motion at constant speed still involves acceleration due to changing direction.", ["physics", "kinematics", "circular-motion"]],
  ],

  // RLA
  "Finding the Main Idea": [
    ["'The Amazon produces 20% of the world's oxygen. Deforestation threatens this vital resource.' What is the main idea?", [["Deforestation threatens the Amazon's ability to produce oxygen", true], ["Football fields are very large", false], ["The Amazon produces 20% of oxygen", false], ["Rain forests are beautiful", false]], "medium", "The main idea connects both the importance and the threat.", ["reading", "main-idea"]],
    ["Which is the main idea sentence of a paragraph about exercise?", [["Regular exercise provides both physical and mental health benefits.", true], ["Walking is one form of exercise.", false], ["Many people join gyms in January.", false], ["Running shoes can be expensive.", false]], "easy", "The main idea is the broadest statement covering the entire topic.", ["reading", "main-idea"]],
    ["The main idea of a passage is usually found in:", [["The first or last sentence", true], ["The middle of the paragraph", false], ["Randomly placed", false], ["Only in the title", false]], "easy", "Main idea is most often in the topic sentence (first or last).", ["reading", "main-idea", "strategy"]],
    ["'Solar panels cost 80% less since 2010. Many homeowners now install them to reduce bills.' Main idea?", [["Solar energy is increasingly accessible due to lower costs", true], ["Solar panels are ugly", false], ["Electricity bills are too high", false], ["2010 was bad for solar", false]], "medium", "The passage connects decreasing costs with increased adoption.", ["reading", "main-idea"]],
  ],
  "Making Inferences": [
    ["'Maria stared at the test, hands trembling. She studied every night for two weeks.' Infer:", [["Maria is nervous about the test despite being prepared", true], ["Maria didn't study enough", false], ["Maria enjoys taking tests", false], ["The test is very easy", false]], "easy", "Trembling = nervous. Studying = prepared. Inference: nervous despite preparation.", ["reading", "inference"]],
    ["'The sidewalk was wet even though it hadn't rained.' Infer:", [["Something else made the sidewalk wet", true], ["It rained during the night", false], ["The sidewalk is broken", false], ["Someone spilled water specifically", false]], "easy", "Since it didn't rain, another source of water caused the wetness.", ["reading", "inference"]],
    ["An inference is:", [["A conclusion based on evidence and reasoning", true], ["A fact directly stated in the text", false], ["The author's opinion", false], ["A summary of the passage", false]], "easy", "Inference = text clues + background knowledge = conclusion not directly stated.", ["reading", "inference", "definition"]],
    ["'The restaurant was empty except for one tired waiter wiping tables.' Best inference?", [["The restaurant is closing or having a slow day", true], ["The food is terrible", false], ["The waiter is lazy", false], ["The restaurant just opened", false]], "medium", "Empty restaurant + tired waiter = closing time or slow business day.", ["reading", "inference"]],
  ],
  "Author's Purpose": [
    ["'Buy now and save 50%! Limited time offer!' What is the author's purpose?", [["To persuade", true], ["To inform", false], ["To entertain", false], ["To describe", false]], "easy", "Exclamation marks, urgency, and call to action = persuasion.", ["reading", "authors-purpose"]],
    ["A textbook chapter about the water cycle is written to:", [["Inform", true], ["Persuade", false], ["Entertain", false], ["Express feelings", false]], "easy", "Textbooks present factual information to teach and inform.", ["reading", "authors-purpose"]],
    ["The three main purposes of writing are (PIE):", [["To inform, persuade, and entertain", true], ["To describe, narrate, and argue", false], ["To educate, sell, and amuse", false], ["To explain, convince, and review", false]], "easy", "PIE = Persuade, Inform, Entertain.", ["reading", "authors-purpose", "PIE"]],
    ["A poem about autumn leaves is primarily written to:", [["Entertain and express emotion", true], ["Persuade the reader to rake leaves", false], ["Inform about tree biology", false], ["Compare seasons scientifically", false]], "easy", "Poetry about nature's beauty = entertain, create imagery, express emotion.", ["reading", "authors-purpose", "poetry"]],
  ],
  "Point of View": [
    ["'I walked into the room and saw my friend.' This is written in which POV?", [["First person", true], ["Second person", false], ["Third person limited", false], ["Third person omniscient", false]], "easy", "The use of 'I' indicates first-person point of view.", ["reading", "point-of-view"]],
    ["'She didn't know that John was watching her.' This is:", [["Third person omniscient", true], ["First person", false], ["Second person", false], ["Third person limited", false]], "medium", "Narrator knows what both 'she' AND 'John' are doing = omniscient.", ["reading", "point-of-view"]],
    ["'You should always check your work before submitting.' Which POV?", [["Second person", true], ["First person", false], ["Third person", false], ["No point of view", false]], "easy", "The pronoun 'you' = second-person POV.", ["reading", "point-of-view"]],
    ["Which POV uses he/she/they but follows only one character's thoughts?", [["Third person limited", true], ["Third person omniscient", false], ["First person", false], ["Second person", false]], "medium", "Third limited: he/she/they but only one character's inner thoughts.", ["reading", "point-of-view"]],
  ],
  "Complete Sentences vs. Fragments": [
    ["Which is a complete sentence?", [["The dog barked loudly at the mailman.", true], ["Because it was raining.", false], ["Running through the park.", false], ["A very big house.", false]], "easy", "A complete sentence needs subject + verb + complete thought.", ["grammar", "sentences", "fragments"]],
    ["'Although she was tired.' Is this a sentence or fragment?", [["Fragment - dependent clause", true], ["Complete sentence", false], ["Run-on sentence", false], ["Compound sentence", false]], "medium", "'Although' makes it a dependent clause needing an independent clause.", ["grammar", "sentences", "fragments"]],
    ["Which is a run-on sentence?", [["I love coffee I drink it every morning.", true], ["I love coffee, and I drink it every morning.", false], ["I love coffee; I drink it every morning.", false], ["I love coffee. I drink it every morning.", false]], "medium", "Two independent clauses with no conjunction or punctuation = run-on.", ["grammar", "sentences", "run-on"]],
    ["Every complete sentence must have:", [["A subject and a verb", true], ["An adjective and adverb", false], ["A preposition and object", false], ["A noun and pronoun", false]], "easy", "Subject (who/what) + verb (action) = minimum requirements for a sentence.", ["grammar", "sentences"]],
  ],
  "Subject-Verb Agreement": [
    ["'The group of students ___ going on a field trip.' Which verb?", [["is", true], ["are", false], ["were", false], ["been", false]], "medium", "'Group' is singular collective noun, so use 'is'.", ["grammar", "subject-verb-agreement"]],
    ["'Neither the cat nor the dogs ___ outside.' Which verb?", [["were", true], ["was", false], ["is", false], ["has been", false]], "medium", "Neither/nor: verb agrees with closer subject ('dogs' = plural = 'were').", ["grammar", "subject-verb-agreement"]],
    ["'Each of the students ___ a textbook.' Which verb?", [["has", true], ["have", false], ["are having", false], ["having", false]], "medium", "'Each' is always singular, so 'has' not 'have'.", ["grammar", "subject-verb-agreement"]],
    ["'Mathematics ___ my favorite subject.' Which verb?", [["is", true], ["are", false], ["were", false], ["have been", false]], "medium", "Words ending in -ics are singular and take singular verbs.", ["grammar", "subject-verb-agreement"]],
  ],
  "Comma Rules": [
    ["Which sentence uses commas correctly?", [["I bought apples, bananas, and oranges at the store.", true], ["I bought apples bananas and oranges, at the store.", false], ["I bought, apples, bananas, and oranges at the store.", false], ["I bought apples bananas and oranges at the store.", false]], "medium", "Use commas to separate list items. Oxford comma before 'and'.", ["grammar", "punctuation", "commas"]],
    ["'However it was too late.' Where should the comma go?", [["However, it was too late.", true], ["However it, was too late.", false], ["However it was, too late.", false], ["No comma needed", false]], "easy", "Conjunctive adverb at start = comma after it.", ["grammar", "punctuation", "commas"]],
    ["Which correctly uses a comma for an introductory phrase?", [["After the game, we went out for pizza.", true], ["After the game we, went out for pizza.", false], ["After, the game we went out for pizza.", false], ["After the game went out, for pizza.", false]], "easy", "Comma after introductory phrase before main sentence.", ["grammar", "punctuation", "commas"]],
    ["'The tall man, wearing a black coat, is my uncle.' The commas set off:", [["A non-essential descriptive phrase", true], ["The subject", false], ["The verb", false], ["A prepositional phrase", false]], "hard", "Non-essential appositive phrases are set off by commas.", ["grammar", "punctuation", "commas"]],
  ],
  "Apostrophes and Quotation Marks": [
    ["Which uses the apostrophe correctly?", [["The dog's tail was wagging.", true], ["The dogs tail was wagging.", false], ["The dog's' tail was wagging.", false], ["The dogs's tail was wagging.", false]], "easy", "Apostrophe + s ('s) for singular noun possession.", ["grammar", "apostrophe"]],
    ["'Its a beautiful day.' What is the error?", [["'Its' should be 'It's' (it is)", true], ["'beautiful' should be 'beautifull'", false], ["'day' should be 'days'", false], ["There is no error", false]], "easy", "It's = it is. Its = possessive. Sentence needs 'It's'.", ["grammar", "apostrophe", "its-vs-it's"]],
    ["'The students' books are on the desk.' The apostrophe means:", [["Plural possessive - books belong to students", true], ["Singular possessive", false], ["A contraction", false], ["A plural, not possessive", false]], "medium", "Students' (plural + apostrophe after s) = possessive of plural.", ["grammar", "apostrophe"]],
    ["In American English, periods and commas go:", [["Inside quotation marks", true], ["Outside quotation marks", false], ["Before quotation marks", false], ["It doesn't matter", false]], "easy", "US style: periods and commas go inside quotation marks.", ["grammar", "quotation-marks"]],
  ],

  // SOCIAL STUDIES
  "The Declaration of Independence": [
    ["When was the Declaration of Independence adopted?", [["July 4, 1776", true], ["July 4, 1775", false], ["January 1, 1776", false], ["December 25, 1776", false]], "easy", "The Continental Congress adopted it on July 4, 1776.", ["history", "declaration"]],
    ["Who was the primary author of the Declaration of Independence?", [["Thomas Jefferson", true], ["George Washington", false], ["Benjamin Franklin", false], ["John Adams", false]], "easy", "Jefferson drafted it; the committee revised it.", ["history", "declaration"]],
    ["'All men are created equal' is from which document?", [["Declaration of Independence", true], ["The Constitution", false], ["The Bill of Rights", false], ["The Articles of Confederation", false]], "easy", "This famous phrase is from the Declaration's second paragraph.", ["history", "declaration"]],
    ["The Declaration of Independence lists grievances against which country?", [["Great Britain (King George III)", true], ["France", false], ["Spain", false], ["Germany", false]], "medium", "The colonists complained about King George III's unfair policies.", ["history", "declaration", "grievances"]],
  ],
  "The U.S. Constitution": [
    ["How many articles are in the U.S. Constitution?", [["7", true], ["10", true], ["27", false], ["3", false]], "medium", "7 articles outline the government structure. 10 = Bill of Rights. 27 = total amendments.", ["civics", "constitution"]],
    ["What does Article I of the Constitution establish?", [["The Legislative Branch (Congress)", true], ["The Executive Branch", false], ["The Judicial Branch", false], ["The Amendments", false]], "medium", "Article I = Congress (Senate + House of Representatives).", ["civics", "constitution", "branches"]],
    ["The Preamble begins with which words?", [["We the People", true], ["We the States", false], ["In order to form", false], ["Four score and seven", false]], "easy", "'We the People of the United States, in Order to form a more perfect Union...'", ["civics", "constitution", "preamble"]],
    ["The Constitution can be amended by:", [["2/3 of Congress + 3/4 of states", true], ["The President alone", false], ["Simple majority of Congress", false], ["Supreme Court decision", false]], "hard", "Proposal: 2/3 of both houses. Ratification: 3/4 of state legislatures.", ["civics", "constitution", "amendments"]],
  ],
  "The Civil Rights Movement Overview": [
    ["The Civil Rights Movement primarily took place in which decade?", [["1950s-1960s", true], ["1920s-1930s", false], ["1970s-1980s", false], ["1890s-1900s", false]], "easy", "The movement peaked in the 1950s and 1960s.", ["history", "civil-rights"]],
    ["What was the 1954 Supreme Court case that desegregated schools?", [["Brown v. Board of Education", true], ["Plessy v. Ferguson", false], ["Marbury v. Madison", false], ["Roe v. Wade", false]], "medium", "Brown v. Board overturned Plessy v. Ferguson's 'separate but equal'.", ["history", "civil-rights", "supreme-court"]],
    ["The Civil Rights Act of 1964 outlawed discrimination based on:", [["Race, color, religion, sex, national origin", true], ["Only race", false], ["Only race and gender", false], ["Age and disability", false]], "medium", "The Act prohibited discrimination in employment and public accommodations.", ["history", "civil-rights"]],
    ["What did the Voting Rights Act of 1965 do?", [["Outlawed discriminatory voting practices", true], ["Gave women the right to vote", false], ["Lowered the voting age to 18", false], ["Created the Electoral College", false]], "medium", "It banned literacy tests and other barriers to voting.", ["history", "civil-rights", "voting"]],
  ],
  "Key Figures: MLK and Rosa Parks": [
    ["Martin Luther King Jr.'s 'I Have a Dream' speech was at:", [["The March on Washington (1963)", true], ["The Selma March", false], ["The Montgomery Bus Boycott", false], ["The Lincoln Memorial dedication", false]], "medium", "Delivered August 28, 1963 at the Lincoln Memorial during the March on Washington.", ["history", "civil-rights", "MLK"]],
    ["Rosa Parks became famous for:", [["Refusing to give up her bus seat", true], ["Leading the March on Washington", false], ["Writing the Civil Rights Act", false], ["Being the first Black congresswoman", false]], "easy", "December 1, 1955 in Montgomery, Alabama.", ["history", "civil-rights", "rosa-parks"]],
    ["MLK advocated for which form of protest?", [["Nonviolent civil disobedience", true], ["Armed rebellion", false], ["Economic boycotts only", false], ["Political lobbying only", false]], "easy", "King was inspired by Gandhi's nonviolent resistance.", ["history", "civil-rights", "MLK", "nonviolence"]],
    ["The Montgomery Bus Boycott lasted how long?", [["381 days (over a year)", true], ["30 days", false], ["6 months", false], ["2 weeks", false]], "medium", "December 1955 to December 1956. It ended when buses were desegregated.", ["history", "civil-rights", "montgomery-boycott"]],
  ],
  "Legislative Branch: Congress": [
    ["Congress is divided into two parts. What are they?", [["Senate and House of Representatives", true], ["House and Supreme Court", false], ["Senate and Cabinet", false], ["House of Lords and Commons", false]], "easy", "Bicameral legislature: Senate (100) + House (435).", ["civics", "congress"]],
    ["How many senators does each state have?", [["2", true], ["Based on population", false], ["1", false], ["4", false]], "easy", "Equal representation: every state gets 2 senators regardless of size.", ["civics", "senate"]],
    ["How long is a Senate term?", [["6 years", true], ["2 years", false], ["4 years", false], ["8 years", false]], "medium", "Senators serve 6-year terms with 1/3 up for election every 2 years.", ["civics", "senate"]],
    ["Who has the power to declare war?", [["Congress", true], ["The President", false], ["The Supreme Court", false], ["The Secretary of Defense", false]], "medium", "Article I, Section 8 gives Congress the power to declare war.", ["civics", "congress", "war-powers"]],
  ],
  "Executive and Judicial Branches": [
    ["Who is the head of the Executive Branch?", [["The President", true], ["The Speaker of the House", false], ["The Chief Justice", false], ["The Vice President", false]], "easy", "The President leads the executive branch.", ["civics", "executive-branch"]],
    ["How long is a presidential term?", [["4 years", true], ["6 years", false], ["8 years", false], ["2 years", false]], "easy", "Presidents serve 4-year terms, limited to 2 terms (8 years total).", ["civics", "president"]],
    ["The Supreme Court has how many justices?", [["9", true], ["7", false], ["12", false], ["5", false]], "easy", "1 Chief Justice + 8 Associate Justices = 9 total.", ["civics", "judicial-branch", "supreme-court"]],
    ["Judicial review (the power to declare laws unconstitutional) was established by:", [["Marbury v. Madison (1803)", true], ["Brown v. Board of Education", false], ["Roe v. Wade", false], ["Dred Scott v. Sandford", false]], "hard", "Chief Justice Marshall established judicial review in Marbury v. Madison.", ["civics", "judicial-branch", "judicial-review"]],
  ],
  "How Elections Work": [
    ["The President is elected by:", [["The Electoral College", true], ["Popular vote only", false], ["Congress", false], ["The Supreme Court", false]], "easy", "The Electoral College officially elects the President.", ["civics", "elections", "electoral-college"]],
    ["How many electoral votes are needed to win the presidency?", [["270", true], ["300", false], ["200", false], ["538", false]], "medium", "270 out of 538 total electoral votes needed to win.", ["civics", "elections", "electoral-college"]],
    ["A presidential election is held every:", [["4 years", true], ["2 years", false], ["6 years", false], ["Every year", false]], "easy", "Presidential elections are every 4 years (leap years).", ["civics", "elections"]],
    ["The 26th Amendment (1971) lowered the voting age to:", [["18", true], ["21", false], ["16", false], ["25", false]], "easy", "'Old enough to fight, old enough to vote' - lowered from 21 to 18.", ["civics", "elections", "amendments"]],
  ],
  "Political Parties and the Two-Party System": [
    ["The two major political parties in the U.S. are:", [["Democratic and Republican", true], ["Liberal and Conservative", false], ["Labor and Tory", false], ["Federalist and Anti-Federalist", false]], "easy", "The Democratic and Republican parties dominate U.S. politics.", ["civics", "political-parties"]],
    ["The Democratic Party's symbol is:", [["Donkey", true], ["Elephant", false], ["Eagle", false], ["Bear", false]], "easy", "Democrat = Donkey, Republican = Elephant.", ["civics", "political-parties"]],
    ["Third parties face challenges in the U.S. because:", [["The winner-take-all system makes it hard to gain representation", true], ["They are illegal", false], ["They cannot raise money", false], ["Voters are not allowed to vote for them", false]], "medium", "The single-member district system means only the top vote-getter wins.", ["civics", "political-parties", "third-parties"]],
    ["What is a 'swing state' (also called battleground state)?", [["A state that could vote for either party", true], ["A state that always votes Democratic", false], ["A state that always votes Republican", false], ["A state with no electoral votes", false]], "easy", "Swing states are competitive and could go to either candidate.", ["civics", "elections", "swing-state"]],
  ],
};

async function main() {
  // Get all lessons with their subject code
  const lessons = await prisma.lesson.findMany({
    include: {
      topic: {
        include: {
          module: {
            include: { subject: true }
          }
        }
      }
    }
  });

  let totalAdded = 0;
  const errors: string[] = [];

  for (const lesson of lessons) {
    const subjectCode = lesson.topic.module.subject.code;
    const lessonTitle = lesson.title;
    const questionsToAdd = QUESTIONS[lessonTitle];

    if (!questionsToAdd || questionsToAdd.length === 0) {
      console.log(`SKIP: ${subjectCode} > ${lessonTitle} (no new questions)`);
      continue;
    }

    for (const [questionText, answers, difficulty, explanation, tags] of questionsToAdd) {
      try {
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
            answers: {
              create: answers.map((a, i) => ({
                id: uuid(),
                content: a[0],
                isCorrect: a[1],
                sortOrder: i,
              }))
            }
          }
        });
        totalAdded++;
      } catch (e: any) {
        errors.push(`${subjectCode} > ${lessonTitle}: ${e.message}`);
      }
    }
    console.log(`OK: ${subjectCode} > ${lessonTitle}: +${questionsToAdd.length} questions`);
  }

  console.log(`\n=== DONE: Added ${totalAdded} questions total ===`);
  if (errors.length > 0) {
    console.log(`\nErrors (${errors.length}):`);
    errors.forEach(e => console.log(`  - ${e}`));
  }

  // Print summary
  const subjects = await prisma.subject.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { questions: { where: { isActive: true } } }
  });
  console.log(`\nUpdated question counts:`);
  for (const s of subjects) {
    const easy = s.questions.filter(q => q.difficulty === 'easy').length;
    const med = s.questions.filter(q => q.difficulty === 'medium').length;
    const hard = s.questions.filter(q => q.difficulty === 'hard').length;
    console.log(`  ${s.code}: ${s.questions.length} total (${easy} easy, ${med} medium, ${hard} hard)`);
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); prisma.$disconnect(); process.exit(1); });
