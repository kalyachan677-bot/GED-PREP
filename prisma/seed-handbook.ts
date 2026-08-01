import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ============================================================================
// GED Knowledge Base & Official Handbook — Seed Data
// 4 subjects × 2 categories (A: Exam Handbook, B: Core Textbook)
// Each topic has EN / TH / MM content with key takeaways and formulas
// ============================================================================

interface HContent {
  contentBodyEn: string;
  contentBodyTh: string;
  contentBodyMm: string;
  keyTakeaways: string[];
  formulaOrRules: string[];
  sortOrder: number;
}

interface HTopic {
  subjectCode: string;
  categoryType: "handbook" | "textbook";
  title: string;
  titleTh: string;
  titleMm: string;
  sortOrder: number;
  contents: HContent[];
}

const HANDBOOK_DATA: HTopic[] = [
  // ==========================================================================
  // MATH — Exam Handbook (A)
  // ==========================================================================
  {
    subjectCode: "math",
    categoryType: "handbook",
    title: "GED Math Test Format & Scoring",
    titleTh: "รูปแบบและการให้คะแนนข้อสอบ GED คณิตศาสตร์",
    titleMm: "GED တွေ့ခြင်းစမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း",
    sortOrder: 0,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# GED Math Test Format & Scoring

The GED Mathematical Reasoning test measures your ability to solve mathematical problems and apply math concepts to real-world situations. The test consists of **46 questions** to be completed in **115 minutes**.

## Test Structure
- **Part 1 (first 5 questions)**: No calculator allowed — tests mental math and estimation skills
- **Part 2 (remaining 41 questions)**: On-screen TI-30XS calculator provided

## Question Types
- **Multiple Choice** (40%): Select one correct answer from 4 options
- **Multiple Select** (10%): Select 2 or more correct answers
- **Fill-in-the-Blank** (15%): Type a numerical answer
- **Drag-and-Drop** (20%): Match items or arrange in order
- **Hot Spot** (15%): Click on specific points on a graph or image

## Scoring
- Score range: **100–200**
- Passing score: **145** (minimum)
- College Ready: **165**
- College Ready + Credit: **175**

## Content Distribution
- Algebraic Problem Solving: ~45%
- Quantitative Problem Solving: ~55% (includes geometry, data, and number operations)`,
        contentBodyTh: `# รูปแบบและการให้คะแนนข้อสอบ GED คณิตศาสตร์

ข้อสอบ GED คณิตศาสตร์วัดความสามารถในการแก้ปัญหาทางคณิตศาสตร์และนำแนวคิดทางคณิตศาสตร์ไปใช้กับสถานการณ์จริง ข้อสอบประกอบด้วย **46 ข้อ** เวลาสอบ **115 นาที**

## โครงสร้างข้อสอบ
- **ส่วนที่ 1 (5 ข้อแรก)**: ห้ามใช้เครื่องคิดเลข — วัดทักษะคำนวณในหัวและการประมาณค่า
- **ส่วนที่ 2 (41 ข้อที่เหลือ)**: ให้ใช้เครื่องคิดเลข TI-30XS บนจอภาพ

## ประเภทข้อสอบ
- **เลือกตอบเดี่ยว** (40%): เลือก 1 คำตอบที่ถูกต้องจาก 4 ตัวเลือก
- **เลือกตอบหลายข้อ** (10%): เลือก 2 คำตอบที่ถูกต้องขึ้นไป
- **เติมคำตอบ** (15%): พิมพ์คำตอบเป็นตัวเลข
- **ลากแล้ววาง** (20%): จับคู่หรือเรียงลำดับ
- **คลิกจุด** (15%): คลิกบนจุดเฉพาะบนกราฟ

## การให้คะแนน
- คะแนนเต็ม: **100–200**
- คะแนนผ่านขั้นต่ำ: **145**
- ระดับ College Ready: **165**
- ระดับ College Ready + Credit: **175**

## สัดส่วนเนื้อหา
- การแก้ปัญหาเชิงพีชคณิต: ~45%
- การแก้ปัญหาเชิงปริมาณ: ~55% (รวมเรขาคณิต สถิติ และจำนวน)`,
        contentBodyMm: `# GED တွေ့ခြင်းစမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း

GED တွေ့ခြင်း စမ်းပြဿနာသည် မြန်မာဘာသာစကား ဖြင့် တွေ့ခြင်းချက်များကို ဖော်ပြထားသည်။ ပြဿနာ ရလဒ်များသည် မိမိကိုယ်ကိုယ် တွေ့ခြင်းခန်းများကို ဖြေရှင်းရန် အချက်အလွယ်များကို အသုံးပြုပုံဖြင့် ဖော်ပြထားသည်။ စမ်းပြဿနာတွင် **၄၆** ပြဿနာများ ရှိပြီး **၁၁၅** မိနစ် ကြာသည်။

## စမ်းပြဿနာ အသေးစိတ်
- **ပစ္စည်းး (၁) (ပထမ ၅ ပြဿနာ)**: ကွက်တိုက် ခွဲခြမ်းစွာ မသုံးရ
- **ပစ္စည်းး (၂) (ကျန်ရှိ ၄၁ ပြဿနာ)**: TI-30XS ကွက်တိုက်ကို အသုံးပြုနိုင်သည်

## မှတ်တမ်း ပုဂ္ဂလ 簽
- တစ်ခုတည်း ရွေးချယ်ခြင်း (၄၀%)
- များစွာ ရွေးချယ်ခြင်း (၁၀%)
- ဖြေကြားခြင်း (၁၅%)
- ယူနေပြီး ထားခြင်း (၂၀%)
- နေရာကို နှိမ်နင်းခြင်း (၁၅%)

## ရလဒ်မှတ်တမ်း
- ရလဒ်: **၁၀၀–၂၀၀**
- အောင်မြင်ရန်: **၁၄၅**
- College Ready: **၁၆၅**
- College Ready + Credit: **၁၇၅**`,
        keyTakeaways: [
          "GED Math has 46 questions in 115 minutes",
          "First 5 questions do NOT allow calculator use",
          "Passing score is 145; College Ready is 165",
          "Algebra is ~45% and Quantitative reasoning is ~55%",
          "TI-30XS calculator is provided on-screen for Part 2",
        ],
        formulaOrRules: [],
      },
    ],
  },
  {
    subjectCode: "math",
    categoryType: "handbook",
    title: "Math Test-Taking Strategies",
    titleTh: "กลยุทธ์การทำข้อสอบคณิตศาสตร์",
    titleMm: "တွေ့ခြင်းစမ်းပြဿနာ လုပ်ဆောင်ချက်များ",
    sortOrder: 1,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Math Test-Taking Strategies

## Time Management
- Spend about **2 minutes per question** on average
- If stuck on a question for more than 3 minutes, mark it and move on
- Answer easier questions first to secure points
- Keep track of time — the on-screen timer is your friend

## Problem-Solving Approach
1. **Read carefully**: Identify what is being asked before solving
2. **Estimate first**: Before calculating, estimate a reasonable answer range
3. **Work backwards**: Plug answer choices back into the problem
4. **Eliminate wrong answers**: Cross out options that are clearly incorrect
5. **Check your work**: If time permits, verify your answer with a different method

## Calculator Tips
- Learn the TI-30XS calculator functions before test day
- Practice with the official GED calculator tutorial
- Use the calculator for complex arithmetic, not simple mental math
- Always double-check calculator entries for typos

## Common Pitfalls to Avoid
- **Misreading the question**: Underline key words like "NOT", "approximately", "least"
- **Unit confusion**: Check if the answer should be in feet, meters, dollars, etc.
- **Negative sign errors**: Pay special attention to negative numbers in calculations
- **Rushing through Part 1**: Since no calculator is allowed, accuracy matters more than speed here`,
        contentBodyTh: `# กลยุทธ์การทำข้อสอบคณิตศาสตร์

## การจัดการเวลา
- ใช้เวลาเฉลี่ย **2 นาทีต่อข้อ**
- ถ้าติดข้อไหนเกิน 3 นาที ให้ทำเครื่องหมายแล้วข้ามไปก่อน
- ทำข้อง่ายก่อนเพื่อสะสมคะแนน
- จับเวลาด้วยนาฬิกาบนจอภาพอยู่เสมอ

## ขั้นตอนการแก้ปัญหา
1. **อ่านให้ระมัดระวัง**: ให้แน่ใจว่าเข้าใจโจทย์ก่อนเริ่มคำนวณ
2. **ประมาณค่าก่อน**: ก่อนคำนวณ ให้เดาช่วงคำตอบที่น่าจะเป็นไปได้
3. **ย้อนกลับ**: นำคำตอบเลือกไปทดสอบกับโจทย์
4. **ตัดข้อผิดออก**: ขีดเส้นทับตัวเลือกที่ผิดชัดเจน
5. **ตรวจสอบ**: ถ้ามีเวลาเหลือ ให้ตรวจคำตอบด้วยวิธีอื่น

## เคล็ดลับเครื่องคิดเลข
- เรียนรู้ฟังก์ชัน TI-30XS ก่อนวันสอบ
- ฝึกใช้เครื่องคิดเลขจาก GED tutorial อย่างเป็นทางการ
- ใช้เครื่องคิดเลขกับการคำนวณที่ซับซ้อน ไม่ใช่ตัวเลขง่ายๆ
- ตรวจสอบตัวเลขที่พิมพ์เข้าไปเสมอ

## ข้อผิดพลาดที่พบบ่อย
- **อ่านโจทย์ผิด**: เน้นคำว่า "ไม่", "ประมาณ", "น้อยที่สุด"
- **สับสนหน่วย**: ตรวจสอบว่าคำตอบต้องเป็นหน่วยอะไร
- **ผิดเครื่องหมายลบ**: ระวังตัวเลขลบในการคำนวณ
- **รีบทำ Part 1 เกินไป**: ต้องระมัดระวังเพราะไม่มีเครื่องคิดเลข`,
        contentBodyMm: `# တွေ့ခြင်းစမ်းပြဿနာ လုပ်ဆောင်ချက်များ

## အချိန် စိတ်ဖြာခြင်း
- တစ်ပြဿနာလုံး အမြန် **၂** မိနစ် သုံးပါ
- ၃ မိနစ်ထက်ပို၍ ပြဿနာတွေ့ချင်လို့ ရှိလျှင် အမှတ်တည်၍ နောက်သို့ ရှောင်ပါ
- လွယ်ကူအပြုသော ပြဿနာများကို ယုံကြည်စွာ ဖြေပါ
- အချိန်ကို ကိုယ့်ရဲ့ ပိုင်ဆိုင်မှုအဖြစ် သတ်မှတ်ပါ

## ပြဿနာ ဖြေရှင်းချက် အဆင့်များ
1. သေချာစွာ ဖတ်ပါ
2. မည်မျှရလဒ်ဖြစ်နိုင်မည်ကို ခန့်မှန်းပါ
3. ရွေးချယ်စရာများကို ပြန်လည်စစ်ဆေးပါ
4. မှားယွင်းသော ရွေးချယ်စရာများကို ဖယ်ရှားပါ
5. အချိန်ရှိလျှင် နောက်ထပ် စစ်ဆေးပါ`,
        keyTakeaways: [
          "Spend ~2 minutes per question, skip hard ones",
          "Estimate answer before calculating for a sanity check",
          "Work backwards by plugging in answer choices",
          "Learn the TI-30XS calculator before test day",
          "Read carefully for keywords: NOT, approximately, least",
        ],
        formulaOrRules: [],
      },
    ],
  },

  // ==========================================================================
  // MATH — Core Textbook (B)
  // ==========================================================================
  {
    subjectCode: "math",
    categoryType: "textbook",
    title: "Linear Equations & Inequalities",
    titleTh: "สมการเชิงเส้นและอสมการ",
    titleMm: "ဟိုးလိုက် ဆက်စပ်မှုများနှင့် တားဆီးမှုများ",
    sortOrder: 0,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Linear Equations & Inequalities

## What is a Linear Equation?
A linear equation is an equation where the highest exponent of any variable is 1. The standard form is **ax + b = c**, where a, b, and c are constants and x is the variable.

## Solving One-Variable Equations
The goal is to isolate the variable on one side of the equation. Use **inverse operations**:
- If a number is **added** to x, **subtract** it from both sides
- If a number is **multiplied** by x, **divide** both sides by it
- If a number is **subtracted** from x, **add** it to both sides

### Example
Solve: 3x + 7 = 22
- Step 1: Subtract 7 from both sides: 3x = 15
- Step 2: Divide both sides by 3: x = 5

## Solving Inequalities
Inequalities use symbols like **<, >, <=, >=** instead of =. Solve them the same way as equations, with ONE key rule:
- **When you multiply or divide both sides by a NEGATIVE number, FLIP the inequality sign**

### Example
Solve: -2x > 6
- Divide both sides by -2: x < -3 (note: the sign flipped!)

## Systems of Equations
Two methods to solve systems:
1. **Substitution**: Solve one equation for one variable, then substitute into the other
2. **Elimination**: Add or subtract equations to eliminate one variable`,
        contentBodyTh: `# สมการเชิงเส้นและอสมการ

## สมการเชิงเส้นคืออะไร?
สมการเชิงเส้นคือสมการที่เลขยกกำลังสูงสุดของตัวแปรเป็น 1 รูปแบบมาตรฐานคือ **ax + b = c** โดยที่ a, b, c คือค่าคงที่ และ x คือตัวแปร

## การแก้สมการตัวแปรเดียว
เป้าหมายคือการแยกตัวแปรออกมาด้านหนึ่ง ใช้ **การดำเนินการผกผัน**:
- ถ้ามีการ**บวก**เลขเข้ากับ x ให้**ลบ**ออกจากทั้งสองข้าง
- ถ้ามีการ**คูณ**เลขกับ x ให้**หาร**ทั้งสองข้างด้วยเลขนั้น
- ถ้ามีการ**ลบ**เลขออกจาก x ให้**บวก**เลขนั้นเข้าไปทั้งสองข้าง

### ตัวอย่าง
แก้สมการ: 3x + 7 = 22
- ขั้นตอนที่ 1: ลบ 7 ออกจากทั้งสองข้าง: 3x = 15
- ขั้นตอนที่ 2: หารทั้งสองข้างด้วย 3: x = 5

## การแก้อสมการ
อสมการใช้สัญลักษณ์ **<, >, <=, >=** แทนเครื่องหมาย = แก้อสมการเหมือนสมการปกติ แต่มีกฎสำคัญ 1 ข้อ:
- **เมื่อคูณหรือหารทั้งสองข้างด้วยจำนวนลบ ให้พลิกเครื่องหมายอสมการ**

### ตัวอย่าง
แก้อสมการ: -2x > 6
- หารทั้งสองข้างด้วย -2: x < -3 (สังเกตว่าเครื่องหมายพลิกกลับ!)

## ระบบสมการ
วิธีแก้ระบบสมการ 2 วิธี:
1. **วิธีเทียบแทน**: แก้สมการหนึ่งหาค่าตัวแปรหนึ่ง แล้วนำไปแทนในอีกสมการ
2. **วิธีตัดทิ้ง**: บวกหรือลบสมการเพื่อลบตัวแปรหนึ่งออก`,
        contentBodyMm: `# ဟိုးလိုက် ဆက်စပ်မှုများနှင့် တားဆီးမှုများ

## ဟိုးလိုက် ဆက်စပ်မှု ဆိုတာ ဘာလဲ?

ဟိုးလိုက် ဆက်စပ်မှုသည် အမြင့်ဆုံး အကြီးမားဆုံး သင်္ချာသည် ၁ ဖြစ်သော ဆက်စပ်မှု ဖြစ်သည်။ ပုံမှန် ဖြစ်ပုံမှာ **ax + b = c** ဖြစ်ပြီး a, b, c များသည် ဦးတည်ရွှေများ ဖြစ်သည်။

## တစ်ခုတည်း ဆက်စပ်မှု ဖြေရှင်းခြင်း

အမေရိကန်သည် စိတ်ဖြာကို တစ်ဖက်တည်းတွင် ခွဲထုတ်ရန် ဖြစ်သည်။ ပြုလုပ်ပုံများ:
- x တွင် ပါဝင်သော အကြောင်းကို ထုတ်ရန် နှစ်ဖက်လုံးမှ ဖယ်ရှားပါ
- x ကို ဖန်တီးထားသော အကြောင်းကို နှစ်ဖက်လုံးမှ စားပါ`,
        keyTakeaways: [
          "Use inverse operations to isolate the variable",
          "When multiplying/dividing inequalities by negative, FLIP the sign",
          "Substitution: solve one variable, plug into the other equation",
          "Elimination: add/subtract equations to cancel a variable",
          "Always check your answer by substituting back into the original",
        ],
        formulaOrRules: [
          "Standard form: ax + b = c",
          "Slope-intercept: y = mx + b (m = slope, b = y-intercept)",
          "Distance: d = rt (distance = rate x time)",
          "Inequality flip rule: If a < b, then -a > -b",
        ],
      },
    ],
  },
  {
    subjectCode: "math",
    categoryType: "textbook",
    title: "Geometry & Measurement",
    titleTh: "เรขาคณิตและการวัด",
    titleMm: "စတိုးတွေ့ခြင်းနှင့် တိုင်းတာ",
    sortOrder: 1,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Geometry & Measurement

## Perimeter and Area
- **Rectangle**: P = 2(l + w), A = lw
- **Triangle**: A = (1/2)bh
- **Circle**: C = 2*pi*r, A = pi*r^2
- **Trapezoid**: A = (1/2)(b1 + b2)h

## Volume
- **Rectangular prism**: V = lwh
- **Cylinder**: V = pi*r^2*h
- **Sphere**: V = (4/3)*pi*r^3
- **Cone**: V = (1/3)*pi*r^2*h

## The Pythagorean Theorem
In a right triangle: a^2 + b^2 = c^2, where c is the hypotenuse (longest side).

Common Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)

## Angles
- Complementary angles add to 90 degrees
- Supplementary angles add to 180 degrees
- Angles on a straight line add to 180 degrees
- Angles around a point add to 360 degrees

## Coordinate Geometry
- **Slope**: m = (y2 - y1) / (x2 - x1)
- **Distance between two points**: d = sqrt((x2-x1)^2 + (y2-y1)^2)
- **Midpoint**: M = ((x1+x2)/2, (y1+y2)/2)

## Similar Triangles
When two triangles are similar, their corresponding sides are proportional and their corresponding angles are equal. The ratio of areas equals the square of the ratio of sides.`,
        contentBodyTh: `# เรขาคณิตและการวัด

## เส้นรอบรูปและพื้นที่
- **สี่เหลี่ยมผืนผ้า**: เส้นรอบ = 2(ยาว + กว้าง), พื้นที่ = ยาว x กว้าง
- **สามเหลี่ยม**: พื้นที่ = (1/2) x ฐาน x สูง
- **วงกลม**: เส้นรอบ = 2 x พาย x รัศมี, พื้นที่ = พาย x รัศมี^2
- **สี่เหลี่ยมคางหกู่**: พื้นที่ = (1/2)(ฐาน1 + ฐาน2) x สูง

## ปริมาตร
- **ทรงกลมบรรจุ**: ปริมาตร = ยาว x กว้าง x สูง
- **ทรงกระบอก**: ปริมาตร = พาย x รัศมี^2 x สูง
- **ทรงกลม**: ปริมาตร = (4/3) x พาย x รัศมี^3
- **ทรงกรวย**: ปริมาตร = (1/3) x พาย x รัศมี^2 x สูง

## ทฤษฎีบทพีทาโกรัส
ในสามเหลี่ยมมุมฉาก: a^2 + b^2 = c^2 โดย c คือเส้นทแยงมุมฉาก

กลุ่มตัวเลขพีทาโกรัสที่พบบ่อย: (3,4,5), (5,12,13), (8,15,17)

## มุม
- มุมประกอบรวมกันได้ 90 องศา
- มุมเสริมรวมกันได้ 180 องศา
- มุมบนเส้นตรงรวมกันได้ 180 องศา
- มุมรอบจุดรวมกันได้ 360 องศา

## เรขาคณิตพิกัด
- **ความชัน**: m = (y2 - y1) / (x2 - x1)
- **ระยะทางระหว่าง 2 จุด**: d = sqrt((x2-x1)^2 + (y2-y1)^2)
- **จุดกึ่งกลาง**: M = ((x1+x2)/2, (y1+y2)/2)`,
        contentBodyMm: `# စတိုးတွေ့ခြင်းနှင့် တိုင်းတာ

## ပတ်ဝန်းကျင်နှင့် အကျုံးဝန်းကျင်
- ချတ်တုံးပြက္ခဒိန်: ပတ်ဝန်းကျင် = 2(ယူး + အလျား)၊ အကျုံးဝန်းကျင် = ယူး x အလျား
- သုံးမျိုးပြည့်: အကျုံးဝန်းကျင် = (၁/၂) x အောက်ခြေ x အမြင့်
- ကြဲလိုက်: ပတ်ဝန်းကျင် = ၂ x pi x ရာသီำ၊ အကျုံးဝန်းကျင် = pi x ရာသီำ^2

## တိုက်ရိုက်အတွေ့
- ချတ်တုံးပြက္ခဒိန် တိုက်ရိုက်: တိုက်ရိုက် = ယူး x အလျား x အမြင့်
- ပိုးလိုက်: တိုက်ရိုက် = pi x ရာသီး^2 x အမြင့်

## ပိုင်းလိုက် သတ်မှတ်ချက်

ပြက္ခဒိန် သုံးမျိုးပြည့်တွင်: a^2 + b^2 = c^2 (c သည် အရမ်းဆုံး အတွေ့)`,
        keyTakeaways: [
          "Memorize key formulas for area, perimeter, and volume",
          "Pythagorean theorem: a^2 + b^2 = c^2 for right triangles",
          "Common triples: (3,4,5), (5,12,13), (8,15,17)",
          "Slope = rise over run = (y2-y1)/(x2-x1)",
          "Similar triangles have proportional sides and equal angles",
        ],
        formulaOrRules: [
          "Circle: C = 2*pi*r, A = pi*r^2",
          "Triangle area: A = (1/2)*b*h",
          "Pythagorean: a^2 + b^2 = c^2",
          "Slope: m = (y2 - y1) / (x2 - x1)",
          "Distance: d = sqrt((x2-x1)^2 + (y2-y1)^2)",
          "Volume (cylinder): V = pi*r^2*h",
          "Volume (cone): V = (1/3)*pi*r^2*h",
        ],
      },
    ],
  },
  {
    subjectCode: "math",
    categoryType: "textbook",
    title: "Statistics & Probability",
    titleTh: "สถิติและความน่าจะเป็น",
    titleMm: "စာရင်းအင်းများနှင့် ဖြစ်နိုင်ခြေများ",
    sortOrder: 2,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Statistics & Probability

## Measures of Central Tendency
- **Mean (Average)**: Sum of all values divided by the number of values
  - Mean = (sum of all values) / (number of values)
- **Median**: The middle value when data is arranged in order
  - If even number of values: average of the two middle values
- **Mode**: The value that appears most frequently

## Range and Spread
- **Range**: Maximum value minus minimum value
- **Interquartile Range (IQR)**: Q3 - Q1 (measures the spread of the middle 50% of data)

## Probability Basics
- **Simple probability**: P(event) = (favorable outcomes) / (total possible outcomes)
- **Complement rule**: P(not A) = 1 - P(A)
- **Mutually exclusive events**: P(A or B) = P(A) + P(B)
- **Independent events**: P(A and B) = P(A) x P(B)

## Reading Graphs and Tables
- **Bar graph**: Compare quantities across categories
- **Line graph**: Show trends over time
- **Pie chart**: Show parts of a whole as percentages
- **Histogram**: Show frequency distribution of continuous data
- **Scatter plot**: Show relationship between two variables

## Data Interpretation Tips
- Always read the title, labels, and units of a graph or table
- Look for trends, patterns, and outliers
- Pay attention to the scale on axes — it can be misleading
- Calculate approximate values when exact numbers are not given`,
        contentBodyTh: `# สถิติและความน่าจะเป็น

## ค่ากลางทางสถิติ
- **ค่าเฉลี่ย (Mean)**: ผลรวมของค่าทั้งหมดหารด้วยจำนวนค่า
  - ค่าเฉลี่ย = (ผลรวมทั้งหมด) / (จำนวนค่า)
- **มัธยฐาน (Median)**: ค่าที่อยู่ตรงกลางเมื่อเรียงลำดับข้อมูลแล้ว
  - ถ้ามีจำนวนค่าเป็นคู่: หาค่าเฉลี่ยของค่ากลาง 2 ค่า
- **ฐานนิยม (Mode)**: ค่าที่ปรากฏบ่อยที่สุด

## ช่วงและการกระจาย
- **ช่วง (Range)**: ค่าสูงสุดลบด้วยค่าต่ำสุด
- **ช่วงไตรมาสควอไทล์ (IQR)**: Q3 - Q1 (วัดการกระจายของข้อมูลกลาง 50%)

## พื้นฐานความน่าจะเป็น
- **ความน่าจะเป็นง่าย**: P(เหตุการณ์) = (ผลลัพธ์ที่ต้องการ) / (ผลลัพธ์ทั้งหมดที่เป็นไปได้)
- **กฎส่วนเสริม**: P(ไม่ใช่ A) = 1 - P(A)
- **เหตุการณ์ที่แยกกันไม่ได้**: P(A หรือ B) = P(A) + P(B)
- **เหตุการณ์อิสระ**: P(A และ B) = P(A) x P(B)

## การอ่านกราฟและตาราง
- **กราฟแท่ง**: เปรียบเทียบปริมาณระหว่างหมวดหมู่
- **กราฟเส้น**: แสดงแนวโน้มตามเวลา
- **กราฟวงกลม**: แสดงสัดส่วนเป็นเปอร์เซ็นต์
- **ฮิสโทแกรม**: แสดงการกระจายความถี่ของข้อมูลต่อเนื่อง
- **กราฟกระจาย**: แสดงความสัมพันธ์ระหว่าง 2 ตัวแปร`,
        contentBodyMm: `# စာရင်းအင်းများနှင့် ဖြစ်နိုင်ခြေများ

## အလတ်ဘက် တိုးတက်မှုများ
- **Mean (ပမာဏ)**: အကြုံအားလုံးကို အရေးအားဖြင့် စားခြင်း
- **Median (အလတ်လိုက်)**: တိုက်ရာ စာရင်းကို စဉ်းစားပါ
- **Mode (အများဆုံး)**: အများဆုံး ဖြစ်သော အကြောင်း

## ဖြစ်နိုင်ခြေ အခြေခံများ
- P(အဖြစ်အရေး) = (အချက်စားလိုက် ရလဒ်များ) / (စုံစုံ ရလဒ်များ)
- P(မဟုတ်ပါ) = ၁ - P(A)
- P(A သို့မဟုတ် B) = P(A) + P(B)
- P(A နှင့် B) = P(A) x P(B)`,
        keyTakeaways: [
          "Mean = sum / count; Median = middle value; Mode = most frequent",
          "Probability = favorable outcomes / total outcomes",
          "P(not A) = 1 - P(A)",
          "Independent events: P(A and B) = P(A) x P(B)",
          "Always check graph scales and labels for accuracy",
        ],
        formulaOrRules: [
          "Mean = Sum / Count",
          "Range = Max - Min",
          "P(event) = favorable / total",
          "P(complement) = 1 - P(event)",
          "P(A or B) = P(A) + P(B) for mutually exclusive",
          "P(A and B) = P(A) x P(B) for independent",
        ],
      },
    ],
  },

  // ==========================================================================
  // RLA — Exam Handbook (A)
  // ==========================================================================
  {
    subjectCode: "rla",
    categoryType: "handbook",
    title: "GED RLA Test Format & Scoring",
    titleTh: "รูปแบบและการให้คะแนนข้อสอบ GED ภาษาอังกฤษ",
    titleMm: "GED အင်္ဂလိပ်စကား စမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း",
    sortOrder: 0,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# GED RLA Test Format & Scoring

The GED Reasoning Through Language Arts test measures your ability to read, understand, and interpret written texts, and to write clearly and effectively.

## Test Structure
- **65 minutes** total (split into two sections)
- **Section 1**: 35 minutes — Reading comprehension and language questions
- **Section 2**: 45 minutes — Extended Response (essay) + remaining language questions

## Question Types
- **Reading Comprehension (~45%)**: Main idea, inference, details, tone, purpose
- **Grammar & Language (~35%)**: Sentence structure, punctuation, verb tense, subject-verb agreement
- **Extended Response Essay (~20%)**: Analyze an argument and write a response

## Scoring
- Score range: **100–200**
- Passing score: **145**
- College Ready: **165**
- College Ready + Credit: **175**

## Reading Passages
Passages are drawn from:
- **Literary texts** (25%): Fiction, poetry, drama
- **Informational texts** (75%): Workplace documents, U.S. founding documents, science/social studies articles

## The Extended Response
You will read two passages that present opposing arguments on the same topic. Your task is to:
1. Analyze which argument is better supported
2. Use specific evidence from both passages
3. Write a well-organized essay of **250–500 words**

The essay is scored on: claim/thesis, evidence usage, organization, and language conventions.`,
        contentBodyTh: `# รูปแบบและการให้คะแนนข้อสอบ GED ภาษาอังกฤษ

ข้อสอบ GED Reasoning Through Language Arts วัดความสามารถในการอ่าน เข้าใจ ตีความข้อความ และเขียนได้อย่างชัดเจนและมีประสิทธิภาพ

## โครงสร้างข้อสอบ
- **65 นาที** ทั้งหมด (แบ่ง 2 ส่วน)
- **ส่วนที่ 1**: 35 นาที — คำถามการอ่านเข้าใจและภาษา
- **ส่วนที่ 2**: 45 นาที — เรียงความ Extended Response + คำถามภาษาที่เหลือ

## ประเภทข้อสอบ
- **การอ่านเข้าใจ (~45%)**: ใจความสำคัญ การสรุปความ รายละเอียด น้ำเสียง วัตถุประสงค์
- **ไวยากรณ์และภาษา (~35%)**: โครงสร้างประโยค วรรคตอน กาลกริยา การเห็นพ้องกันระหว่างประธานและกริยา
- **เรียงความ Extended Response (~20%)**: วิเคราะห์อาร์กิวเมนต์และเขียนตอบ

## การให้คะแนน
- คะแนนเต็ม: **100–200**
- คะแนนผ่านขั้นต่ำ: **145**
- ระดับ College Ready: **165**
- ระดับ College Ready + Credit: **175**

## บทความที่ให้อ่าน
- **บทความวรรณกรรม** (25%): นิยาย กวีนิพนธ์ ละคร
- **บทความข้อมูล** (75%): เอกสารที่ทำงาน เอกสารก่อตั้งสหรัฐฯ บทความวิทยาศาสตร์/สังคมศาสตร์

## เรียงความ Extended Response
คุณจะอ่านบทความ 2 บทความที่นำเสนออาร์กิวเมนต์ตรงข้ามกัน งานของคุณคือ:
1. วิเคราะห์ว่าอาร์กิวเมนต์ไหนมีหลักฐานสนับสนุนดีกว่า
2. ใช้หลักฐานเฉพาะเจาะจงจากทั้ง 2 บทความ
3. เขียนเรียงความ **250–500 คำ** ที่จัดระเบียบดี`,
        contentBodyMm: `# GED အင်္ဂလိပ်စကား စမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း

GED အင်္ဂလိပ်စကား စမ်းပြဿနာသည် စကားလုံးများကို ဖတ်ပြီး နားလည်ရန်နှင့် ရေးသားခြင်းတွေ့ရှိစွာ စမ်းဆေးသည်။

## စမ်းပြဿနာ အသေးစိတ်
- **၆၅** မိနစ် စုံစုံ (ပစ္စည်း မှတ်တမ်း နှစ်ခု)
- **ပစ္စည်းး ၁**: ၃၅ မိနစ် — ဖတ်ပြီးနားလည်ခြင်း ပြဿနာများ
- **ပစ္စည်းး ၂**: ၄၅ မိနစ် — ရေးသားခြင်း (ယနေ့တိုင်း) + ကျန်ရှိ ပြဿနာများ

## ရလဒ်မှတ်တမ်း
- ရလဒ်: **၁၀၀–၂၀၀**
- အောင်မြင်ရန်: **၁၄၅**
- College Ready: **၁၆၅**`,
        keyTakeaways: [
          "RLA test is 65 minutes split into two sections",
          "75% of passages are informational texts, 25% literary",
          "Extended response requires analyzing two opposing arguments",
          "Essay scored on claim, evidence, organization, and language",
          "Passing score is 145; College Ready is 165",
        ],
        formulaOrRules: [
          "Essay length: 250-500 words recommended",
          "Essay scoring dimensions: claim, evidence, organization, language",
        ],
      },
    ],
  },
  {
    subjectCode: "rla",
    categoryType: "handbook",
    title: "Reading Comprehension Strategies",
    titleTh: "กลยุทธ์การอ่านเข้าใจ",
    titleMm: "ဖတ်ပြီး နားလည်ခြင်း လုပ်ဆောင်ချက်များ",
    sortOrder: 1,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Reading Comprehension Strategies

## Active Reading Approach
1. **Preview the passage**: Read the title, first sentence of each paragraph, and the last paragraph
2. **Identify the purpose**: Ask: Why did the author write this? (Inform, Persuade, Entertain)
3. **Annotate mentally**: Note the main idea of each paragraph as you read
4. **Underline key evidence**: Mark specific details, statistics, or quotes that support claims

## Question Types and How to Tackle Them
- **Main Idea**: What is the passage primarily about? Look at the first and last paragraphs.
- **Inference**: What can be concluded from the passage? The answer is NOT directly stated — look for clues.
- **Detail**: What does the passage say about X? Find the specific line in the text.
- **Author's Purpose**: Why did the author write this? Look at tone, word choice, and structure.
- **Tone/Mood**: What is the author's attitude? Look at emotional language and adjectives.
- **Text Structure**: How is the passage organized? (Cause-effect, compare-contrast, chronological, problem-solution)

## Evidence-Based Answering
Always return to the passage to verify your answer. Do not rely on memory alone. For inference questions, look for textual evidence that supports your conclusion.

## Time Management
- Spend about **1.5–2 minutes per reading question**
- Read the question BEFORE reading the passage (for detail questions)
- For main idea questions, read the entire passage first
- Do not over-analyze — trust your first reasonable interpretation`,
        contentBodyTh: `# กลยุทธ์การอ่านเข้าใจ

## การอ่านแบบมีส่วนร่วม
1. **สำรวจบทความก่อน**: อ่านชื่อเรื่อง ประโยคแรกของแต่ละวรรค และวรรคสุดท้าย
2. **ระบุวัตถุประสงค์**: ถามตัวเองว่า ผู้เขียนเขียนนี้เพื่ออะไร? (ให้ข้อมูล โน้มน้าว บันเทิง)
3. **จดบันทึกในใจ**: สังเกตใจความสำคัญของแต่ละวรรคขณะอ่าน
4. **เน้นหลักฐานสำคัญ**: ทำเครื่องหมายรายละเอียด สถิติ หรือคำพูดที่สนับสนุนข้ออ้าง

## ประเภทคำถามและวิธีจัดการ
- **ใจความสำคัญ**: บทความพูดถึงอะไรเป็นหลัก? ดูที่วรรคแรกและสุดท้าย
- **การสรุปความ**: สรุปอะไรได้จากบทความ? คำตอบไม่ได้ระบุตรงๆ — หาตัวบอก
- **รายละเอียด**: บทความพูดถึง X อย่างไร? หาบรรทัดที่เกี่ยวข้องในข้อความ
- **วัตถุประสงค์ผู้เขียน**: ผู้เขียนเขียนนี้เพื่ออะไร? ดูน้ำเสียง คำศัพท์ โครงสร้าง
- **น้ำเสียง/อารมณ์**: ทัศนคติของผู้เขียนคืออะไร? ดูคำที่มีอารมณ์และคำคุณศัพท์
- **โครงสร้างข้อความ**: บทความจัดระเบียบอย่างไร? (สาเหตุ-ผล เปรียบเทียบ ตามลำดับเวลา ปัญหา-วิธีแก้)

## การตอบโดยอ้างอิงหลักฐาน
กลับไปอ่านบทความเสมอเพื่อตรวจสอบคำตอบ อย่าพึ่งความจำเพียงอย่างเดียว สำหรับคำถามสรุปความ ให้หาหลักฐานในข้อความที่สนับสนุนข้อสรุป`,
        contentBodyMm: `# ဖတ်ပြီး နားလည်ခြင်း လုပ်ဆောင်ချက်များ

## ပါဝင်စွာ ဖတ်ခြင်း နည်းလမ်း
1. ပကတိ စာသားကို ကြည့်ရန်
2. ရေးသားသူ၏ ရည်ရွယ်ချက်ကို သတ်မှတ်ရန်
3. နောက်ဆုံး အပိုင်းကို ဖတ်ရန်

## ပြဿနာအမျိုးအစားများနှင့် ဖြေရှင်းချက်
- **အရေးကြီးသော အထိပ်တည်း**: ပထမနှင့် နောက်ဆုံး အပိုင်းကို ဖတ်ပါ
- **ဆန်တူခြင်း**: စာသားတွင် တည်ဆောက်ထားသော အထိတွေ့ကို ရှာပါ
- **အသေးစိတ်များ**: စာသားတွင် ကိုယ်စီးပြီး ရှာပါ`,
        keyTakeaways: [
          "Preview: title, first sentences, last paragraph",
          "Identify author's purpose: Inform, Persuade, or Entertain",
          "For inference questions, the answer is NOT directly stated",
          "Always return to the passage to verify your answer",
          "Spend ~1.5-2 minutes per reading question",
        ],
        formulaOrRules: [],
      },
    ],
  },

  // ==========================================================================
  // RLA — Core Textbook (B)
  // ==========================================================================
  {
    subjectCode: "rla",
    categoryType: "textbook",
    title: "Main Idea, Inference & Evidence",
    titleTh: "ใจความสำคัญ การสรุปความ และหลักฐาน",
    titleMm: "အရေးကြီးသော အထိ၊ ဆန်တူခြင်းနှင့် အထောက်အကူ",
    sortOrder: 0,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Main Idea, Inference & Evidence

## Finding the Main Idea
The main idea is the central point the author wants to communicate. It is usually found in:
- The **first or last sentence** of the passage
- The **thesis statement** of an essay
- Repeated **keywords or phrases** throughout the text

### How to Identify
1. Ask: "What is this passage mostly about?"
2. Eliminate details that are too specific or too broad
3. The main idea should cover the entire passage, not just one paragraph

## Making Inferences
An inference is a conclusion drawn from evidence and reasoning, not directly stated in the text.

### Inference Process
1. Read the question carefully
2. Find relevant evidence in the passage
3. Combine the evidence with your reasoning
4. Choose the answer that is most logically supported

### Key Signal Words for Inferences
- "suggests", "implies", "can be concluded", "most likely"
- "The author would probably agree that..."

## Using Evidence
Strong answers are supported by:
- **Direct quotes** from the passage
- **Paraphrased ideas** from specific sections
- **Statistical data** or facts mentioned in the text
- **Cause-and-effect relationships** established in the passage

## Distinguishing Fact from Opinion
- **Fact**: Can be verified; uses objective language ("studies show", "data indicates")
- **Opinion**: Cannot be verified; uses subjective language ("I believe", "the best", "obviously")`,
        contentBodyTh: `# ใจความสำคัญ การสรุปความ และหลักฐาน

## การหาใจความสำคัญ
ใจความสำคัญคือประเด็นหลักที่ผู้เขียนต้องการสื่อสาร มักพบได้ที่:
- **ประโยคแรกหรือประโยคสุดท้าย** ของบทความ
- **ประโยคเรื่อง (thesis statement)** ของเรียงความ
- **คำหรือวลี** ที่ซ้ำกันตลอดทั้งข้อความ

### วิธีระบุ
1. ถามตัวเอง: "บทความนี้พูดถึงอะไรเป็นหลัก?"
2. ตัดรายละเอียดที่จำเพาะเจาะจงหรือกว้างเกินไปออก
3. ใจความสำคัญต้องครอบคลุมทั้งบทความ ไม่ใช่แค่วรรคเดียว

## การสรุปความ (Inference)
การสรุปความคือข้อสรุปที่หามาจากหลักฐานและการใช้เหตุผล ไม่ได้ระบุตรงๆ ในข้อความ

### ขั้นตอนการสรุปความ
1. อ่านคำถามให้ระมัดระวัง
2. หาหลักฐานที่เกี่ยวข้องในบทความ
3. ผสมหลักฐานกับการใช้เหตุผลของคุณ
4. เลือกคำตอบที่มีเหตุผลสนับสนุนมากที่สุด

### คำสัญญาณสำคัญสำหรับการสรุปความ
- "บอกเป็นนัย", "แสดงว่า", "สรุปได้ว่า", "น่าจะเป็นไปได้ว่า"

## การใช้หลักฐาน
คำตอบที่ดีต้องมีหลักฐานสนับสนุน:
- **คำพูดโดยตรง** จากบทความ
- **ความคิดที่ดัดแปลง** จากส่วนเฉพาะเจาะจง
- **ข้อมูลสถิติ** หรือข้อเท็จจริงที่กล่าวถึงในข้อความ

## การแยกความแตกต่างระหว่างข้อเท็จจริงและความคิดเห็น
- **ข้อเท็จจริง**: ตรวจสอบได้ ใช้ภาษาที่เป็นกลาง ("การศึกษาแสดงว่า", "ข้อมูลชี้ว่า")
- **ความคิดเห็น**: ตรวจสอบไม่ได้ ใช้ภาษาเชิงอัตวิสัย ("ฉันเชื่อ", "ดีที่สุด", "ชัดเจน")`,
        contentBodyMm: `# အရေးကြီးသော အထိ၊ ဆန်တူခြင်းနှင့် အထောက်အကူ

## အရေးကြီးသော အထိကို ရှာခြင်း

အရေးကြီးသော အထိသည် ရေးသားသူ ဖော်ပြလိုသော အလိုက်ဖြစ်သည်။ အရေရှိသော နေရာများ:
- ပထမနှင့် နောက်ဆုံး သတိမှတ်ချက်များ
- သတိမှတ်ချက် ပရော်ဖက်၏ အဓိပ္ပာယ်ဖော်ပြချက်
- စာသား အတွက် အရမ်းအားဖြင့် ထပ်တိုက် ပေါ်ဖြာသော စကားလုံးများ

## ဆန်တူခြင်း (Inference)

ဆန်တူခြင်းသည် စာသားတွင် တိုက်တည်စွာ ဖော်ပြထားမှုမဟုတ်ဘဲ အထောက်အကူနှင့် အကြံပြုချက်များမှ ထုတ်ထွင်းထားသော အkaကျဝေး ဖြစ်သည်။`,
        keyTakeaways: [
          "Main idea = the central point, usually in first/last sentence",
          "Inference = conclusion NOT directly stated, based on clues",
          "Signal words: suggests, implies, can be concluded, most likely",
          "Strong answers use direct quotes or paraphrased evidence",
          "Fact = verifiable; Opinion = subjective belief",
        ],
        formulaOrRules: [
          "Main Idea Test: Does it cover the ENTIRE passage?",
          "Inference Test: Is there textual evidence to support this conclusion?",
          "Fact vs Opinion: Can it be proven objectively?",
        ],
      },
    ],
  },
  {
    subjectCode: "rla",
    categoryType: "textbook",
    title: "Grammar, Usage & Mechanics",
    titleTh: "ไวยากรณ์ การใช้ภาษา และกฎเกณฑ์",
    titleMm: "ကာကွယ်ရေး၊ အသုံးပြုမှုနှင့် စည်မာများ",
    sortOrder: 1,
    contents: [
      {
        sortOrder: 0,
        contentBodyEn: `# Grammar, Usage & Mechanics

## Subject-Verb Agreement
A singular subject takes a singular verb; a plural subject takes a plural verb.
- Correct: "The cat **runs** quickly." (singular)
- Correct: "The cats **run** quickly." (plural)

### Tricky Cases
- Compound subjects with "and" = plural ("Tom and Jerry **are** friends")
- Subjects with "or/nor" = verb matches the closer subject
- Collective nouns (team, group, family) = usually singular in American English
- Indefinite pronouns (everyone, nobody, each) = always singular

## Verb Tenses
- **Simple Present**: I walk (habitual actions)
- **Simple Past**: I walked (completed actions)
- **Present Perfect**: I have walked (past action with present relevance)
- **Past Perfect**: I had walked (past action before another past action)
- **Future**: I will walk (actions yet to happen)

## Pronoun-Antecedent Agreement
Pronouns must match their antecedents in number and gender.
- Each student must bring **his or her** book.
- The dogs wagged **their** tails.

## Common Sentence Errors
- **Run-on**: Two independent clauses joined without proper punctuation
  - Fix: Use a period, semicolon, or conjunction
- **Fragment**: Incomplete sentence missing subject or verb
  - Fix: Add the missing element
- **Comma splice**: Two independent clauses joined by only a comma
  - Fix: Use a semicolon or add a conjunction

## Punctuation Rules
- **Comma**: Separate items in a list, after introductory phrases, before conjunctions in compound sentences
- **Semicolon**: Join two related independent clauses
- **Apostrophe**: Show possession (John's) or contraction (don't)`,
        contentBodyTh: `# ไวยากรณ์ การใช้ภาษา และกฎเกณฑ์

## การเห็นพ้องกันระหว่างประธานและกริยา
ประธานเอกพจน์ใช้กริยาเอกพจน์ ประธานพหูพจน์ใช้กริยาพหูพจน์
- ถูกต้อง: "แมว **วิ่ง** เร็ว" (เอกพจน์)
- ถูกต้อง: "แมวๆ **วิ่ง** เร็ว" (พหูพจน์)

### กรณีที่ซับซ้อน
- ประธานรวมด้วย "และ" = พหูพจน์ ("ทอมและเจอร์รี่ **เป็น** เพื่อน")
- ประธานที่มี "หรือ" = กริยาตามประธานที่ใกล้กว่า
- คำนามรวม (ทีม, กลุ่ม, ครอบครัว) = มักเป็นเอกพจน์ในภาษาอังกฤษอเมริกัน
- สรรพนามไม่ชี้เฉพาะ (ทุกคน, ไม่มีใคร, แต่ละคน) = เป็นเอกพจน์เสมอ

## กาลกริยา
- **ปัจจุบันกาลธรรมดา**: I walk (นิสัยประจำ)
- **อดีตกาลธรรมดา**: I walked (เสร็จแล้ว)
- **ปัจจุบันกาลสมบูรณ์**: I have walked (อดีตที่เกี่ยวข้องกับปัจจุบัน)
- **อดีตกาลสมบูรณ์**: I had walked (อดีตก่อนอดีตอีกเหตุการณ์หนึ่ง)
- **อนาคตกาล**: I will walk (ที่ยังไม่เกิด)

## ความผิดพลาดประโยคที่พบบ่อย
- **Run-on**: ประโยคอิสระ 2 ประโยคต่อกันโดยไม่มีวรรคตอนที่เหมาะสม
- **Fragment**: ประโยคไม่สมบูรณ์ ขาดประธานหรือกริยา
- **Comma splice**: ประโยคอิสระ 2 ประโยค ต่อกันด้วยจุลภาคเพียงอย่างเดียว`,
        contentBodyMm: `# ကာကွယ်ရေး၊ အသုံးပြုမှုနှင့် စည်မာများ

## အားသား-လုပ်ရေး သင့်ကျေးဇူးတင်ခြင်း

တစ်ခုတည်း အားသားသည် တစ်ခုတည်း လုပ်ရေးကို သုံးသည်။ များစွာ အားသားသည် များစွာ လုပ်ရေးကို သုံးသည်။
- မှန်ကန်: "The cat **runs** quickly." (တစ်ခုတည်း)
- မှန်ကန်: "The cats **run** quickly." (များစွာ)

## လုပ်ရေး ခပ်သေချာ စည်မာများ
- **Present**: I walk (လမ်းလျှင် လုပ်ဆောင်ချက်များ)
- **Past**: I walked (ပြီးဆုံးခဲ့သော လုပ်ရေးများ)
- **Present Perfect**: I have walked (ယခုလို ပြီးခဲ့သော လုပ်ရေးများ)
- **Past Perfect**: I had walked (နောက်ထပ် လုပ်ရေးမှန်ကန်မှု)`,
        keyTakeaways: [
          "Subject-verb agreement: singular subject = singular verb",
          "Indefinite pronouns (everyone, each) are ALWAYS singular",
          "Run-on fix: use period, semicolon, or conjunction",
          "Fragment fix: add missing subject or verb",
          "Comma splice fix: use semicolon or add conjunction",
        ],
        formulaOrRules: [
          "Singular subjects need singular verbs",
          "Compound subjects with 'and' are plural",
          