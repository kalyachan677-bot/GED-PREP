import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

// All 64 questions: questionText, answer contents, hint, explanation, difficulty
// Organized by subject prefix (cmrvybia=math, cmrvybic=science, cmrvybie=rla, cmrvybih=ss)

interface QUpdate {
  id: string;
  questionText: string;
  answers: { id: string; content: string }[];
  explanation: string;
  hintText?: string;
  difficulty: string;
}

const mathQuestions: QUpdate[] = [
  {
    id: 'cmrvybiay0009njqmdjpxlolv',
    questionText: 'Solve for x: 3x + 7 = 22',
    answers: [
      { id: 'cmrvybiaz000bnjqm6b010wm2', content: 'x = 5' },
      { id: 'cmrvybib0000dnjqm88rzto8h', content: 'x = 4' },
      { id: 'cmrvybib1000fnjqmqwam00wx', content: 'x = 6' },
      { id: 'cmrvybib1000hnjqmdbfhnoeo', content: 'x = 7' },
    ],
    explanation: 'Subtract 7 from both sides: 3x = 22 − 7 = 15. Then divide both sides by 3: x = 15 ÷ 3 = 5. Therefore, x = 5.',
    hintText: 'Isolate the variable term by subtracting 7 from both sides first.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybib2000jnjqme6nzvgz0',
    questionText: 'Solve for x: 2(x + 4) = 18',
    answers: [
      { id: 'cmrvybib2000lnjqm6z4aa0xx', content: 'x = 3' },
      { id: 'cmrvybib3000nnjqmxj24ru0m', content: 'x = 5' },
      { id: 'cmrvybib3000pnjqmvz9am75q', content: 'x = 7' },
      { id: 'cmrvybib4000rnjqmq1gxkvuy', content: 'x = 9' },
    ],
    explanation: 'Divide both sides by 2: x + 4 = 9. Then subtract 4 from both sides: x = 9 − 4 = 5. The correct answer is x = 5.',
    hintText: 'First distribute or divide both sides by 2 to simplify.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybib7000vnjqmcukxjwja',
    questionText: 'Solve the inequality: −2x > −10',
    answers: [
      { id: 'cmrvybib8000xnjqmz2wl3pvg', content: 'x > 5' },
      { id: 'cmrvybib9000znjqm3x1rheds', content: 'x < 5' },
      { id: 'cmrvybiba0011njqmorr1yxw7', content: 'x < −5' },
      { id: 'cmrvybiba0013njqmezd7wqhn', content: 'x > −5' },
    ],
    explanation: 'When dividing both sides of an inequality by a negative number, you must flip the inequality sign. Divide both sides by −2: x < 5 (not x > 5). This is a key rule tested on the GED.',
    hintText: 'Remember: dividing by a negative number reverses the inequality sign.',
    difficulty: 'medium',
  },
  {
    id: 'cmrvybibb0015njqmf1zhtk3x',
    questionText: 'Solve for x: 3x − 3 ≤ 9',
    answers: [
      { id: 'cmrvybibc0017njqmm089zcko', content: 'x ≤ 4' },
      { id: 'cmrvybibd0019njqm6u4pyq2a', content: 'x ≤ 6' },
      { id: 'cmrvybibd001bnjqm5rgw2pqj', content: 'x ≥ 4' },
      { id: 'cmrvybibe001dnjqmrr5gq42f', content: 'x < 2' },
    ],
    explanation: 'Add 3 to both sides: 3x ≤ 12. Then divide both sides by 3: x ≤ 4. The inequality stays the same because we divided by a positive number.',
    hintText: 'Add 3 to both sides first to isolate the term with x.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybibf001jnjqmg3t8f9lr',
    questionText: 'If y = 2x + 1 and x + y = 10, what is the value of y?',
    answers: [
      { id: 'cmrvybibg001jnjqm2x6v0fpr', content: 'y = 6' },
      { id: 'cmrvybibh001nnjqmwj0m9k2w', content: 'y = 7' },
      { id: 'cmrvybibi001onjqmrbgqf8nr', content: 'y = 8' },
      { id: 'cmrvybibj001qnjqm0hcbkhq5', content: 'y = 5' },
    ],
    explanation: 'Substitute y = 2x + 1 into x + y = 10: x + (2x + 1) = 10 → 3x + 1 = 10 → 3x = 9 → x = 3. Then y = 2(3) + 1 = 7. Check: 3 + 7 = 10 ✓',
    hintText: 'Substitute the expression for y into the second equation.',
    difficulty: 'medium',
  },
  {
    id: 'cmrvybibi001tnjqmqzfp06ax',
    questionText: 'Solve the system: 3x + 2y = 13 and x = 3. What is y?',
    answers: [
      { id: 'cmrvybibj001tnjqm3phxb6wx', content: 'y = 1' },
      { id: 'cmrvybibk001vnjqm1cwlbtq2', content: 'y = 2' },
      { id: 'cmrvybibk001xnjqmbdhlx70g', content: 'y = 3' },
      { id: 'cmrvybibl001znjqmnfhcvdps', content: 'y = 4' },
    ],
    explanation: 'Substitute x = 3 into the first equation: 3(3) + 2y = 13 → 9 + 2y = 13 → 2y = 4 → y = 2. The solution is (3, 2).',
    hintText: 'Since x is already given, just substitute it into the equation.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybibm0025njqmkvatp8s1',
    questionText: 'What is the slope of the line that passes through points (2, 3) and (6, 11)?',
    answers: [
      { id: 'cmrvybibn0027njqm5rc2u3nr', content: 'm = 1' },
      { id: 'cmrvybibn0029njqm6mhmwffp', content: 'm = 2' },
      { id: 'cmrvybibo002bnjqmbd0es0r5', content: 'm = 4' },
      { id: 'cmrvybibo002dnjqm7xvcj39p', content: 'm = 3' },
    ],
    explanation: 'Slope formula: m = (y₂ − y₁)/(x₂ − x₁) = (11 − 3)/(6 − 2) = 8/4 = 2. The slope of the line is 2, meaning for every 1 unit right, the line goes up 2 units.',
    hintText: 'Use the slope formula: m = (y₂ − y₁) / (x₂ − x₁)',
    difficulty: 'medium',
  },
  {
    id: 'cmrvybibq002fnjqm7fe20zto',
    questionText: 'A store is offering 25% off on a jacket that originally costs $120. What is the sale price?',
    answers: [
      { id: 'cmrvybibq002hnjqm16nd3rpr', content: '$95' },
      { id: 'cmrvybibq002jnjqm9rmkpkpv', content: '$90' },
      { id: 'cmrvybibr002mnjqm7cmh3f8m', content: '$85' },
      { id: 'cmrvybibr002onjqm9w0tzkpk', content: '$100' },
    ],
    explanation: '25% of $120 = 0.25 × 120 = $30 discount. Sale price = $120 − $30 = $90. This type of percentage problem appears frequently on the GED Math test.',
    hintText: 'Find 25% of the original price, then subtract from the original.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybibv002vnjqmer5v1i5e',
    questionText: 'What is 15% of 200?',
    answers: [
      { id: 'cmrvybibw002vnjqm8hjv2qyp', content: '25' },
      { id: 'cmrvybibw002xnjqm61mwyxpr', content: '35' },
      { id: 'cmrvybibx002znjqmx2p2qf3l', content: '20' },
      { id: 'cmrvybibx0031njqmbn3w2y7v', content: '30' },
    ],
    explanation: '15% of 200 = 0.15 × 200 = 30. You can also think of it as 10% of 200 = 20, plus 5% of 200 = 10, so 20 + 10 = 30.',
    hintText: 'Convert the percentage to a decimal and multiply.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybiby0035njqmwjlc9swk',
    questionText: 'The area of a rectangle is 48 cm². If the length is 8 cm, what is the width?',
    answers: [
      { id: 'cmrvybiby0037njqm7ej6r7bk', content: '4 cm' },
      { id: 'cmrvybibz0039njqmk7vxfp0w', content: '8 cm' },
      { id: 'cmrvybic0003bnjqm37w5qkbc', content: '6 cm' },
      { id: 'cmrvybic1003dnjqm2wf4n7nv', content: '12 cm' },
    ],
    explanation: 'Area of a rectangle = length × width. So width = Area ÷ length = 48 ÷ 8 = 6 cm. The width is 6 cm.',
    hintText: 'Use the formula: Area = length × width, then solve for the unknown.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybic1003hnjqmjioraett',
    questionText: 'Which expression is equivalent to 3(x + 4) − 2x?',
    answers: [
      { id: 'cmrvybic2003jnjqm3v1lq394', content: 'x + 12' },
      { id: 'cmrvybic3003lnjqm32thgpnn', content: '5x + 12' },
      { id: 'cmrvybic4003nnjqmb78r1mrc', content: 'x + 4' },
      { id: 'cmrvybic4003pnjqmchbxp462', content: '3x + 12' },
    ],
    explanation: 'Distribute the 3: 3(x + 4) = 3x + 12. Then subtract 2x: 3x + 12 − 2x = x + 12. The simplified expression is x + 12.',
    hintText: 'Distribute first, then combine like terms.',
    difficulty: 'medium',
  },
  {
    id: 'cmrvybic5003rnjqm2umamgv7',
    questionText: 'Simplify: (2x)(3x)',
    answers: [
      { id: 'cmrvybic6003tnjqm2v9r7n2v', content: '6x' },
      { id: 'cmrvybic6003vnjqm4r4x4w7m', content: '5x²' },
      { id: 'cmrvybic7003xnjqmtz0z2mws', content: '6x²' },
      { id: 'cmrvybic8003znjqmq9mcygvr', content: '6x²' },
    ],
    explanation: 'Multiply the coefficients: 2 × 3 = 6. Multiply the variables: x × x = x². So (2x)(3x) = 6x².',
    hintText: 'Multiply coefficients together and variables together separately.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybic80045njqmhg5lmplm',
    questionText: 'What is the mean (average) of the numbers 4, 8, 12, 16, and 20?',
    answers: [
      { id: 'cmrvybic90055njqm7bpvhqcx', content: '10' },
      { id: 'cmrvybica0065njqm5e2mztvl', content: '14' },
      { id: 'cmrvybica0066njqmmg3wf7z3', content: '12' },
      { id: 'cmrvybica0067njqmznm2kls2', content: '16' },
    ],
    explanation: 'Mean = Sum of all values ÷ Number of values = (4 + 8 + 12 + 16 + 20) ÷ 5 = 60 ÷ 5 = 12. The mean is 12.',
    hintText: 'Add all the numbers together and divide by how many numbers there are.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybica004fnjqm6sudaevg',
    questionText: 'If a triangle has a base of 10 cm and a height of 6 cm, what is its area?',
    answers: [
      { id: 'cmrvybica004hnjqm6rdk1svl', content: '30 cm²' },
      { id: 'cmrvybica004jnjqm99j5q3w8', content: '60 cm²' },
      { id: 'cmrvybica004lnjqm0chbxfsd', content: '16 cm²' },
      { id: 'cmrvybica004nnjqmwczkp26q', content: '20 cm²' },
    ],
    explanation: 'Area of a triangle = ½ × base × height = ½ × 10 × 6 = 30 cm². Remember the formula includes the factor of ½, unlike rectangles.',
    hintText: 'Use the triangle area formula: A = ½ × base × height.',
    difficulty: 'medium',
  },
  {
    id: 'cmrvybicf004rnjqmh2scbglr',
    questionText: 'Simplify the expression: 2³ × 2⁴',
    answers: [
      { id: 'cmrvybicg004tnjqmt7hjbjjk', content: '2⁷ = 128' },
      { id: 'cmrvybich004vnjqmy4rcl4x7', content: '2¹² = 4096' },
      { id: 'cmrvybich004xnjqm2w6pgxdk', content: '4⁷' },
      { id: 'cmrvybici004znjqmzp4t0wgl', content: '2⁷ = 128' },
    ],
    explanation: 'When multiplying with the same base, add the exponents: 2³ × 2⁴ = 2^(3+4) = 2⁷ = 128. This is the Product Rule for exponents.',
    hintText: 'When multiplying terms with the same base, add the exponents.',
    difficulty: 'medium',
  },
  {
    id: 'cmrvybich0051njqm3rhkkclm',
    questionText: 'Maria earns $15 per hour. If she works 36 hours in a week, how much does she earn in total?',
    answers: [
      { id: 'cmrvybich0053njqm2j8rwdlz', content: '$540' },
      { id: 'cmrvybici0055njqm6zmmz4gx', content: '$480' },
      { id: 'cmrvybici0057njqm1kbc0gj0', content: '$600' },
      { id: 'cmrvybicj0059njqm4gfvhwqd', content: '$510' },
    ],
    explanation: 'Total earnings = Hourly wage × Hours worked = $15 × 36 = $540. Maria earns $540 for the week.',
    hintText: 'Multiply the hourly rate by the number of hours worked.',
    difficulty: 'easy',
  },
];

