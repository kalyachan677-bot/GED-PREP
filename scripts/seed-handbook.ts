import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

/**
 * GED Handbook Seed Script
 * Populates handbook_topics + handbook_contents for all 4 GED subjects.
 * Category A (handbook): Exam info, scoring, calculator, time management.
 * Category B (textbook): Core concepts, formulas, vocabulary.
 * Content sourced from Kaplan GED, Princeton Review, McGraw-Hill GED.
 */

const SUBJECT_CODES = ["math", "science", "rla", "ss"] as const;

// ── Helper: Markdown-safe text ──
const th = (s: string) => s;
const mm = (s: string) => s;

async function main() {
  console.log("Seeding Handbook Topics & Contents...");

  // Look up subject IDs by code
  const subjects = await db.subject.findMany({
    where: { code: { in: [...SUBJECT_CODES] } },
    select: { id: true, code: true },
  });
  const sMap = Object.fromEntries(subjects.map((s) => [s.code, s.id]));

  // ── Clear existing handbook data ──
  await db.handbookContent.deleteMany();
  await db.handbookTopic.deleteMany();
  console.log("  Cleared existing handbook data.");

  // ═══════════════════════════════════════════════════════════════
  //  SECTION A: EXAM HANDBOOK (categoryType = "handbook")
  // ═══════════════════════════════════════════════════════════════

  const examHandbookTopics = [
    // ── MATH ──
    {
      subjectCode: "math" as const,
      title: "GED Mathematical Reasoning Exam Overview",
      titleTh: th("ภาพรวมข้อสอบ GED คณิตศาสตร์"),
      titleMm: mm("GED ရောင်ခံသတိပြုရန် စမ်းပြဿနာ အကြောင်း"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# ภาพรวมข้อสอบ GED คณิตศาสตร์

## รูปแบบข้อสอบ
ข้อสอบ GED คณิตศาสตร์ประกอบด้วยข้อสอบทั้งหมด **46 ข้อ** เวลาสอบ **115 นาที** (ประมาณ 2 ชั่วโมง 30 นาที)

## ส่วนแบ่งคะแนนในข้อสอบ
- คะแนนเต็ม **175 คะแนน** สำหรับส่วนคณิตศาสตร์
- คะแนนผ่านขั้นต่ำ **145 คะแนน** (GED Passing Score)
- คะแนน College Ready **165 คะแนน**
- คะแนน College Ready + Credit **175 คะแนน**

## ทักษะที่วัด
1. **Quantitative Problem Solving** (~45%) — การแก้ปัญหาเชิงปริมาณ
2. **Algebraic Problem Solving** (~55%) — การแก้ปัญหาเชิงพีชคณิต

## หมวดหมู่หัวข้อที่สอบ
- การดำเนินการกับจำนวน (Number Operations)
- เศษส่วนและทศนิยม (Fractions & Decimals)
- สัดส่วนและอัตราส่วน (Ratios & Proportions)
- ค่าร้อยละ (Percents)
- ทศนิยมและจำนวนจริง (Real Numbers)
- พีชคณิตเบื้องต้น (Basic Algebra)
- สมการเชิงเส้น (Linear Equations & Inequalities)
- ฟังก์ชัน (Functions)
- รูปเรขาคณิต (Geometry)
- การวิเคราะห์ข้อมูลและสถิติ (Data Analysis & Statistics)
- ความน่าจะเป็น (Probability)`),
          contentBodyMm: mm(`# GED ရောင်ခံသတိပြုရန် စမ်းပြဿနာ အကြောင်း

## စမ်းပြဿနာ အုပ်စုံအကြောင်း
GED ရောင်ခံသတိပြုရန် စမ်းပြဿနာတွင် **၄၆** မေးခွန်းရှိပါသည်။ စမ်းမှတ်ချိန် **၁၁၅** မိနစ် (နှစ်နာရီ တစ်သိန်း) ပေးထားပါသည်။

## အမှန်တကယ်နှုန်း
- အမြဲ့မှတ် **၁၇၅** ရှိပါသည်
- အောက်ဆုံး သက်သာချက် **၁၄၅** ရှိပါသည်
- College Ready **၁၆၅** ရှိပါသည်
- College Ready + Credit **၁၇၅** ရှိပါသည်`),
          contentBodyEn: `# GED Mathematical Reasoning Exam Overview

## Test Format
The GED Mathematical Reasoning test consists of **46 questions** with a time limit of **115 minutes** (approximately 2 hours 30 minutes).

## Scoring Scale
- Maximum score: **175 points** for the Math section
- GED Passing Score: **145 points** (minimum to pass)
- College Ready: **165 points**
- College Ready + Credit: **175 points**

## Assessed Skills
1. **Quantitative Problem Solving** (~45%)
2. **Algebraic Problem Solving** (~55%)

## Content Categories Tested
- Number Operations
- Fractions & Decimals
- Ratios & Proportions
- Percents
- Real Numbers
- Basic Algebra
- Linear Equations & Inequalities
- Functions
- Geometry
- Data Analysis & Statistics
- Probability`,
          keyTakeaways: JSON.stringify([
            "ข้อสอบคณิตศาสตร์ 46 ข้อ / 115 นาที",
            "คะแนนผ่านขั้นต่ำ 145 คะแนน",
            "พีชคณิตมีน้ำหนัก 55% สูงกว่าเชิงปริมาณ 45%",
            "สอบครอบคลุมตั้งแต่จำนวน พีชคณิต เรขาคณิต สถิติ ไปจนถึงความน่าจะเป็น",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },
    {
      subjectCode: "math",
      title: "Calculator Use (TI-30XS) & Item Types",
      titleTh: th("การใช้เครื่องคิดเลข TI-30XS และประเภทข้อสอบ"),
      titleMm: mm("TI-30XS ခန်ိန်တွက်စုံ အသုံးပြုခြင်းနှင့် မေးခွန်းအမျိုးအစား"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# การใช้เครื่องคิดเลข TI-30XS MultiView

## ว่าด้วยเครื่องคิดเลข
- สามารถใช้เครื่องคิดเลข Texas Instruments TI-30XS MultiView ได้ **ทุกข้อ**
- ไม่อนุญาตให้ใช้เครื่องคิดเลขรุ่นอื่น
- จะมีเครื่องคิดเลขให้บนหน้าจอสอบ (On-Screen Calculator) สำหรับคอมพิวเตอร์

## วิธีกดปุ่มสำคัญบน TI-30XS
1. **2nd** + **x²** = ค่ารากที่สอง (Square Root)
2. **2nd** + **x³** = ค่ารากที่สาม (Cube Root)
3. **^** = ยกกำลัง (Exponent) เช่น 3^4 = 81
4. **2nd** + **π** = ค่า π ≈ 3.14159...
5. **2nd** + **(-)** = ใส่ค่าลบ
6. **n/d** = ใส่เศษส่วน เช่น 1/2 + 1/3
7. **2nd** + **PRB** = เลือก nPr, nCr (Permutation, Combination)
8. **STAT** = เข้าโหมดสถิติ

## ประเภทข้อสอบ (Item Types)
1. **Multiple Choice** — เลือกคำตอบ 1 ข้อ จาก 5 ตัวเลือก
2. **Multiple Select** — เลือกคำตอบได้มากกว่า 1 ข้อ
3. **Fill-in-the-Blank** — พิมพ์คำตอบเอง (ตัวเลขหรือทศนิยม)
4. **Drag-and-Drop** — ลากวางคำตอบให้ถูกต้อง
5. **Drop-Down** — เลือกคำตอบจาก Drop-Down menu
6. **Hot Spot** — คลิกจุดบนกราฟหรือรูปภาพ

## เคล็ดลับสำคัญ
- อ่านโจทย์ให้รอบคอบก่อนกดเครื่องคิดเลข
- ตรวจสอบคำตอบด้วยการคำนวณย้อนกลับ
- สำหรับข้อ Fill-in-the-Blank ใส่ค่าทศนิยมให้ตรงตามที่โจทย์ต้องการ (2 ตำแหน่ง / 3 ตำแหน่ง)`),
          contentBodyMm: mm(`# TI-30XS MultiView ခန်ိန်တွက်စုံ အသုံးပြုခြင်း

## ခန်ိန်တွက်စုံ အကြောင်း
- Texas Instruments TI-30XS MultiView ခန်ိန်တွက်စုံကို **မေးခွန်းအားလုံး** တွင် အသုံးပြုနိုင်ပါသည်။
- အခြား ခန်ိန်တွက်စုံမျိုးကို ခွင့်မပြုပါ။

## အဓိက ချိန်မှန်များ
1. **2nd** + **x²** = နှစ်ထက်ပေါ် (Square Root)
2. **2nd** + **x³** = သုံးထက်ပေါ် (Cube Root)
3. **^** = အပြုအမူ (Exponent)
4. **2nd** + **π** = π ≈ 3.14159...
5. **n/d** = စပါ (Fraction)`),
          contentBodyEn: `# Calculator Use (TI-30XS) & Item Types

## Calculator Policy
- You may use a Texas Instruments TI-30XS MultiView calculator on **ALL questions**.
- No other calculator models are permitted.
- An on-screen TI-30XS calculator is provided for computer-based testing.

## Key TI-30XS Button Sequences
1. **2nd** + **x²** = Square Root
2. **2nd** + **x³** = Cube Root
3. **^** = Exponent (e.g., 3^4 = 81)
4. **2nd** + **π** = π ≈ 3.14159...
5. **2nd** + **(-)** = Enter negative values
6. **n/d** = Enter fractions (e.g., 1/2 + 1/3)
7. **2nd** + **PRB** = Access nPr, nCr (Permutation, Combination)
8. **STAT** = Statistics mode

## Item Types
1. **Multiple Choice** — Select 1 answer from 5 options
2. **Multiple Select** — Select more than 1 answer
3. **Fill-in-the-Blank** — Type your own answer (number or decimal)
4. **Drag-and-Drop** — Drag answers to correct positions
5. **Drop-Down** — Select answer from dropdown menu
6. **Hot Spot** — Click a point on a graph or image

## Important Tips
- Read each question carefully before using the calculator.
- Verify answers by back-calculating.
- For Fill-in-the-Blank, enter the exact decimal places requested.`,
          keyTakeaways: JSON.stringify([
            "ใช้ TI-30XS MultiView ได้ทุกข้อ ไม่จำกัด",
            "2nd + x² = รากที่สอง, 2nd + x³ = รากที่สาม",
            "ข้อสอบมี 6 ประเภท: MC, Multi-Select, Fill-Blank, Drag-Drop, Drop-Down, Hot Spot",
            "Fill-in-the-Blank ต้องระวังทศนิยมให้ตรงตามโจทย์กำหนด",
          ]),
          formulaOrRules: JSON.stringify([
            "TI-30XS: 2nd + x² = √, ^ = ยกกำลัง, n/d = เศษส่วน",
            "2nd + PRB: nPr (Permutation), nCr (Combination)",
          ]),
        },
      ],
    },
    {
      subjectCode: "math",
      title: "Time Management & Test-Taking Strategies",
      titleTh: th("กลยุทธ์บริหารเวลาและเทคนิคสอบ"),
      titleMm: mm("အချိန်ရည်ရွယ်ခြင်းနှင့် စမ်းမှတ်နည်းလမ်းများ"),
      sortOrder: 2,
      contents: [
        {
          contentBodyTh: th(`# กลยุทธ์บริหารเวลาสอบคณิตศาสตร์

## การกระจายเวลา (115 นาที / 46 ข้อ)
- **2 นาทีต่อข้อ** เป็นค่าเฉลี่ยที่ควรใช้
- ใช้เวลา **5 นาทีแรก** อ่านข้อสอบทั้งหมดคร่าวๆ ทำเครื่องหมายที่ข้อง่าย
- ทำข้อง่ายก่อน ข้อยากไว้ทีหลัง
- สำรองเวลา **15-20 นาทีสุดท้าย** สำหรับตรวจสอบคำตอบ

## เทคนิคการทำข้อสอบ
1. **Pacing**: ห้ามติดข้อเดียวนานเกิน 3 นาที — ข้ามไปก่อน ทำทีหลัง
2. **Elimination**: ตัดคำตอบที่ผิดออก 2-3 ตัวเลือก โอกาสตอบถูกสูงขึ้นมาก
3. **Back-Solving**: สำหรับข้อเลือกตอบ — ทดสอบคำตอบย้อนกลับจากตัวเลือก
4. **Estimation**: ประมาณค่าคำตอบก่อนคำนวณแม่นตรง ช่วยตรวจสอบ
5. **Drawing Diagrams**: ข้อเรขาคณิต ให้วาดรูปช่วยเสมอ

## ข้อผิดพลาดที่พบบ่อย
- อ่านโจทย์ผิด (ไม่อ่านคำว่า "NOT" หรือ "EXCEPT")
- คำนวณผิดเรื่องเครื่องหมาย + และ -
- ลืมแปลงหน่วย (เช่น นิ้วเป็นฟุต, องศาเป็นเรเดียน)
- ตอบไม่ครบ — ข้อ Multiple Select ต้องเลือกครบทุกคำตอบที่ถูกต้อง`),
          contentBodyMm: mm(`# အချိန်ရည်ရွယ်ခြင်းနှင့် စမ်းမှတ်နည်းလမ်းများ

## အချိန် ချဲ့ချသန် (၁၁၅ မိနစ် / ၄၆ မေးခွန်း)
- တစ်မေးခွန်းလုံး **၂ မိနစ်** သုံးသပ်သည်
- ပြီးပြည့်စုံ စမ်းပြဿနာကို အရေအတွက် **၅ မိနစ်** ဖြင့် ဖတ်ရန်
- လွန်ခဲ့သော အပြုအမူများကို နောက်ဆုံး **၁၅-၂၀ မိနစ်** တွင် စစ်ဆေးရန်`),
          contentBodyEn: `# Time Management & Test-Taking Strategies

## Pacing Guide (115 minutes / 46 questions)
- **2 minutes per question** is the average target.
- Spend the **first 5 minutes** scanning all questions and marking easy ones.
- Do easy questions first, skip difficult ones for later.
- Reserve **15-20 minutes** at the end for reviewing answers.

## Test-Taking Techniques
1. **Pacing**: Never spend more than 3 minutes on a single question — skip and return.
2. **Elimination**: Eliminate 2-3 clearly wrong answers to improve odds.
3. **Back-Solving**: For multiple choice, plug answer choices back into the problem.
4. **Estimation**: Approximate the answer before calculating precisely.
5. **Drawing Diagrams**: Always draw diagrams for geometry problems.

## Common Mistakes to Avoid
- Misreading the question (missing "NOT" or "EXCEPT").
- Sign errors in calculations (+ vs -).
- Forgetting unit conversions (inches to feet, degrees to radians).
- Incomplete answers on Multiple Select questions.`,
          keyTakeaways: JSON.stringify([
            "2 นาที/ข้อ เป็นค่าเฉลี่ย — ข้อยางเกิน 3 นาทีให้ข้าม",
            "Elimination: ตัดเลือกผิดออก เหลือ 2-3 ตัวเลือก โอกาสถูกสูงขึ้นมาก",
            "Back-Solving: สำหรับ MC — ทดสอบคำตอบย้อนจากตัวเลือก",
            "สำรองเวลา 15-20 นาทีสุดท้ายตรวจสอบคำตอบ",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },

    // ── SCIENCE ──
    {
      subjectCode: "science",
      title: "GED Science Exam Overview",
      titleTh: th("ภาพรวมข้อสอบ GED วิทยาศาสตร์"),
      titleMm: mm("GED သုတေသီ စမ်းပြဿနာ အကြောင်း"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# ภาพรวมข้อสอบ GED วิทยาศาสตร์

## รูปแบบข้อสอบ
- ข้อสอบทั้งหมด **40 ข้อ** เวลาสอบ **90 นาที**

## ส่วนแบ่งคะแนน
- คะแนนเต็ม: **175** | ผ่านขั้นต่ำ: **145** | College Ready: **165**

## หมวดหมู่ที่สอบ
1. **Life Science** (~40%) — ชีววิทยา เซลล์ กรรมพันธุ์ วิวัฒนาการ
2. **Physical Science** (~40%) — เคมี ฟิสิกส์ ปฏิกิริยา พลังงาน
3. **Earth & Space Science** (~20%) — ธรณีวิทยา อุตุนิยมวิทยา ดาราศาสตร์

## ทักษะที่วัด (Science Practices)
- **Interpretation of Data** — อ่านและวิเคราะห์กราฟ ตาราง แผนภูมิ
- **Science Explanations** — อธิบายปรากฏการณ์ทางวิทยาศาสตร์
- **Problem Solving** — แก้ปัญหาโดยใช้วิธีทางวิทยาศาสตร์
- **Mathematical Reasoning in Science** — ใช้คณิตศาสตร์ในบริบทวิทยาศาสตร์

## เครื่องมือที่ใช้ในข้อสอบ
- ไม่มีเครื่องคิดเลข — ใช้การคำนวณง่ายๆ เท่านั้น
- มี Periodic Table ให้บนหน้าจอ
- มี Reference Sheet สำหรับสูตรฟิสิกส์พื้นฐาน`),
          contentBodyEn: `# GED Science Exam Overview

## Test Format
- **40 questions** total, **90 minutes** time limit.

## Scoring
- Max: **175** | Pass: **145** | College Ready: **165**

## Content Distribution
1. **Life Science** (~40%) — Biology, cells, genetics, evolution
2. **Physical Science** (~40%) — Chemistry, physics, reactions, energy
3. **Earth & Space Science** (~20%) — Geology, weather, astronomy

## Science Practices Assessed
- **Interpretation of Data** — Read and analyze graphs, tables, charts
- **Science Explanations** — Explain scientific phenomena
- **Problem Solving** — Apply scientific reasoning to solve problems
- **Mathematical Reasoning in Science** — Use math in science contexts

## Tools Available
- No calculator — only basic arithmetic required.
- On-screen Periodic Table provided.
- Reference Sheet for basic physics formulas.`,
          contentBodyMm: mm(`# GED သုတေသီ စမ်းပြဿနာ အကြောင်း

## စမ်းပြဿနာ အုပ်စုံအကြောင်း
- စမ်းမေးခွန်း **၄၀** မေးခွန်း၊ **၉၀** မိနစ်။

## အမှန်တကယ်နှုန်း
- အမြဲ့ **၁၇၅** | အောက်ဆုံး **၁၄၅** | College Ready **၁၆၅**

## အကြောင်းအရာ အုပ်စုံ
1. **သုတေသီရေး ဘောလုံး** (~၄၀%)
2. **သုတေသီရေး ဘက်** (~၄၀%)
3. **မြေနှင့် အကြောင်းရေး သုတေသီ** (~၂၀%)`),
          keyTakeaways: JSON.stringify([
            "ข้อสอบวิทยาศาสตร์ 40 ข้อ / 90 นาที",
            "Life Science 40% + Physical Science 40% + Earth/Space 20%",
            "ไม่มีเครื่องคิดเลข — มี Periodic Table ให้",
            "เน้นการอ่านกราฟ/ตาราง และอธิบายปรากฏการณ์",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },
    {
      subjectCode: "science",
      title: "Science Item Types & Time Management",
      titleTh: th("ประเภทข้อสอบวิทยาศาสตร์และกลยุทธ์บริหารเวลา"),
      titleMm: mm("သုတေသီ မေးခွန်းအမျိုးအစားနှင့် အချိန်ရည်ရွယ်ခြင်း"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# ประเภทข้อสอบและกลยุทธ์วิทยาศาสตร์

## ประเภทข้อสอบ
1. **Multiple Choice** — เลือก 1 คำตอบจาก 5 ตัวเลือก (ส่วนใหญ่)
2. **Multiple Select** — เลือกมากกว่า 1 คำตอบ
3. **Fill-in-the-Blank** — พิมพ์คำตอบเอง
4. **Drag-and-Drop** — ลากวางลำดับ/จัดหมวดหมู่
5. **Hot Spot** — คลิกจุดบนกราฟหรือแผนภาพ

## ลักษณะพิเศษของข้อสอบวิทยาศาสตร์
- ข้อสอบมักมี **กราฟ ตาราง แผนภูมิ** ประกอบ
- บางข้อมี **Short Reading Passage** อธิบายการทดลอง
- ต้องอ่าน **แผนภูมิวงจร (Cycle Diagram)** และ **แผนภาพระบบ (System Diagram)**

## กลยุทธ์บริหารเวลา (90 นาที / 40 ข้อ)
- เฉลี่ย **2.25 นาที/ข้อ**
- ข้อที่มีกราฟ/ตารางให้ใช้เวลา **3 นาที**
- ข้อ Multiple Choice ธรรมดาให้ใช้ **1.5 นาที**
- สำรอง **10 นาทีสุดท้าย** ตรวจสอบ

## เทคนิคทำข้อสอบ
1. **อ่านกราฟก่อนอ่านโจทย์** — ดูแกน X, Y, หน่วย, ค่าสูงสุด/ต่ำสุด
2. **หา Trend** — กราฟเพิ่มขึ้น/ลดลง/คงที่?
3. **อ่าน Caption** ของรูป/กราฟเสมอ
4. **ใช้ Process of Elimination** ตัดคำตอบที่ขัดแย้งกับข้อมูล`),
          contentBodyEn: `# Science Item Types & Time Management

## Item Types
1. **Multiple Choice** — 1 answer from 5 options (most common)
2. **Multiple Select** — More than 1 answer
3. **Fill-in-the-Blank** — Type your answer
4. **Drag-and-Drop** — Order or categorize
5. **Hot Spot** — Click a point on a graph or diagram

## Science Question Characteristics
- Questions often include **graphs, tables, charts**.
- Some include **Short Reading Passages** describing experiments.
- Must read **Cycle Diagrams** and **System Diagrams**.

## Time Management (90 min / 40 questions)
- Average: **2.25 min/question**
- Questions with graphs/tables: **3 minutes**
- Standard Multiple Choice: **1.5 minutes**
- Reserve **10 minutes** at the end for review.

## Test-Taking Techniques
1. **Read the graph before the question** — Check axes, units, max/min.
2. **Identify the Trend** — Increasing/decreasing/constant?
3. **Always read captions** on images and graphs.
4. **Use Process of Elimination** to remove contradicting answers.`,
          contentBodyMm: mm(`# သုတေသီ မေးခွန်းအမျိုးအစားနှင့် အချိန်ရည်ရွယ်ခြင်း

## မေးခွန်း အမျိုးအစား
1. **Multiple Choice** — ၅ ရွေးချယ်မှုမှ တစ်ခုကို ရွေးချယ်ပါ
2. **Multiple Select** — တစ်ခုထိုပါ ရွေးချယ်နိုင်ပါသည်
3. **Fill-in-the-Blank** — မကြာသေးမီ ဖြတ်ပါ
4. **Drag-and-Drop** — ဖွဲ့စည်းပါ သို့မဟုတ် အုပ်စုံဖွဲ့ပါ
5. **Hot Spot** — စာရင်း သို့မဟုတ် အပြာရင်းပေါ်တွင် ကိုင်ပါ`),
          keyTakeaways: JSON.stringify([
            "ข้อสอบมักมีกราฟ/ตารางประกอบ — อ่านกราฟก่อนอ่านโจทย์",
            "เฉลี่ย 2.25 นาที/ข้อ — ข้อมีกราฟใช้ 3 นาที",
            "เน้นดู Trend (แนวโน้ม) ของข้อมูลก่อนตอบ",
            "อ่าน Caption ของรูป/กราฟเสมอ — มักมีข้อมูลสำคัญ",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },

    // ── RLA ──
    {
      subjectCode: "rla",
      title: "GED RLA Exam Overview",
      titleTh: th("ภาพรวมข้อสอบ GED ภาษาและการอ่าน"),
      titleMm: mm("GED ဘာသာစကားနှင့် ဖတ်ပါ စမ်းပြဿနာ အကြောင်း"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# ภาพรวมข้อสอบ GED Reasoning Through Language Arts (RLA)

## รูปแบบข้อสอบ
- ข้อสอบทั้งหมด **~47 ข้อ** (รวม Extended Response 1 ข้อ) เวลา **150 นาที**

## โครงสร้างข้อสอบ
1. **Reading Comprehension** (~45%) — อ่านเข้าใจจากบทความ
2. **Grammar & Language** (~30%) — ไวยากรณ์ การใช้ภาษา
3. **Extended Response / Essay** (~25%) — เขียนเรียงความวิเคราะห์

## ส่วนแบ่งคะแนน
- คะแนนเต็ม: **175** | ผ่าน: **145** | College Ready: **165**

## ประเภทข้อสอบ
1. **Multiple Choice** — เลือกคำตอบ (ส่วนใหญ่)
2. **Drag-and-Drop** — ลากวางประโยค/คำ
3. **Drop-Down** — เลือกคำที่เหมาะสมในประโยค
4. **Fill-in-the-Blank** — พิมพ์คำตอบ
5. **Extended Response (Essay)** — เขียนเรียงความ ~250 คำ

## Extended Response (เรียงความ)
- ต้องเขียน **วิเคราะห์ Argument** จากบทความที่ให้
- ให้คะแนนจาก 3 มิติ:
  1. **Claim** — การระบุข้ออ้างหลัก
  2. **Evidence** — การยกหลักฐานสนับสนุน
  3. **Organization & Language** — โครงสร้างและภาษา
- คะแนนเต็ม Extended Response = **12 คะแนน** (แต่ละมิติ 0-4 คะแนน)`),
          contentBodyEn: `# GED RLA Exam Overview

## Test Format
- Approximately **47 questions** (including 1 Extended Response). **150 minutes**.

## Structure
1. **Reading Comprehension** (~45%)
2. **Grammar & Language** (~30%)
3. **Extended Response / Essay** (~25%)

## Scoring
- Max: **175** | Pass: **145** | College Ready: **165**

## Item Types
1. **Multiple Choice** (most common)
2. **Drag-and-Drop** — Rearrange sentences/words
3. **Drop-Down** — Select appropriate word in a sentence
4. **Fill-in-the-Blank**
5. **Extended Response (Essay)** — ~250 word argument analysis

## Extended Response (Essay)
- Analyze an argument from a given passage.
- Scored on 3 dimensions (each 0-4 points, total 12):
  1. **Claim** — Identify main argument
  2. **Evidence** — Support with evidence from text
  3. **Organization & Language** — Structure and clarity`,
          contentBodyMm: mm(`# GED RLA စမ်းပြဿနာ အကြောင်း

## စမ်းပြဿနာ အုပ်စုံ
- စမ်းမေးခွန်း **၄၇** မေးခွန်း (Extended Response တစ်ခု ပါဝင်)။ **၁၅၀** မိနစ်။

## အပြုအမူ အုပ်စုံ
1. **ဖတ်ပါမှု အားလပ်မှု** (~၄၅%)
2. **ဘာသာစကား လက်ရှိ** (~၃၀%)
3. **Extended Response** (~၂၅%) — စာများဖတ်ရေး ခန့်မှန်းခြင်း`),
          keyTakeaways: JSON.stringify([
            "ข้อสอบ RLA ~47 ข้อ / 150 นาที",
            "Extended Response (Essay) ให้คะแนน 12 คะแนน (Claim 4 + Evidence 4 + Org 4)",
            "เน้นอ่านเข้าใจ 45%, ไวยากรณ์ 30%, เรียงความ 25%",
            "Drop-Down และ Drag-and-Drop ใช้ทดสอบไวยากรณ์",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },
    {
      subjectCode: "rla",
      title: "Extended Response (Essay) Writing Guide",
      titleTh: th("คู่มือเขียนเรียงความ GED Extended Response"),
      titleMm: mm("GED Extended Response စာနယ်ဖတ်ရေး လမ်းដန်း"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# คู่มือเขียน Extended Response (Essay) GED

## โครงสร้างเรียงความที่ควรทำ (250-500 คำ)

### ย่อหน้าที่ 1: Introduction (บทนำ)
- เปิดด้วยประโยค Hook ที่เกี่ยวข้องกับหัวข้อ
- สรุปประเด็นหลักของบทความต้นฉบับใน 1-2 ประโยค
- **ระบุ Claim ชัดเจน**: "The author argues that..."

### ย่อหน้าที่ 2-3: Body (เนื้อเรื่อง)
- แต่ละย่อหน้ายก **หลักฐาน 1-2 ข้อ** จากบทความ
- ใช้ **Direct Quote** หรือ **Paraphrase** จากต้นฉบับ
- อธิบาย **วิธีที่หลักฐานสนับสนุน Claim**
- ใช้คำเชื่อม: "Furthermore", "In addition", "The author also states..."

### ย่อหน้าสุดท้าย: Conclusion (บทสรุป)
- สรุป Claim และหลักฐานสำคัญอีกครั้ง
- ไม่ต้องเพิ่มข้อมูลใหม่
- ปิดท้ายด้วยประโยคสรุปอารมณ์คิด

## เกณฑ์ให้คะแนน
| มิติ | 0 คะแนน | 4 คะแนน |
|---|---|---|
| **Claim** | ไม่ระบุ Claim | ระบุ Claim ชัดเจน ถูกต้อง |
| **Evidence** | ไม่มีหลักฐาน | มี 2+ หลักฐานที่เกี่ยวข้อง อ้างอิงจากบทความ |
| **Organization** | ไม่มีโครงสร้าง | มี Intro, Body, Conclusion ชัดเจน |

## เคล็ดลับ
- เขียน **250 คำขึ้นไป** — ข้อสั้นเกินไปจะได้คะแนนต่ำ
- ใช้ **คำเชื่อมเชิงตรรกะ** (However, Therefore, In contrast)
- อ้างอิงบทความต้นฉบับ **ทุกครั้ง** ที่ยกหลักฐาน`),
          contentBodyEn: `# Extended Response (Essay) Writing Guide

## Recommended Essay Structure (250-500 words)

### Paragraph 1: Introduction
- Open with a hook related to the topic.
- Summarize the main points of the source passage in 1-2 sentences.
- **State your Claim clearly**: "The author argues that..."

### Paragraphs 2-3: Body
- Each paragraph presents **1-2 pieces of evidence** from the passage.
- Use **direct quotes** or **paraphrases** from the source.
- Explain **how the evidence supports the Claim**.
- Use transition words: "Furthermore", "In addition", "The author also states..."

### Final Paragraph: Conclusion
- Restate the Claim and key evidence.
- Do not introduce new information.
- End with a concluding thought.

## Scoring Rubric
| Dimension | 0 points | 4 points |
|---|---|---|
| **Claim** | No claim identified | Clear, accurate claim |
| **Evidence** | No evidence | 2+ relevant pieces with citations |
| **Organization** | No structure | Clear Intro, Body, Conclusion |

## Tips
- Write **at least 250 words** — shorter essays score lower.
- Use **logical transition words** (However, Therefore, In contrast).
- **Always cite** the source passage when presenting evidence.`,
          contentBodyMm: mm(`# Extended Response (Essay) ရေးရန် လမ်းညွှန်

## အကယ်XmlNode နည်းလမ်း (၂၅၀-၅၀၀ စကားလုံး)

### ပထမ အကွက်: Introduction
- အကြောင်းရေ နှင့် ဆက်စပ်သော စကားရွက်စားဖြင့် စတင်ပါ။
- မူရင်း စာတည်းရှိ အဓိက အမြင်များကို ၁-၂ တိုက် ဖြန့်ပြုးပါ။
- **Claim** ကို တိကျစွာ ဖော်ပြပါ။`),
          keyTakeaways: JSON.stringify([
            "เรียงความ 250-500 คำ โครงสร้าง: Intro → Body (2-3 ย่อหน้า) → Conclusion",
            "ให้คะแนน 3 มิติ: Claim (0-4) + Evidence (0-4) + Organization (0-4) = 12 คะแนน",
            "ต้องยกหลักฐานจากบทความต้นฉบับทุกครั้ง",
            "เขียน 250 คำขึ้นไป — ข้อสั้นได้คะแนนต่ำ",
          ]),
          formulaOrRules: JSON.stringify([
            "Claim = ระบุข้ออ้างหลักของบทความ",
            "Evidence = ยกหลักฐาน 2+ ข้อจากต้นฉบับ (Quote/Paraphrase)",
            "Organization = Intro, Body, Conclusion ชัดเจน",
          ]),
        },
      ],
    },

    // ── SS ──
    {
      subjectCode: "ss",
      title: "GED Social Studies Exam Overview",
      titleTh: th("ภาพรวมข้อสอบ GED สังคมศึกษา"),
      titleMm: mm("GED လူမှုရေးရာ ပညာရေး စမ်းပြဿနာ အကြောင်း"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# ภาพรวมข้อสอบ GED สังคมศึกษา

## รูปแบบข้อสอบ
- ข้อสอบทั้งหมด **~35 ข้อ** เวลาสอบ **90 นาที**

## หมวดหมู่ที่สอบ
1. **Civics & Government** (~50%) — ระบบรัฐสภา รัฐธรรมนูญ สิทธิพลเมือง
2. **U.S. History** (~20%) — ประวัติศาสตร์อเมริกาตั้งแต่สมัย Colonial
3. **Economics** (~15%) — เศรษฐศาสตร์ อุปทาน/อุปสงค์ ระบบเศรษฐกิจ
4. **Geography & World History** (~15%) — ภูมิศาสตร์ ประวัติศาสตร์โลก

## ส่วนแบ่งคะแนน
- คะแนนเต็ม: **175** | ผ่าน: **145** | College Ready: **165**

## ทักษะที่วัด
- **Interpretation of Primary/Secondary Sources** — อ่านเอกสารต้นฉบับ/ทุติยภูมิ
- **Analysis of Social Studies Information** — วิเคราะห์ข้อมูลสังคมศึกษา
- **Application of Social Studies Concepts** — ใช้แนวคิดสังคมศึกษา

## ลักษณะพิเศษ
- ข้อสอบมักให้ **เอกสาร/บทความสั้นๆ** มาอ่านแล้วตอบคำถาม
- ต้องเข้าใจความแตกต่างระหว่าง **Fact** (ข้อเท็จจริง) กับ **Opinion** (ความคิดเห็น)
- ให้ **แผนภูมิ/แผนที่/กราฟ** บ่อย`),
          contentBodyEn: `# GED Social Studies Exam Overview

## Test Format
- Approximately **35 questions**, **90 minutes**.

## Content Distribution
1. **Civics & Government** (~50%) — Parliamentary systems, constitution, civil rights
2. **U.S. History** (~20%) — American history from Colonial era
3. **Economics** (~15%) — Supply/demand, economic systems
4. **Geography & World History** (~15%) — Geography, world history

## Scoring
- Max: **175** | Pass: **145** | College Ready: **165**

## Assessed Skills
- **Interpretation of Primary/Secondary Sources**
- **Analysis of Social Studies Information**
- **Application of Social Studies Concepts**

## Key Characteristics
- Questions often provide **short documents/articles** to read.
- Must distinguish **Fact** from **Opinion**.
- Frequently includes **maps, charts, and graphs**.`,
          contentBodyMm: mm(`# GED လူမှုရေးရာ ပညာရေး စမ်းပြဿနာ အကြောင်း

## စမ်းပြဿနာ အုပ်စုံ
- စမ်းမေးခွန်း **၃၅** မေးခွန်း၊ **၉၀** မိနစ်။

## အကြောင်းအရာ အုပ်စုံ
1. **နိုင်ငံရေးနှင့် အုတ်မြို့** (~၅၀%)
2. **အမေရိကန် သမိုင်း** (~၂၀%)
3. **ဘဏ်ရာရေး** (~၁၅%)
4. **ရပ်သည်းစုံတစ်ခုခံ သမိုင်း** (~၁၅%)`),
          keyTakeaways: JSON.stringify([
            "ข้อสอบ SS ~35 ข้อ / 90 นาที",
            "Civics & Government มีน้ำหนักสูงสุด 50%",
            "ต้องอ่านเอกสารต้นฉบับ/ทุติยภูมิแล้ววิเคราะห์",
            "แยก Fact กับ Opinion ได้เป็นทักษะสำคัญ",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },
    {
      subjectCode: "ss",
      title: "Document Analysis & Test Strategies",
      titleTh: th("เทคนิควิเคราะห์เอกสารและกลยุทธ์สอบสังคมศึกษา"),
      titleMm: mm("စာရင်းရှင်းဖော်ခြင်းနှင့် စမ်းမှတ်နည်းလမ်းများ"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# เทคนิควิเคราะห์เอกสารและกลยุทธ์สอบ

## การวิเคราะห์เอกสาร (Document Analysis)
### ประเภทเอกสาร
1. **Primary Source** — เอกสารต้นฉบับ (สุนทรพจน์ จดหมาย กฎหมาย ภาพถ่าย)
2. **Secondary Source** — เอกสารทุติยภูมิ (บทความวิเคราะห์ ตำรา สารคดี)

### ขั้นตอนการวิเคราะห์
1. **SOAPSTone**: Subject, Occasion, Audience, Purpose, Speaker, Tone
2. หา **Main Idea** (ประเด็นหลัก) ของเอกสาร
3. ระบุ **Author's Purpose** (จุดประสงค์ของผู้เขียน)
4. แยก **Fact vs. Opinion** (ข้อเท็จจริง vs ความคิดเห็น)
5. หา **Bias** (อคติ) ของเอกสาร

## กลยุทธ์บริหารเวลา (90 นาที / 35 ข้อ)
- เฉลี่ย **2.5 นาที/ข้อ**
- ข้อที่มีเอกสารยาวให้ใช้ **3-4 นาที**
- ข้อกราฟ/แผนที่ใช้ **2 นาที**
- สำรอง **10 นาทีสุดท้าย** ตรวจสอบ

## เคล็ดลับสำคัญ
- อ่าน **คำถามก่อนอ่านเอกสาร** — จะได้รู้ว่าต้องหาอะไร
- ขีดเส้นใต้ **Keyword** ในเอกสารขณะอ่าน
- สำหรับข้อ Timeline — จัดลำดับเหตุการณ์ก่อนตอบ`),
          contentBodyEn: `# Document Analysis & Test Strategies

## Document Analysis
### Document Types
1. **Primary Source** — Original documents (speeches, letters, laws, photos)
2. **Secondary Source** — Analysis documents (articles, textbooks, documentaries)

### Analysis Framework
1. **SOAPSTone**: Subject, Occasion, Audience, Purpose, Speaker, Tone
2. Find the **Main Idea** of the document.
3. Identify the **Author's Purpose**.
4. Distinguish **Fact vs. Opinion**.
5. Detect **Bias** in the document.

## Time Management (90 min / 35 questions)
- Average: **2.5 min/question**
- Long documents: **3-4 minutes**
- Graphs/Maps: **2 minutes**
- Reserve **10 minutes** at the end.

## Key Tips
- **Read the question BEFORE the document** — know what to look for.
- **Underline keywords** while reading.
- For Timeline questions — sequence events before answering.`,
          contentBodyMm: mm(`# စာရင်းရှင်းဖော်ခြင်းနှင့် စမ်းမှတ်နည်းလမ်းများ

## စာရင်း ရှင်းဖော်ခြင်း
### စာရင်းအမျိုးအစား
1. **Primary Source** — မူရင်းစာရင်းများ
2. **Secondary Source** — ဒေတာရှင်းဖော်စာရင်းများ`),
          keyTakeaways: JSON.stringify([
            "อ่านคำถามก่อนอ่านเอกสาร — รู้ว่าต้องหาอะไร",
            "SOAPSTone: Subject, Occasion, Audience, Purpose, Speaker, Tone",
            "แยก Fact vs Opinion และหา Bias ของเอกสาร",
            "2.5 นาที/ข้อ เฉลี่ย — เอกสารยาวใช้ 3-4 นาที",
          ]),
          formulaOrRules: JSON.stringify([
            "SOAPSTone = Subject, Occasion, Audience, Purpose, Speaker, Tone",
          ]),
        },
      ],
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  SECTION B: CORE CONCEPT TEXTBOOK (categoryType = "textbook")
  // ═══════════════════════════════════════════════════════════════

  const textbookTopics = [
    // ── MATH TEXTBOOK ──
    {
      subjectCode: "math" as const,
      title: "Number Operations, Fractions & Decimals",
      titleTh: th("การดำเนินการกับจำนวน เศษส่วน และทศนิยม"),
      titleMm: mm("အရေးစားရှင်းရိုးခြင်း၊ စပါများနှင့် သီကုန်တွက်စုံ"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# การดำเนินการกับจำนวน เศษส่วน และทศนิยม

## จำนวนเต็ม (Whole Numbers)
- การบวก ลบ คูณ หาร จำนวนเต็ม
- **Order of Operations (PEMDAS)**: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction
- ตัวอย่าง: 2 + 3 × 4 = 2 + 12 = **14** (ไม่ใช่ 20)

## เศษส่วน (Fractions)
- การบวก/ลบเศษส่วน: ตัวส่วนเท่ากัน บวก/ลบเฉพาะตัวเลข
- การคูณเศษส่วน: ตัวเลข × ตัวเลข, ตัวส่วน × ตัวส่วน
- การหารเศษส่วน: กลับเศษส่วนตัวหลัง แล้วคูณ
- การลดเศษส่วน: หารตัวเลขและตัวส่วนด้วย GCD

## ทศนิยม (Decimals)
- ทศนิยม = เศษส่วนที่มีตัวส่วนเป็น 10, 100, 1000, ...
- 0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4
- การบวก/ลบทศนิยม: จัดจุดทศนิยมให้ตรงกัน
- การคูณทศนิยม: คูณปกติ แล้วนับจุดทศนิยมรวม
- การหารทศนิยม: เลื่อนจุดทศนิยมจนกลายเป็นจำนวนเต็ม`),
          contentBodyEn: `# Number Operations, Fractions & Decimals

## Whole Numbers
- Addition, subtraction, multiplication, division of whole numbers.
- **Order of Operations (PEMDAS)**: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction
- Example: 2 + 3 × 4 = 2 + 12 = **14** (not 20)

## Fractions
- Addition/Subtraction: Denominators must match; add/subtract numerators only.
- Multiplication: numerator × numerator, denominator × denominator.
- Division: flip the second fraction (reciprocal), then multiply.
- Simplification: divide both numerator and denominator by GCD.

## Decimals
- A decimal is a fraction with denominator 10, 100, 1000, ...
- 0.5 = 1/2, 0.25 = 1/4, 0.75 = 3/4
- Addition/Subtraction: Align decimal points.
- Multiplication: Multiply normally, then count total decimal places.
- Division: Move the decimal point to make the divisor a whole number.`,
          contentBodyMm: mm(`# အရေးစားရှင်းရိုးခြင်း၊ စပါများနှင့် သီကုန်တွက်စုံ

## အပေါ်မှတ် အရေးစားများ
- PEMDAS အဆင့်: Parentheses → Exponents → Multiplication/Division → Addition/Subtraction`),
          keyTakeaways: JSON.stringify([
            "PEMDAS: วงเล็บ → ยกกำลัง → คูณ/หาร → บวก/ลบ",
            "คูณเศษส่วน: ตัวเลข×ตัวเลข, ตัวส่วน×ตัวส่วน",
            "หารเศษส่วน: กลับตัวหลังแล้วคูณ",
            "ทศนิยม = เศษส่วนที่ตัวส่วนเป็น 10, 100, 1000",
          ]),
          formulaOrRules: JSON.stringify([
            "a/b + c/d = (ad + bc) / bd",
            "a/b × c/d = ac / bd",
            "a/b ÷ c/d = a/b × d/c = ad / bc",
            "GCD(a,b) = ตัวหารร่วมมากที่สุด",
          ]),
        },
      ],
    },
    {
      subjectCode: "math",
      title: "Algebra: Linear Equations & Inequalities",
      titleTh: th("พีชคณิต: สมการและอสมการเชิงเส้น"),
      titleMm: mm("သာရိုး: ညီမျှက်ညီမှုနှင့် မညီမျှက်ညီမှုများ"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# สมการและอสมการเชิงเส้น

## สมการเชิงเส้นตัวแปรเดียว (One-Variable Linear Equations)
- รูปแบบ: **ax + b = c**
- วิธีแก้: ย้ายข้าง + ดำเนินการย้อนกลับ
- ตัวอย่าง: 3x + 7 = 22 → 3x = 15 → x = 5

## อสมการเชิงเส้น (Linear Inequalities)
- รูปแบบ: **ax + b > c** (หรือ <, ≥, ≤)
- เมื่อ **คูณ/หารด้วยจำนวนลบ** ต้อง **กลับเครื่องหมาย**
- ตัวอย่าง: -2x > 6 → x < -3 (กลับเครื่องหมาย!)

## ระบบสมการเชิงเส้น (Systems of Linear Equations)
- 2 สมการ 2 ตัวแปร: หาจุดตัดของ 2 เส้นตรง
- **วิธี Substitution**: แทนที่ตัวแปรตัวหนึ่งด้วยอีกตัวแปร
- **วิธี Elimination**: บวก/ลบสมการเพื่อลบตัวแปรตัวหนึ่งออก
- ผลลัพธ์: 1 จุดตัด (Unique), ไม่มี (No solution), หรือ ไม่สิ้นสุด (Infinite)

## ความชันของเส้นตรง (Slope)
- **Slope (m)** = (y₂ - y₁) / (x₂ - x₁)
- m > 0: เส้นขึ้น, m < 0: เส้นลง, m = 0: แนวราบ
- สมการเส้นตรง: **y = mx + b** (m = ความชัน, b = จุดตัดแกน y)`),
          contentBodyEn: `# Algebra: Linear Equations & Inequalities

## One-Variable Linear Equations
- Form: **ax + b = c**
- Solve by isolating the variable (inverse operations).
- Example: 3x + 7 = 22 → 3x = 15 → x = 5

## Linear Inequalities
- Form: **ax + b > c** (or <, ≥, ≤)
- When **multiplying/dividing by a negative**, **flip the inequality sign**.
- Example: -2x > 6 → x < -3 (sign flipped!)

## Systems of Linear Equations
- 2 equations, 2 variables: find the intersection of 2 lines.
- **Substitution**: Replace one variable with an expression.
- **Elimination**: Add/subtract equations to eliminate a variable.
- Outcomes: Unique solution, No solution, or Infinite solutions.

## Slope of a Line
- **Slope (m)** = (y₂ - y₁) / (x₂ - x₁)
- m > 0: rising, m < 0: falling, m = 0: flat
- Slope-Intercept Form: **y = mx + b** (m = slope, b = y-intercept)`,
          contentBodyMm: mm(`# ညီမျှက်ညီမှုနှင့် မညီမျှက်ညီမှုများ

## ညီမျှက်ညီမှု မှန်ကန်မှု
- နည်းပညာ: ax + b = c
- နမှုန်ပါ: 3x + 7 = 22 → 3x = 15 → x = 5`),
          keyTakeaways: JSON.stringify([
            "ax + b = c → ย้ายข้าง + ดำเนินการย้อนกลับเพื่อแยก x",
            "อสมการ: คูณ/หารด้วยลบ ต้องกลับเครื่องหมาย",
            "Slope = (y₂-y₁)/(x₂-x₁) — ความชันของเส้นตรง",
            "y = mx + b (m=ความชัน, b=จุดตัด y)",
          ]),
          formulaOrRules: JSON.stringify([
            "ax + b = c → x = (c - b) / a",
            "Slope m = (y₂ - y₁) / (x₂ - x₁)",
            "y = mx + b (Slope-Intercept Form)",
            "การคูณ/หารอสมการด้วยค่าลบ → กลับเครื่องหมาย",
          ]),
        },
      ],
    },
    {
      subjectCode: "math",
      title: "Geometry, Measurement & Data Analysis",
      titleTh: th("เรขาคณิต การวัด และการวิเคราะห์ข้อมูล"),
      titleMm: mm("ဒေတာ ဗဟုသုတ ဖတ်ရှင်းခြင်းနှင့် တိုင်းရင်းသတ်သပ်ခြင်း"),
      sortOrder: 2,
      contents: [
        {
          contentBodyTh: th(`# เรขาคณิต การวัด และการวิเคราะห์ข้อมูล

## รูปเรขาคณิตพื้นฐาน
### พื้นที่ (Area)
- สี่เหลี่ยมผืนผ้า: A = l × w
- สามเหลี่ยม: A = (1/2) × base × height
- วงกลม: A = π × r²
- สี่เหลี่ยมด้านขนาน: A = base × height

### เส้นรอบรูป (Perimeter / Circumference)
- สี่เหลี่ยม: P = 2(l + w)
- วงกลม: C = 2πr = πd
- สามเหลี่ยม: P = a + b + c

### ปริมาตร (Volume)
- ทรงสี่เหลี่ยม: V = l × w × h
- ทรงกระบอก: V = π × r² × h
- ทรงกรวย: V = (1/3) × π × r² × h

### ทฤษฎีบทพีทาโกรัส (Pythagorean Theorem)
- **a² + b² = c²** (c = ค่าเอียงของสามเหลี่ยมมุมฉาก)
- สามเหลี่ยมพีทาโกรัส: 3-4-5, 5-12-13, 8-15-17

## สถิติพื้นฐาน
- **Mean (เฉลี่ย)** = ผลรวม / จำนวน
- **Median (มัธยฐาน)** = ค่ากลางหลังเรียงลำดับ
- **Mode (ฐานนิยม)** = ค่าที่พบบ่อยที่สุด
- **Range** = ค่าสูงสุด - ค่าต่ำสุด

## ความน่าจะเป็น (Probability)
- P(event) = จำนวนผลลัพธ์ที่ต้องการ / จำนวนผลลัพธ์ทั้งหมด
- ค่าอยู่ระหว่าง 0 ถึง 1
- P(complement) = 1 - P(event)`),
          contentBodyEn: `# Geometry, Measurement & Data Analysis

## Basic Geometry
### Area
- Rectangle: A = l × w
- Triangle: A = (1/2) × base × height
- Circle: A = π × r²
- Parallelogram: A = base × height

### Perimeter / Circumference
- Rectangle: P = 2(l + w)
- Circle: C = 2πr = πd
- Triangle: P = a + b + c

### Volume
- Rectangular prism: V = l × w × h
- Cylinder: V = π × r² × h
- Cone: V = (1/3) × π × r² × h

### Pythagorean Theorem
- **a² + b² = c²** (c = hypotenuse of right triangle)
- Pythagorean triples: 3-4-5, 5-12-13, 8-15-17

## Basic Statistics
- **Mean** = Sum / Count
- **Median** = Middle value (when sorted)
- **Mode** = Most frequent value
- **Range** = Maximum - Minimum

## Probability
- P(event) = Favorable outcomes / Total outcomes
- Range: 0 to 1
- P(complement) = 1 - P(event)`,
          contentBodyMm: mm(`# ဒေတာ ဗဟုသုတ ဖတ်ရှင်းခြင်းနှင့် တိုင်းရင်းသတ်သပ်ခြင်း

## ဒေတာဗဟုသုတ အခြေခံများ
- တိုင်းပုံ: A = l × w
- သင်္ချာ: A = (1/2) × base × height
- အံကြီးလေး: A = π × r²`),
          keyTakeaways: JSON.stringify([
            "สามเหลี่ยม: A = ½×base×height, วงกลม: A = πr²",
            "Pythagorean: a² + b² = c² (3-4-5, 5-12-13)",
            "Mean=ผลรวม/จำนวน, Median=ค่ากลาง, Mode=ค่าที่พบบ่อยสุด",
            "P(event) = ผลลัพธ์ที่ต้องการ / ผลลัพธ์ทั้งหมด",
          ]),
          formulaOrRules: JSON.stringify([
            "A = l × w (สี่เหลี่ยม)",
            "A = ½ × b × h (สามเหลี่ยม)",
            "A = πr² (วงกลม)",
            "C = 2πr (เส้นรอบวงกลม)",
            "V = l × w × h (ทรงสี่เหลี่ยม)",
            "V = πr²h (ทรงกระบอก)",
            "a² + b² = c² (พีทาโกรัส)",
            "Mean = Σx / n",
            "P(E) = n(E) / n(S)",
          ]),
        },
      ],
    },

    // ── SCIENCE TEXTBOOK ──
    {
      subjectCode: "science" as const,
      title: "Life Science: Cells, Genetics & Evolution",
      titleTh: th("วิทยาศาสตร์ชีวภาพ: เซลล์ พันธุกรรม และวิวัฒนาการ"),
      titleMm: mm("သုတေသီ ဘဝခံ: အကွဲများ၊ ဂဏန်းဝင်များနှင့် လင်္ကာရီဖွံဆန်ခြင်း"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# วิทยาศาสตร์ชีวภาพ: เซลล์ พันธุกรรม และวิวัฒนาการ

## เซลล์ (Cells)
- **เซลล์** = หน่วยพื้นฐานของสิ่งมีชีวิต
- เซลล์ประกอบด้วย:
  - **Nucleus** — จุดศูนย์กลางควบคุม เก็บ DNA
  - **Cell Membrane** — เยื่อหุ้มเซลล์ ควบคุมสารเข้า-ออก
  - **Mitochondria** — โรงงานผลิตพลังงาน (Powerhouse)
  - **Ribosome** — สร้างโปรตีน
  - **Cytoplasm** — น้ำเหลวงภายในเซลล์

## พันธุกรรม (Genetics)
- **DNA** = พหุสัณฐานคู่ (Double Helix) เก็บรหัสพันธุกรรม
- **Gene** = ส่วนของ DNA ที่สร้างลักษณะหนึ่งๆ
- **Chromosome** = รวมกลุ่มของ Genes (คนมี 23 คู่ = 46 โครโมโซม)
- **Genotype** = รหัสพันธุกรรม (เช่น Aa, BB)
- **Phenotype** = ลักษณะที่แสดงออก (เช่น ตาสีน้ำตาล)
- **Punnett Square** = วิธีคำนวณอัตราพันธุกรรมลูก

## วิวัฒนาการ (Evolution)
- **Natural Selection** = ธรรมชาติเลือกสิ่งมีชีวิตที่เหมาะสมที่สุด
- **Adaptation** = การปรับตัวให้เข้ากับสิ่งแวดล้อม
- **Mutation** = การเปลี่ยนแปลงของ DNA (อาจเป็นได้ทั้งดีและร้าย)
- **Evidence of Evolution**: ฟอสซิล, โครงสร้างร่างกายคล้ายกัน, DNA ใกล้เคียง`),
          contentBodyEn: `# Life Science: Cells, Genetics & Evolution

## Cells
- **Cells** are the basic unit of all living things.
- Key organelles:
  - **Nucleus** — Control center, stores DNA
  - **Cell Membrane** — Controls what enters/exits the cell
  - **Mitochondria** — Powerhouse (energy production)
  - **Ribosome** — Makes proteins
  - **Cytoplasm** — Jelly-like fluid inside the cell

## Genetics
- **DNA** = Double Helix, stores genetic code.
- **Gene** = A section of DNA that codes for a trait.
- **Chromosome** = Grouped genes (humans have 23 pairs = 46 total).
- **Genotype** = Genetic code (e.g., Aa, BB).
- **Phenotype** = Expressed trait (e.g., brown eyes).
- **Punnett Square** = Tool to predict offspring genetics.

## Evolution
- **Natural Selection** = Nature selects the fittest organisms.
- **Adaptation** = Adjusting to the environment.
- **Mutation** = DNA changes (can be beneficial or harmful).
- **Evidence**: Fossils, similar body structures, related DNA.`,
          contentBodyMm: mm(`# သုတေသီ ဘဝခံ: အကွဲများ၊ ဂဏန်းဝင်များနှင့် လင်္ကာရီဖွံဆန်ခြင်း

## အကွဲများ (Cells)
- **အကွဲ** သည် မြင့်မားသော အရေးရှိ စစ်မှုများ၏ အခြေခံ အရေးစားဖြစ်သည်။`),
          keyTakeaways: JSON.stringify([
            "เซลล์ = หน่วยพื้นฐานสิ่งมีชีวิต — Nucleus เก็บ DNA, Mitochondria ผลิตพลังงาน",
            "DNA → Gene → Chromosome (คนมี 23 คู่ = 46 โครโมโซม)",
            "Genotype = รหัสพันธุกรรม, Phenotype = ลักษณะที่แสดงออก",
            "Natural Selection = ธรรมชาติเลือกที่เหมาะสมที่สุดให้มีชีวิตรอด",
          ]),
          formulaOrRules: JSON.stringify([
            "Genotype = AA, Aa, aa (รหัสพันธุกรรม)",
            "Punnett Square: คำนวณอัตราลูก เช่น Aa × Aa = 1AA:2Aa:1aa",
            "DNA → RNA → Protein (Central Dogma)",
          ]),
        },
      ],
    },
    {
      subjectCode: "science",
      title: "Physical Science: Chemistry & Physics Fundamentals",
      titleTh: th("วิทยาศาสตร์กายภาพ: เคมีและฟิสิกส์พื้นฐาน"),
      titleMm: mm("သုတေသီ စားမျက်စာ: မူကြည့်နှင့် ဖက်ရှင်းမူကြည့် အခြေခံများ"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# เคมีและฟิสิกส์พื้นฐาน

## เคมี (Chemistry)
### โครงสร้างอะตอม
- **Atom** = อนุภาคเล็กที่สุดของธาตุ
- **Proton** (+) ในนิวเคลียส, **Neutron** (กลาง) ในนิวเคลียส, **Electron** (-) โคจรรอบ
- **Atomic Number** = จำนวน Proton
- **Atomic Mass** ≈ Proton + Neutron

### ตารางธาตุ (Periodic Table)
- ธาตุเรียงตาม **Atomic Number** จากน้อยไปมาก
- **แถวนอน (Period)** = จำนวนชั้นของ Electron
- **หมู่ (Group)** = จำนวน Electron วงนอกสุด (Valence)
- ธาตุในหมู่เดียวกันมีสมบัติเคมีคล้ายกัน

### ปฏิกิริยาเคมี
- **สมการเคมี**: Reactants → Products
- **Conservation of Mass**: มวลของสารตั้งต้น = มวลของผลิตภัณฑ์
- **Exothermic** = ปล่อยความร้อน, **Endothermic** = ดูดซับความร้อน

## ฟิสิกส์ (Physics)
### พลังงาน (Energy)
- **Kinetic Energy** = พลังงานจลน์ (E = ½mv²)
- **Potential Energy** = พลังงานศักย์ (E = mgh)
- **Conservation of Energy**: พลังงานไม่ถูกสร้างหรือทำลาย เปลี่ยนรูปเท่านั้น

### ความเร็วและการเคลื่อนที่
- **Speed** = Distance / Time
- **Velocity** = Speed + Direction
- **Acceleration** = Change in Velocity / Time`),
          contentBodyEn: `# Physical Science: Chemistry & Physics Fundamentals

## Chemistry
### Atomic Structure
- **Atom** = Smallest particle of an element.
- **Proton** (+) in nucleus, **Neutron** (neutral) in nucleus, **Electron** (-) orbits.
- **Atomic Number** = Number of Protons.
- **Atomic Mass** ≈ Protons + Neutrons.

### Periodic Table
- Elements arranged by **Atomic Number** (increasing).
- **Period** (row) = Number of electron shells.
- **Group** (column) = Valence electrons (outer shell).
- Elements in the same group share similar chemical properties.

### Chemical Reactions
- **Chemical Equation**: Reactants → Products
- **Conservation of Mass**: Mass of reactants = Mass of products.
- **Exothermic** = Releases heat. **Endothermic** = Absorbs heat.

## Physics
### Energy
- **Kinetic Energy** = E = ½mv²
- **Potential Energy** = E = mgh
- **Conservation of Energy**: Energy cannot be created or destroyed, only transformed.

### Speed and Motion
- **Speed** = Distance / Time
- **Velocity** = Speed + Direction
- **Acceleration** = Change in Velocity / Time`,
          contentBodyMm: mm(`# မူကြည့်နှင့် ဖက်ရှင်းမူကြည့် အခြေခံများ

## မူကြည့် (Chemistry)
- **Atom** = အရေးရှိ အသင်္ချာအရွယ်အစားဖြစ်သည်။`),
          keyTakeaways: JSON.stringify([
            "Proton (+), Neutron (0), Electron (-) — Atomic Number = จำนวน Proton",
            "Periodic Table: แถว = ชั้นอิเล็กตรอน, หมู่ = อิเล็กตรอนวงนอก",
            "Conservation of Mass: มวลสารตั้งต้น = มวลผลิตภัณฑ์",
            "Kinetic Energy = ½mv², Potential Energy = mgh",
          ]),
          formulaOrRules: JSON.stringify([
            "E(kinetic) = ½mv²",
            "E(potential) = mgh",
            "Speed = Distance / Time",
            "Acceleration = Δv / Δt",
            "Conservation of Energy: E_total = const",
            "Conservation of Mass: m(reactants) = m(products)",
          ]),
        },
      ],
    },
    {
      subjectCode: "science",
      title: "Earth & Space Science",
      titleTh: th("วิทยาศาสตร์โลกและอวกาศ"),
      titleMm: mm("မြေနှင့် အကြောင်းရေး သုတေသီ"),
      sortOrder: 2,
      contents: [
        {
          contentBodyTh: th(`# วิทยาศาสตร์โลกและอวกาศ

## ธรณีวิทยา (Geology)
### Plate Tectonics (ทฤษฎีเปลือกโลกเคลื่อน)
- เปลือกโลกแบ่งเป็น **Tectonic Plates** หลายแผ่น
- แผ่นเคลื่อนที่เข้าหากัน → **Convergent** → ภูเขาไฟ แผ่นดินไหว
- แผ่นเคลื่อนที่ออกจากกัน → **Divergent** → รอยเลื่อน สันเขากลางทะเล
- แผ่นเลื่อนผ่านกัน → **Transform** → รอยเลื่อนตามแนวราบ

## อุตุนิยมวิทยา (Weather & Climate)
- **Weather** = สภาพอากาศตอนนั้น (ระยะสั้น)
- **Climate** = รูปแบบอากาศเฉลี่ยในพื้นที่ (ระยะยาว)
- **Water Cycle**: ระเหย → ควบแน่น → ตกลงมาเป็นฝน → ไหลลงทะเล
- **Greenhouse Effect**: ก๊าซ CO₂ ดักจับความร้อน → โลกร้อนขึ้น

## ดาราศาสตร์ (Astronomy)
- **Solar System**: ดาวฤกษ์ (Sun) → ดาวเคราะห์ 8 ดวง
- ดาวเคราะห์ชั้นใน: Mercury, Venus, Earth, Mars (Rocky)
- ดาวเคราะห์ชั้นนอก: Jupiter, Saturn, Uranus, Neptune (Gas/Ice Giants)
- **Moon Phases**: ใหม่ → ข้าวขึ้น → อรุณงาม → เต็ม → แรม → ข้าวแรม → กลางเดือน → มืด
- **Seasons** = เกิดจากแกนโลกเอียง 23.5° เมื่อโคจรรอบดวงอาทิตย์`),
          contentBodyEn: `# Earth & Space Science

## Geology
### Plate Tectonics
- Earth's crust is divided into **Tectonic Plates**.
- Plates moving together → **Convergent** → Volcanoes, earthquakes.
- Plates moving apart → **Divergent** → Rifts, mid-ocean ridges.
- Plates sliding past each other → **Transform** → Fault lines.

## Weather & Climate
- **Weather** = Current atmospheric conditions (short-term).
- **Climate** = Average weather patterns in an area (long-term).
- **Water Cycle**: Evaporation → Condensation → Precipitation → Runoff.
- **Greenhouse Effect**: CO₂ traps heat → Global warming.

## Astronomy
- **Solar System**: The Sun + 8 planets.
- Inner planets: Mercury, Venus, Earth, Mars (Rocky).
- Outer planets: Jupiter, Saturn, Uranus, Neptune (Gas/Ice Giants).
- **Moon Phases**: New → Waxing → Full → Waning.
- **Seasons** = Caused by Earth's 23.5° axial tilt.`,
          contentBodyMm: mm(`# မြေနှင့် အကြောင်းရေး သုတေသီ

## မြေရှင်းဖော်ခြင်း (Geology)
- မြေပြင်ကို **Tectonic Plates** အုပ်စုံဖြင့် ခွဲဖြူထားသည်။`),
          keyTakeaways: JSON.stringify([
            "Plate Tectonics: Convergent (เข้าหา) = ภูเขาไฟ, Divergent (ออกจาก) = ร่องลึก",
            "Water Cycle: ระเหย → ควบแน่น → ฝน → ไหลยลงทะเล",
            "Seasons = แกนโลกเอียง 23.5° (ไม่ใช่ระยะห่างจากดวงอาทิตย์)",
            "Inner Planets = หิน, Outer Planets = ก๊าซ/น้ำแข็ง",
          ]),
          formulaOrRules: JSON.stringify([]),
        },
      ],
    },

    // ── RLA TEXTBOOK ──
    {
      subjectCode: "rla" as const,
      title: "Reading Comprehension Strategies",
      titleTh: th("กลยุทธ์การอ่านจับใจความ"),
      titleMm: mm("ဖတ်ပါမှု အားလပ်မှု နည်းလမ်းများ"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# กลยุทธ์การอ่านจับใจความ

## ประเภทบทความที่พบในข้อสอบ
1. **Literary Text** — บทความวรรณกรรม (เรื่องสั้น บทกวี บทละคร)
2. **Informational Text** — บทความให้ข้อมูล (บทความ รายงาน หนังสือพิมพ์)

## เทคนิคการอ่านอย่างมีประสิทธิภาพ
### 1. อ่านคำถามก่อนอ่านบทความ
- รู้ว่าต้องหาอะไร → อ่านได้แม่นยำขึ้น

### 2. หา Main Idea (ประเด็นหลัก)
- มักอยู่ใน **ประโยคแรก** หรือ **ประโยคสุดท้าย** ของย่อหน้า
- ถามตัวเอง: "บทความนี้บอกอะไร?"

### 3. ระบุ Author's Purpose (จุดประสงค์)
- **To Inform** — บอกข้อมูล/ความรู้
- **To Persuade** — ชักจูงให้เห็นด้วย
- **To Entertain** — บันเทิง

### 4. ทำความเข้าใจ Tone & Mood
- **Tone** = ท่าทีของผู้เขียน (formal, sarcastic, optimistic)
- **Mood** = อารมณ์ที่ผู้อ่านรู้สึก (happy, tense, mysterious)

### 5. สรุป Inference (อนุมาน)
- Inference = ข้อสรุปที่ไม่ได้ระบุตรงๆ แต่สามารถอนุมานได้จากบริบท
- ใช้คำใบ้ในบทความ + ความรู้บริบท

## คำศัพท์สำคัญ
- **Context Clues** = คำใบ้จากบริบทที่ช่วย guess ความหมายคำใหม่
- **Prefix** = ส่วนนำหน้า (un-, re-, pre-, dis-)
- **Suffix** = ส่วนท้าย (-tion, -ment, -able, -ful)
- **Root Word** = รากศัพท์ (คำแม่)`),
          contentBodyEn: `# Reading Comprehension Strategies

## Passage Types on the Test
1. **Literary Text** — Fiction (short stories, poems, drama)
2. **Informational Text** — Non-fiction (articles, reports, newspapers)

## Effective Reading Techniques
### 1. Read Questions First
- Know what to look for → More accurate reading.

### 2. Find the Main Idea
- Usually in the **first** or **last sentence** of a paragraph.
- Ask: "What is this passage mainly about?"

### 3. Identify Author's Purpose
- **To Inform** — Provide information/knowledge
- **To Persuade** — Convince the reader
- **To Entertain** — Amuse

### 4. Understand Tone & Mood
- **Tone** = Writer's attitude (formal, sarcastic, optimistic)
- **Mood** = Feeling the reader gets (happy, tense, mysterious)

### 5. Make Inferences
- Inference = Conclusion not directly stated but can be deduced from context.

## Key Vocabulary
- **Context Clues** = Hints from surrounding text.
- **Prefix** = Word part at the beginning (un-, re-, pre-, dis-)
- **Suffix** = Word part at the end (-tion, -ment, -able, -ful)
- **Root Word** = Base word (e.g., "struct" = build)`,
          contentBodyMm: mm(`# ဖတ်ပါမှု အားလပ်မှု နည်းလမ်းများ

## စာတည်း အမျိုးအစားများ
1. **Literary Text** — စာပေနှင့် စာအုပ်စုံများ
2. **Informational Text** — သတေမှတ် စာတည်းများ`),
          keyTakeaways: JSON.stringify([
            "อ่านคำถามก่อนอ่านบทความ — รู้ว่าต้องหาอะไร",
            "Main Idea มักอยู่ประโยคแรก/สุดท้ายของย่อหน้า",
            "Author's Purpose: Inform / Persuade / Entertain",
            "Inference = อนุมานจากบริบท ไม่ใช่ข้อเท็จจริงตรงๆ",
          ]),
          formulaOrRules: JSON.stringify([
            "Prefix: un-, re-, pre-, dis-, mis-",
            "Suffix: -tion, -ment, -able, -ful, -less",
            "Context Clues = คำใบ้จากประโยคข้างๆ",
          ]),
        },
      ],
    },
    {
      subjectCode: "rla",
      title: "Grammar, Sentence Structure & Punctuation",
      titleTh: th("ไวยากรณ์ โครงสร้างประโยค และวรรคตอน"),
      titleMm: mm("ဘာသာစကား ခေါင်းစဉ်နှင့် အသှက်အပြက် ချိတ်ဆက်ခြင်း"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# ไวยากรณ์ โครงสร้างประโยค และวรรคตอน

## ประเภทประโยค
1. **Simple Sentence** — ประโยคเดี่ยว (1 Subject + 1 Verb)
   - "The cat sat on the mat."
2. **Compound Sentence** — ประโยครวม (2 ประโยคเดี่ยว + FANBOYS)
   - "I studied hard, **but** the test was difficult."
3. **Complex Sentence** — ประโยคซับซ้อน (Independent + Dependent clause)
   - "**Although it rained**, we went to the park."
4. **Compound-Complex** — ประโยคผสม (2+ Independent + 1+ Dependent)

## FANBOYS (คำเชื่อมประโยครวม)
- **F**or, **A**nd, **N**or, **B**ut, **O**r, **Y**et, **S**o

## วรรคตอน (Punctuation)
### จุดภาค (Comma ,)
- คั่นระหว่าง independent clauses ที่เชื่อมด้วย FANBOYS
- คั่น items ใน list
- คั่น introductory phrase/clause

### จุด (Period .)
- ท้ายประโยคแบบปกติ

### เครื่องหมายคำพูด (Quotation Marks " ")
- ล้อมคำพูดโดยตรง

### Apostrophe (')
- แสดงความเป็นเจ้าของ: **cat's** tail
- แสดงการย่อ: **don't**, **it's**

## ข้อผิดพลาดที่พบบ่อย
- **Subject-Verb Agreement**: He **walk** → He **walks**
- **Run-on Sentence**: ไม่ควรเชื่อมประโยคด้วยคอมมาเพียงอย่างเดียว
- **Pronoun Agreement**: Everyone should bring **their** book (ใช้ their ไม่ใช่ his/her)`),
          contentBodyEn: `# Grammar, Sentence Structure & Punctuation

## Sentence Types
1. **Simple Sentence** — 1 Subject + 1 Verb
   - "The cat sat on the mat."
2. **Compound Sentence** — 2 simple sentences + FANBOYS
   - "I studied hard, **but** the test was difficult."
3. **Complex Sentence** — Independent + Dependent clause
   - "**Although it rained**, we went to the park."
4. **Compound-Complex** — 2+ Independent + 1+ Dependent

## FANBOYS (Coordinating Conjunctions)
- **F**or, **A**nd, **N**or, **B**ut, **O**r, **Y**et, **S**o

## Punctuation
### Comma (,)
- Between independent clauses joined by FANBOYS.
- Separating items in a list.
- After introductory phrases.

### Period (.)
- End of a declarative sentence.

### Quotation Marks (" ")
- Around direct speech.

### Apostrophe (')
- Possession: **cat's** tail
- Contraction: **don't**, **it's**

## Common Errors
- **Subject-Verb Agreement**: He **walk** → He **walks**
- **Run-on Sentence**: Don't join with just a comma.
- **Pronoun Agreement**: Everyone should bring **their** book.`,
          contentBodyMm: mm(`# ဘာသာစကား ခေါင်းစဉ်နှင့် အသှက်အပြက် ချိတ်ဆက်ခြင်း

## ခေါင်းစဉ် အမျိုးအစား
1. **Simple Sentence** — Subject တစ်ခု + Verb တစ်ခု
2. **Compound Sentence** — FANBOYS ဖြင့် ဆက်သော ခေါင်းစဉ်နှစ်ခု`),
          keyTakeaways: JSON.stringify([
            "Simple (1 clause), Compound (2+FANBOYS), Complex (Ind+Dep)",
            "FANBOYS = For, And, Nor, But, Or, Yet, So",
            "Subject-Verb Agreement: He walks (ไม่ใช่ He walk)",
            "Apostrophe: ความเป็นเจ้าของ (cat's) และการย่อ (don't)",
          ]),
          formulaOrRules: JSON.stringify([
            "FANBOYS = For, And, Nor, But, Or, Yet, So",
            "S-V Agreement: Singular subject + Singular verb",
            "Pronoun Agreement: Everyone → their (singular they)",
          ]),
        },
      ],
    },

    // ── SS TEXTBOOK ──
    {
      subjectCode: "ss" as const,
      title: "Civics & Government: U.S. Constitution & Rights",
      titleTh: th("พลเมืองและรัฐบาล: รัฐธรรมนูญและสิทธิเสรีภาพ"),
      titleMm: mm("ပါဝန်နှင့် အုတ်မြို့: သို့သို့ပဲ ဥပုလ်နှင့် အခွင့်အရေးများ"),
      sortOrder: 0,
      contents: [
        {
          contentBodyTh: th(`# พลเมืองและรัฐบาล: รัฐธรรมนูญและสิทธิเสรีภาพ

## โครงสร้างรัฐบาลสหรัฐอเมริกา
### 3 สาขาอำนาจ (Three Branches)
1. **Legislative (ฝ่ายนิติบัญญัติ)** — ร่างกฎหมาย
   - สภาคองเกรส (Congress) = วุฒิสภา (Senate, 100 คน) + สภาผู้แทน (House, 435 คน)
2. **Executive (ฝ่ายบริหาร)** — บังคับใช้กฎหมาย
   - ประธานาธิบดี (President) + คณะรัฐมนตรี (Cabinet)
3. **Judicial (ฝ่ายตุลาการ)** — วินิจฉัยข้อพิพาท
   - ศาลสูงสุด (Supreme Court, 9 ผู้พิพากษา)

## ระบบ Check & Balance
- แต่ละสาขาสามารถ **จำกัดอำนาจ** ของอีกสาขา
- President → Veto law | Congress → Override veto (2/3) | Supreme Court → Declare law unconstitutional

## รัฐธรรมนูญ (Constitution)
- **Preamble**: "We the People..." — จุดประสงค์ของรัฐธรรมนูญ
- **Amendment**: แก้ไขเพิ่มเติม (ปัจจุบัน 27 ข้อ)
- **Bill of Rights** (Amendment 1-10):
  - 1st: เสรีภาพศาสนา คำพูด สื่อ ชุมนุม
  - 2nd: สิทธิถืออาวุธ
  - 4th: ป้องกันการค้นหา/จับกุมโดยไม่ชอบด้วยกฎหมาย
  - 5th: สิทธิไม่ต้องเป็นพยานต่อตัวเอง
  - 6th: สิทธิได้ทนาย
  - 10th: อำนาจที่ไม่ได้มอบให้รัฐบาลกลาง จะเป็นของรัฐ

## สิทธิพลเมืองสำคัญ
- **Voting Rights**: การเลือกตั้ง (15th, 19th, 24th, 26th Amendments)
- **Due Process**: ขั้นตอนยุติธรรม (5th, 14th Amendments)
- **Equal Protection**: ความเท่าเทียมกันตามกฎหมาย (14th Amendment)`),
          contentBodyEn: `# Civics & Government: U.S. Constitution & Rights

## U.S. Government Structure
### Three Branches
1. **Legislative** — Makes laws
   - Congress = Senate (100) + House of Representatives (435)
2. **Executive** — Enforces laws
   - President + Cabinet
3. **Judicial** — Interprets laws
   - Supreme Court (9 Justices)

## Checks and Balances
- Each branch can **limit** another branch's power.
- President → Veto | Congress → Override (2/3) | Court → Unconstitutional

## Constitution
- **Preamble**: "We the People..."
- **Amendments**: 27 total.
- **Bill of Rights** (Amendments 1-10):
  - 1st: Freedom of religion, speech, press, assembly
  - 2nd: Right to bear arms
  - 4th: Protection from unreasonable search/seizure
  - 5th: Right against self-incrimination
  - 6th: Right to counsel
  - 10th: Powers not delegated to federal government → States

## Key Civil Rights
- **Voting Rights**: 15th, 19th, 24th, 26th Amendments
- **Due Process**: 5th, 14th Amendments
- **Equal Protection**: 14th Amendment`,
          contentBodyMm: mm(`# ပါဝန်နှင့် အုတ်မြို့: သို့သို့ပဲ ဥပုလ်နှင့် အခွင့်အရေးများ

## အမေရိကန် အုတ်မြို့ အုပ်စုံ
### အရေးရှိ အဖွဲ့ 3 ခု
1. **Legislative** — ဥပုလ်များ ရေးသားခြင်း
2. **Executive** — ဥပုလ်များ အကျုံးဝင်ခြင်း
3. **Judicial** — ဥပုလ်များ ဖော်ဖြေခြင်း`),
          keyTakeaways: JSON.stringify([
            "3 สาขา: Legislative (ร่างกฎหมาย) → Executive (บังคับใช้) → Judicial (วินิจฉัย)",
            "Check & Balance: แต่ละสาขาจำกัดอำนาจกันและกัน",
            "Bill of Rights = Amendment 1-10 (เสรีภาพ สิทธิพลเมือง)",
            "14th Amendment = Equal Protection + Due Process สำคัญมาก",
          ]),
          formulaOrRules: JSON.stringify([
            "3 Branches: Legislative → Executive → Judicial",
            "Bill of Rights: Amendments 1-10",
            "Voting: 15th (race), 19th (women), 24th (poll tax), 26th (age 18)",
            "14th Amendment: Equal Protection + Due Process + Citizenship",
          ]),
        },
      ],
    },
    {
      subjectCode: "ss",
      title: "U.S. History, Economics & World Events",
      titleTh: th("ประวัติศาสตร์อเมริกา เศรษฐศาสตร์ และเหตุการณ์โลก"),
      titleMm: mm("အမေရိကန် သမိုင်း၊ ဘဏ်ရာရေးနှင့် ကမ္ဘာရေး အဖွဲ့အစည်းများ"),
      sortOrder: 1,
      contents: [
        {
          contentBodyTh: th(`# ประวัติศาสตร์อเมริกา เศรษฐศาสตร์ และเหตุการณ์โลก

## ประวัติศาสตร์อเมริกาสำคัญ
### ยุค Colonial (1607-1776)
- ผู้ตั้งถิ่นฐานชาวยุโรปมาที่อเมริกา
- 13 อาณานิคมภายใต้อังกฤษ

### การปฏิวัติอเมริกา (1775-1783)
- **Declaration of Independence (1776)**: ประกาศอิสรภาพจากอังกฤษ
- ผู้นำ: George Washington, Thomas Jefferson, Benjamin Franklin

### สงครามกลางเมือง (Civil War, 1861-1865)
- เหนือ (Union) vs ใต้ (Confederacy) เรื่อง **ทาส**
- **Emancipation Proclamation (1863)**: ปลดปล่อยทาส
- **13th Amendment**: ยกเลิกการเป็นทาส

### ยุคประวัติศาสตร์สำคัญ
- **World War I (1914-1918)**, **World War II (1939-1945)**
- **Great Depression (1929)**: วิกฤตเศรษฐกิจ
- **Civil Rights Movement (1950s-1960s)**: สิทธิพลเมือง (Martin Luther King Jr.)

## เศรษฐศาสตร์ (Economics)
### อุปสงค์และอุปทาน (Supply & Demand)
- **Demand**: ราคา↑ ปริมาณที่ต้องการ↓ | ราคา↓ ปริมาณที่ต้องการ↑
- **Supply**: ราคา↑ ปริมาณที่ผลิต↑ | ราคา↓ ปริมาณที่ผลิต↓
- **Equilibrium**: จุดที่อุปสงค์ = อุปทาน

### ระบบเศรษฐกิจ
- **Traditional**: ผลิตตามภูมิประเทศ/จารีต
- **Command**: รัฐบาลวางแผน (เช่น คอมมิวนิสต์)
- **Market (Capitalist)**: ตลาดกำหนด (สหรัฐฯ)
- **Mixed**: ผสมตลาด + รัฐบาลแทรกแซง

### GDP และ Inflation
- **GDP** = มูลค่าสินค้าและบริการทั้งหมดที่ผลิตในประเทศ
- **Inflation** = ราคาสินค้าสูงขึ้นทั่วไป ค่าเงินลดลาภลัย`),
          contentBodyEn: `# U.S. History, Economics & World Events

## Key U.S. History
### Colonial Era (1607-1776)
- European settlers arrived in America.
- 13 British colonies.

### American Revolution (1775-1783)
- **Declaration of Independence (1776)**: Independence from Britain.
- Leaders: Washington, Jefferson, Franklin.

### Civil War (1861-1865)
- North (Union) vs South (Confederacy) over **slavery**.
- **Emancipation Proclamation (1863)**: Freed slaves.
- **13th Amendment**: Abolished slavery.

### Key Historical Periods
- **WWI (1914-1918)**, **WWII (1939-1945)**
- **Great Depression (1929)**: Economic crisis.
- **Civil Rights Movement (1950s-1960s)**: MLK Jr.

## Economics
### Supply & Demand
- **Demand**: Price↑ → Quantity Demanded↓
- **Supply**: Price↑ → Quantity Supplied↑
- **Equilibrium**: Where Supply = Demand

### Economic Systems
- **Traditional**: Custom/heritage-based
- **Command**: Government-planned (Communist)
- **Market (Capitalist)**: Market-driven (USA)
- **Mixed**: Market + Government intervention

### GDP and Inflation
- **GDP** = Total value of goods/services produced.
- **Inflation** = General price increase, money loses value.`,
          contentBodyMm: mm(`# အမေရိကန် သမိုင်း၊ ဘဏ်ရာရေးနှင့် ကမ္ဘာရေး အဖွဲ့အစည်းများ

## အဓိက အမေရိကန် သမိုင်း
- **Declaration of Independence (၁၇၇၆)**: အင်္ဂလာပါ မှ လွတ်လပ်ရေး
- **Civil War (၁၈၆၁-၁၈၆၅)**: အလုံခြုံ ဖြန့် စစ်
- **Great Depression (၁၉၂၉)**: ဘဏ်ရာရေး ကွဲနေခြင်း`),
          keyTakeaways: JSON.stringify([
            "Declaration of Independence 1776 = ประกาศอิสรภาพ",
            "Civil War = เหนือ vs ใต้ เรื่องทาส → 13th Amendment ยกเลิกทาส",
            "Supply & Demand: ราคา↑ อุปสงค์↓ อุปทาน↑ จุดสมดุล = ตัดกัน",
            "ระบบเศรษฐกิจ: Traditional, Command, Market, Mixed",
          ]),
          formulaOrRules: JSON.stringify([
            "Demand: ราคา ↑ → ปริมาณต้องการ ↓",
            "Supply: ราคา ↑ → ปริมาณผลิต ↑",
            "Equilibrium: Supply = Demand",
                        "GDP = มูลค่าสินค้า+บริการทั้งหมดที่ผลิตในประเทศ",
            "Inflation = ราคาสินค้าทั่วไปสูงขึ้น",
          ]),
        },
      ],
    },
  ];

  // ═══════════════════════════════════════════════════════════════
  //  INSERT INTO DATABASE
  // ═══════════════════════════════════════════════════════════════

  type TopicInput = (typeof examHandbookTopics)[number];

  async function seedTopics(topics: TopicInput[], categoryType: string) {
    for (const t of topics) {
      const subjectId = sMap[t.subjectCode];
      if (!subjectId) {
        console.warn(`  SKIP: Unknown subject code '${t.subjectCode}'`);
        continue;
      }

      const topic = await db.handbookTopic.create({
        data: {
          subjectId,
          title: t.title,
          titleTh: t.titleTh,
          titleMm: t.titleMm,
          categoryType,
          sortOrder: t.sortOrder,
          contents: {
            create: t.contents.map((c, idx) => ({
              contentBodyEn: c.contentBodyEn,
              contentBodyTh: c.contentBodyTh,
              contentBodyMm: c.contentBodyMm,
              keyTakeaways: c.keyTakeaways,
              formulaOrRules: c.formulaOrRules,
              sortOrder: idx,
            })),
          },
        },
      });
      console.log(`  + [${categoryType}] ${t.title} (${t.contents.length} sections)`);
    }
  }

  await seedTopics(examHandbookTopics, "handbook");
  await seedTopics(textbookTopics, "textbook");

  // ── Summary ──
  const totalTopics = await db.handbookTopic.count();
  const totalContents = await db.handbookContent.count();
  console.log(`\nDone! Seeded ${totalTopics} handbook topics with ${totalContents} content sections.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
