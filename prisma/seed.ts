import { PrismaClient } from "@prisma/client";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");
import { EXTRA_QUESTIONS } from "./extra-questions";

const prisma = new PrismaClient();

const SUBJECTS = [
  {
    code: "math",
    title: "Mathematical Reasoning",
    description:
      "Algebraic problem solving, quantitative reasoning, data analysis, and geometry concepts tested on the GED.",
    iconUrl: "/icons/math.svg",
    colorHex: "#10B981",
    sortOrder: 0,
    modules: [
      {
        title: "Algebraic Foundations",
        description: "Linear equations, inequalities, and algebraic expressions.",
        estimatedHours: 8.5,
        sortOrder: 0,
        topics: [
          {
            title: "Solving Linear Equations",
            description:
              "Master one-variable linear equations and systems of equations.",
            sortOrder: 0,
            lessons: [
              {
                title: "What is a Linear Equation?",
                slug: "what-is-linear-equation",
                contentType: "mixed",
                durationMinutes: 12,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "What is a Linear Equation?",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "A <strong>linear equation</strong> is an algebraic equation of degree one. The highest power of any variable is 1. The general form is <strong>ax + b = c</strong>, where a, b, and c are constants.",
                  },
                  {
                    id: "blk_003",
                    block_type: "callout",
                    callout: {
                      variant: "formula",
                      title: "Standard Form",
                      body: "ax + b = c  \u2192  x = (c \u2212 b) / a",
                    },
                  },
                  {
                    id: "blk_004",
                    block_type: "numbered_list",
                    items: [
                      "<strong>Isolate the variable term</strong> \u2014 Move all terms with x to one side.",
                      "<strong>Isolate the constant</strong> \u2014 Move constants to the other side.",
                      "<strong>Solve for x</strong> \u2014 Divide both sides by the coefficient of x.",
                      "<strong>Check your answer</strong> \u2014 Substitute back into the original equation.",
                    ],
                  },
                  {
                    id: "blk_005",
                    block_type: "callout",
                    callout: {
                      variant: "tip",
                      title: "GED Tip",
                      body: "Always check your answer by plugging it back into the original equation. This catches sign errors and arithmetic mistakes.",
                    },
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "easy",
                    explanation:
                      "Subtract 7 from both sides to get 3x = 15, then divide by 3.",
                    hintText: "Isolate x on one side of the equation.",
                    tags: JSON.stringify([
                      "algebra",
                      "linear-equation",
                      "solving",
                    ]),
                    answers: [
                      {
                        content: "5",
                        isCorrect: true,
                        sortOrder: 0,
                      },
                      { content: "4", isCorrect: false, sortOrder: 1 },
                      { content: "6", isCorrect: false, sortOrder: 2 },
                      { content: "7", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    explanation:
                      "Subtract 4: 2(x+4) = 18 \u2192 x+4 = 9 \u2192 x = 5.",
                    hintText: "First distribute or divide both sides by 2.",
                    tags: JSON.stringify([
                      "algebra",
                      "distributive-property",
                    ]),
                    answers: [
                      { content: "3", isCorrect: false, sortOrder: 0 },
                      {
                        content: "5",
                        isCorrect: true,
                        sortOrder: 1,
                      },
                      { content: "7", isCorrect: false, sortOrder: 2 },
                      { content: "9", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
              {
                title: "Solving Inequalities",
                slug: "solving-inequalities",
                contentType: "text",
                durationMinutes: 15,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "Solving Inequalities",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "Inequalities use symbols like &lt;, &gt;, \u2264, \u2265 instead of =. Solving them is similar to equations, but <strong>flip the inequality sign when multiplying or dividing by a negative number</strong>.",
                  },
                  {
                    id: "blk_003",
                    block_type: "callout",
                    callout: {
                      variant: "warning",
                      title: "Common Mistake",
                      body: "Forgetting to flip the sign when dividing by a negative: \u22122x > 6 becomes x < \u22123, NOT x > \u22123.",
                    },
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "easy",
                    explanation:
                      "Divide both sides by -2 and flip the sign: x < 5.",
                    tags: JSON.stringify(["inequality", "flip-sign"]),
                    answers: [
                      { content: "x > 5", isCorrect: false, sortOrder: 0 },
                      {
                        content: "x < 5",
                        isCorrect: true,
                        sortOrder: 1,
                      },
                      {
                        content: "x < -5",
                        isCorrect: false,
                        sortOrder: 2,
                      },
                      { content: "x > -5", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    explanation:
                      "Add 3 to both sides: 3x \u2264 12, then divide by 3: x \u2264 4.",
                    tags: JSON.stringify([
                      "inequality",
                      "compound-inequality",
                    ]),
                    answers: [
                      {
                        content: "x \u2264 4",
                        isCorrect: true,
                        sortOrder: 0,
                      },
                      {
                        content: "x \u2265 4",
                        isCorrect: false,
                        sortOrder: 1,
                      },
                      {
                        content: "x < 4",
                        isCorrect: false,
                        sortOrder: 2,
                      },
                      {
                        content: "x > 4",
                        isCorrect: false,
                        sortOrder: 3,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title: "Systems of Equations",
            description:
              "Solve pairs of linear equations using substitution and elimination.",
            sortOrder: 1,
            lessons: [
              {
                title: "Substitution Method",
                slug: "substitution-method",
                contentType: "text",
                durationMinutes: 18,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "The Substitution Method",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "Substitution solves one equation for a variable, then substitutes into the other equation. This is especially useful when one equation already has a variable isolated.",
                  },
                  {
                    id: "blk_003",
                    block_type: "callout",
                    callout: {
                      variant: "example",
                      title: "Example: y = 2x + 1 and x + y = 10",
                      body: "Substitute: x + (2x+1) = 10 \u2192 3x = 9 \u2192 x = 3, y = 7",
                    },
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    explanation:
                      "Substitute x=3 into y=2x+1: y=7. Check: 3+7=10.",
                    tags: JSON.stringify(["systems", "substitution"]),
                    answers: [
                      { content: "(2, 5)", isCorrect: false, sortOrder: 0 },
                      {
                        content: "(3, 7)",
                        isCorrect: true,
                        sortOrder: 1,
                      },
                      {
                        content: "(4, 6)",
                        isCorrect: false,
                        sortOrder: 2,
                      },
                      {
                        content: "(1, 9)",
                        isCorrect: false,
                        sortOrder: 3,
                      },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "hard",
                    explanation:
                      "3(3) + 2y = 13 \u2192 9 + 2y = 13 \u2192 y = 2.",
                    tags: JSON.stringify([
                      "systems",
                      "substitution",
                      "fractions",
                    ]),
                    answers: [
                      { content: "y = 1", isCorrect: false, sortOrder: 0 },
                      {
                        content: "y = 2",
                        isCorrect: true,
                        sortOrder: 1,
                      },
                      { content: "y = 3", isCorrect: false, sortOrder: 2 },
                      { content: "y = 4", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
              {
                title: "Elimination Method",
                slug: "elimination-method",
                contentType: "text",
                durationMinutes: 18,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "The Elimination Method",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "Elimination adds or subtracts equations to cancel out one variable, making it easy to solve for the remaining variable.",
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    tags: JSON.stringify(["systems", "elimination"]),
                    answers: [
                      { content: "(3, 1)", isCorrect: true, sortOrder: 0 },
                      { content: "(1, 3)", isCorrect: false, sortOrder: 1 },
                      { content: "(2, 2)", isCorrect: false, sortOrder: 2 },
                      { content: "(4, 0)", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "hard",
                    tags: JSON.stringify(["systems", "no-solution"]),
                    answers: [
                      { content: "One solution", isCorrect: false, sortOrder: 0 },
                      { content: "No solution", isCorrect: true, sortOrder: 1 },
                      { content: "Infinite solutions", isCorrect: false, sortOrder: 2 },
                      { content: "Two solutions", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Geometry and Measurement",
        description:
          "Area, perimeter, volume, angles, and the Pythagorean theorem.",
        estimatedHours: 7.0,
        sortOrder: 1,
        topics: [
          {
            title: "Perimeter and Area",
            description: "Calculate perimeter and area of 2D shapes.",
            sortOrder: 0,
            lessons: [
              {
                title: "Rectangle and Triangle Basics",
                slug: "rectangle-triangle-basics",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "Rectangle and Triangle Basics",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "A rectangle has perimeter = 2(l+w) and area = l\u00d7w. A triangle has area = \u00bd \u00d7 base \u00d7 height.",
                  },
                  {
                    id: "blk_003",
                    block_type: "callout",
                    callout: {
                      variant: "formula",
                      title: "Key Formulas",
                      body: "Rectangle: P = 2(l+w), A = lw\nTriangle: A = \u00bdbh\nCircle: C = 2\u03c0r, A = \u03c0r\u00b2",
                    },
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "easy",
                    tags: JSON.stringify([
                      "geometry",
                      "rectangle",
                      "area",
                    ]),
                    answers: [
                      { content: "30", isCorrect: true, sortOrder: 0 },
                      { content: "35", isCorrect: false, sortOrder: 1 },
                      { content: "40", isCorrect: false, sortOrder: 2 },
                      { content: "50", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "easy",
                    tags: JSON.stringify([
                      "geometry",
                      "triangle",
                      "area",
                    ]),
                    answers: [
                      { content: "12", isCorrect: true, sortOrder: 0 },
                      { content: "24", isCorrect: false, sortOrder: 1 },
                      { content: "10", isCorrect: false, sortOrder: 2 },
                      { content: "6", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
              {
                title: "Circles and Composite Shapes",
                slug: "circles-composite-shapes",
                contentType: "text",
                durationMinutes: 16,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "Circles and Composite Shapes",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "A circle has circumference C = 2\u03c0r and area A = \u03c0r\u00b2. Composite shapes can be broken into simpler shapes.",
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    tags: JSON.stringify(["geometry", "circle", "circumference"]),
                    answers: [
                      { content: "10\u03c0", isCorrect: true, sortOrder: 0 },
                      { content: "20\u03c0", isCorrect: false, sortOrder: 1 },
                      { content: "5\u03c0", isCorrect: false, sortOrder: 2 },
                      { content: "25\u03c0", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    tags: JSON.stringify(["geometry", "circle", "area"]),
                    answers: [
                      { content: "16\u03c0", isCorrect: true, sortOrder: 0 },
                      { content: "8\u03c0", isCorrect: false, sortOrder: 1 },
                      { content: "4\u03c0", isCorrect: false, sortOrder: 2 },
                      { content: "32\u03c0", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
            ],
          },
          {
            title: "The Pythagorean Theorem",
            description: "Apply a\u00b2 + b\u00b2 = c\u00b2 to right triangles.",
            sortOrder: 1,
            lessons: [
              {
                title: "Understanding the Theorem",
                slug: "pythagorean-theorem-intro",
                contentType: "mixed",
                durationMinutes: 15,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "The Pythagorean Theorem",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      'In a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides: <strong>a\u00b2 + b\u00b2 = c\u00b2</strong>, where c is the hypotenuse (longest side, opposite the right angle).',
                  },
                  {
                    id: "blk_003",
                    block_type: "callout",
                    callout: {
                      variant: "remember",
                      title: "Key Fact",
                      body: "The theorem ONLY works for right triangles. Common Pythagorean triples: (3,4,5), (5,12,13), (8,15,17).",
                    },
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "easy",
                    tags: JSON.stringify([
                      "geometry",
                      "pythagorean",
                      "right-triangle",
                    ]),
                    answers: [
                      { content: "13", isCorrect: true, sortOrder: 0 },
                      { content: "12", isCorrect: false, sortOrder: 1 },
                      { content: "14", isCorrect: false, sortOrder: 2 },
                      { content: "15", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "medium",
                    tags: JSON.stringify([
                      "geometry",
                      "pythagorean",
                      "find-leg",
                    ]),
                    answers: [
                      { content: "8", isCorrect: false, sortOrder: 0 },
                      { content: "9", isCorrect: true, sortOrder: 1 },
                      { content: "12", isCorrect: false, sortOrder: 2 },
                      { content: "15", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
              {
                title: "Applications and Word Problems",
                slug: "pythagorean-applications",
                contentType: "text",
                durationMinutes: 20,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  {
                    id: "blk_001",
                    block_type: "heading",
                    content: "Real-World Applications",
                    level: 2,
                  },
                  {
                    id: "blk_002",
                    block_type: "paragraph",
                    content:
                      "The Pythagorean theorem is used in construction, navigation, and many real-world measurement problems. On the GED, you will often see it in word problem format.",
                  },
                ]),
                questions: [
                  {
                    questionType: "multiple_choice",
                    difficulty: "hard",
                    tags: JSON.stringify([
                      "geometry",
                      "pythagorean",
                      "word-problem",
                    ]),
                    answers: [
                      { content: "17 feet", isCorrect: true, sortOrder: 0 },
                      { content: "20 feet", isCorrect: false, sortOrder: 1 },
                      { content: "15 feet", isCorrect: false, sortOrder: 2 },
                      { content: "25 feet", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                  {
                    questionType: "multiple_choice",
                    difficulty: "hard",
                    tags: JSON.stringify([
                      "geometry",
                      "pythagorean",
                      "diagonal",
                    ]),
                    answers: [
                      { content: "10\u221a2", isCorrect: true, sortOrder: 0 },
                      { content: "20", isCorrect: false, sortOrder: 1 },
                      { content: "14", isCorrect: false, sortOrder: 2 },
                      { content: "10\u221a3", isCorrect: false, sortOrder: 3 },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "science",
    title: "Science",
    description:
      "Life science, physical science, earth and space science concepts for the GED.",
    iconUrl: "/icons/science.svg",
    colorHex: "#F59E0B",
    sortOrder: 1,
    modules: [
      {
        title: "Life Science",
        description: "Cell biology, genetics, evolution, and human body systems.",
        estimatedHours: 7.0,
        sortOrder: 0,
        topics: [
          {
            title: "Cell Biology",
            description: "Cell structure, organelles, and cell processes.",
            sortOrder: 0,
            lessons: [
              {
                title: "Cell Structure and Organelles",
                slug: "cell-structure-organelles",
                contentType: "text",
                durationMinutes: 16,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Cell Structure", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "All living things are made of cells. Prokaryotic cells (bacteria) lack a nucleus, while eukaryotic cells (plants, animals) have a nucleus and membrane-bound organelles." },
                  { id: "b3", block_type: "callout", callout: { variant: "info", title: "Key Organelles", body: "Mitochondria: energy production (ATP)\nRibosomes: protein synthesis\nNucleus: contains DNA\nCell membrane: controls what enters/exits" } },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["biology", "cell", "organelle"]), answers: [
                    { content: "Mitochondria", isCorrect: true, sortOrder: 0 },
                    { content: "Ribosome", isCorrect: false, sortOrder: 1 },
                    { content: "Nucleus", isCorrect: false, sortOrder: 2 },
                    { content: "Cell wall", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["biology", "prokaryotic", "eukaryotic"]), answers: [
                    { content: "They have a nucleus", isCorrect: false, sortOrder: 0 },
                    { content: "They lack membrane-bound organelles", isCorrect: true, sortOrder: 1 },
                    { content: "They are larger", isCorrect: false, sortOrder: 2 },
                    { content: "They contain DNA", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Cell Division: Mitosis and Meiosis",
                slug: "cell-division-mitosis-meiosis",
                contentType: "text",
                durationMinutes: 18,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Cell Division", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Mitosis produces two identical diploid cells for growth and repair. Meiosis produces four unique haploid cells for reproduction (sperm and egg)." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["biology", "mitosis"]), answers: [
                    { content: "2 identical diploid cells", isCorrect: true, sortOrder: 0 },
                    { content: "4 unique haploid cells", isCorrect: false, sortOrder: 1 },
                    { content: "2 unique haploid cells", isCorrect: false, sortOrder: 2 },
                    { content: "4 identical diploid cells", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["biology", "meiosis"]), answers: [
                    { content: "Growth and repair", isCorrect: false, sortOrder: 0 },
                    { content: "Sexual reproduction", isCorrect: true, sortOrder: 1 },
                    { content: "Asexual reproduction", isCorrect: false, sortOrder: 2 },
                    { content: "Protein synthesis", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
          {
            title: "Genetics and Heredity",
            description: "DNA, genes, alleles, and Punnett squares.",
            sortOrder: 1,
            lessons: [
              {
                title: "DNA and Genes",
                slug: "dna-and-genes",
                contentType: "text",
                durationMinutes: 15,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "DNA and Genes", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "DNA (deoxyribonucleic acid) is a double helix that carries genetic instructions. Genes are segments of DNA that code for specific proteins. Alleles are different versions of a gene." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["genetics", "DNA"]), answers: [
                    { content: "Double helix", isCorrect: true, sortOrder: 0 },
                    { content: "Single strand", isCorrect: false, sortOrder: 1 },
                    { content: "Triple helix", isCorrect: false, sortOrder: 2 },
                    { content: "Circular ring", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["genetics", "allele"]), answers: [
                    { content: "Different versions of the same gene", isCorrect: true, sortOrder: 0 },
                    { content: "Different genes on different chromosomes", isCorrect: false, sortOrder: 1 },
                    { content: "Mutated DNA sequences only", isCorrect: false, sortOrder: 2 },
                    { content: "Proteins that build cells", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Punnett Squares",
                slug: "punnett-squares",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Punnett Squares", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "A Punnett square predicts the probability of offspring genotypes from parental crosses. Dominant alleles (uppercase) mask recessive alleles (lowercase)." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["genetics", "punnett-square"]), answers: [
                    { content: "25%", isCorrect: true, sortOrder: 0 },
                    { content: "50%", isCorrect: false, sortOrder: 1 },
                    { content: "75%", isCorrect: false, sortOrder: 2 },
                    { content: "100%", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "hard", tags: JSON.stringify(["genetics", "genotype-phenotype"]), answers: [
                    { content: "Genotype is the genetic makeup; phenotype is the physical expression", isCorrect: true, sortOrder: 0 },
                    { content: "They mean the same thing", isCorrect: false, sortOrder: 1 },
                    { content: "Phenotype determines genotype", isCorrect: false, sortOrder: 2 },
                    { content: "Genotype is only about appearance", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Physical Science",
        description: "Chemistry, physics, and energy concepts.",
        estimatedHours: 6.5,
        sortOrder: 1,
        topics: [
          {
            title: "Chemistry Basics",
            description: "Atoms, elements, compounds, and chemical reactions.",
            sortOrder: 0,
            lessons: [
              {
                title: "Atoms and the Periodic Table",
                slug: "atoms-periodic-table",
                contentType: "text",
                durationMinutes: 16,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Atoms and the Periodic Table", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Atoms are the smallest units of elements. They consist of protons (positive), neutrons (neutral), and electrons (negative). The periodic table organizes elements by atomic number." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["chemistry", "atom"]), answers: [
                    { content: "Proton", isCorrect: true, sortOrder: 0 },
                    { content: "Neutron", isCorrect: false, sortOrder: 1 },
                    { content: "Electron", isCorrect: false, sortOrder: 2 },
                    { content: "Isotope", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["chemistry", "periodic-table"]), answers: [
                    { content: "Atomic number", isCorrect: true, sortOrder: 0 },
                    { content: "Atomic mass", isCorrect: false, sortOrder: 1 },
                    { content: "Number of neutrons", isCorrect: false, sortOrder: 2 },
                    { content: "Chemical symbol", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Chemical Reactions",
                slug: "chemical-reactions",
                contentType: "text",
                durationMinutes: 15,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Chemical Reactions", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "In a chemical reaction, bonds break and form to create new substances. Reactants are on the left side; products are on the right. The law of conservation of mass means atoms are neither created nor destroyed." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["chemistry", "conservation-of-mass"]), answers: [
                    { content: "The total mass of reactants equals total mass of products", isCorrect: true, sortOrder: 0 },
                    { content: "Mass can be created during reactions", isCorrect: false, sortOrder: 1 },
                    { content: "Gases have no mass", isCorrect: false, sortOrder: 2 },
                    { content: "Mass is only conserved in solids", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["chemistry", "reaction-type"]), answers: [
                    { content: "Synthesis", isCorrect: true, sortOrder: 0 },
                    { content: "Decomposition", isCorrect: false, sortOrder: 1 },
                    { content: "Combustion", isCorrect: false, sortOrder: 2 },
                    { content: "Neutralization", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
          {
            title: "Physics: Motion and Forces",
            description: "Newton's laws, speed, velocity, and acceleration.",
            sortOrder: 1,
            lessons: [
              {
                title: "Newton's Laws of Motion",
                slug: "newtons-laws-motion",
                contentType: "text",
                durationMinutes: 18,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Newton's Laws of Motion", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "1st Law (Inertia): An object at rest stays at rest; an object in motion stays in motion unless acted on by an unbalanced force. 2nd Law: F = ma. 3rd Law: Every action has an equal and opposite reaction." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["physics", "newton"]), answers: [
                    { content: "F = ma", isCorrect: true, sortOrder: 0 },
                    { content: "E = mc\u00b2", isCorrect: false, sortOrder: 1 },
                    { content: "P = mv", isCorrect: false, sortOrder: 2 },
                    { content: "V = IR", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["physics", "inertia"]), answers: [
                    { content: "First law", isCorrect: true, sortOrder: 0 },
                    { content: "Second law", isCorrect: false, sortOrder: 1 },
                    { content: "Third law", isCorrect: false, sortOrder: 2 },
                    { content: "Law of gravity", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Speed, Velocity, and Acceleration",
                slug: "speed-velocity-acceleration",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Speed, Velocity, and Acceleration", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Speed is how fast (scalar). Velocity is speed with direction (vector). Acceleration is the rate of change of velocity." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["physics", "speed-velocity"]), answers: [
                    { content: "Velocity includes direction; speed does not", isCorrect: true, sortOrder: 0 },
                    { content: "They are the same thing", isCorrect: false, sortOrder: 1 },
                    { content: "Speed is a vector quantity", isCorrect: false, sortOrder: 2 },
                    { content: "Velocity only measures deceleration", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["physics", "acceleration"]), answers: [
                    { content: "m/s\u00b2", isCorrect: true, sortOrder: 0 },
                    { content: "m/s", isCorrect: false, sortOrder: 1 },
                    { content: "kg\u00b7m/s", isCorrect: false, sortOrder: 2 },
                    { content: "N", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "rla",
    title: "Reasoning Through Language Arts",
    description: "Reading comprehension, writing, grammar, and language conventions.",
    iconUrl: "/icons/rla.svg",
    colorHex: "#8B5CF6",
    sortOrder: 2,
    modules: [
      {
        title: "Reading Comprehension",
        description: "Analyze passages, identify main ideas, and make inferences.",
        estimatedHours: 8.0,
        sortOrder: 0,
        topics: [
          {
            title: "Main Idea and Details",
            description: "Identify the main idea and supporting details in passages.",
            sortOrder: 0,
            lessons: [
              {
                title: "Finding the Main Idea",
                slug: "finding-main-idea",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Finding the Main Idea", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The <strong>main idea</strong> is the central point the author wants to communicate. It is often (but not always) stated in the first or last sentence. Supporting details provide evidence, examples, and explanations." },
                  { id: "b3", block_type: "callout", callout: { variant: "tip", title: "GED Strategy", body: "Ask yourself: 'What is the one thing the author most wants me to understand?' If you can answer in one sentence, you have found the main idea." } },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["rla", "main-idea"]), answers: [
                    { content: "First or last sentence", isCorrect: true, sortOrder: 0 },
                    { content: "Random sentence in the middle", isCorrect: false, sortOrder: 1 },
                    { content: "Only in the title", isCorrect: false, sortOrder: 2 },
                    { content: "It is never directly stated", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["rla", "supporting-detail"]), answers: [
                    { content: "To provide evidence and examples", isCorrect: true, sortOrder: 0 },
                    { content: "To contradict the main idea", isCorrect: false, sortOrder: 1 },
                    { content: "To introduce a new topic", isCorrect: false, sortOrder: 2 },
                    { content: "To summarize the passage", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Making Inferences",
                slug: "making-inferences",
                contentType: "text",
                durationMinutes: 16,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Making Inferences", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "An <strong>inference</strong> is a conclusion drawn from evidence and reasoning rather than from explicit statements. On the GED, you will need to 'read between the lines' to answer inference questions." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["rla", "inference"]), answers: [
                    { content: "A conclusion based on clues and evidence in the text", isCorrect: true, sortOrder: 0 },
                    { content: "A fact directly stated by the author", isCorrect: false, sortOrder: 1 },
                    { content: "The title of the passage", isCorrect: false, sortOrder: 2 },
                    { content: "A summary of the main idea", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "hard", tags: JSON.stringify(["rla", "tone"]), answers: [
                    { content: "The author's attitude toward the subject", isCorrect: true, sortOrder: 0 },
                    { content: "The main character's name", isCorrect: false, sortOrder: 1 },
                    { content: "The number of paragraphs", isCorrect: false, sortOrder: 2 },
                    { content: "The publication date", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
          {
            title: "Text Structure and Purpose",
            description: "Recognize how texts are organized and the author's purpose.",
            sortOrder: 1,
            lessons: [
              {
                title: "Author's Purpose",
                slug: "authors-purpose",
                contentType: "text",
                durationMinutes: 12,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Author's Purpose", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The three main purposes are: <strong>to inform</strong> (explain facts), <strong>to persuade</strong> (convince the reader), and <strong>to entertain</strong> (tell a story). Some texts combine multiple purposes." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["rla", "purpose"]), answers: [
                    { content: "To persuade", isCorrect: true, sortOrder: 0 },
                    { content: "To entertain", isCorrect: false, sortOrder: 1 },
                    { content: "To inform", isCorrect: false, sortOrder: 2 },
                    { content: "To describe", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["rla", "text-structure"]), answers: [
                    { content: "Cause and effect", isCorrect: true, sortOrder: 0 },
                    { content: "Alphabetical order", isCorrect: false, sortOrder: 1 },
                    { content: "Rhyming scheme", isCorrect: false, sortOrder: 2 },
                    { content: "Question and answer", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Point of View",
                slug: "point-of-view",
                contentType: "text",
                durationMinutes: 13,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Point of View", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Point of view (POV) is the perspective from which a story is told. First person uses 'I'. Third person limited follows one character. Third person omniscient knows all characters' thoughts." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["rla", "point-of-view"]), answers: [
                    { content: "First person", isCorrect: true, sortOrder: 0 },
                    { content: "Second person", isCorrect: false, sortOrder: 1 },
                    { content: "Third person omniscient", isCorrect: false, sortOrder: 2 },
                    { content: "Third person objective", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["rla", "narrator"]), answers: [
                    { content: "Can reveal all characters' thoughts and feelings", isCorrect: true, sortOrder: 0 },
                    { content: "Only knows one character's perspective", isCorrect: false, sortOrder: 1 },
                    { content: "Is a character in the story", isCorrect: false, sortOrder: 2 },
                    { content: "Never describes settings", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Grammar and Language Conventions",
        description: "Sentence structure, punctuation, verb tense, and agreement.",
        estimatedHours: 6.0,
        sortOrder: 1,
        topics: [
          {
            title: "Sentence Structure",
            description: "Complete sentences, fragments, run-ons, and sentence types.",
            sortOrder: 0,
            lessons: [
              {
                title: "Complete Sentences vs. Fragments",
                slug: "sentences-vs-fragments",
                contentType: "text",
                durationMinutes: 12,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Complete Sentences vs. Fragments", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "A <strong>complete sentence</strong> has a subject and a verb and expresses a complete thought. A <strong>fragment</strong> is missing one of these elements. A <strong>run-on</strong> joins two complete sentences without proper punctuation or conjunction." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["grammar", "fragment"]), answers: [
                    { content: "Missing a subject or verb or complete thought", isCorrect: true, sortOrder: 0 },
                    { content: "Too long", isCorrect: false, sortOrder: 1 },
                    { content: "Contains a spelling error", isCorrect: false, sortOrder: 2 },
                    { content: "Has too many commas", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["grammar", "run-on"]), answers: [
                    { content: "I love coffee she loves tea.", isCorrect: true, sortOrder: 0 },
                    { content: "I love coffee, but she loves tea.", isCorrect: false, sortOrder: 1 },
                    { content: "I love coffee and she loves tea.", isCorrect: false, sortOrder: 2 },
                    { content: "I love coffee; she loves tea.", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Subject-Verb Agreement",
                slug: "subject-verb-agreement",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Subject-Verb Agreement", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "A singular subject takes a singular verb; a plural subject takes a plural verb. Be careful with prepositional phrases between the subject and verb \u2014 they do not affect agreement." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["grammar", "subject-verb"]), answers: [
                    { content: "runs", isCorrect: true, sortOrder: 0 },
                    { content: "run", isCorrect: false, sortOrder: 1 },
                    { content: "running", isCorrect: false, sortOrder: 2 },
                    { content: "ran", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["grammar", "pronoun-agreement"]), answers: [
                    { content: "their", isCorrect: false, sortOrder: 0 },
                    { content: "his or her", isCorrect: true, sortOrder: 1 },
                    { content: "its", isCorrect: false, sortOrder: 2 },
                    { content: "they", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
          {
            title: "Punctuation and Capitalization",
            description: "Proper use of commas, periods, apostrophes, and capital letters.",
            sortOrder: 1,
            lessons: [
              {
                title: "Comma Rules",
                slug: "comma-rules",
                contentType: "text",
                durationMinutes: 13,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Comma Rules", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Use commas to: separate items in a list, after introductory clauses, before coordinating conjunctions (FANBOYS) in compound sentences, and to set off non-essential information." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["grammar", "comma"]), answers: [
                    { content: "apples, bananas, and oranges", isCorrect: true, sortOrder: 0 },
                    { content: "apples bananas and oranges", isCorrect: false, sortOrder: 1 },
                    { content: "apples, bananas and, oranges", isCorrect: false, sortOrder: 2 },
                    { content: "apples bananas, and oranges", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["grammar", "comma-splice"]), answers: [
                    { content: "Add a period or semicolon between the independent clauses", isCorrect: true, sortOrder: 0 },
                    { content: "Add more commas", isCorrect: false, sortOrder: 1 },
                    { content: "Remove all punctuation", isCorrect: false, sortOrder: 2 },
                    { content: "Make the sentences shorter", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Apostrophes and Quotation Marks",
                slug: "apostrophes-quotation-marks",
                contentType: "text",
                durationMinutes: 12,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Apostrophes and Quotation Marks", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Use apostrophes for contractions (don't, can't) and possessives (the cat's tail). Never use an apostrophe for plurals. Use quotation marks for direct speech and titles of short works." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["grammar", "apostrophe"]), answers: [
                    { content: "The dog's bone", isCorrect: true, sortOrder: 0 },
                    { content: "The dogs bone", isCorrect: false, sortOrder: 1 },
                    { content: "The dogs' bone's", isCorrect: false, sortOrder: 2 },
                    { content: "The dog bone", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["grammar", "its-vs-it's"]), answers: [
                    { content: "Its is possessive; it's is a contraction for it is", isCorrect: true, sortOrder: 0 },
                    { content: "They mean the same thing", isCorrect: false, sortOrder: 1 },
                    { content: "Its is a contraction", isCorrect: false, sortOrder: 2 },
                    { content: "It's is possessive", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    code: "ss",
    title: "Social Studies",
    description: "U.S. history, civics, economics, and geography for the GED.",
    iconUrl: "/icons/ss.svg",
    colorHex: "#F43F5E",
    sortOrder: 3,
    modules: [
      {
        title: "U.S. History",
        description: "Major events, documents, and movements in American history.",
        estimatedHours: 8.0,
        sortOrder: 0,
        topics: [
          {
            title: "Founding Documents",
            description: "Declaration of Independence, Constitution, and Bill of Rights.",
            sortOrder: 0,
            lessons: [
              {
                title: "The Declaration of Independence",
                slug: "declaration-of-independence",
                contentType: "text",
                durationMinutes: 15,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "The Declaration of Independence", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Adopted on July 4, 1776, the Declaration announced the 13 colonies' separation from Great Britain. Written primarily by Thomas Jefferson, it asserts that all men are created equal with unalienable rights to life, liberty, and the pursuit of happiness." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["history", "declaration"]), answers: [
                    { content: "July 4, 1776", isCorrect: true, sortOrder: 0 },
                    { content: "July 4, 1775", isCorrect: false, sortOrder: 1 },
                    { content: "June 15, 1776", isCorrect: false, sortOrder: 2 },
                    { content: "January 1, 1777", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["history", "unalienable-rights"]), answers: [
                    { content: "Life, liberty, and the pursuit of happiness", isCorrect: true, sortOrder: 0 },
                    { content: "Life, liberty, and property", isCorrect: false, sortOrder: 1 },
                    { content: "Freedom, equality, and justice", isCorrect: false, sortOrder: 2 },
                    { content: "Faith, hope, and charity", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "The U.S. Constitution",
                slug: "us-constitution",
                contentType: "text",
                durationMinutes: 18,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "The U.S. Constitution", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The Constitution (1787) established the framework of the U.S. government with three branches: Legislative (Congress), Executive (President), and Judicial (Supreme Court). The system of checks and balances ensures no branch becomes too powerful." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["civics", "constitution", "branches"]), answers: [
                    { content: "Three", isCorrect: true, sortOrder: 0 },
                    { content: "Two", isCorrect: false, sortOrder: 1 },
                    { content: "Four", isCorrect: false, sortOrder: 2 },
                    { content: "Five", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["civics", "checks-and-balances"]), answers: [
                    { content: "To prevent any one branch from becoming too powerful", isCorrect: true, sortOrder: 0 },
                    { content: "To make government more efficient", isCorrect: false, sortOrder: 1 },
                    { content: "To give the President more power", isCorrect: false, sortOrder: 2 },
                    { content: "To eliminate state governments", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
          {
            title: "Civil Rights Movement",
            description: "Key events and figures in the struggle for civil rights.",
            sortOrder: 1,
            lessons: [
              {
                title: "The Civil Rights Movement Overview",
                slug: "civil-rights-movement-overview",
                contentType: "text",
                durationMinutes: 16,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "The Civil Rights Movement", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The Civil Rights Movement (1950s-1960s) aimed to end racial segregation and discrimination. Key events include Brown v. Board of Education (1954), the Montgomery Bus Boycott (1955), the March on Washington (1963), and the Civil Rights Act (1964)." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["history", "civil-rights"]), answers: [
                    { content: "Outlawed segregation in public schools", isCorrect: true, sortOrder: 0 },
                    { content: "Gave women the right to vote", isCorrect: false, sortOrder: 1 },
                    { content: "Ended slavery", isCorrect: false, sortOrder: 2 },
                    { content: "Established the Bill of Rights", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["history", "civil-rights-act"]), answers: [
                    { content: "1964", isCorrect: true, sortOrder: 0 },
                    { content: "1954", isCorrect: false, sortOrder: 1 },
                    { content: "1968", isCorrect: false, sortOrder: 2 },
                    { content: "1972", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Key Figures: MLK and Rosa Parks",
                slug: "mlk-rosa-parks",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Key Figures of the Movement", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Martin Luther King Jr. led nonviolent protests and delivered the 'I Have a Dream' speech. Rosa Parks refused to give up her bus seat, sparking the Montgomery Bus Boycott. Both became symbols of the fight for equality." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["history", "mlk"]), answers: [
                    { content: "I Have a Dream", isCorrect: true, sortOrder: 0 },
                    { content: "Gettysburg Address", isCorrect: false, sortOrder: 1 },
                    { content: "The Federalist Papers", isCorrect: false, sortOrder: 2 },
                    { content: "Emancipation Proclamation", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["history", "rosa-parks"]), answers: [
                    { content: "Montgomery Bus Boycott", isCorrect: true, sortOrder: 0 },
                    { content: "March on Washington", isCorrect: false, sortOrder: 1 },
                    { content: "Brown v. Board of Education", isCorrect: false, sortOrder: 2 },
                    { content: "Freedom Rides", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
        ],
      },
      {
        title: "Civics and Government",
        description: "How government works, elections, and citizenship.",
        estimatedHours: 6.5,
        sortOrder: 1,
        topics: [
          {
            title: "The Three Branches of Government",
            description: "Legislative, Executive, and Judicial branches and their powers.",
            sortOrder: 0,
            lessons: [
              {
                title: "Legislative Branch: Congress",
                slug: "legislative-branch-congress",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "The Legislative Branch", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "Congress is the legislative branch, made up of the Senate (100 members, 2 per state) and the House of Representatives (435 members, based on state population). Congress makes laws, declares war, and controls spending." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["civics", "congress"]), answers: [
                    { content: "100", isCorrect: true, sortOrder: 0 },
                    { content: "50", isCorrect: false, sortOrder: 1 },
                    { content: "435", isCorrect: false, sortOrder: 2 },
                    { content: "535", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["civics", "house-representatives"]), answers: [
                    { content: "Based on state population", isCorrect: true, sortOrder: 0 },
                    { content: "Two per state", isCorrect: false, sortOrder: 1 },
                    { content: "Appointed by the President", isCorrect: false, sortOrder: 2 },
                    { content: "Elected by the Senate", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Executive and Judicial Branches",
                slug: "executive-judicial-branches",
                contentType: "text",
                durationMinutes: 15,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Executive and Judicial Branches", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The Executive branch is headed by the President, who serves as Commander in Chief and enforces laws. The Judicial branch, led by the Supreme Court, interprets laws and can declare them unconstitutional." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["civics", "president"]), answers: [
                    { content: "Commander in Chief", isCorrect: true, sortOrder: 0 },
                    { content: "Chief Justice", isCorrect: false, sortOrder: 1 },
                    { content: "Speaker of the House", isCorrect: false, sortOrder: 2 },
                    { content: "Senate Majority Leader", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["civics", "supreme-court"]), answers: [
                    { content: "Declare laws unconstitutional", isCorrect: true, sortOrder: 0 },
                    { content: "Create new laws", isCorrect: false, sortOrder: 1 },
                    { content: "Enforce laws", isCorrect: false, sortOrder: 2 },
                    { content: "Command the military", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
          {
            title: "Elections and Voting",
            description: "The electoral process, voting rights, and political parties.",
            sortOrder: 1,
            lessons: [
              {
                title: "How Elections Work",
                slug: "how-elections-work",
                contentType: "text",
                durationMinutes: 14,
                sortOrder: 0,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "How Elections Work", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The President is elected through the Electoral College, not by direct popular vote. Each state has electors equal to its Congressional delegation. A candidate needs 270 electoral votes to win." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["civics", "electoral-college"]), answers: [
                    { content: "270", isCorrect: true, sortOrder: 0 },
                    { content: "300", isCorrect: false, sortOrder: 1 },
                    { content: "218", isCorrect: false, sortOrder: 2 },
                    { content: "51", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["civics", "voting-amendments"]), answers: [
                    { content: "15th, 19th, and 26th Amendments", isCorrect: true, sortOrder: 0 },
                    { content: "1st, 2nd, and 3rd Amendments", isCorrect: false, sortOrder: 1 },
                    { content: "10th, 11th, and 12th Amendments", isCorrect: false, sortOrder: 2 },
                    { content: "4th, 5th, and 6th Amendments", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
              {
                title: "Political Parties and the Two-Party System",
                slug: "political-parties",
                contentType: "text",
                durationMinutes: 12,
                sortOrder: 1,
                bodyContent: JSON.stringify([
                  { id: "b1", block_type: "heading", content: "Political Parties", level: 2 },
                  { id: "b2", block_type: "paragraph", content: "The U.S. has a two-party system dominated by Democrats and Republicans. Third parties exist but rarely win major elections. Parties develop platforms, nominate candidates, and organize voters." },
                ]),
                questions: [
                  { questionType: "multiple_choice", difficulty: "easy", tags: JSON.stringify(["civics", "political-parties"]), answers: [
                    { content: "Democrats and Republicans", isCorrect: true, sortOrder: 0 },
                    { content: "Liberals and Conservatives", isCorrect: false, sortOrder: 1 },
                    { content: "Federalists and Anti-Federalists", isCorrect: false, sortOrder: 2 },
                    { content: "Whigs and Tories", isCorrect: false, sortOrder: 3 },
                  ]},
                  { questionType: "multiple_choice", difficulty: "medium", tags: JSON.stringify(["civics", "primary-election"]), answers: [
                    { content: "To select a party's nominee for the general election", isCorrect: true, sortOrder: 0 },
                    { content: "To elect the President directly", isCorrect: false, sortOrder: 1 },
                    { content: "To remove a sitting official", isCorrect: false, sortOrder: 2 },
                    { content: "To amend the Constitution", isCorrect: false, sortOrder: 3 },
                  ]},
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

async function seed() {
  console.log("=== GED Prep Platform — Seeding Database ===\n");

  // Idempotent check: skip if subjects already exist
  const existingSubjects = await prisma.subject.count();
  if (existingSubjects > 0) {
    console.log(`Database already has ${existingSubjects} subjects. Checking for extra questions...`);
    await seedExtraQuestions();
    const totalQ = await prisma.question.count({ where: { isActive: true } });
    console.log(`Total active questions: ${totalQ}`);
    await prisma.$disconnect();
    return;
  }

  // Clear in reverse dependency order
  console.log("Clearing existing data...");
  await prisma.readinessHistory.deleteMany();
  await prisma.readinessScore.deleteMany();
  await prisma.essayGradingDetail.deleteMany();
  await prisma.essaySubmission.deleteMany();
  await prisma.essayPrompt.deleteMany();
  await prisma.aiMessage.deleteMany();
  await prisma.aiConversation.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.spacedRepetition.deleteMany();
  await prisma.quizAttemptAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.module.deleteMany();
  await prisma.subject.deleteMany();

  // Create a demo user (upsert to avoid unique constraint on re-runs)
  const demoPasswordHash = await bcrypt.hash("demo1234", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@ged.com" },
    update: {},
    create: {
      email: "demo@ged.com",
      passwordHash: demoPasswordHash,
      firstName: "Demo",
      lastName: "Student",
      displayName: "Demo Student",
      role: "student",
      status: "active",
    },
  });
  console.log(`Created user: ${user.email}`);

  let totalLessons = 0;
  let totalQuestions = 0;

  for (const subjectData of SUBJECTS) {
    const { modules: _mods, ...subjectInput } = subjectData;
    const subject = await prisma.subject.create({
      data: { ...subjectInput, status: "published" },
    });
    console.log(`  Subject: ${subject.title}`);

    for (const moduleData of _mods) {
      const { topics: _topics, ...modInput } = moduleData;
      const mod = await prisma.module.create({
        data: { ...modInput, subjectId: subject.id, status: "published" },
      });

      for (const topicData of _topics) {
        const { lessons: _lessons, ...topicInput } = topicData;
        const topic = await prisma.topic.create({
          data: { ...topicInput, moduleId: mod.id, status: "published" },
        });

        for (const lessonData of _lessons) {
          const { questions: _questions, ...lessonInput } = lessonData;
          const lesson = await prisma.lesson.create({
            data: {
              ...lessonInput,
              topicId: topic.id,
              status: "published",
            },
          });
          totalLessons++;

          for (const qData of _questions) {
            const { answers: _answers, ...qInput } = qData;
            const question = await prisma.question.create({
              data: {
                ...qInput,
                lessonId: lesson.id,
                subjectId: subject.id,
              },
            });

            for (const aData of _answers) {
              await prisma.answer.create({
                data: { ...aData, questionId: question.id },
              });
            }
            totalQuestions += 1;
          }
        }
      }
    }
  }

  console.log(`\n=== Seed Complete ===`);
  console.log(`Subjects: ${SUBJECTS.length}`);
  console.log(`Lessons: ${totalLessons}`);
  console.log(`Questions: ${totalQuestions}`);
  console.log(`Demo user: demo@ged.com / demo1234`);

  // =======================================================================
  // SEED FLASHCARDS — 32 vocabulary terms across 4 subjects (8 each)
  // =======================================================================
  console.log("\n--- Seeding Flashcards ---");

  const FLASHCARDS: Record<string, { term: string; translation: string; pronunciation: string; meaning: string }[]> = {
    math: [
      {
        term: "Slope (m)",
        translation: "ความชันของเส้นตรง",
        pronunciation: "สโลป",
        meaning: "ค่าที่บอกความเอียงของเส้นตรงบนกราฟว่าเอียงขึ้นหรือดิ่งลง หาได้จากสูตรผลต่างของ Y หารด้วยผลต่างของ X",
      },
      {
        term: "Variable",
        translation: "ตัวแปร",
        pronunciation: "แวริ-เอ-เบิล",
        meaning: "ตัวอักษร (เช่น x, y) ที่ใช้แทนค่าตัวเลขที่ยังไม่ทราบค่าในสมการ",
      },
      {
        term: "Expression",
        translation: "นิพจน์",
        pronunciation: "เอ็กซ์-เพรช-เชิน",
        meaning: "ข้อความสัญลักษณ์ทางคณิตศาสตร์ที่มีตัวเลข ตัวแปร และเครื่องหมายดำเนินการ แต่องค์ประกอบจะไม่มีเครื่องหมายเท่ากับ (เช่น 3x + 5)",
      },
      {
        term: "Equation",
        translation: "สมการ",
        pronunciation: "อี-เคว-เชิน",
        meaning: "ประโยคสัญลักษณ์ทางคณิตศาสตร์ที่มีเครื่องหมายเท่ากับ (=) แสดงว่าค่าของสองฝั่งมีปริมาณเท่ากัน",
      },
      {
        term: "Inequality",
        translation: "อสมการ",
        pronunciation: "อิน-อี-ควอ-ลิ-ที",
        meaning: "ประโยคสัญลักษณ์ที่แสดงความไม่เท่ากัน โดยใช้เครื่องหมายมากกว่า น้อยกว่า หรือไม่เท่ากับ (เช่น >, <, ≥, ≤, ≠)",
      },
      {
        term: "Ratio / Proportion",
        translation: "อัตราส่วน / สัดส่วน",
        pronunciation: "เร-โช / โปร-ปอร์-เชิน",
        meaning: "การเปรียบเทียบปริมาณของสองสิ่ง หรือการเปรียบเทียบว่าอัตราส่วนสองชุดนั้นมีค่าเท่ากันหรือไม่",
      },
      {
        term: "Probability",
        translation: "ความน่าจะเป็น",
        pronunciation: "พรอ-บา-บิ-ลิ-ที",
        meaning: "โอกาสที่จะเกิดเหตุการณ์ที่สนใจ คำนวณจากจำนวนผลลัพธ์ที่สนใจ หารด้วยจำนวนผลลัพธ์ที่เป็นไปได้ทั้งหมด",
      },
      {
        term: "Mean / Median / Mode",
        translation: "ค่าเฉลี่ย / มัธยฐาน / ฐานนิยม",
        pronunciation: "มีน / มี-เดียน / โมด",
        meaning: "กลุ่มค่าสถิติที่ใช้เป็นตัวแทนของข้อมูล (Mean = ผลรวมหารด้วยจำนวน, Median = ค่าที่อยู่ตรงกลางเมื่อเรียงลำดับแล้ว, Mode = ข้อมูลที่ซ้ำกันมากที่สุด)",
      },
    ],
    rla: [
      {
        term: "Inference / Infer",
        translation: "การสรุปความ / ตีความ",
        pronunciation: "อิน-เฟอ-เรนซ์ / อิน-เฟอ",
        meaning: "การหาข้อสรุปจากเนื้อหาที่บทความใบ้หรือบอกเป็นนัยมา โดยที่ผู้เขียนไม่ได้ระบุข้อความนั้นออกมาตรง ๆ",
      },
      {
        term: "Main Idea / Central Argument",
        translation: "ใจความสำคัญ / ประเด็นหลัก",
        pronunciation: "เมน ไอ-เดีย / เซน-ทรอล อาร์-กิว-เมนต์",
        meaning: "ประเด็นที่สำคัญที่สุดหรือแกนหลักของเรื่องที่ผู้เขียนต้องการสื่อสารให้ผู้อ่านเข้าใจ",
      },
      {
        term: "Author's Purpose",
        translation: "วัตถุประสงค์ของผู้เขียน",
        pronunciation: "ออ-เธอร์ซ พัร-โพส",
        meaning: "เหตุผลเบื้องหลังที่ผู้เขียนแต่งบทความนี้ขึ้นมา เช่น เพื่อโน้มน้าวใจ (Persuade) เพื่อให้ข้อมูล (Inform) หรือเพื่อความบันเทิง (Entertain)",
      },
      {
        term: "Tone / Mood",
        translation: "น้ำเสียง / อารมณ์ของบทความ",
        pronunciation: "โทน / มูด",
        meaning: "ทัศนคติหรือความรู้สึกของผู้เขียนที่สะท้อนผ่านตัวอักษร เช่น มองโลกในแง่ดี (Optimistic) หรือเชิงจับผิดและวิจารณ์ (Critical)",
      },
      {
        term: "Evidence",
        translation: "หลักฐานสนับสนุน",
        pronunciation: "เอ-วิ-เดนซ์",
        meaning: "ข้อมูล ข้อเท็จจริง สถิติ หรือคำพูดของผู้เชี่ยวชาญที่ผู้เขียนยกมาอ้างเพื่อเพิ่มความน่าเชื่อถือให้แก่ข้ออ้างหลัก",
      },
      {
        term: "Contradict / Oppose",
        translation: "ขัดแย้ง / คัดค้าน",
        pronunciation: "คอน-ทระ-ดิกต์ / โอ-โพส",
        meaning: "ข้อมูล ข้อมูลโต้แย้ง หรือแนวคิดที่มีความหมายสวนทางหรือหักล้างกับประเด็นหลักที่กล่าวไปก่อนหน้า",
      },
      {
        term: "Context Clue",
        translation: "บริบทแวดล้อม",
        pronunciation: "คอน-เท็กซต์ คลู",
        meaning: "คำศัพท์ วลี หรือประโยคที่อยู่รอบ ๆ คำศัพท์ยาก ซึ่งช่วยใบ้ความหมายของคำศัพท์ลึกลับคำนั้นให้เดาได้ง่ายขึ้น",
      },
      {
        term: "Chronological Order",
        translation: "การเรียงลำดับตามเวลา",
        pronunciation: "ครอ-โน-โล-จิ-เคิล ออร์-เดอร์",
        meaning: "รูปแบบการเล่าเรื่องหรืออธิบายขั้นตอน โดยเรียงลำดับเหตุการณ์ตามวันเวลาที่เกิดขึ้นจริงก่อน-หลัง",
      },
    ],
    science: [
      {
        term: "Hypothesis",
        translation: "สมมติฐาน",
        pronunciation: "ไฮ-พอ-เธ-ซิส",
        meaning: "การคาดคะเนหรือตั้งข้อสมมติเกี่ยวกับผลลัพธ์ของการทดลองไว้ล่วงหน้า โดยอาศัยความรู้เดิมและสามารถทดสอบได้",
      },
      {
        term: "Dependent Variable",
        translation: "ตัวแปรตาม",
        pronunciation: "ดี-เพน-เดนต์ แวริ-เอ-เบิล",
        meaning: "สิ่งที่เป็นผลลัพธ์หรือสิ่งที่เปลี่ยนไปตามการเปลี่ยนแปลงของตัวแปรต้น เป็นค่าที่เราต้องคอยวัดผลในการทดลอง",
      },
      {
        term: "Independent Variable",
        translation: "ตัวแปรต้น / ตัวแปรอิสระ",
        pronunciation: "อิน-ดี-เพน-เดนต์ แวริ-เอ-เบิล",
        meaning: "สิ่งหรือปัจจัยที่ผู้ทดลองกำหนดให้แตกต่างกันตั้งแต่แรก เพื่อศึกษาดูว่ามันจะส่งผลต่อการทดลองอย่างไร",
      },
      {
        term: "Control Group",
        translation: "กลุ่มควบคุม",
        pronunciation: "คอน-โทรล กรุ๊ป",
        meaning: "ชุดการทดลองที่ถูกแยกไว้ในสภาพแวดล้อมปกติ โดยไม่ใส่ตัวแปรต้นเข้าไป เพื่อใช้เป็นเกณฑ์เปรียบเทียบกับกลุ่มที่ทดลองจริง",
      },
      {
        term: "Photosynthesis",
        translation: "กระบวนการสังเคราะห์ด้วยแสง",
        pronunciation: "โฟ-โท-ซิน-เธ-ซิส",
        meaning: "กระบวนการสร้างอาหารของพืช โดยเปลี่ยนพลังงานแสง แหล่งน้ำ และแก๊สคาร์บอนไดออกไซด์ ให้เป็นน้ำตาลและแก๊สออกซิเจน",
      },
      {
        term: "Mitosis / Meiosis",
        translation: "การแบ่งเซลล์แบบไมโทซิส / ไมโอซิส",
        pronunciation: "ไม-โท-ซิส / ไม-โอ-ซิส",
        meaning: "รูปแบบการแบ่งเซลล์ (Mitosis เพื่อการเจริญเติบโตและซ่อมแซมส่วนสึกหรอ / Meiosis เพื่อสร้างเซลล์สืบพันธุ์ที่มีโครโมโซมลดลงครึ่งหนึ่ง)",
      },
      {
        term: "Ecosystem",
        translation: "ระบบนิเวศ",
        pronunciation: "อี-โค-ซิส-เทม",
        meaning: "ระบบความสัมพันธ์ระหว่างกลุ่มสิ่งมีชีวิตด้วยกันเอง และความสัมพันธ์ระหว่างสิ่งมีชีวิตกับสิ่งไม่มีชีวิตในแหล่งที่อยู่อาศัยนั้น ๆ",
      },
      {
        term: "Kinetic / Potential Energy",
        translation: "พลังงานจลน์ / พลังงานศักย์",
        pronunciation: "คิ-เน-ทิค / โพ-เทน-เชิล เอน-เนอ-จี",
        meaning: "พลังงานสองรูปแบบหลัก (Kinetic = พลังงานของวัตถุที่กำลังเคลื่อนที่, Potential = พลังงานที่สะสมอยู่ในวัตถุตามตำแหน่งหรือความสูง)",
      },
    ],
    ss: [
      {
        term: "Democracy",
        translation: "ระบอบประชาธิปไตย",
        pronunciation: "เด-มอ-ครา-ซี",
        meaning: "ระบอบการปกครองที่ถือว่าอำนาจสูงสุดเป็นของประชาชน โดยประชาชนมีสิทธิ์เลือกตัวแทนเข้าไปบริหารประเทศ",
      },
      {
        term: "Constitution",
        translation: "รัฐธรรมนูญ",
        pronunciation: "คอน-สติ-ทู-เชิน",
        meaning: "กฎหมายสูงสุดของประเทศที่ใช้เป็นหลักในการปกครอง จัดระเบียบสังคม และกำหนดโครงสร้างบทบาทหน้าที่ของรัฐบาล",
      },
      {
        term: "Separation of Powers",
        translation: "การแบ่งแยกอำนาจ",
        pronunciation: "เซ-พะ-เร-เชิน ออฟ พาว-เวอร์ซ",
        meaning: "แนวคิดการกระจายอำนาจรัฐบาลอเมริกาออกเป็น 3 ฝ่ายคานกัน คือ ฝ่ายนิติบัญญัติ (ออกกฎหมาย) ฝ่ายบริหาร (บังคับใช้กฎหมาย) และฝ่ายตุลาการ (ตีความกฎหมาย)",
      },
      {
        term: "Amendment",
        translation: "การแก้ไขเพิ่มเติมรัฐธรรมนูญ",
        pronunciation: "อะ-เมน-เดนต์",
        meaning: "ข้อบัญญัติหรือกฎหมายที่ถูกเพิ่มเติมหรือแก้ไขในรัฐธรรมนูญสหรัฐฯ ภายหลัง เพื่อคุ้มครองสิทธิ์ประชาชน เช่น First Amendment (เสรีภาพทางศาสนาและการพูด)",
      },
      {
        term: "Supply and Demand",
        translation: "อุปสงค์และอุปทาน",
        pronunciation: "ซัพ-ไพล์ แอนด์ ดี-แมนด์",
        meaning: "กลไกราคาตามเศรษฐศาสตร์ โดย Supply คือความต้องการขายหรือปริมาณสินค้าที่มี และ Demand คือความต้องการซื้อของประชาชน",
      },
      {
        term: "Sovereignty",
        translation: "อำนาจอธิปไตย",
        pronunciation: "ซอ-เวอ-ริน-ที",
        meaning: "อำนาจสูงสุดเด็ดขาดในการปกครองตนเองของประเทศหรือรัฐ โดยปราศจากการแทรกแซงจากอำนาจภายนอก",
      },
      {
        term: "Immigration",
        translation: "การตรวจคนเข้าเมือง / การอพยพย้ายถิ่นฐาน",
        pronunciation: "อิ-มิ-เกร-เชิน",
        meaning: "การกระทำหรือกระบวนการของประชากรที่ย้ายจากประเทศบ้านเกิดเข้ามาตั้งรกรากอยู่อาศัยในอีกประเทศหนึ่งเป็นการถาวร",
      },
      {
        term: "Checks and Balances",
        translation: "ระบบตรวจสอบและถ่วงดุลอำนาจ",
        pronunciation: "เช็กส์ แอนด์ แบล-เลน-ซิส",
        meaning: "กลไกการเมืองที่ให้อำนาจแต่ละฝ่ายของรัฐบาล (นิติบัญญัติ บริหาร ตุลาการ) สามารถตรวจสอบและคัดค้านอำนาจของฝ่ายอื่นได้ เพื่อป้องกันไม่ให้ฝ่ายใดมีอำนาจล้นฟ้า",
      },
    ],
  };

  let totalFlashcards = 0;
  for (const [subjectCode, cards] of Object.entries(FLASHCARDS)) {
    const subject = await prisma.subject.findUnique({ where: { code: subjectCode } });
    if (!subject) {
      console.warn(`  Subject ${subjectCode} not found, skipping flashcards`);
      continue;
    }
    for (let i = 0; i < cards.length; i++) {
      await prisma.flashcard.create({
        data: {
          subjectId: subject.id,
          term: cards[i].term,
          translation: cards[i].translation,
          pronunciation: cards[i].pronunciation,
          meaning: cards[i].meaning,
          sortOrder: i,
        },
      });
      totalFlashcards++;
    }
    console.log(`  ${subject.title}: ${cards.length} flashcards`);
  }
  console.log(`Total flashcards: ${totalFlashcards}`);

  // =======================================================================
  // SEED EXTRA QUESTIONS (merged from add-questions.ts + add-hard-questions.ts)
  // =======================================================================
  await seedExtraQuestions();
}

async function seedExtraQuestions() {
  console.log("\n--- Seeding Extra Questions ---");

  const lessons = await prisma.lesson.findMany({
    include: { topic: { include: { module: { include: { subject: true } } } } },
  });

  // Build a map of lesson title -> lesson id + subject id
  const lessonMap = new Map<string, { id: string; subjectId: string }>();
  for (const l of lessons) {
    lessonMap.set(l.title, { id: l.id, subjectId: l.topic.module.subject.id });
  }

  let totalAdded = 0;
  for (const [lessonTitle, questions] of Object.entries(EXTRA_QUESTIONS)) {
    const lessonInfo = lessonMap.get(lessonTitle);
    if (!lessonInfo) {
      console.warn(`  SKIP: Lesson not found: "${lessonTitle}"`);
      continue;
    }

    for (const [questionText, answers, difficulty, explanation, tags] of questions) {
      await prisma.question.create({
        data: {
          questionType: "multiple_choice",
          difficulty,
          questionText,
          explanation,
          hintText: "",
          tags: JSON.stringify(tags),
          isActive: true,
          points: difficulty === "hard" ? 3 : difficulty === "medium" ? 2 : 1,
          subjectId: lessonInfo.subjectId,
          lessonId: lessonInfo.id,
          answers: {
            create: answers.map((a, i) => ({
              content: a[0],
              isCorrect: a[1],
              sortOrder: i,
            })),
          },
        },
      });
      totalAdded++;
    }
    console.log(`  + ${lessonTitle}: ${questions.length} questions`);
  }

  console.log(`Extra questions added: ${totalAdded}`);

  // Print summary
  const subjects = await prisma.subject.findMany({
    orderBy: { sortOrder: "asc" },
    include: { questions: { where: { isActive: true } } },
  });
  console.log("\n--- Question Summary ---");
  for (const s of subjects) {
    const easy = s.questions.filter((q) => q.difficulty === "easy").length;
    const med = s.questions.filter((q) => q.difficulty === "medium").length;
    const hard = s.questions.filter((q) => q.difficulty === "hard").length;
    console.log(
      `  ${s.code}: ${s.questions.length} total (${easy} easy, ${med} medium, ${hard} hard)`
    );
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });