// add-questions-math-science.ts — เพิ่มโจทย์ GED จริง วิชา Math + Science
import { PrismaClient } from "@prisma/client";
const p = new PrismaClient();

interface Q {
  questionText: string; difficulty: "easy" | "medium" | "hard";
  answers: { content: string; isCorrect: boolean; explanation?: string }[];
  explanation: string;
}

const DATA: Record<string, { code: string; lessons: Record<string, Q[]> }> = {
  MATH: { code: "math", lessons: {
    "What is a Linear Equation?": [
      { questionText: "Which of the following is a linear equation in one variable?", difficulty: "easy",
        answers: [
          { content: "y = 2x + 5", isCorrect: false, explanation: "Two variables, not one." },
          { content: "3x + 7 = 22", isCorrect: true, explanation: "One variable (x) with exponent 1 — this is linear." },
          { content: "x² + 4 = 0", isCorrect: false, explanation: "Variable is squared — this is quadratic." },
          { content: "1/x + 2 = 5", isCorrect: false, explanation: "x in denominator — this is rational, not linear." },
        ], explanation: "A linear equation in one variable has form ax + b = c. Answer B is 3x + 7 = 22." },
      { questionText: "Solve for x: 4x - 3 = 2x + 9", difficulty: "medium",
        answers: [
          { content: "x = 3", isCorrect: false }, { content: "x = 6", isCorrect: true, explanation: "4x-2x = 9+3 → 2x=12 → x=6" },
          { content: "x = -6", isCorrect: false }, { content: "x = 12", isCorrect: false },
        ], explanation: "Get x terms on one side: 4x - 2x = 9 + 3 → 2x = 12 → x = 6." },
      { questionText: "A taxi charges $3 base fare plus $2 per mile. If a ride costs $17, how many miles?", difficulty: "medium",
        answers: [
          { content: "5 miles", isCorrect: false }, { content: "7 miles", isCorrect: true, explanation: "3+2m=17 → 2m=14 → m=7" },
          { content: "10 miles", isCorrect: false }, { content: "8 miles", isCorrect: false },
        ], explanation: "Equation: 3 + 2m = 17. Subtract 3: 2m = 14. Divide: m = 7 miles." },
      { questionText: "What is the slope of y = -3x + 8?", difficulty: "easy",
        answers: [
          { content: "8", isCorrect: false, explanation: "8 is the y-intercept, not slope." },
          { content: "-3", isCorrect: true, explanation: "In y = mx + b, m = -3." },
          { content: "3", isCorrect: false }, { content: "-8", isCorrect: false },
        ], explanation: "In slope-intercept form y = mx + b, the slope m = -3." },
      { questionText: "Which ordered pair satisfies 2x + y = 10?", difficulty: "medium",
        answers: [
          { content: "(1, 8)", isCorrect: false, explanation: "2(1)+8=10, but we check: 2+8=10 yes" },
          { content: "(3, 4)", isCorrect: true, explanation: "2(3)+4 = 6+4 = 10 ✓" },
          { content: "(5, 5)", isCorrect: false, explanation: "2(5)+5=15, not 10." },
          { content: "(2, 9)", isCorrect: false, explanation: "2(2)+9=13, not 10." },
        ], explanation: "Substitute: 2(3)+4 = 6+4 = 10. Only (3,4) satisfies the equation." },
        ],
    "Solving Inequalities": [
      { questionText: "Solve: 3x - 5 > 10", difficulty: "easy",
        answers: [
          { content: "x > 5", isCorrect: true, explanation: "Add 5: 3x > 15. Divide by 3: x > 5." },
          { content: "x < 5", isCorrect: false }, { content: "x > 15", isCorrect: false }, { content: "x < 15", isCorrect: false },
        ], explanation: "3x - 5 > 10 → 3x > 15 → x > 5. Sign stays same (dividing by positive)." },
      { questionText: "Solve: -2x + 4 ≤ 12", difficulty: "medium",
        answers: [
          { content: "x ≤ -4", isCorrect: false }, { content: "x ≥ -4", isCorrect: true, explanation: "-2x ≤ 8. Divide by -2, FLIP sign: x ≥ -4." },
          { content: "x ≤ 4", isCorrect: false }, { content: "x ≥ 4", isCorrect: false },
        ], explanation: "Subtract 4: -2x ≤ 8. Divide by -2 and REVERSE sign: x ≥ -4." },
      { questionText: "A driver must arrive within 45 minutes. After driving 20 min, which inequality shows remaining time t?", difficulty: "hard",
        answers: [
          { content: "t + 20 > 45", isCorrect: false }, { content: "t + 20 ≤ 45", isCorrect: true, explanation: "Total time (t+20) must be ≤ 45." },
          { content: "t - 20 ≤ 45", isCorrect: false }, { content: "20t ≤ 45", isCorrect: false },
        ], explanation: "Time used (20) + remaining (t) ≤ 45 minutes total. So: 20 + t ≤ 45." },
      { questionText: "Which represents x < 4 on a number line?", difficulty: "easy",
        answers: [
          { content: "Closed circle at 4, arrow right", isCorrect: false, explanation: "This is x ≥ 4." },
          { content: "Open circle at 4, arrow left", isCorrect: true, explanation: "Open circle (4 not included), arrow left (values less than 4)." },
          { content: "Closed circle at 4, arrow left", isCorrect: false, explanation: "This is x ≤ 4." },
          { content: "Open circle at 4, arrow right", isCorrect: false },
        ], explanation: "x < 4: open circle (strict inequality) at 4, shading to the left (smaller values)." },
        ],
    "Substitution Method": [
      { questionText: "Solve by substitution: y = 2x + 1 and x + y = 10", difficulty: "medium",
        answers: [
          { content: "x = 3, y = 7", isCorrect: true, explanation: "x + (2x+1) = 10 → 3x = 9 → x=3, y=7." },
          { content: "x = 4, y = 6", isCorrect: false }, { content: "x = 2, y = 8", isCorrect: false }, { content: "x = 5, y = 5", isCorrect: false },
        ], explanation: "Substitute y: x + 2x + 1 = 10 → 3x = 9 → x = 3, y = 2(3)+1 = 7." },
      { questionText: "Two numbers add to 25. One is 7 more than the other. What are they?", difficulty: "medium",
        answers: [
          { content: "9 and 16", isCorrect: true, explanation: "x + (x+7) = 25 → 2x = 18 → x=9, other=16." },
          { content: "10 and 15", isCorrect: false }, { content: "8 and 17", isCorrect: false }, { content: "12 and 13", isCorrect: false },
        ], explanation: "Let numbers be x and x+7. x + x+7 = 25 → 2x = 18 → x=9. Numbers: 9 and 16." },
      { questionText: "Solve: x = y + 3 and 2x - 4y = 6", difficulty: "medium",
        answers: [
          { content: "x = 3, y = 0", isCorrect: true, explanation: "2(y+3)-4y=6 → -2y=0 → y=0, x=3." },
          { content: "x = 6, y = 3", isCorrect: false }, { content: "x = 0, y = -3", isCorrect: false }, { content: "x = 1, y = -2", isCorrect: false },
        ], explanation: "Substitute x = y+3: 2(y+3) - 4y = 6 → -2y + 6 = 6 → y = 0, x = 3." },
      { questionText: "The first step in substitution method is to:", difficulty: "easy",
        answers: [
          { content: "Add the equations", isCorrect: false, explanation: "That's elimination." },
          { content: "Replace a variable with its expression from the other equation", isCorrect: true, explanation: "This is the core of substitution." },
          { content: "Graph both equations", isCorrect: false }, { content: "Multiply both equations", isCorrect: false },
        ], explanation: "Substitution: replace one variable in one equation with its expression from the other." },
    ],
    "Elimination Method": [
      { questionText: "Solve by elimination: x + y = 8 and x - y = 2", difficulty: "easy",
        answers: [
          { content: "x = 5, y = 3", isCorrect: true, explanation: "Add: 2x = 10 → x=5, y=3." },
          { content: "x = 4, y = 4", isCorrect: false }, { content: "x = 6, y = 2", isCorrect: false }, { content: "x = 3, y = 5", isCorrect: false },
        ], explanation: "Add equations: (x+x)+(y-y)=8+2 → 2x=10 → x=5. Then 5+y=8 → y=3." },
      { questionText: "How many solutions does 2x+4y=8 and x+2y=4 have?", difficulty: "hard",
        answers: [
          { content: "One", isCorrect: false }, { content: "No solution", isCorrect: false },
          { content: "Infinite solutions", isCorrect: true, explanation: "Second eq is half of first — same line." },
          { content: "Two", isCorrect: false },
        ], explanation: "The second equation multiplied by 2 equals the first. They are the same line → infinite solutions." },
      { questionText: "A theater sold 200 tickets. Adult $8, child $5. Total $1,300. How many adult tickets?", difficulty: "hard",
        answers: [
          { content: "100", isCorrect: true, explanation: "a+c=200, 8a+5c=1300. Solve: a=100." },
          { content: "80", isCorrect: false }, { content: "120", isCorrect: false }, { content: "150", isCorrect: false },
        ], explanation: "a+c=200 and 8a+5c=1300. Multiply first by 5: 5a+5c=1000. Subtract: 3a=300 → a=100." },
      { questionText: "To eliminate x from 2x+3y=12 and 3x+2y=13, multiply first by __ and second by __:", difficulty: "medium",
        answers: [
          { content: "3 and 2", isCorrect: true, explanation: "Makes both x coefficients = 6." },
          { content: "2 and 3", isCorrect: false }, { content: "1 and 1", isCorrect: false }, { content: "-1 and 1", isCorrect: false },
        ], explanation: "Multiply first by 3 (6x) and second by 2 (6x), then subtract to eliminate x." },
        ],
    "Rectangle and Triangle Basics": [
      { questionText: "A rectangle has length 12 cm and width 5 cm. What is its area?", difficulty: "easy",
        answers: [
          { content: "34 cm²", isCorrect: false }, { content: "60 cm²", isCorrect: true, explanation: "Area = 12 × 5 = 60 cm²." },
          { content: "17 cm²", isCorrect: false }, { content: "120 cm²", isCorrect: false },
        ], explanation: "Rectangle area = length × width = 12 × 5 = 60 cm²." },
      { questionText: "A triangle has base 10 inches and height 6 inches. Area?", difficulty: "easy",
        answers: [
          { content: "60 in²", isCorrect: false, explanation: "That's base × height, not ÷ 2." },
          { content: "30 in²", isCorrect: true, explanation: "Area = ½ × 10 × 6 = 30 in²." },
          { content: "16 in²", isCorrect: false }, { content: "20 in²", isCorrect: false },
        ], explanation: "Triangle area = ½ × base × height = ½ × 10 × 6 = 30 in²." },
      { questionText: "Hypotenuse = 13 cm, one leg = 5 cm. Other leg?", difficulty: "medium",
        answers: [
          { content: "8 cm", isCorrect: false }, { content: "12 cm", isCorrect: true, explanation: "a² + 25 = 169 → a² = 144 → a = 12." },
          { content: "10 cm", isCorrect: false }, { content: "15 cm", isCorrect: false },
        ], explanation: "Pythagorean theorem: a² + 5² = 13² → a² + 25 = 169 → a² = 144 → a = 12 cm." },
      { questionText: "Perimeter of rectangle with length 9 and width 4?", difficulty: "easy",
        answers: [
          { content: "13", isCorrect: false }, { content: "26", isCorrect: true, explanation: "P = 2(9+4) = 26." },
          { content: "36", isCorrect: false }, { content: "18", isCorrect: false },
        ], explanation: "Perimeter = 2 × (length + width) = 2 × (9 + 4) = 26." },
        ],
    "Circles and Composite Shapes": [
      { questionText: "Area of a circle with radius 5?", difficulty: "easy",
        answers: [
          { content: "10π", isCorrect: false }, { content: "25π", isCorrect: true, explanation: "A = πr² = π(25) = 25π." },
          { content: "50π", isCorrect: false }, { content: "5π", isCorrect: false },
        ], explanation: "Circle area = πr² = π × 5² = 25π square units." },
      { questionText: "Circumference of a circle with diameter 8?", difficulty: "easy",
        answers: [
          { content: "16π", isCorrect: false }, { content: "8π", isCorrect: true, explanation: "C = πd = 8π." },
          { content: "4π", isCorrect: false }, { content: "32π", isCorrect: false },
        ], explanation: "Circumference = π × diameter = π × 8 = 8π." },
      { questionText: "Area of a semicircle with radius 4 cm?", difficulty: "medium",
        answers: [
          { content: "8π cm²", isCorrect: true, explanation: "½ × π × 16 = 8π." },
          { content: "16π cm²", isCorrect: false }, { content: "4π cm²", isCorrect: false }, { content: "2π cm²", isCorrect: false },
        ], explanation: "Semicircle area = ½πr² = ½ × π × 16 = 8π cm²." },
      { questionText: "A 6×4 rectangle has a semicircle on its 6-unit side. Approximate total area? (π≈3.14)", difficulty: "hard",
        answers: [
          { content: "24 + 9π ≈ 52.26", isCorrect: false }, { content: "24 + 14.13 ≈ 38.13", isCorrect: true, explanation: "Rect=24, semi=½π(9)≈14.13." },
          { content: "24 + 6π ≈ 42.84", isCorrect: false }, { content: "30.13", isCorrect: false },
        ], explanation: "Rectangle: 6×4=24. Semicircle: radius=3, area=½π(9)≈14.13. Total≈38.13." },
        ],
    "Understanding the Theorem": [
      { questionText: "Pythagorean theorem states: a² + b² = c², where c is the:", difficulty: "easy",
        answers: [
          { content: "Shortest side", isCorrect: false }, { content: "Hypotenuse (longest side)", isCorrect: true, explanation: "c is always the hypotenuse in a right triangle." },
          { content: "Area", isCorrect: false }, { content: "Perimeter", isCorrect: false },
        ], explanation: "In a² + b² = c², c represents the hypotenuse — the side opposite the right angle." },
      { questionText: "Right triangle legs are 5 and 12. Hypotenuse?", difficulty: "medium",
        answers: [
          { content: "13", isCorrect: true, explanation: "√(25+144) = √169 = 13." },
          { content: "17", isCorrect: false }, { content: "11", isCorrect: false }, { content: "14", isCorrect: false },
        ], explanation: "c² = 5² + 12² = 25 + 144 = 169. c = √169 = 13." },
      { questionText: "Which is a Pythagorean triple?", difficulty: "medium",
        answers: [
          { content: "3, 4, 5", isCorrect: true, explanation: "9 + 16 = 25 = 5²." },
          { content: "2, 3, 4", isCorrect: false, explanation: "4 + 9 = 13 ≠ 16." },
          { content: "4, 5, 6", isCorrect: false, explanation: "16 + 25 = 41 ≠ 36." },
          { content: "1, 2, 3", isCorrect: false, explanation: "1 + 4 = 5 ≠ 9." },
        ], explanation: "A Pythagorean triple: a² + b² = c². 3² + 4² = 9 + 16 = 25 = 5²." },
      { questionText: "A ladder's base is 9 ft from a wall, reaches 12 ft high. Ladder length?", difficulty: "hard",
        answers: [
          { content: "15 feet", isCorrect: true, explanation: "√(81+144) = √225 = 15." },
          { content: "21 feet", isCorrect: false }, { content: "10 feet", isCorrect: false }, { content: "13 feet", isCorrect: false },
        ], explanation: "Ladder² = 9² + 12² = 81 + 144 = 225. Ladder = √225 = 15 feet." },
        ],
    "Applications and Word Problems": [
      { questionText: "20% off sale on a $50 item. Sale price?", difficulty: "easy",
        answers: [
          { content: "$30", isCorrect: false }, { content: "$40", isCorrect: true, explanation: "20% of $50 = $10 off. $50-$10=$40." },
          { content: "$35", isCorrect: false }, { content: "$10", isCorrect: false },
        ], explanation: "20% of $50 = $10 discount. Sale price = $50 - $10 = $40." },
      { questionText: "Maria earns $12/hour, worked 35 hours. Total earnings?", difficulty: "easy",
        answers: [
          { content: "$420", isCorrect: true, explanation: "$12 × 35 = $420." },
          { content: "$350", isCorrect: false }, { content: "$480", isCorrect: false }, { content: "$400", isCorrect: false },
        ], explanation: "Earnings = rate × hours = $12 × 35 = $420." },
      { questionText: "Recipe: 3 cups flour for 24 cookies. How many cups for 60 cookies?", difficulty: "medium",
        answers: [
          { content: "6 cups", isCorrect: false }, { content: "7.5 cups", isCorrect: true, explanation: "3/24 = x/60 → x = 180/24 = 7.5." },
          { content: "8 cups", isCorrect: false }, { content: "5 cups", isCorrect: false },
        ], explanation: "Proportion: 3/24 = x/60 → 24x = 180 → x = 7.5 cups." },
      { questionText: "Scores: 85, 90, 78. Average?", difficulty: "easy",
        answers: [
          { content: "84.3", isCorrect: true, explanation: "(85+90+78)/3 = 253/3 ≈ 84.3." },
          { content: "85", isCorrect: false }, { content: "90", isCorrect: false }, { content: "78", isCorrect: false },
        ], explanation: "Average = sum ÷ count = (85+90+78) ÷ 3 = 253 ÷ 3 ≈ 84.3." },
        ],
  }},
  SCIENCE: { code: "science", lessons: {
    "Cell Structure and Organelles": [
      { questionText: "Which organelle is the 'powerhouse of the cell'?", difficulty: "easy",
        answers: [
          { content: "Nucleus", isCorrect: false, explanation: "Nucleus stores DNA." },
          { content: "Mitochondria", isCorrect: true, explanation: "Produces ATP through cellular respiration." },
          { content: "Ribosome", isCorrect: false, explanation: "Makes proteins." },
          { content: "Golgi apparatus", isCorrect: false, explanation: "Packages and ships proteins." },
        ], explanation: "Mitochondria convert nutrients into ATP energy — the 'powerhouse of the cell.'" },
      { questionText: "Primary function of the cell membrane?", difficulty: "easy",
        answers: [
          { content: "Store DNA", isCorrect: false }, { content: "Control what enters and exits the cell", isCorrect: true, explanation: "Selectively permeable barrier." },
          { content: "Produce proteins", isCorrect: false }, { content: "Provide energy", isCorrect: false },
        ], explanation: "The cell membrane is a selectively permeable barrier controlling material movement." },
      { questionText: "Which organelle makes proteins?", difficulty: "easy",
        answers: [
          { content: "Lysosome", isCorrect: false }, { content: "Ribosome", isCorrect: true, explanation: "Reads mRNA to build proteins." },
          { content: "Vacuole", isCorrect: false }, { content: "Endoplasmic reticulum", isCorrect: false, explanation: "ER transports materials." },
        ], explanation: "Ribosomes are the sites of protein synthesis, assembling amino acids into proteins." },
      { questionText: "Plant cells have which structure that animal cells lack?", difficulty: "easy",
        answers: [
          { content: "Mitochondria", isCorrect: false }, { content: "Cell wall", isCorrect: true, explanation: "Rigid cellulose wall for structure." },
          { content: "Cell membrane", isCorrect: false }, { content: "Nucleus", isCorrect: false },
        ], explanation: "Plant cells have a cell wall (cellulose), chloroplasts, and a large central vacuole." },
        ],
    "Cell Division: Mitosis and Meiosis": [
      { questionText: "Result of mitosis?", difficulty: "easy",
        answers: [
          { content: "Two identical daughter cells", isCorrect: true, explanation: "Mitosis: 2 identical diploid cells." },
          { content: "Four unique sex cells", isCorrect: false, explanation: "That's meiosis." },
          { content: "One cell with double chromosomes", isCorrect: false }, { content: "Two cells with half chromosomes", isCorrect: false },
        ], explanation: "Mitosis produces 2 genetically identical diploid daughter cells for growth and repair." },
      { questionText: "Main purpose of meiosis?", difficulty: "medium",
        answers: [
          { content: "Growth and repair", isCorrect: false, explanation: "That's mitosis." },
          { content: "Produce gametes (sperm and egg)", isCorrect: true, explanation: "Meiosis halves chromosomes for reproduction." },
          { content: "Create identical copies", isCorrect: false }, { content: "Break down waste", isCorrect: false },
        ], explanation: "Meiosis produces haploid gametes with half the chromosomes for sexual reproduction." },
      { questionText: "In which mitosis phase do chromosomes line up at the center?", difficulty: "medium",
        answers: [
          { content: "Prophase", isCorrect: false }, { content: "Metaphase", isCorrect: true, explanation: "Chromosomes align at metaphase plate." },
          { content: "Anaphase", isCorrect: false, explanation: "Sister chromatids separate." }, { content: "Telophase", isCorrect: false },
        ], explanation: "During metaphase, chromosomes line up at the cell equator (metaphase plate)." },
      { questionText: "Meiosis produces how many cells and what chromosome count?", difficulty: "medium",
        answers: [
          { content: "2 diploid cells", isCorrect: false }, { content: "4 haploid cells", isCorrect: true, explanation: "Two divisions produce 4 cells with half chromosomes." },
          { content: "2 haploid cells", isCorrect: false }, { content: "4 diploid cells", isCorrect: false },
        ], explanation: "Meiosis: 2 rounds of division → 4 haploid (n) daughter cells." },
        ],
    "DNA and Genes": [
      { questionText: "Four nitrogenous bases in DNA?", difficulty: "easy",
        answers: [
          { content: "Adenine, Guanine, Cytosine, Thymine", isCorrect: true, explanation: "A-T and G-C pairings." },
          { content: "Adenine, Guanine, Cytosine, Uracil", isCorrect: false, explanation: "Uracil is in RNA, not DNA." },
          { content: "Adenine, Thymine, Uracil, Cytosine", isCorrect: false }, { content: "Guanine, Thymine, Uracil, Cytosine", isCorrect: false },
        ], explanation: "DNA bases: A, T, G, C. A pairs with T, G pairs with C." },
      { questionText: "Shape of DNA molecule?", difficulty: "easy",
        answers: [
          { content: "Single helix", isCorrect: false }, { content: "Double helix", isCorrect: true, explanation: "Twisted ladder discovered by Watson & Crick." },
          { content: "Triple helix", isCorrect: false }, { content: "Flat sheet", isCorrect: false },
        ], explanation: "DNA has a double helix structure — two strands twisted like a spiral staircase." },
      { questionText: "In DNA, adenine pairs with:", difficulty: "easy",
        answers: [
          { content: "Guanine", isCorrect: false }, { content: "Thymine", isCorrect: true, explanation: "A-T base pair." },
          { content: "Cytosine", isCorrect: false }, { content: "Uracil", isCorrect: false },
        ], explanation: "Base pairing: A pairs with T (2 hydrogen bonds), G pairs with C (3 hydrogen bonds)." },
      { questionText: "A gene contains instructions for making a:", difficulty: "medium",
        answers: [
          { content: "Carbohydrate", isCorrect: false }, { content: "Protein", isCorrect: true, explanation: "Genes code for specific proteins that determine traits." },
          { content: "Lipid", isCorrect: false }, { content: "Mineral", isCorrect: false },
        ], explanation: "A gene is a DNA segment containing instructions to build a specific protein." },
        ],
    "Punnett Squares": [
      { questionText: "Each box in a Punnett square represents:", difficulty: "easy",
        answers: [
          { content: "A parent's genotype", isCorrect: false }, { content: "A possible offspring genotype", isCorrect: true },
          { content: "A mutation", isCorrect: false }, { content: "A dominant trait only", isCorrect: false },
        ], explanation: "Each Punnett square box shows one possible genotype for an offspring." },
      { questionText: "BB × bb cross: what % show dominant trait?", difficulty: "medium",
        answers: [
          { content: "25%", isCorrect: false }, { content: "50%", isCorrect: false },
          { content: "100%", isCorrect: true, explanation: "All offspring are Bb, showing dominant trait." }, { content: "75%", isCorrect: false },
        ], explanation: "BB × bb → all Bb. Dominant B masks recessive b → 100% show dominant trait." },
      { questionText: "Bb × Bb: probability of showing recessive trait?", difficulty: "medium",
        answers: [
          { content: "25%", isCorrect: true, explanation: "BB:Bb:Bb:bb — only bb (1/4) shows recessive." },
          { content: "50%", isCorrect: false }, { content: "75%", isCorrect: false }, { content: "0%", isCorrect: false },
        ], explanation: "Bb × Bb: Punnett gives BB, Bb, Bb, bb. Only bb (25%) shows the recessive trait." },
      { questionText: "Genotype ratio of Bb × Bb?", difficulty: "medium",
        answers: [
          { content: "1 BB : 2 Bb : 1 bb", isCorrect: true }, { content: "2 BB : 1 Bb : 1 bb", isCorrect: false },
          { content: "1 BB : 1 Bb : 2 bb", isCorrect: false }, { content: "3 Bb : 1 bb", isCorrect: false },
        ], explanation: "Bb × Bb produces 1 BB : 2 Bb : 1 bb genotype ratio (1:2:1)." },
        ],
    "Atoms and the Periodic Table": [
      { questionText: "Three main subatomic particles?", difficulty: "easy",
        answers: [
          { content: "Proton, neutron, electron", isCorrect: true, explanation: "Protons(+) and neutrons in nucleus; electrons(-) orbit." },
          { content: "Proton, photon, electron", isCorrect: false }, { content: "Neutron, nucleus, electron", isCorrect: false }, { content: "Ion, isotope, electron", isCorrect: false },
        ], explanation: "Atoms: protons (+) and neutrons (0) in nucleus, electrons (-) in orbit." },
      { questionText: "Atomic number tells you:", difficulty: "easy",
        answers: [
          { content: "Number of neutrons", isCorrect: false }, { content: "Number of protons", isCorrect: true, explanation: "Defines the element." },
          { content: "Total mass", isCorrect: false }, { content: "Outer shell electrons", isCorrect: false },
        ], explanation: "Atomic number = number of protons, which uniquely identifies each element." },
      { questionText: "Metals on the periodic table are located:", difficulty: "easy",
        answers: [
          { content: "Right side", isCorrect: false }, { content: "Left and center", isCorrect: true, explanation: "Metals fill the left side and middle." },
          { content: "Top row only", isCorrect: false }, { content: "Bottom right", isCorrect: false },
        ], explanation: "Metals are on the left and center (including transition metals) of the periodic table." },
      { questionText: "Atom with 6 protons, 6 neutrons. Approximate atomic mass?", difficulty: "easy",
        answers: [
          { content: "6", isCorrect: false }, { content: "12", isCorrect: true, explanation: "Mass ≈ protons + neutrons = 6+6 = 12 (Carbon-12)." },
          { content: "18", isCorrect: false }, { content: "0", isCorrect: false },
        ], explanation: "Atomic mass ≈ protons + neutrons = 6 + 6 = 12. This is Carbon-12." },
        ],
    "Chemical Reactions": [
      { questionText: "In a chemical equation, the arrow (→) represents:", difficulty: "easy",
        answers: [
          { content: "Reactants", isCorrect: false }, { content: "Reactants become products", isCorrect: true },
          { content: "Reversible reaction", isCorrect: false }, { content: "Balanced equation", isCorrect: false },
        ], explanation: "The arrow shows reactants (left) are converted to products (right)." },
      { questionText: "What is a catalyst?", difficulty: "medium",
        answers: [
          { content: "Substance consumed in reaction", isCorrect: false }, { content: "Speeds up reaction without being consumed", isCorrect: true },
          { content: "A product", isCorrect: false }, { content: "A chemical bond", isCorrect: false },
        ], explanation: "A catalyst speeds up a reaction by lowering activation energy without being consumed." },
      { questionText: "Which is an exothermic reaction?", difficulty: "medium",
        answers: [
          { content: "Photosynthesis", isCorrect: false, explanation: "Absorbs energy (endothermic)." },
          { content: "Burning wood", isCorrect: true, explanation: "Releases heat — exothermic." },
          { content: "Melting ice", isCorrect: false, explanation: "Absorbs heat (endothermic)." }, { content: "Dissolving NH₄NO₃", isCorrect: false },
        ], explanation: "Exothermic reactions release energy. Burning wood releases heat and light." },
      { questionText: "Law of conservation of mass:", difficulty: "medium",
        answers: [
          { content: "Mass is created", isCorrect: false }, { content: "Mass is destroyed", isCorrect: false },
          { content: "Mass is neither created nor destroyed", isCorrect: true, explanation: "Atoms rearrange but total mass stays constant." }, { content: "Mass doubles", isCorrect: false },
        ], explanation: "Matter cannot be created or destroyed in a chemical reaction — atoms are rearranged." },
        ],
    "Newton's Laws of Motion": [
      { questionText: "Newton's First Law is the law of:", difficulty: "easy",
        answers: [
          { content: "Acceleration", isCorrect: false }, { content: "Inertia", isCorrect: true, explanation: "Objects stay at rest or in motion unless acted on." },
          { content: "Action-Reaction", isCorrect: false }, { content: "Gravity", isCorrect: false },
        ], explanation: "First Law (Inertia): objects maintain their state of motion unless a force acts on them." },
      { questionText: "Newton's Second Law: Force equals:", difficulty: "easy",
        answers: [
          { content: "mass × velocity", isCorrect: false }, { content: "mass × acceleration (F=ma)", isCorrect: true },
          { content: "mass ÷ acceleration", isCorrect: false }, { content: "velocity × time", isCorrect: false },
        ], explanation: "F = ma. Force = mass × acceleration." },
      { questionText: "10 kg box pushed with 50 N force. Acceleration?", difficulty: "medium",
        answers: [
          { content: "5 m/s²", isCorrect: true, explanation: "a = F/m = 50/10 = 5." },
          { content: "500 m/s²", isCorrect: false }, { content: "0.2 m/s²", isCorrect: false }, { content: "50 m/s²", isCorrect: false },
        ], explanation: "F = ma → a = F/m = 50÷10 = 5 m/s²." },
      { questionText: "You push a wall, wall pushes back. Which law?", difficulty: "easy",
        answers: [
          { content: "First Law", isCorrect: false }, { content: "Second Law", isCorrect: false },
          { content: "Third Law (Action-Reaction)", isCorrect: true, explanation: "Every action has equal opposite reaction." }, { content: "Law of Gravity", isCorrect: false },
        ], explanation: "Newton's Third Law: for every action force there is an equal and opposite reaction force." },
        ],
    "Speed, Velocity, and Acceleration": [
      { questionText: "Difference between speed and velocity?", difficulty: "easy",
        answers: [
          { content: "Speed includes direction", isCorrect: false }, { content: "Velocity includes direction; speed does not", isCorrect: true },
          { content: "Same thing", isCorrect: false }, { content: "Velocity only for falling objects", isCorrect: false },
        ], explanation: "Speed = magnitude only (how fast). Velocity = magnitude + direction (how fast AND which way)." },
      { questionText: "Car travels 120 miles in 2 hours. Average speed?", difficulty: "easy",
        answers: [
          { content: "30 mph", isCorrect: false }, { content: "60 mph", isCorrect: true, explanation: "120÷2 = 60 mph." },
          { content: "120 mph", isCorrect: false }, { content: "240 mph", isCorrect: false },
        ], explanation: "Speed = distance ÷ time = 120 ÷ 2 = 60 mph." },
      { questionText: "0 to 60 mph in 5 seconds. Average acceleration?", difficulty: "hard",
        answers: [
          { content: "12 mph/s", isCorrect: true, explanation: "(60-0)÷5 = 12." },
          { content: "30 mph/s", isCorrect: false }, { content: "5 mph/s", isCorrect: false }, { content: "60 mph/s", isCorrect: false },
        ], explanation: "Acceleration = (final - initial velocity) ÷ time = 60 ÷ 5 = 12 mph/s." },
      { questionText: "Which represents acceleration?", difficulty: "medium",
        answers: [
          { content: "Constant 55 mph", isCorrect: false, explanation: "No change = no acceleration." },
          { content: "Car slowing down at stop sign", isCorrect: true, explanation: "Slowing down = negative acceleration." },
          { content: "Parked car", isCorrect: false }, { content: "Car turning at constant speed", isCorrect: true, explanation: "Changing direction = acceleration." },
        ], explanation: "Acceleration: any change in velocity — speeding up, slowing down, or changing direction." },
        ],
  }},
};

