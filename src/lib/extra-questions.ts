// =======================================================================
// Extra questions merged from scripts/add-questions.ts + scripts/add-hard-questions.ts
// Format: [questionText, [[answer, isCorrect], ...], difficulty, explanation, ...tags]
// =======================================================================
export type Q = [string, [string, boolean][], "easy" | "medium" | "hard", string, string[]];

export const EXTRA_QUESTIONS: Record<string, Q[]> = {
  // ======================== MATH ========================
  "What is a Linear Equation?": [
    ["Which of the following is a linear equation?", [["3x + 5 = 17", true], ["x^2 + 2x = 8", false], ["1/x + 3 = 7", false], ["sqrt(x) = 4", false]], "easy", "A linear equation has variables only to the first power.", ["algebra", "linear-equation"]],
    ["Solve for x: 4(x - 2) = 20", [["7", true], ["5", false], ["8", false], ["6", false]], "medium", "Distribute: 4x - 8 = 20. Add 8: 4x = 28. x = 7.", ["algebra", "solving"]],
    ["If 2x + 3 = 3x - 7, what is x?", [["10", true], ["4", false], ["7", false], ["-10", false]], "medium", "Subtract 2x: 3 = x - 7. Add 7: x = 10.", ["algebra", "solving"]],
    ["What is the value of x if 5(x + 3) = 35?", [["4", true], ["7", false], ["10", false], ["5", false]], "medium", "5x + 15 = 35, 5x = 20, x = 4.", ["algebra", "distributive-property"]],
  ],
  "Solving Inequalities": [
    ["Solve: 2x - 3 > 7", [["x > 5", true], ["x > 2", false], ["x < 5", false], ["x > 4", false]], "easy", "Add 3: 2x > 10. Divide by 2: x > 5.", ["algebra", "inequalities"]],
    ["Solve: -3x <= 12", [["x >= -4", true], ["x <= -4", false], ["x >= 4", false], ["x <= 4", false]], "medium", "Divide by -3 and flip the inequality sign: x >= -4.", ["algebra", "inequalities"]],
    ["Which inequality represents 'at most 5'?", [["x <= 5", true], ["x >= 5", false], ["x < 5", false], ["x > 5", false]], "easy", "'At most' means less than or equal to.", ["algebra", "inequalities", "vocabulary"]],
    ["Solve: 3(x + 2) < 5x - 4", [["x > 5", true], ["x < 5", false], ["x > 10", false], ["x < 10", false]], "medium", "3x + 6 < 5x - 4. Subtract 3x: 6 < 2x - 4. Add 4: 10 < 2x. x > 5.", ["algebra", "inequalities"]],
  ],
  "Working with Units and Measurement": [
    ["How many feet are in 2 miles?", [["10,560 feet", true], ["5,280 feet", false], ["2,640 feet", false], ["3,000 feet", false]], "easy", "1 mile = 5,280 feet. 2 miles = 10,560 feet.", ["measurement", "conversions"]],
    ["A recipe calls for 3 cups of flour for 12 muffins. How many cups for 20 muffins?", [["5 cups", true], ["4 cups", false], ["6 cups", false], ["4.5 cups", false]], "medium", "3/12 = x/20. x = 3(20)/12 = 5.", ["measurement", "ratios", "proportions"]],
    ["Convert 2.5 kilometers to meters.", [["2,500 meters", true], ["250 meters", false], ["25,000 meters", false], ["250,000 meters", false]], "easy", "1 km = 1,000 m. 2.5 km = 2,500 m.", ["measurement", "metric-conversion"]],
    ["If 1 inch = 2.54 cm, how many cm in 10 inches?", [["25.4 cm", true], ["2.54 cm", false], ["255.4 cm", false], ["10 cm", false]], "medium", "10 x 2.54 = 25.4 cm.", ["measurement", "conversions"]],
  ],
  "Geometry Basics": [
    ["What is the area of a rectangle with length 8 and width 5?", [["40", true], ["26", false], ["13", false], ["80", false]], "easy", "Area = length x width = 8 x 5 = 40.", ["geometry", "area", "rectangle"]],
    ["What is the perimeter of a square with side 9?", [["36", true], ["18", false], ["81", false], ["27", false]], "easy", "Perimeter = 4 x side = 4 x 9 = 36.", ["geometry", "perimeter", "square"]],
    ["The angles of a triangle add up to:", [["180 degrees", true], ["360 degrees", false], ["90 degrees", false], ["270 degrees", false]], "easy", "Triangle angle sum = 180 degrees.", ["geometry", "angles", "triangle"]],
    ["What is the circumference of a circle with radius 7? (use pi ~ 3.14)", [["43.96", true], ["21.98", false], ["153.86", false], ["49", false]], "medium", "C = 2 x pi x r = 2 x 3.14 x 7 = 43.96.", ["geometry", "circumference", "circle"]],
  ],
  "The Coordinate Plane and Graphing": [
    ["In which quadrant is the point (-3, 4)?", [["Quadrant II", true], ["Quadrant I", false], ["Quadrant III", false], ["Quadrant IV", false]], "easy", "Negative x, positive y = Quadrant II.", ["coordinate-plane", "quadrants"]],
    ["What is the slope of the line passing through (2, 3) and (6, 11)?", [["2", true], ["4", false], ["8", false], ["1/2", false]], "medium", "Slope = (11-3)/(6-2) = 8/4 = 2.", ["coordinate-plane", "slope"]],
    ["What is the y-intercept of y = 3x - 7?", [["-7", true], ["3", false], ["7", false], ["-3", false]], "easy", "In y = mx + b, b is the y-intercept. Here b = -7.", ["coordinate-plane", "y-intercept"]],
    ["Which point is on the line y = 2x + 1?", [["(3, 7)", true], ["(2, 3)", false], ["(1, 1)", false], ["(0, 2)", false]], "medium", "When x=3: y = 2(3)+1 = 7. Point (3,7) is on the line.", ["coordinate-plane", "graphing"]],
  ],
  "Data Analysis and Statistics": [
    ["What is the mean of 4, 8, 12, 16?", [["10", true], ["12", false], ["8", false], ["14", false]], "easy", "Mean = (4+8+12+16)/4 = 40/4 = 10.", ["statistics", "mean"]],
    ["What is the median of 3, 7, 9, 12, 15?", [["9", true], ["7", false], ["12", false], ["10.5", false]], "easy", "Median is the middle value: 9.", ["statistics", "median"]],
    ["What is the mode of 2, 3, 3, 5, 7, 7, 7, 9?", [["7", true], ["3", false], ["5", false], ["9", false]], "easy", "Mode is the most frequent value: 7 appears 3 times.", ["statistics", "mode"]],
    ["If the mean of 5 numbers is 20, what is their sum?", [["100", true], ["25", false], ["20", false], ["10", false]], "medium", "Mean = sum/count. 20 = sum/5. Sum = 100.", ["statistics", "mean"]],
  ],
  "Introduction to Probability": [
    ["A fair coin is flipped. What is P(heads)?", [["1/2", true], ["1", false], ["1/4", false], ["0", false]], "easy", "A fair coin has 2 equally likely outcomes.", ["probability", "coin"]],
    ["A standard die is rolled. What is P(even)?", [["1/2", true], ["1/3", false], ["2/3", false], ["1/6", false]], "easy", "Even outcomes: 2,4,6 = 3 out of 6 = 1/2.", ["probability", "dice"]],
    ["A bag has 3 red and 5 blue marbles. What is P(red)?", [["3/8", true], ["5/8", false], ["3/5", false], ["1/3", false]], "easy", "P(red) = 3/(3+5) = 3/8.", ["probability", "marbles"]],
    ["Two dice are rolled. What is P(sum = 7)?", [["1/6", true], ["1/12", false], ["1/36", false], ["7/36", false]], "medium", "There are 6 ways to sum to 7 out of 36 total: 6/36 = 1/6.", ["probability", "dice", "compound"]],
  ],
  "Percentages, Ratios, and Proportions": [
    ["What is 25% of 200?", [["50", true], ["25", false], ["75", false], ["100", false]], "easy", "25% x 200 = 0.25 x 200 = 50.", ["percent", "basic"]],
    ["A shirt costs $40 and is on sale for 20% off. What is the sale price?", [["$32", true], ["$28", false], ["$36", false], ["$8", false]], "medium", "20% of 40 = 8. Sale price = 40 - 8 = 32.", ["percent", "discount"]],
    ["The ratio of boys to girls is 3:5. If there are 40 students total, how many girls?", [["25", true], ["15", false], ["20", false], ["30", false]], "medium", "3x + 5x = 40. 8x = 40. x = 5. Girls = 5(5) = 25.", ["ratio", "proportions"]],
    ["If a price increases from $80 to $100, what is the percent increase?", [["25%", true], ["20%", false], ["15%", false], ["30%", false]], "medium", "Increase = 20. Percent = 20/80 x 100 = 25%.", ["percent", "increase"]],
  ],
  "Functions and Graphs": [
    ["If f(x) = 2x + 3, what is f(4)?", [["11", true], ["8", false], ["10", false], ["14", false]], "easy", "f(4) = 2(4) + 3 = 8 + 3 = 11.", ["functions", "evaluation"]],
    ["Which table shows a function?", [["Each x-value has exactly one y-value", true], ["x=1 maps to y=2 and y=3", false], ["Multiple outputs for same input", false], ["A vertical line intersects the graph twice", false]], "easy", "A function has exactly one output for each input.", ["functions", "definition"]],
    ["What is the domain of f(x) = 1/(x-3)?", [["All real numbers except 3", true], ["All real numbers", false], ["x > 3", false], ["x < 3", false]], "medium", "x-3 cannot be 0, so x cannot be 3.", ["functions", "domain"]],
    ["If f(x) = x^2 - 1, what is f(-2)?", [["3", true], ["5", false], ["-5", false], ["-3", false]], "medium", "f(-2) = (-2)^2 - 1 = 4 - 1 = 3.", ["functions", "evaluation"]],
  ],
  "Polynomials and Exponents": [
    ["Simplify: (x^2)(x^3)", [["x^5", true], ["x^6", false], ["x^5", false], ["2x^5", false]], "easy", "Add exponents: x^(2+3) = x^5.", ["exponents", "rules"]],
    ["Simplify: (2x)^3", [["8x^3", true], ["2x^3", false], ["6x^3", false], ["8x^3", false]], "easy", "(2x)^3 = 2^3 x x^3 = 8x^3.", ["exponents", "rules"]],
    ["What is the degree of 3x^4 + 2x^2 - x + 7?", [["4", true], ["7", false], ["3", false], ["2", false]], "easy", "The degree is the highest exponent: 4.", ["polynomials", "degree"]],
    ["Combine like terms: 3x + 5 - 2x + 1", [["x + 6", true], ["5x + 6", false], ["x + 4", false], ["6x", false]], "easy", "(3x-2x) + (5+1) = x + 6.", ["polynomials", "simplifying"]],
  ],
  "Quadratic Equations": [
    ["Solve: x^2 = 49", [["x = 7 or x = -7", true], ["x = 7", false], ["x = 49", false], ["x = 0", false]], "easy", "x^2 = 49 means x = +/-sqrt(49) = +/-7.", ["quadratic", "solving"]],
    ["Factor: x^2 + 5x + 6", [["(x+2)(x+3)", true], ["(x+1)(x+6)", false], ["(x+5)(x+1)", false], ["(x-2)(x-3)", false]], "medium", "Find two numbers that multiply to 6 and add to 5: 2 and 3.", ["quadratic", "factoring"]],
    ["Solve: x^2 - 5x + 6 = 0", [["x = 2 or x = 3", true], ["x = -2 or x = -3", false], ["x = 1 or x = 6", false], ["x = -1 or x = -6", false]], "medium", "(x-2)(x-3) = 0, so x = 2 or x = 3.", ["quadratic", "factoring"]],
    ["What is the vertex of y = x^2 - 4x + 3?", [["(2, -1)", true], ["(-2, -1)", false], ["(4, 3)", false], ["(0, 3)", false]], "medium", "x = -b/2a = 4/2 = 2. y = 4 - 8 + 3 = -1. Vertex: (2, -1).", ["quadratic", "vertex"]],
  ],
  "Number Sense and Operations": [
    ["Which of the following is an irrational number?", [["sqrt(2)", true], ["0.5", false], ["3/4", false], ["sqrt(4)", true]], "easy", "sqrt(2) cannot be written as a simple fraction.", ["numbers", "irrational"]],
    ["What is the least common multiple (LCM) of 4 and 6?", [["12", true], ["24", false], ["2", false], ["6", false]], "easy", "LCM of 4 and 6 is 12.", ["numbers", "LCM"]],
    ["What is the greatest common factor (GCF) of 12 and 18?", [["6", true], ["3", false], ["12", false], ["36", false]], "easy", "GCF of 12 and 18 is 6.", ["numbers", "GCF"]],
    ["Evaluate: |-7| + |3|", [["10", true], ["4", false], ["-4", false], ["-10", false]], "easy", "|-7| = 7, |3| = 3. 7 + 3 = 10.", ["numbers", "absolute-value"]],
  ],

  // ======================== SCIENCE ========================
  "Cell Structure and Organelles": [
    ["What is the powerhouse of the cell?", [["Mitochondria", true], ["Nucleus", false], ["Ribosome", false], ["Endoplasmic reticulum", false]], "easy", "Mitochondria produce ATP energy through cellular respiration.", ["biology", "cell", "organelle"]],
    ["Which organelle contains the cell's genetic material?", [["Nucleus", true], ["Mitochondria", false], ["Cytoplasm", false], ["Cell membrane", false]], "easy", "The nucleus stores DNA and controls cell activities.", ["biology", "cell", "nucleus"]],
    ["Which organelle is responsible for protein synthesis?", [["Ribosome", true], ["Golgi apparatus", false], ["Lysosome", false], ["Vacuole", false]], "medium", "Ribosomes read mRNA to build proteins.", ["biology", "cell", "ribosome"]],
    ["If a cell's mitochondria were destroyed, which process would be most affected?", [["ATP production (cellular respiration)", true], ["Protein synthesis", false], ["DNA replication", false], ["Cell division", false]], "hard", "Without mitochondria, the cell cannot perform aerobic respiration to produce ATP energy.", ["biology", "cell", "organelle", "mitochondria"]],
    ["Which statement correctly describes the endosymbiotic theory?", [["Mitochondria and chloroplasts were once free-living prokaryotes", true], ["All organelles evolved from bacteria", false], ["Eukaryotic cells became prokaryotic", false], ["The nucleus was the first organelle to evolve", false]], "hard", "The endosymbiotic theory explains that mitochondria and chloroplasts originated as independent prokaryotes.", ["biology", "cell", "endosymbiotic-theory"]],
  ],
  "Chemical Reactions": [
    ["In a chemical reaction, reactants are:", [["The substances that start the reaction", true], ["The substances produced", false], ["The energy released", false], ["The catalyst used", false]], "easy", "Reactants are the starting materials in a chemical reaction.", ["chemistry", "reactions", "reactants"]],
    ["Which of the following is an example of a physical change?", [["Ice melting", true], ["Burning wood", false], ["Rusting iron", false], ["Digesting food", false]], "easy", "Melting ice changes form but not chemical composition.", ["chemistry", "physical-change"]],
    ["What is conserved in a chemical reaction?", [["Mass (atoms)", true], ["Volume", false], ["Shape", false], ["Color", false]], "medium", "The Law of Conservation of Mass states mass is conserved.", ["chemistry", "reactions", "conservation"]],
    ["In the reaction 2Na + 2H2O -> 2NaOH + H2, what type of reaction is this?", [["Single replacement", true], ["Double replacement", false], ["Synthesis", false], ["Decomposition", false]], "hard", "Na replaces H in H2O - one element replaces another in a compound = single replacement.", ["chemistry", "reactions", "types"]],
    ["A 50g sample of CaCO3 decomposes producing 28g of CaO and 22g of CO2. This demonstrates:", [["Law of Conservation of Mass", true], ["Law of Definite Proportions", false], ["Charles's Law", false], ["Boyle's Law", false]], "hard", "50g = 28g + 22g. Mass is conserved in the chemical reaction.", ["chemistry", "reactions", "conservation-of-mass"]],
  ],
  "DNA and Genes": [
    ["DNA stands for:", [["Deoxyribonucleic acid", true], ["Dinitrogen acid", false], ["Deoxyribose nitrogen acid", false], ["Dynamic nucleic acid", false]], "easy", "DNA = Deoxyribonucleic acid, the molecule that carries genetic information.", ["biology", "dna"]],
    ["Which base pairs with adenine in DNA?", [["Thymine", true], ["Guanine", false], ["Cytosine", false], ["Uracil", false]], "easy", "A pairs with T in DNA (A-U in RNA).", ["biology", "dna", "base-pairing"]],
    ["A gene is a segment of DNA that:", [["Codes for a specific protein", true], ["Creates energy", false], ["Destroys waste", false], ["Produces lipids", false]], "medium", "Genes are DNA segments that contain instructions for making proteins.", ["biology", "dna", "genes"]],
    ["If a DNA strand has the sequence ATTCGGA, what is the complementary strand?", [["TAAGCCT", true], ["ATTCGGA", false], ["UAAGCCU", false], ["GCCTAAT", false]], "hard", "A pairs with T, T pairs with A, C pairs with G, G pairs with C. Complement of ATTCGGA = TAAGCCT.", ["biology", "dna", "base-pairing"]],
    ["A mutation changes a codon from GAA to GUA. What type of mutation is this?", [["Missense mutation", true], ["Silent mutation", false], ["Nonsense mutation", false], ["Frameshift mutation", false]], "hard", "GAA (Glu) to GUA (Val) changes the amino acid = missense mutation.", ["biology", "dna", "mutation"]],
  ],
  "Newton's Laws of Motion": [
    ["Newton's First Law is also called the Law of:", [["Inertia", true], ["Acceleration", false], ["Action-Reaction", false], ["Gravity", false]], "easy", "An object at rest stays at rest unless acted upon by a force.", ["physics", "newton-laws"]],
    ["Force = mass x acceleration is Newton's:", [["Second Law", true], ["First Law", false], ["Third Law", false], ["Law of Gravity", false]], "easy", "F = ma is Newton's Second Law of Motion.", ["physics", "newton-laws", "F=ma"]],
    ["For every action, there is an equal and opposite reaction. This is Newton's:", [["Third Law", true], ["First Law", false], ["Second Law", false], ["Law of Gravity", false]], "easy", "Newton's Third Law describes action-reaction force pairs.", ["physics", "newton-laws"]],
    ["A 2000 kg car at rest is pushed with 400 N of force. If friction is 100 N, what is the acceleration?", [["0.15 m/s squared", true], ["0.2 m/s squared", false], ["0.05 m/s squared", false], ["0.25 m/s squared", false]], "hard", "Net force = 400 - 100 = 300 N. a = F/m = 300/2000 = 0.15 m/s squared.", ["physics", "newton-laws", "friction"]],
  ],
  "Speed, Velocity, and Acceleration": [
    ["Speed is:", [["Distance divided by time", true], ["Force divided by mass", false], ["Mass divided by volume", false], ["Displacement divided by time", false]], "easy", "Speed = distance/time.", ["physics", "speed"]],
    ["What is the difference between speed and velocity?", [["Velocity includes direction", true], ["Speed is always faster", false], ["There is no difference", false], ["Speed uses metric units only", false]], "medium", "Velocity is speed with a specified direction (vector quantity).", ["physics", "velocity"]],
    ["A ball is thrown upward at 20 m/s. How high does it go before falling back? (g = 10 m/s squared)", [["20 meters", true], ["10 meters", false], ["40 meters", false], ["5 meters", false]], "hard", "At max height: v = 0. v squared = u squared - 2gh. 0 = 400 - 20h. h = 20 m.", ["physics", "kinematics", "projectile"]],
    ["A car accelerates from rest at 2 m/s squared for 8 seconds. How far does it travel?", [["64 meters", true], ["16 meters", false], ["32 meters", false], ["128 meters", false]], "hard", "d = ut + 1/2 at squared = 0 + 0.5(2)(64) = 64 meters.", ["physics", "kinematics", "equations-of-motion"]],
  ],
  "Cell Division: Mitosis and Meiosis": [
    ["Mitosis produces:", [["Two identical daughter cells", true], ["Four unique cells", false], ["One cell with double DNA", false], ["Three cells", false]], "easy", "Mitosis creates two genetically identical daughter cells.", ["biology", "mitosis"]],
    ["Meiosis is used for:", [["Producing gametes (sex cells)", true], ["Growth and repair", false], ["Asexual reproduction", false], ["Making proteins", false]], "medium", "Meiosis reduces chromosome number by half to produce gametes.", ["biology", "meiosis"]],
    ["A cell with 24 chromosomes undergoes meiosis. How many chromosomes does each resulting cell have?", [["12", true], ["24", false], ["6", false], ["48", false]], "hard", "Meiosis halves the chromosome number: 24/2 = 12 chromosomes per gamete.", ["biology", "meiosis", "chromosomes"]],
    ["If a cell has 20 chromosomes during G2 phase, how many chromosomes will each daughter cell have after mitosis?", [["20", true], ["10", false], ["40", false], ["30", false]], "hard", "Mitosis preserves chromosome number. G2 = 20 (already replicated). Daughter cells also have 20.", ["biology", "mitosis", "cell-cycle"]],
  ],
  "Atoms and the Periodic Table": [
    ["The nucleus of an atom contains:", [["Protons and neutrons", true], ["Protons and electrons", false], ["Neutrons and electrons", false], ["Only protons", false]], "easy", "The nucleus contains protons (positive) and neutrons (neutral).", ["chemistry", "atoms", "nucleus"]],
    ["What determines an element's identity?", [["Number of protons (atomic number)", true], ["Number of neutrons", false], ["Number of electrons", false], ["Atomic mass", false]], "medium", "The atomic number (proton count) uniquely identifies an element.", ["chemistry", "atoms", "atomic-number"]],
    ["An element has atomic number 17 and mass number 35. How many neutrons does it have?", [["18", true], ["17", false], ["35", false], ["52", false]], "hard", "Neutrons = Mass number - Atomic number = 35 - 17 = 18. (This is Chlorine-35.)", ["chemistry", "atoms", "isotopes"]],
  ],
  "Punnett Squares": [
    ["In a monohybrid cross Aa x Aa, what fraction of offspring will show the dominant trait?", [["3/4", true], ["1/2", false], ["1/4", false], ["All", false]], "medium", "AA, Aa, Aa show dominant. Only aa shows recessive. 3/4.", ["biology", "genetics", "punnett-square"]],
    ["In sex-linked inheritance (X-linked recessive), a carrier mother (XNXn) and normal father (XNY) have a son. What is the chance the son has the trait?", [["50%", true], ["25%", false], ["100%", false], ["0%", false]], "hard", "Son gets Y from father, X from mother. 50% chance of getting Xn (affected) vs XN (carrier).", ["biology", "genetics", "sex-linked"]],
  ],
  "The Scientific Method": [
    ["What is the correct order of the scientific method?", [["Observation, hypothesis, experiment, analysis, conclusion", true], ["Experiment, hypothesis, observation, conclusion", false], ["Hypothesis, observation, experiment, analysis", false], ["Conclusion, experiment, hypothesis, observation", false]], "easy", "The scientific method starts with observation and ends with conclusion.", ["science", "scientific-method"]],
    ["A hypothesis is:", [["A testable prediction", true], ["A proven fact", false], ["A final conclusion", false], ["An opinion", false]], "easy", "A hypothesis is an educated guess that can be tested.", ["science", "hypothesis"]],
    ["In an experiment, the variable you change is called:", [["Independent variable", true], ["Dependent variable", false], ["Control variable", false], ["Constant", false]], "medium", "The independent variable is the one the experimenter changes.", ["science", "variables"]],
    ["Which of the following is a scientific theory?", [["Theory of Evolution by Natural Selection", true], ["It just is what it is", false], ["Because I said so", false], ["My teacher told me", false]], "medium", "A scientific theory is supported by extensive evidence and testing.", ["science", "theory"]],
  ],
  "Energy and Work": [
    ["What is the unit of energy?", [["Joule", true], ["Watt", false], ["Newton", false], ["Pascal", false]], "easy", "The Joule (J) is the SI unit of energy.", ["physics", "energy", "units"]],
    ["Kinetic energy depends on:", [["Mass and velocity", true], ["Mass and height", false], ["Height and gravity", false], ["Temperature only", false]], "medium", "KE = 1/2 mv squared. It depends on mass and velocity.", ["physics", "energy", "kinetic"]],
    ["A 10 kg object is lifted 5 meters. How much work is done? (g = 10 m/s squared)", [["500 Joules", true], ["50 Joules", false], ["100 Joules", false], ["250 Joules", false]], "medium", "Work = Force x distance = (10 x 10) x 5 = 500 J.", ["physics", "work"]],
  ],
  "Ecology and Ecosystems": [
    ["Producers in an ecosystem are organisms that:", [["Make their own food through photosynthesis", true], ["Eat other organisms", false], ["Break down dead matter", false], ["Only live in water", false]], "easy", "Producers (autotrophs) convert sunlight into food energy.", ["biology", "ecology", "producers"]],
    ["What is a food chain?", [["A sequence of who eats whom", true], ["A chain made of food", false], ["The amount of food available", false], ["A type of ecosystem", false]], "easy", "A food chain shows energy flow from producers to consumers.", ["biology", "ecology", "food-chain"]],
    ["Decomposers play an important role because they:", [["Break down dead organisms and recycle nutrients", true], ["Produce oxygen", false], ["Are primary consumers", false], ["Create energy from sunlight", false]], "medium", "Decomposers recycle nutrients back into the ecosystem.", ["biology", "ecology", "decomposers"]],
  ],

  // ======================== RLA (Reasoning Through Language Arts) ========================
  "Making Inferences": [
    ["Read: 'Maria shut the door, pulled up the blanket, and closed her eyes.' What can you infer?", [["Maria is going to sleep", true], ["Maria is angry", false], ["Maria is cleaning", false], ["Maria is exercising", false]], "easy", "Shutting door, pulling blanket, closing eyes = going to sleep.", ["reading", "inference"]],
    ["'The company's quarterly profits dropped 40%, and the CEO announced mandatory vacation days next month.' Best inference:", [["The company is likely preparing for layoffs disguised as vacation", true], ["Employees are getting a bonus", false], ["The company is doing well", false], ["The CEO is generous", false]], "hard", "Profits dropped 40% + mandatory vacation suggests cost-cutting, likely layoffs.", ["reading", "inference", "critical-thinking"]],
    ["'Every morning, she watered the plants and checked the soil.' What can you infer about her?", [["She cares about gardening/plants", true], ["She works at a nursery", false], ["She lives in a desert", false], ["She is a farmer", false]], "easy", "Regularly watering plants and checking soil shows care for plants.", ["reading", "inference"]],
  ],
  "Author's Purpose": [
    ["'Buy now and save 50%!' This text is meant to:", [["Persuade", true], ["Inform", false], ["Entertain", false], ["Describe", false]], "easy", "Sales language with urgency is persuasive.", ["reading", "authors-purpose"]],
    ["'The new highway will cut travel time by 20 minutes but will destroy the only wetland in the county, home to 15 endangered species.' The author's purpose is most likely to:", [["Persuade readers to oppose the highway project", true], ["Inform about highway construction schedules", false], ["Entertain with a story about wildlife", false], ["Describe wetland geography", false]], "hard", "Presenting benefits vs. devastating environmental cost = persuasive against the project.", ["reading", "authors-purpose", "persuasion"]],
    ["An encyclopedia entry about the water cycle is meant to:", [["Inform", true], ["Persuade", false], ["Entertain", false], ["Express emotion", false]], "easy", "Encyclopedia entries provide factual information.", ["reading", "authors-purpose"]],
  ],
  "Subject-Verb Agreement": [
    ["'The group of students ___ going to the museum.' Which verb is correct?", [["is", true], ["are", false], ["were", false], ["be", false]], "easy", "'The group' is singular (collective noun), so use 'is'.", ["grammar", "subject-verb-agreement"]],
    ["'Neither the cat nor the dogs ___ outside.' Which verb fits?", [["were", true], ["was", false], ["is", false], ["has been", false]], "medium", "With 'neither/nor', the verb agrees with the nearer subject 'dogs' (plural) = 'were'.", ["grammar", "subject-verb-agreement", "neither-nor"]],
    ["'None of the evidence ___ to support the defendant's claim.' Which verb fits both formal and informal usage?", [["points (formal) / point (informal) are both acceptable", true], ["Only 'points' is correct", false], ["Only 'point' is correct", false], ["Neither is correct; use 'pointing'", false]], "hard", "'None' can be singular or plural. Formal grammar prefers singular ('points'). Informal allows plural ('point').", ["grammar", "subject-verb-agreement", "none"]],
  ],
  "Comma Rules": [
    ["Which sentence uses commas correctly?", [["I need to buy apples, bananas, and oranges.", true], ["I need to buy, apples, bananas, and oranges.", false], ["I need to buy apples bananas and, oranges.", false], ["I need to buy apples, bananas and oranges.", false]], "easy", "Use commas to separate items in a list (Oxford comma before 'and').", ["grammar", "punctuation", "commas"]],
    ["Which sentence correctly uses commas with a complex sentence?", [["Because the storm was approaching, we boarded up the windows.", true], ["We boarded up the windows, because the storm was approaching.", false], ["Because the storm was approaching we, boarded up the windows.", false], ["Because, the storm was approaching, we boarded up the windows.", false]], "hard", "When a dependent clause comes first, use a comma after it before the independent clause.", ["grammar", "punctuation", "commas", "complex-sentence"]],
  ],
  "Point of View": [
    ["'I walked to the store and bought some milk.' This is written in:", [["First person", true], ["Second person", false], ["Third person", false], ["Third person omniscient", false]], "easy", "'I' indicates first person point of view.", ["reading", "point-of-view"]],
    ["A story is told using 'he' and follows one character's thoughts, but the narrator is NOT that character. This is:", [["Third person limited", true], ["First person", false], ["Second person", false], ["Third person omniscient", false]], "hard", "Third person limited: narrator uses he/she, follows one character's perspective but is an outside observer.", ["reading", "point-of-view"]],
  ],
  "Complete Sentences vs. Fragments": [
    ["Which of the following is a complete sentence?", [["The dog barked loudly.", true], ["Running down the street.", false], ["Because it was raining.", false], ["Under the bridge.", false]], "easy", "A complete sentence has a subject and a verb and expresses a complete thought.", ["grammar", "sentences"]],
    ["Which of the following is NOT a fragment?", [["Having studied all night, she felt prepared for the exam.", true], ["Having studied all night.", false], ["Because she had studied all night.", false], ["Studying all night, despite being exhausted.", false]], "hard", "The first option has a complete independent clause ('she felt prepared') after the introductory phrase.", ["grammar", "sentences", "fragments"]],
  ],
  "Apostrophes and Quotation Marks": [
    ["Which sentence shows correct apostrophe use?", [["The dog's tail is wagging.", true], ["The dogs tail is wagging.", false], ["The dogs's tail is wagging.", false], ["The dog its tail is wagging.", false]], "easy", "'Dog's' = possessive singular. The tail belongs to the dog.", ["grammar", "apostrophe"]],
    ["Which sentence is correct?", [["The Joneses' house is the one on the corner.", true], ["The Jones's house is the one on the corner.", false], ["The Jone's house is the one on the corner.", false], ["The Joneses house is the one on the corner.", false]], "hard", "Joneses = plural of Jones. Joneses' = possessive of plural = correct form for a family named Jones.", ["grammar", "apostrophe", "plural-possessive"]],
  ],
  "Finding the Main Idea": [
    ["'Regular exercise strengthens your heart, improves mood, and helps maintain a healthy weight.' The main idea is:", [["Exercise has multiple health benefits", true], ["You should run every day", false], ["Only heart health matters", false], ["Weight loss requires exercise only", false]], "easy", "The sentence lists several benefits of exercise as the main idea.", ["reading", "main-idea"]],
    ["Read: 'While social media connects people globally, studies show it increases feelings of loneliness and depression, especially among teenagers. Algorithms designed to maximize engagement often promote extreme content.' What is the main idea?", [["Social media has significant negative mental health effects despite its connectivity benefits", true], ["Algorithms are bad technology", false], ["Teenagers use social media too much", false], ["Global connection is impossible without social media", false]], "hard", "The passage contrasts connectivity benefits with mental health harms - the main idea encompasses both.", ["reading", "main-idea", "critical-thinking"]],
  ],
  "Text Structure and Organization": [
    ["'First, gather your ingredients. Next, mix them together. Finally, bake for 30 minutes.' This is an example of:", [["Sequential/Chronological order", true], ["Compare and contrast", false], ["Cause and effect", false], ["Problem and solution", false]], "easy", "First, Next, Finally = chronological/sequential order.", ["reading", "text-structure"]],
    ["'Although both cars get good gas mileage, the sedan is more affordable, while the SUV has more cargo space.' This is:", [["Compare and contrast", true], ["Cause and effect", false], ["Sequential order", false], ["Problem and solution", false]], "medium", "Comparing two things (sedan vs SUV) on different features = compare and contrast.", ["reading", "text-structure", "compare-contrast"]],
  ],
  "Vocabulary in Context": [
    ["'The elusive cat hid under the porch every time visitors arrived.' What does 'elusive' mean?", [["Hard to catch or find", true], ["Very friendly", false], ["Large and scary", false], ["Colorful", false]], "easy", "Hiding every time = hard to catch/find = elusive.", ["vocabulary", "context-clues"]],
    ["'The benevolent donor gave millions to the children's hospital.' What does 'benevolent' mean?", [["Generous and kind", true], ["Wealthy", false], ["Famous", false], ["Careless", false]], "medium", "Giving millions to a hospital = generous and kind = benevolent.", ["vocabulary", "context-clues"]],
  ],

  // ======================== SOCIAL STUDIES ========================
  "The Declaration of Independence": [
    ["When was the Declaration of Independence adopted?", [["1776", true], ["1775", false], ["1783", false], ["1787", false]], "easy", "The Declaration was adopted on July 4, 1776.", ["history", "declaration"]],
    ["Which Enlightenment philosopher most influenced the Declaration's idea of 'unalienable rights'?", [["John Locke", true], ["Thomas Hobbes", false], ["Jean-Jacques Rousseau", false], ["Montesquieu", false]], "hard", "Locke's 'natural rights' (life, liberty, property) directly inspired Jefferson's 'life, liberty, and the pursuit of happiness'.", ["history", "declaration", "enlightenment"]],
    ["The Declaration argues that governments get their power from:", [["The consent of the governed", true], ["God", false], ["The military", false], ["Wealthy landowners", false]], "hard", "'Governments are instituted among Men, deriving their just powers from the consent of the governed.'", ["history", "declaration", "social-contract"]],
  ],
  "The U.S. Constitution": [
    ["How many branches of government does the U.S. have?", [["Three", true], ["Two", false], ["Four", false], ["Five", false]], "easy", "Legislative, Executive, and Judicial.", ["civics", "constitution", "branches"]],
    ["Which amendment abolished slavery?", [["13th Amendment", true], ["12th Amendment", false], ["14th Amendment", false], ["15th Amendment", false]], "hard", "13th (1865) abolished slavery. 14th = equal protection. 15th = voting regardless of race.", ["civics", "constitution", "amendments", "reconstruction"]],
    ["The 'supremacy clause' (Article VI) establishes that:", [["Federal law overrides conflicting state laws", true], ["The President is supreme over Congress", false], ["State laws override federal laws", false], ["The Supreme Court can create laws", false]], "hard", "Article VI's Supremacy Clause: the Constitution and federal laws are the 'supreme Law of the Land'.", ["civics", "constitution", "supremacy-clause"]],
  ],
  "The Civil Rights Movement Overview": [
    ["Who was a key leader of the Civil Rights Movement known for nonviolent protest?", [["Martin Luther King Jr.", true], ["Malcolm X", false], ["Rosa Parks", false], ["John F. Kennedy", false]], "easy", "MLK led the civil rights movement using nonviolent protest strategies.", ["history", "civil-rights", "MLK"]],
    ["The doctrine of 'separate but equal' was established by which case?", [["Plessy v. Ferguson (1896)", true], ["Brown v. Board of Education (1954)", false], ["Dred Scott v. Sandford (1857)", false], ["Regents of UC v. Bakke (1978)", false]], "hard", "Plessy v. Ferguson (1896) established 'separate but equal', which Brown v. Board later overturned.", ["history", "civil-rights", "supreme-court"]],
    ["The 24th Amendment (1964) eliminated:", [["Poll taxes in federal elections", true], ["Literacy tests", false], ["Grandfather clauses", false], ["White primaries", false]], "hard", "The 24th Amendment specifically banned poll taxes, which were used to disenfranchise poor (especially Black) voters.", ["history", "civil-rights", "voting-rights"]],
  ],
  "Key Figures: MLK and Rosa Parks": [
    ["Rosa Parks is known for:", [["Refusing to give up her bus seat", true], ["Leading the March on Washington", false], ["Writing the Civil Rights Act", false], ["Being the first Black president", false]], "easy", "Rosa Parks refused to give up her bus seat in Montgomery, sparking the bus boycott.", ["history", "civil-rights", "rosa-parks"]],
    ["MLK's 'Letter from Birmingham Jail' defended which strategy?", [["Nonviolent direct action against unjust laws", true], ["Armed self-defense", false], ["Gradual legislative change only", false], ["Economic boycotts as the only tool", false]], "hard", "The letter defended the strategy of nonviolent direct action, explaining why 'wait' meant 'never'.", ["history", "civil-rights", "MLK"]],
  ],
  "Legislative Branch: Congress": [
    ["How many senators does each state have?", [["Two", true], ["Based on population", false], ["One", false], ["Four", false]], "easy", "Each state has 2 senators regardless of population (Great Compromise).", ["civics", "congress", "senate"]],
    ["A bill passes the House but fails in the Senate. What happens?", [["The bill dies and must start over", true], ["It goes to the President anyway", false], ["The House can override the Senate", false], ["It goes to conference committee automatically", false]], "hard", "Both chambers must pass identical versions. If one rejects it, the bill dies unless a conference committee reconciles differences.", ["civics", "congress", "legislative-process"]],
  ],
  "Executive and Judicial Branches": [
    ["Who is the Commander in Chief of the U.S. military?", [["The President", true], ["The Vice President", false], ["The Secretary of Defense", false], ["The Chairman of the Joint Chiefs", false]], "easy", "The President is the Commander in Chief per Article II of the Constitution.", ["civics", "president"]],
    ["Which president expanded the executive power through the 'imperial presidency'?", [["Richard Nixon (Watergate era)", true], ["George Washington", false], ["Abraham Lincoln", false], ["Jimmy Carter", false]], "hard", "Nixon's expanded use of executive privilege, impoundment, and domestic spying exemplified 'imperial presidency'.", ["civics", "president", "executive-power"]],
    ["Which case established that the President is not above the law?", [["United States v. Nixon (1974)", true], ["Marbury v. Madison", false], ["Bush v. Gore", false], ["Clinton v. Jones", false]], "hard", "US v. Nixon forced Nixon to turn over the Watergate tapes, establishing that executive privilege has limits.", ["civics", "judicial-branch", "supreme-court"]],
  ],
  "How Elections Work": [
    ["How many electoral votes are needed to win the presidency?", [["270", true], ["300", false], ["218", false], ["51", false]], "easy", "270 out of 538 electoral votes are needed to win.", ["civics", "elections", "electoral-college"]],
    ["What happens if no candidate gets 270 electoral votes?", [["The House of Representatives chooses the President", true], ["The Senate chooses the President", false], ["There is a runoff election", false], ["The incumbent stays in office", false]], "hard", "If no majority in Electoral College, the House elects the President (each state delegation gets 1 vote).", ["civics", "elections", "electoral-college", "contingent-election"]],
  ],
  "Political Parties and the Two-Party System": [
    ["The two major political parties in the U.S. are:", [["Democrats and Republicans", true], ["Liberals and Conservatives", false], ["Federalists and Anti-Federalists", false], ["Whigs and Tories", false]], "easy", "Democrats and Republicans are the two major U.S. political parties.", ["civics", "political-parties"]],
    ["The Federalist Party, one of the first two U.S. parties, was led by:", [["Alexander Hamilton", true], ["Thomas Jefferson", false], ["James Madison", false], ["George Washington", false]], "hard", "Federalists (Hamilton) favored strong central government. Democratic-Republicans (Jefferson) favored states' rights.", ["civics", "political-parties", "history"]],
    ["What is 'gerrymandering'?", [["Redrawing district boundaries to favor one party", true], ["Voting more than once", false], ["Campaigning in multiple states", false], ["Changing party affiliation", false]], "hard", "Gerrymandering = manipulating electoral district boundaries for political advantage. Named after Governor Gerry (1812).", ["civics", "elections", "gerrymandering"]],
  ],
  "Economics Basics": [
    ["What is inflation?", [["A general increase in prices over time", true], ["A decrease in prices", false], ["When the stock market crashes", false], ["When unemployment is zero", false]], "easy", "Inflation is the rate at which the general level of prices for goods and services rises.", ["economics", "inflation"]],
    ["What is GDP?", [["Total value of all goods and services produced in a country", true], ["Total government debt", false], ["Total population income", false], ["Total exports minus imports", false]], "medium", "GDP = Gross Domestic Product = total value of goods/services produced.", ["economics", "GDP"]],
    ["A tax on imported goods is called a:", [["Tariff", true], ["Quota", false], ["Subsidy", false], ["Surplus", false]], "medium", "A tariff is a tax on imports to protect domestic industries.", ["economics", "trade", "tariff"]],
  ],
  "World Wars and Global Conflicts": [
    ["World War I (1914-1918) was triggered by:", [["The assassination of Archduke Franz Ferdinand", true], ["The bombing of Pearl Harbor", false], ["The invasion of Poland", false], ["The Russian Revolution", false]], "easy", "The assassination of Austria-Hungary's Archduke in Sarajevo triggered WWI.", ["history", "WWI", "causes"]],
    ["The United States entered World War II after:", [["The attack on Pearl Harbor (1941)", true], ["The invasion of France", false], ["The bombing of London", false], ["The fall of Berlin", false]], "easy", "Japan's attack on Pearl Harbor on Dec 7, 1941 brought the U.S. into WWII.", ["history", "WWII", "pearl-harbor"]],
    ["The Cold War was primarily between:", [["The U.S. and the Soviet Union", true], ["The U.S. and China", false], ["Britain and France", false], ["Germany and Japan", false]], "medium", "The Cold War (1947-1991) was a geopolitical tension between the U.S. (capitalist) and USSR (communist).", ["history", "cold-war"]],
  ],
  "Maps, Geography, and Human-Environment Interaction": [
    ["What does a map scale show?", [["The relationship between distance on the map and real distance", true], ["The compass direction", false], ["The population density", false], ["The climate zones", false]], "easy", "A map scale tells you how map distance relates to actual ground distance.", ["geography", "maps", "scale"]],
    ["Which type of map shows elevation and terrain features?", [["Topographic map", true], ["Political map", false], ["Climate map", false], ["Population map", false]], "medium", "Topographic maps use contour lines to show elevation and terrain.", ["geography", "maps", "topographic"]],
  ],
  "The Bill of Rights": [
    ["The First Amendment protects:", [["Freedom of religion, speech, press, assembly, and petition", true], ["Right to bear arms", false], ["Protection from unreasonable search", false], ["Right to a fair trial", false]], "easy", "1st Amendment: 5 freedoms - religion, speech, press, assembly, petition.", ["civics", "constitution", "bill-of-rights"]],
    ["The Second Amendment protects the right to:", [["Bear arms", true], ["Free speech", false], ["Trial by jury", false], ["Privacy", false]], "easy", "2nd Amendment protects the right to keep and bear arms.", ["civics", "constitution", "bill-of-rights"]],
    ["Which amendment protects against 'cruel and unusual punishment'?", [["Eighth Amendment", true], ["Fifth Amendment", false], ["Sixth Amendment", false], ["Fourth Amendment", false]], "medium", "The 8th Amendment prohibits excessive bail/fines and cruel/unusual punishment.", ["civics", "constitution", "amendments"]],
  ],
};