const scienceQuestions: QUpdate[] = [
  {
    id: 'cmrvybicp005injqmdqdjaq0l',
    questionText: 'What is the chemical formula for water?',
    answers: [
      { id: 'cmrvybicp005knjqmxz7wpx3p', content: 'CO₂' },
      { id: 'cmrvybicq005mnjqmy9g7yy3w', content: 'H₂O' },
      { id: 'cmrvybicq005onjqm5xw4f4q2', content: 'NaCl' },
      { id: 'cmrvybicr005qnjqmzfhr0bvx', content: 'O₂' },
    ],
    explanation: 'Water is composed of two hydrogen atoms (H) and one oxygen atom (O), giving it the chemical formula H₂O. This is one of the most fundamental chemical formulas tested on the GED Science test.',
    hintText: 'Think about what elements make up water.',
    difficulty: 'easy',
  },
  {
    id: 'cmrvybicr005snjqm0adxi439',
    questionText: 'What is the primary function of the mitochondria in a cell?',
    answers: [
      { id: 'cmrvybics005unjqm4b1dwpph', content: 'To store genetic information (DNA)' },
      { id: 'cmrvybics005wnjqm4g8whm4j', content: 'To produce energy (ATP)' },
      { id: 'cmrvybict005ynjqm6ldg2px2', content: 'To control what enters and leaves the cell' },
      { id: 'cmrvybict0060njqmbwjsdwvc', content: 'To make proteins' },
    ],
    explanation: 'Mitochondria are known as the 