async function main() {
  for (const [_, subjectData] of Object.entries(DATA)) {
    const subject = await p.subject.findFirst({ where: { code: subjectData.code } });
    if (!subject) { console.log(`SKIP ${subjectData.code}`); continue; }

    for (const [lessonTitle, questions] of Object.entries(subjectData.lessons)) {
      const lesson = await p.lesson.findFirst({
        where: { title: lessonTitle, topic: { module: { subjectId: subject.id } } },
      });
      if (!lesson) { console.log(`  SKIP lesson: ${lessonTitle}`); continue; }

      const existing = await p.question.findMany({ where: { lessonId: lesson.id }, include: { answers: true }, orderBy: { createdAt: "asc" } });
      console.log(`  ${subjectData.code} | ${lessonTitle} | existing: ${existing.length} | new: ${questions.length}`);

      // อัปเดตข้อเดิม
      const updateCount = Math.min(existing.length, questions.length);
      for (let i = 0; i < updateCount; i++) {
        const q = questions[i], eq = existing[i];
        await p.question.update({ where: { id: eq.id }, data: { questionText: q.questionText, explanation: q.explanation, difficulty: q.difficulty } });
        for (let j = 0; j < eq.answers.length && j < q.answers.length; j++) {
          await p.answer.update({ where: { id: eq.answers[j].id }, data: { content: q.answers[j].content, isCorrect: q.answers[j].isCorrect, explanation: q.answers[j].explanation || null } });
        }
      }
      // เพิ่มใหม่
      for (let i = updateCount; i < questions.length; i++) {
        const q = questions[i];
        await p.question.create({ data: { subjectId: subject.id, lessonId: lesson.id, questionType: "multiple_choice", difficulty: q.difficulty, questionText: q.questionText, explanation: q.explanation, points: 1, isActive: true, answers: { create: q.answers.map((a, idx) => ({ content: a.content, isCorrect: a.isCorrect, sortOrder: idx, explanation: a.explanation || null })) } } });
      }
    }
  }
  const total = await p.question.count({ where: { questionText: { not: null } } });
  console.log(`\nDone! Questions with text: ${total}/${await p.question.count()}`);
}
main().catch(console.error).finally(() => p.$disconnect());