import json, os

# This script generates prisma/seed-handbook.ts with comprehensive GED handbook data
# 4 subjects x 2 categories (handbook A, textbook B) x 2 topics each = 16 topics

TOPICS = [
  # ==========================================================================
  # MATH — Exam Handbook (A)
  # ==========================================================================
  {
    "subjectCode": "math", "categoryType": "handbook", "sortOrder": 0,
    "title": "GED Math Test Format & Scoring",
    "titleTh": "รูปแบบและการให้คะแนนข้อสอบ GED คณิตศาสตร์",
    "titleMm": "GED တွေ့ခြင်းစမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း",
    "contents": [{
      "sortOrder": 0,
      "en": "# GED Math Test Format & Scoring\n\nThe GED Mathematical Reasoning test has **46 questions** in **115 minutes**.\n\n## Test Structure\n- **Part 1 (5 questions)**: No calculator — tests mental math\n- **Part 2 (41 questions)**: TI-30XS calculator on screen\n\n## Question Types\n- Multiple Choice (40%), Multiple Select (10%)\n- Fill-in-the-Blank (15%), Drag-and-Drop (20%), Hot Spot (15%)\n\n## Scoring\n- Score range: 100-200 | Passing: **145** | College Ready: **165**\n\n## Content Distribution\n- Algebraic Problem Solving: ~45%\n- Quantitative Problem Solving: ~55% (geometry, data, number operations)",
      "th": "# รูปแบบและการให้คะแนนข้อสอบ GED คณิตศาสตร์\n\nข้อสอบ GED คณิตศาสตร์มี **46 ข้อ** เวลา **115 นาที**\n\n## โครงสร้างข้อสอบ\n- **ส่วนที่ 1 (5 ข้อ)**: ห้ามใช้เครื่องคิดเลข — วัดทักษะคำนวณในหัว\n- **ส่วนที่ 2 (41 ข้อ)**: ใช้เครื่องคิดเลข TI-30XS บนจอภาพ\n\n## ประเภทข้อสอบ\n- เลือกตอบเดี่ยว (40%), เลือกตอบหลายข้อ (10%)\n- เติมคำตอบ (15%), ลากแล้ววาง (20%), คลิกจุด (15%)\n\n## การให้คะแนน\n- คะแนน: 100-200 | ผ่านขั้นต่ำ: **145** | College Ready: **165**\n\n## สัดส่วนเนื้อหา\n- การแก้ปัญหาเชิงพีชคณิต: ~45%\n- การแก้ปัญหาเชิงปริมาณ: ~55% (เรขาคณิต สถิติ จำนวน)",
      "mm": "# GED တွေ့ခြင်းစမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း\n\nGED တွေ့ခြင်းစမ်းပြဿနာတွင် **၄၆** ပြဿနာများရှိပြီး **၁၁၅** မိနစ် ကြာသည်။\n\n- ပစ္စည်းး (၁) (၅ ပြဿနာ): ကွက်တိုက်မသုံးရ\n- ပစ္စည်းး (၂) (၄၁ ပြဿနာ): TI-30XS ကွက်တိုက် အသုံးပြုနိုင်\n\n- ရလဒ်: ၁၀၀-၂၀၀ | အောင်မြင်ရန်: **၁၄၅** | College Ready: **၁၆၅**",
      "takeaways": [
        "GED Math has 46 questions in 115 minutes",
        "First 5 questions do NOT allow calculator",
        "Passing score is 145; College Ready is 165",
        "Algebra ~45% and Quantitative reasoning ~55%",
        "TI-30XS calculator is provided on-screen for Part 2"
      ],
      "formulas": []
    }]
  },
  {
    "subjectCode": "math", "categoryType": "handbook", "sortOrder": 1,
    "title": "Math Test-Taking Strategies",
    "titleTh": "กลยุทธ์การทำข้อสอบคณิตศาสตร์",
    "titleMm": "တွေ့ခြင်းစမ်းပြဿနာ လုပ်ဆောင်ချက်များ",
    "contents": [{
      "sortOrder": 0,
      "en": "# Math Test-Taking Strategies\n\n## Time Management\n- Spend ~2 minutes per question on average\n- If stuck >3 min, mark it and move on\n- Answer easier questions first to secure points\n\n## Problem-Solving Steps\n1. **Read carefully**: Identify what is being asked\n2. **Estimate first**: Get a reasonable answer range\n3. **Work backwards**: Plug answer choices into the problem\n4. **Eliminate wrong answers**: Cross out clearly incorrect options\n5. **Check your work**: Verify with a different method if time permits\n\n## Calculator Tips\n- Learn TI-30XS functions before test day\n- Use calculator for complex arithmetic, not simple mental math\n- Always double-check calculator entries for typos\n\n## Common Pitfalls\n- Misreading keywords: \"NOT\", \"approximately\", \"least\"\n- Unit confusion: check if answer should be in feet, meters, dollars\n- Negative sign errors in calculations\n- Rushing through Part 1 (no calculator allowed)",
      "th": "# กลยุทธ์การทำข้อสอบคณิตศาสตร์\n\n## การจัดการเวลา\n- ใช้เวลาเฉลี่ย ~2 นาทีต่อข้อ\n- ถ้าติดเกิน 3 นาที ทำเครื่องหมายแล้วข้ามไปก่อน\n- ทำข้อง่ายก่อนเพื่อสะสมคะแนน\n\n## ขั้นตอนการแก้ปัญหา\n1. **อ่านให้ระมัดระวัง**: ให้แน่ใจว่าเข้าใจโจทย์\n2. **ประมาณค่าก่อน**: เดาช่วงคำตอบที่น่าจะเป็นไปได้\n3. **ย้อนกลับ**: นำคำตอบไปทดสอบกับโจทย์\n4. **ตัดข้อผิดออก**: ขีดเส้นทับตัวเลือกที่ผิดชัดเจน\n5. **ตรวจสอบ**: ถ้ามีเวลาเหลือ ตรวจด้วยวิธีอื่น\n\n## ข้อผิดพลาดที่พบบ่อย\n- อ่านโจทย์ผิด: เน้นคำว่า \"ไม่\", \"ประมาณ\", \"น้อยที่สุด\"\n- สับสนหน่วย: ตรวจสอบว่าคำตอบต้องเป็นหน่วยอะไร\n- ผิดเครื่องหมายลบในการคำนวณ\n- รีบทำ Part 1 เกินไป (ไม่มีเครื่องคิดเลข)",
      "mm": "# တွေ့ခြင်းစမ်းပြဿနာ လုပ်ဆောင်ချက်များ\n\n- တစ်ပြဿနာလုံး အမြန် ၂ မိနစ်သုံးပါ\n- ၃ မိနစ်ထက်ပို၍ ပြဿနာတွေ့ချင်လို့ ရှိလျှင် အမှတ်တည်၍ နောက်သို့ ရှောင်ပါ\n- လွယ်ကူအပြုသော ပြဿနာများကို ယုံကြည်စွာ ဖြေပါ\n- ပြဿနာကို သေချာစွာ ဖတ်ပြီး အောက်မှတ်ပါ",
      "takeaways": [
        "Spend ~2 minutes per question, skip hard ones",
        "Estimate answer before calculating for a sanity check",
        "Work backwards by plugging in answer choices",
        "Learn the TI-30XS calculator before test day",
        "Read carefully for keywords: NOT, approximately, least"
      ],
      "formulas": []
    }]
  },
  # ==========================================================================
  # MATH — Core Textbook (B)
  # ==========================================================================
  {
    "subjectCode": "math", "categoryType": "textbook", "sortOrder": 0,
    "title": "Linear Equations & Inequalities",
    "titleTh": "สมการเชิงเส้นและอสมการ",
    "titleMm": "ဟိုးလိုက် ဆက်စပ်မှုများနှင့် တားဆီးမှုများ",
    "contents": [{
      "sortOrder": 0,
      "en": "# Linear Equations & Inequalities\n\n## What is a Linear Equation?\nA linear equation has the highest exponent of any variable equal to 1. Standard form: **ax + b = c**\n\n## Solving One-Variable Equations\nUse **inverse operations** to isolate the variable:\n- If a number is **added** to x, **subtract** it from both sides\n- If a number is **multiplied** by x, **divide** both sides\n\n### Example: 3x + 7 = 22\n- Step 1: Subtract 7: 3x = 15\n- Step 2: Divide by 3: **x = 5**\n\n## Solving Inequalities\nSame as equations but with <, >, <=, >=.\n**Key rule: When you multiply/divide by a NEGATIVE number, FLIP the sign!**\n\n### Example: -2x > 6 => x < -3 (sign flipped!)\n\n## Systems of Equations\n1. **Substitution**: Solve one equation for a variable, plug into the other\n2. **Elimination**: Add/subtract equations to cancel a variable",
      "th": "# สมการเชิงเส้นและอสมการ\n\n## สมการเชิงเส้นคืออะไร?\nสมการที่เลขยกกำลังสูงสุดของตัวแปรเป็น 1 รูปแบบ: **ax + b = c**\n\n## การแก้สมการตัวแปรเดียว\nใช้ **การดำเนินการผกผัน** เพื่อแยกตัวแปร:\n- ถ้ามีการ**บวก**เลขเข้ากับ x ให้**ลบ**ออกจากทั้งสองข้าง\n- ถ้ามีการ**คูณ**เลขกับ x ให้**หาร**ทั้งสองข้าง\n\n### ตัวอย่าง: 3x + 7 = 22\n- ขั้นตอนที่ 1: ลบ 7: 3x = 15\n- ขั้นตอนที่ 2: หารด้วย 3: **x = 5**\n\n## การแก้อสมการ\nเหมือนสมการปกติ แต่ใช้ <, >, <=, >=\n**กฎสำคัญ: เมื่อคูณ/หารด้วยจำนวนลบ ให้พลิกเครื่องหมาย!**\n\n### ตัวอย่าง: -2x > 6 => x < -3 (เครื่องหมายพลิก!)\n\n## ระบบสมการ\n1. **วิธีเทียบแทน**: แก้สมการหนึ่ง แล้วนำไปแทนในอีกสมการ\n2. **วิธีตัดทิ้ง**: บวก/ลบสมการเพื่อลบตัวแปรหนึ่ง",
      "mm": "# ဟိုးလိုက် ဆက်စပ်မှုများနှင့် တားဆီးမှုများ\n\nဟိုးလိုက် ဆက်စပ်မှုသည် အမြင့်ဆုံး အကြီးမားဆုံး သင်္ချာသည် ၁ ဖြစ်သည်။ ပုံမှန်: ax + b = c\n\n- 3x + 7 = 22 ဖြေရှင်းရန်: 3x = 15 => x = 5\n- စားသော အကြောင်းမှားလျှင် အမှတ်တည်ပါ",
      "takeaways": [
        "Use inverse operations to isolate the variable",
        "When multiplying/dividing inequalities by negative, FLIP the sign",
        "Substitution: solve one variable, plug into the other",
        "Elimination: add/subtract equations to cancel a variable",
        "Always check your answer by substituting back"
      ],
      "formulas": [
        "Standard form: ax + b = c",
        "Slope-intercept: y = mx + b",
        "Inequality flip rule: If a < b, then -a > -b"
      ]
    }]
  },
  {
    "subjectCode": "math", "categoryType": "textbook", "sortOrder": 1,
    "title": "Geometry, Measurement & Statistics",
    "titleTh": "เรขาคณิต การวัด และสถิติ",
    "titleMm": "စတိုးတွေ့ခြင်း၊ တိုင်းတာနှင့် စာရင်းအင်း",
    "contents": [{
      "sortOrder": 0,
      "en": "# Geometry, Measurement & Statistics\n\n## Perimeter & Area\n- Rectangle: P = 2(l+w), A = lw\n- Triangle: A = (1/2)bh\n- Circle: C = 2*pi*r, A = pi*r^2\n- Trapezoid: A = (1/2)(b1+b2)h\n\n## Volume\n- Rectangular prism: V = lwh\n- Cylinder: V = pi*r^2*h\n- Cone: V = (1/3)*pi*r^2*h\n\n## Pythagorean Theorem\nRight triangle: **a^2 + b^2 = c^2** (c = hypotenuse)\nCommon triples: (3,4,5), (5,12,13), (8,15,17)\n\n## Coordinate Geometry\n- Slope: m = (y2-y1)/(x2-x1)\n- Distance: d = sqrt((x2-x1)^2 + (y2-y1)^2)\n- Midpoint: M = ((x1+x2)/2, (y1+y2)/2)\n\n## Statistics\n- Mean = sum/count | Median = middle value | Mode = most frequent\n- Probability P(E) = favorable/total\n- P(not A) = 1 - P(A)\n- Independent: P(A and B) = P(A) x P(B)",
      "th": "# เรขาคณิต การวัด และสถิติ\n\n## เส้นรอบรูปและพื้นที่\n- สี่เหลี่ยมผืนผ้า: เส้นรอบ = 2(ยาว+กว้าง), พื้นที่ = ยาว x กว้าง\n- สามเหลี่ยม: พื้นที่ = (1/2) x ฐาน x สูง\n- วงกลม: เส้นรอบ = 2 x พาย x รัศมี, พื้นที่ = พาย x รัศมี^2\n- สี่เหลี่ยมคางหกู่: พื้นที่ = (1/2)(ฐาน1+ฐาน2) x สูง\n\n## ปริมาตร\n- ทรงกระบอก: V = พาย x รัศมี^2 x สูง\n- ทรงกรวย: V = (1/3) x พาย x รัศมี^2 x สูง\n\n## ทฤษฎีบทพีทาโกรัส\nสามเหลี่ยมมุมฉาก: **a^2 + b^2 = c^2** (c = เส้นทแยงมุมฉาก)\nกลุ่มตัวเลขที่พบบ่อย: (3,4,5), (5,12,13), (8,15,17)\n\n## เรขาคณิตพิกัด\n- ความชัน: m = (y2-y1)/(x2-x1)\n- ระยะทาง: d = sqrt((x2-x1)^2 + (y2-y1)^2)\n\n## สถิติ\n- ค่าเฉลี่ย = ผลรวม/จำนวน | มัธยฐาน = ค่ากลาง | ฐานนิยม = ค่าที่พบบ่อยสุด\n- ความน่าจะเป็น P(E) = ผลลัพธ์ที่ต้องการ/ผลลัพธ์ทั้งหมด\n- P(ไม่ใช่ A) = 1 - P(A)",
      "mm": "# စတိုးတွေ့ခြင်း၊ တိုင်းတာနှင့် စာရင်းအင်း\n\n- ချတ်တုံးပြက္ခဒိန်: အကျုံးဝန်းကျင် = ယူး x အလျား\n- သုံးမျိုးပြည့်: အကျုံးဝန်းကျင် = (၁/၂) x အောက်ခြေ x အမြင့်\n- ပိုးလိုက်: တိုက်ရိုက် = pi x ရာသီး^2 x အမြင့်\n- ပိုင်းလိုက် သတ်မှတ်ချက်: a^2 + b^2 = c^2\n- စာရင်းအင်း: Mean = ပေါင်းလုံး / အရေအား",
      "takeaways": [
        "Memorize key formulas for area, perimeter, and volume",
        "Pythagorean theorem: a^2 + b^2 = c^2 for right triangles",
        "Common triples: (3,4,5), (5,12,13), (8,15,17)",
        "Slope = rise/run = (y2-y1)/(x2-x1)",
        "Probability = favorable outcomes / total outcomes"
      ],
      "formulas": [
        "Circle: C = 2*pi*r, A = pi*r^2",
        "Triangle area: A = (1/2)*b*h",
        "Pythagorean: a^2 + b^2 = c^2",
        "Slope: m = (y2-y1)/(x2-x1)",
        "Distance: d = sqrt((x2-x1)^2 + (y2-y1)^2)",
        "Volume (cylinder): V = pi*r^2*h",
        "Volume (cone): V = (1/3)*pi*r^2*h",
        "Mean = Sum / Count",
        "P(not A) = 1 - P(A)",
        "P(A and B) = P(A) x P(B) for independent events"
      ]
    }]
  },

  # ==========================================================================
  # RLA — Exam Handbook (A)
  # ==========================================================================
  {
    "subjectCode": "rla", "categoryType": "handbook", "sortOrder": 0,
    "title": "GED RLA Test Format & Scoring",
    "titleTh": "รูปแบบและการให้คะแนนข้อสอบ GED ภาษาอังกฤษ",
    "titleMm": "GED အင်္ဂလိပ်စကား စမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း",
    "contents": [{
      "sortOrder": 0,
      "en": "# GED RLA Test Format & Scoring\n\nThe GED Reasoning Through Language Arts test is **65 minutes** total.\n\n## Structure\n- **Section 1 (35 min)**: Reading comprehension and language questions\n- **Section 2 (45 min)**: Extended Response (essay) + remaining questions\n\n## Question Types\n- Reading Comprehension (~45%): Main idea, inference, details, tone, purpose\n- Grammar & Language (~35%): Sentence structure, punctuation, verb tense\n- Extended Response Essay (~20%): Analyze an argument, write 250-500 words\n\n## Scoring\n- Score range: 100-200 | Passing: **145** | College Ready: **165**\n\n## Passages\n- Literary texts (25%): Fiction, poetry, drama\n- Informational texts (75%): Workplace docs, founding documents, articles\n\n## Extended Response\nRead two opposing arguments. Analyze which is better supported using evidence. Scored on: claim, evidence, organization, language conventions.",
      "th": "# รูปแบบและการให้คะแนนข้อสอบ GED ภาษาอังกฤษ\n\nข้อสอบ GED RLA ใช้เวลา **65 นาที** ทั้งหมด\n\n## โครงสร้าง\n- **ส่วนที่ 1 (35 นาที)**: คำถามการอ่านเข้าใจและภาษา\n- **ส่วนที่ 2 (45 นาที)**: เรียงความ Extended Response + คำถามที่เหลือ\n\n## ประเภทข้อสอบ\n- การอ่านเข้าใจ (~45%): ใจความสำคัญ การสรุปความ รายละเอียด น้ำเสียง\n- ไวยากรณ์ (~35%): โครงสร้างประโยค วรรคตอน กาลกริยา\n- เรียงความ (~20%): วิเคราะห์อาร์กิวเมนต์ เขียน 250-500 คำ\n\n## การให้คะแนน\n- คะแนน: 100-200 | ผ่าน: **145** | College Ready: **165**\n\n## บทความที่ให้อ่าน\n- วรรณกรรม (25%): นิยาย กวีนิพนธ์ ละคร\n- ข้อมูล (75%): เอกสารที่ทำงาน เอกสารก่อตั้งสหรัฐฯ บทความวิชาการ",
      "mm": "# GED အင်္ဂလိပ်စကား စမ်းပြဿနာ အသေးစိတ်\n\nGED RLA စမ်းပြဿနာသည် အချိန် **၆၅** မိနစ် ရှိသည်။\n\n- ပစ္စည်းး ၁ (၃၅ မိနစ်): ဖတ်ပြီးနားလည်ခြင်း ပြဿနာများ\n- ပစ္စည်းး ၂ (၄၅ မိနစ်): ရေးသားခြင်း (၂၅၀-၅၀၀ စကား)\n- ရလဒ်: ၁၀၀-၂၀၀ | အောင်မြင်ရန်: **၁၄၅**",
      "takeaways": [
        "RLA test is 65 minutes split into two sections",
        "75% of passages are informational texts, 25% literary",
        "Extended response requires analyzing two opposing arguments",
        "Essay scored on claim, evidence, organization, and language",
        "Passing score is 145; College Ready is 165"
      ],
      "formulas": ["Essay length: 250-500 words recommended", "Essay dimensions: claim, evidence, organization, language"]
    }]
  },
  {
    "subjectCode": "rla", "categoryType": "handbook", "sortOrder": 1,
    "title": "Reading Comprehension & Essay Strategies",
    "titleTh": "กลยุทธ์การอ่านเข้าใจและเขียนเรียงความ",
    "titleMm": "ဖတ်ပြီးနားလည်ခြင်းနှင့် ရေးသားခြင်း လုပ်ဆောင်ချက်များ",
    "contents": [{
      "sortOrder": 0,
      "en": "# Reading Comprehension & Essay Strategies\n\n## Active Reading Steps\n1. **Preview**: Read title, first sentences of each paragraph, last paragraph\n2. **Identify purpose**: Inform, Persuade, or Entertain?\n3. **Note main ideas** per paragraph as you read\n4. **Mark evidence**: Underline key details, statistics, quotes\n\n## Question Attack Guide\n- **Main Idea**: Look at first/last paragraphs\n- **Inference**: NOT directly stated — find clues in text\n- **Detail**: Find the specific line in the passage\n- **Author's Purpose**: Check tone, word choice, structure\n- **Tone/Mood**: Look for emotional language and adjectives\n\n## Essay Writing Framework\n1. **Introduction**: State your thesis (which argument is better supported)\n2. **Body Paragraph 1**: Analyze evidence from Passage A\n3. **Body Paragraph 2**: Analyze evidence from Passage B\n4. **Conclusion**: Restate thesis with reasoning\n\n**Key tip**: Use direct quotes and specific details from BOTH passages.",
      "th": "# กลยุทธ์การอ่านเข้าใจและเขียนเรียงความ\n\n## ขั้นตอนการอ่านแบบมีส่วนร่วม\n1. **สำรวจ**: อ่านชื่อเรื่อง ประโยคแรกของแต่ละวรรค วรรคสุดท้าย\n2. **ระบุวัตถุประสงค์**: ให้ข้อมูล โน้มน้าว หรือบันเทิง?\n3. **จดใจความสำคัญ** ของแต่ละวรรคขณะอ่าน\n4. **ทำเครื่องหมายหลักฐาน**: เน้นรายละเอียด สถิติ คำพูดสำคัญ\n\n## คู่มือตอบคำถาม\n- **ใจความสำคัญ**: ดูวรรคแรกและสุดท้าย\n- **การสรุปความ**: คำตอบไม่ได้ระบุตรงๆ — หาตัวบอกในข้อความ\n- **รายละเอียด**: หาบรรทัดที่เกี่ยวข้องในบทความ\n- **วัตถุประสงค์**: ดูน้ำเสียง คำศัพท์ โครงสร้างข้อความ\n\n## โครงสร้างเขียนเรียงความ\n1. **บทนำ**: กล่าว thesis (อาร์กิวเมนต์ไหนดีกว่า)\n2. **วรรคตัวอย่าง 1**: วิเคราะห์หลักฐานจากบทความ A\n3. **วรรคตัวอย่าง 2**: วิเคราะห์หลักฐานจากบทความ B\n4. **บทสรุป**: กล่าว thesis ซ้ำพร้อมเหตุผล",
      "mm": "# ဖတ်ပြီးနားလည်ခြင်းနှင့် ရေးသားခြင်း လုပ်ဆောင်ချက်များ\n\n1. ပကတိ စာသားကို ကြည့်ပါ\n2. ရေးသားသူ၏ ရည်ရွယ်ချက်ကို သတ်မှတ်ပါ\n3. အရေးကြီးသော အထိကို မှတ်ပါ\n4. ပြဿနာကို သေချာစွာ ဖတ်ပြီး ဖြေပါ",
      "takeaways": [
        "Preview: title, first sentences, last paragraph",
        "For inference questions, answer is NOT directly stated",
        "Always return to the passage to verify your answer",
        "Essay: state thesis, analyze evidence from BOTH passages",
        "Spend ~1.5-2 minutes per reading question"
      ],
      "formulas": ["Main Idea Test: Does it cover the ENTIRE passage?", "Inference Test: Is there textual evidence?", "Fact vs Opinion: Can it be proven objectively?"]
    }]
  },
  # ==========================================================================
  # RLA — Core Textbook (B)
  # ==========================================================================
  {
    "subjectCode": "rla", "categoryType": "textbook", "sortOrder": 0,
    "title": "Main Idea, Inference & Evidence",
    "titleTh": "ใจความสำคัญ การสรุปความ และหลักฐาน",
    "titleMm": "အရေးကြီးသော အထိ၊ ဆန်တူခြင်းနှင့် အထောက်အကူ",
    "contents": [{
      "sortOrder": 0,
      "en": "# Main Idea, Inference & Evidence\n\n## Finding the Main Idea\nThe central point the author wants to communicate. Found in:\n- First or last sentence of the passage\n- The thesis statement of an essay\n- Repeated keywords throughout the text\n\n**Test**: Ask \"What is this mostly about?\" — it should cover the ENTIRE passage.\n\n## Making Inferences\nA conclusion drawn from evidence, NOT directly stated.\n\n### Process\n1. Read the question carefully\n2. Find relevant evidence in the passage\n3. Combine evidence with reasoning\n4. Choose the most logically supported answer\n\n### Signal Words\n\"suggests\", \"implies\", \"can be concluded\", \"most likely\"\n\n## Using Evidence\nStrong answers use: direct quotes, paraphrased ideas, statistical data, cause-and-effect relationships.\n\n## Fact vs Opinion\n- **Fact**: Verifiable; uses \"studies show\", \"data indicates\"\n- **Opinion**: Not verifiable; uses \"I believe\", \"the best\", \"obviously\"",
      "th": "# ใจความสำคัญ การสรุปความ และหลักฐาน\n\n## การหาใจความสำคัญ\nประเด็นหลักที่ผู้เขียนต้องการสื่อสาร มักพบที่:\n- ประโยคแรกหรือประโยคสุดท้ายของบทความ\n- ประโยคเรื่อง (thesis statement) ของเรียงความ\n- คำหรือวลีที่ซ้ำกันตลอดทั้งข้อความ\n\n**ทดสอบ**: ถาม \"บทความนี้พูดถึงอะไรเป็นหลัก?\" — ต้องครอบคลุมทั้งบทความ\n\n## การสรุปความ (Inference)\nข้อสรุปจากหลักฐาน ไม่ได้ระบุตรงๆ ในข้อความ\n\n### ขั้นตอน\n1. อ่านคำถามให้ระมัดระวัง\n2. หาหลักฐานที่เกี่ยวข้อง\n3. ผสมหลักฐานกับเหตุผล\n4. เลือกคำตอบที่มีเหตุผลสนับสนุนมากที่สุด\n\n### คำสัญญาณ\n\"บอกเป็นนัย\", \"แสดงว่า\", \"สรุปได้ว่า\", \"น่าจะเป็นไปได้ว่า\"\n\n## ข้อเท็จจริง vs ความคิดเห็น\n- **ข้อเท็จจริง**: ตรวจสอบได้ ใช้ภาษากลาง (\"การศึกษาแสดงว่า\")\n- **ความคิดเห็น**: ตรวจสอบไม่ได้ ใช้ภาษาเชิงอัตวิสัย (\"ฉันเชื่อ\")",
      "mm": "# အရေးကြီးသော အထိ၊ ဆန်တူခြင်းနှင့် အထောက်အကူ\n\nအရေးကြီးသော အထိသည် ရေးသားသူ ဖော်ပြလိုသော အလိုက်ဖြစ်သည်။ ပထမနှင့် နောက်ဆုံး စာတွေ့တွင် တွေ့ရှိနိုင်သည်။\n\nဆန်တူခြင်းသည် စာသားတွင် တိုက်တည်စွာ ဖော်ပြထားမှုမဟုတ်ဘဲ အထောက်အကူမှ ထုတ်ထွင်းထားသော အkaကျဝေး ဖြစ်သည်။",
      "takeaways": [
        "Main idea = central point, usually in first/last sentence",
        "Inference = conclusion NOT directly stated, based on clues",
        "Signal words: suggests, implies, can be concluded, most likely",
        "Strong answers use direct quotes or paraphrased evidence",
        "Fact = verifiable; Opinion = subjective belief"
      ],
      "formulas": ["Main Idea Test: Does it cover the ENTIRE passage?", "Inference Test: Is there textual evidence?", "Fact vs Opinion: Can it be proven objectively?"]
    }]
  },
  {
    "subjectCode": "rla", "categoryType": "textbook", "sortOrder": 1,
    "title": "Grammar, Usage & Sentence Mechanics",
    "titleTh": "ไวยากรณ์ การใช้ภาษา และกฎประโยค",
    "titleMm": "ကာကွယ်ရေး၊ အသုံးပြုမှုနှင့် စည်မာများ",
    "contents": [{
      "sortOrder": 0,
      "en": "# Grammar, Usage & Sentence Mechanics\n\n## Subject-Verb Agreement\nSingular subject = singular verb; Plural subject = plural verb\n- Tricky: \"Tom and Jerry **are**\" (compound = plural)\n- \"Everyone **is**\" (indefinite pronoun = singular)\n- \"or/nor\": verb matches the closer subject\n\n## Verb Tenses\n- Simple Present: I walk (habits)\n- Simple Past: I walked (completed)\n- Present Perfect: I have walked (past with present relevance)\n- Past Perfect: I had walked (past before another past)\n\n## Common Errors\n- **Run-on**: Two independent clauses without proper punctuation\n  - Fix: period, semicolon, or conjunction\n- **Fragment**: Missing subject or verb\n  - Fix: add the missing element\n- **Comma splice**: Two clauses joined by only a comma\n  - Fix: semicolon or add conjunction\n\n## Punctuation\n- **Comma**: list items, introductory phrases, before conjunctions\n- **Semicolon**: join two related independent clauses\n- **Apostrophe**: possession (John's) or contraction (don't)",
      "th": "# ไวยากรณ์ การใช้ภาษา และกฎประโยค\n\n## การเห็นพ้องกันระหว่างประธานและกริยา\nประธานเอกพจน์ = กริยาเอกพจน์; ประธานพหูพจน์ = กริยาพหูพจน์\n- ซับซ้อน: \"ทอมและเจอร์รี่ **เป็น**\" (ประธานรวม = พหูพจน์)\n- \"ทุกคน **เป็น**\" (สรรพนามไม่ชี้เฉพาะ = เอกพจน์)\n- \"หรือ\": กริยาตามประธานที่ใกล้กว่า\n\n## กาลกริยา\n- ปัจจุบันกาลธรรมดา: I walk (นิสัย)\n- อดีตกาลธรรมดา: I walked (เสร็จแล้ว)\n- ปัจจุบันกาลสมบูรณ์: I have walked (เกี่ยวข้องกับปัจจุบัน)\n\n## ความผิดพลาดประโยคที่พบบ่อย\n- **Run-on**: ประโยคอิสระ 2 ประโยค ไม่มีวรรคตอนที่เหมาะสม → ใช้จุด อัฒภาค หรือคำเชื่อม\n- **Fragment**: ขาดประธานหรือกริยา → เพิ่มส่วนที่ขาด\n- **Comma splice**: ต่อประโยคด้วยจุลภาคเพียงอย่างเดียว → ใช้อัฒภาคหรือเพิ่มคำเชื่อม",
      "mm": "# ကာကွယ်ရေးနှင့် စည်မာများ\n\nတစ်ခုတည်း အားသားသည် တစ်ခုတည်း လုပ်ရေးကို သုံးသည်။\n- Run-on: မှန်မှန်ကိုယ်ပါ တွဲခိုးပါ\n- Fragment: အားသား သို့မဟုတ် လုပ်ရေး ပါကစားနေပါသည်",
      "takeaways": [
        "Singular subject = singular verb",
        "Indefinite pronouns (everyone, each) are ALWAYS singular",
        "Run-on fix: use period, semicolon, or conjunction",
        "Fragment fix: add missing subject or verb",
        "Comma splice fix: use semicolon or add conjunction"
      ],
      "formulas": ["Compound subjects with 'and' are plural", "'or/nor': verb matches closer subject", "Apostrophe: possession (John's) or contraction (don't)"]
    }]
  },

  # ==========================================================================
  # SCIENCE — Exam Handbook (A)
  # ==========================================================================
  {
    "subjectCode": "science", "categoryType": "handbook", "sortOrder": 0,
    "title": "GED Science Test Format & Scoring",
    "titleTh": "รูปแบบและการให้คะแนนข้อสอบ GED วิทยาศาสตร์",
    "titleMm": "GED ဘာသာစကား စမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း",
    "contents": [{
      "sortOrder": 0,
      "en": "# GED Science Test Format & Scoring\n\nThe GED Science test has **40 questions** in **90 minutes**.\n\n## Question Types\n- Multiple Choice (~50%), Fill-in-the-Blank (~20%)\n- Drag-and-Drop (~15%), Hot Spot (~10%), Short Answer (~5%)\n\n## Content Distribution\n- **Life Science (~40%)**: Cells, genetics, evolution, ecosystems\n- **Physical Science (~40%)**: Chemistry (atoms, reactions) and Physics (energy, forces)\n- **Earth & Space Science (~20%)**: Weather, climate, astronomy, geology\n\n## Scoring\n- Score range: 100-200 | Passing: **145** | College Ready: **165**\n\n## Key Skills Tested\n- Interpreting scientific data, graphs, and tables\n- Understanding experimental design and the scientific method\n- Drawing conclusions from evidence\n- Applying scientific concepts to real-world situations",
      "th": "# รูปแบบและการให้คะแนนข้อสอบ GED วิทยาศาสตร์\n\nข้อสอบ GED วิทยาศาสตร์มี **40 ข้อ** เวลา **90 นาที**\n\n## ประเภทข้อสอบ\n- เลือกตอบเดี่ยว (~50%), เติมคำตอบ (~20%)\n- ลากแล้ววาง (~15%), คลิกจุด (~10%), ตอบสั้น (~5%)\n\n## สัดส่วนเนื้อหา\n- **วิทยาศาสตร์ชีวภาพ (~40%)**: เซลล์ พันธุกรรม วิวัฒนาการ ระบบนิเวศ\n- **วิทยาศาสตร์กายภาพ (~40%)**: เคมี (อะตอม ปฏิกิริยา) และฟิสิกส์ (พลังงาน แรง)\n- **วิทยาศาสตร์โลกและอวกาศ (~20%)**: อากาศ ภูมิอากาศ ดาราศาสตร์ ธรณีวิทยา\n\n## การให้คะแนน\n- คะแนน: 100-200 | ผ่าน: **145** | College Ready: **165**\n\n## ทักษะที่วัด\n- ตีความข้อมูล กราฟ และตารางทางวิทยาศาสตร์\n- เข้าใจการออกแบบการทดลองและวิธีวิทยาศาสตร์\n- สรุปข้อความจากหลักฐาน\n- นำแนวคิดทางวิทยาศาสตร์ไปใช้กับสถานการณ์จริง",
      "mm": "# GED ဘာသာစကား စမ်းပြဿနာ အသေးစိတ်\n\nGED ဘာသာစကားစမ်းပြဿနာတွင် **၄၀** ပြဿနာများရှိပြီး **၉၀** မိနစ် ကြာသည်။\n\n- ရလဒ်: ၁၀၀-၂၀၀ | အောင်မြင်ရန်: **၁၄၅**\n- ဘာသာရေး (~၄၀%): ခေါ်မွေး၊ ရပ်တူညီမှု၊ မြှုပ်နှံမှု\n- ကိုယ်ဓိဋ္ဌာန်ဘာသာ (~၄၀%): ရောမလေးနီနီခေါ်၊ ဖုန်း၊ အရာရောင်မှု",
      "takeaways": [
        "GED Science has 40 questions in 90 minutes",
        "Life Science ~40%, Physical Science ~40%, Earth/Space ~20%",
        "Focus on interpreting data, graphs, and tables",
        "Understand experimental design and scientific method",
        "Passing score is 145; College Ready is 165"
      ],
      "formulas": []
    }]
  },
  {
    "subjectCode": "science", "categoryType": "handbook", "sortOrder": 1,
    "title": "Scientific Method & Data Interpretation",
    "titleTh": "วิธีวิทยาศาสตร์และการตีความข้อมูล",
    "titleMm": "ဘာသာရေးနည်းလမ်းနှင့် အချက်အလွယ် ဖော်ပြချက်ခြင်း",
    "contents": [{
      "sortOrder": 0,
      "en": "# Scientific Method & Data Interpretation\n\n## The Scientific Method\n1. **Observe** and ask a question\n2. **Form a hypothesis** (testable prediction)\n3. **Design an experiment** with controlled variables\n4. **Collect and analyze data**\n5. **Draw conclusions** and communicate results\n\n## Key Vocabulary\n- **Independent Variable**: What the experimenter changes\n- **Dependent Variable**: What is measured (the outcome)\n- **Control Group**: Group with no treatment (for comparison)\n- **Constant/Control Variable**: Factors kept the same\n\n## Reading Graphs & Tables\n- **X-axis**: Independent variable (usually)\n- **Y-axis**: Dependent variable (usually)\n- **Trend line**: Look for overall direction (up, down, flat)\n- **Units**: Always check axis labels and units\n- **Outliers**: Data points far from the trend — may indicate errors\n\n## Types of Studies\n- **Experimental**: Researcher manipulates variables\n- **Observational**: Researcher observes without manipulating\n- **Correlational**: Looks for relationships between variables",
      "th": "# วิธีวิทยาศาสตร์และการตีความข้อมูล\n\n## วิธีวิทยาศาสตร์\n1. **สังเกต** แล้วถามคำถาม\n2. **ตั้งสมมติฐาน** (คาดคะเนที่ทดสอบได้)\n3. **ออกแบบการทดลอง** โดยควบคุมตัวแปร\n4. **เก็บและวิเคราะห์ข้อมูล**\n5. **สรุปข้อความ** และรายงานผล\n\n## คำศัพท์สำคัญ\n- **ตัวแปรอิสระ (Independent)**: สิ่งที่ผู้ทดลองเปลี่ยน\n- **ตัวแปรตาม (Dependent)**: สิ่งที่วัดผล\n- **กลุ่มควบคุม (Control Group)**: กลุ่มที่ไม่ใส่ตัวแปรต้น (เพื่อเปรียบเทียบ)\n- **ตัวแปรควบคุม (Constant)**: ปัจจัยที่ทำให้เหมือนกัน\n\n## การอ่านกราฟและตาราง\n- **แกน X**: ตัวแปรอิสระ (โดยทั่วไป)\n- **แกน Y**: ตัวแปรตาม (โดยทั่วไป)\n- **เส้นแนวโน้ม**: ดูทิศทางโดยรวม (ขึ้น ลง ราบ)\n- **หน่วย**: ตรวจสอบป้ายชื่อและหน่วยของแกนเสมอ\n- **ค่าผิดปกติ (Outliers)**: จุดข้อมูลที่ห่างจากแนวโน้ม",
      "mm": "# ဘာသာရေးနည်းလမ်းနှင့် အချက်အလွယ် ဖော်ပြချက်ခြင်း\n\n1. ကြည့်မှုများကို ပြုပြင်ပါ\n2. စမ်းသပ်ခြင်း (Hypothesis) ကို ဖန်တီးပါ\n3. ပြဿနာပြုလုပ်မှုကို လိုက်ဖော်ပြပါ\n4. အချက်အလွယ်များကို သွင်းပါ\n5. အkaကျဝေးများကို ထုတ်ထွင်းပါ\n\n- အိမ်နီနိုင် (Independent): ပြဿနာပြုလုပ်သူ ပြောင်းလဲသောအရာ\n- ဒေတာနိုင် (Dependent): တိုင်းတာသောအရာ",
      "takeaways": [
        "Scientific method: Observe > Hypothesize > Experiment > Analyze > Conclude",
        "Independent variable = what you change; Dependent = what you measure",
        "Control group = no treatment, for comparison",
        "Always check graph axis labels and units",
        "Distinguish experimental vs. observational vs. correlational studies"
      ],
      "formulas": ["Hypothesis must be testable and falsifiable", "Control group receives no experimental treatment"]
    }]
  },
  # ==========================================================================
  # SCIENCE — Core Textbook (B)
  # ==========================================================================
  {
    "subjectCode": "science", "categoryType": "textbook", "sortOrder": 0,
    "title": "Life Science: Cells, Genetics & Ecosystems",
    "titleTh": "วิทยาศาสตร์ชีวภาพ: เซลล์ พันธุกรรม และระบบนิเวศ",
    "titleMm": "ဘာသာရေး: ခေါ်မွေးများ၊ ရပ်တူညီမှုနှင့် အရပ်အဖြေ",
    "contents": [{
      "sortOrder": 0,
      "en": "# Life Science: Cells, Genetics & Ecosystems\n\n## Cell Biology\n- **Cell Theory**: All living things are made of cells; cells are the basic unit of life\n- **Organelles**: Nucleus (DNA storage), Mitochondria (energy), Ribosomes (protein synthesis)\n- **Cell Division**: Mitosis (growth/repair, produces 2 identical cells), Meiosis (reproduction, produces 4 unique cells with half chromosomes)\n\n## Genetics\n- **DNA**: Double helix; stores genetic instructions\n- **Genes**: Segments of DNA that code for specific traits\n- **Dominant vs Recessive**: Dominant masks recessive (Bb = brown eyes if B is dominant)\n- **Punnett Squares**: Tool to predict offspring genotypes\n\n## Ecosystems\n- **Producers** (plants) convert sunlight to energy via photosynthesis\n- **Consumers** (animals) eat other organisms for energy\n- **Decomposers** (bacteria/fungi) break down dead matter, recycling nutrients\n- **Food chains**: Energy flows from producers to primary consumers to secondary consumers\n- **Biodiversity**: Variety of life in an ecosystem; higher biodiversity = more stable ecosystem",
      "th": "# วิทยาศาสตร์ชีวภาพ: เซลล์ พันธุกรรม และระบบนิเวศ\n\n## ชีววิทยาของเซลล์\n- **ทฤษฎีเซลล์**: สิ่งมีชีวิตทุกชนิดประกอบด้วยเซลล์; เซลล์คือหน่วยพื้นฐานของชีวิต\n- **ออร์แกเนลล์**: นิวเคลียส (เก็บ DNA), ไมโทคอนเดรีย (ผลิตพลังงาน), ไรโบโซม (สังเคราะห์โปรตีน)\n- **การแบ่งเซลล์**: ไมโทซิส (เจริญ/ซ่อมแซม, ผลิตเซลล์เหมือนเดิม 2 เซลล์), ไมโอซิส (สืบพันธุ์, ผลิตเซลล์ 4 เซลล์ที่แตกต่างกัน)\n\n## พันธุกรรม\n- **DNA**: สายรูปเกลียวคู่; เก็บคำสั่งพันธุกรรม\n- **ยีน**: ส่วนของ DNA ที่รหัสลักษณะเฉพาะ\n- **ดีมินแนนต์ vs รีเซสซีฟ**: ดีมินแนนต์จะบังรีเซสซีฟ (Bb = ตาสีน้ำตาล ถ้า B เป็นดีมินแนนต์)\n- **Punnett Square**: เครื่องมือทำนายลักษณะของลูกหลาน\n\n## ระบบนิเวศ\n- **ผู้ผลิต** (พืช) แปลงแสงเป็นพลังงานผ่านการสังเคราะห์ด้วยแสง\n- **ผู้บริโภค** (สัตว์) กินสิ่งมีชีวิตอื่นเพื่อพลังงาน\n- **ผู้ย่อยสลาย** (แบคทีเรีย/เห็ดรา) สลายซากศพ รีไซเคิลสารอาหาร\n- **ห่วงโซ่อาหาร**: พลังงานไหลจากผู้ผลิต → ผู้บริโภคขั้นต้น → ผู้บริโภคขั้นสอง\n- **ความหลากหลายทางชีวภาพ**: ความหลากหลายของชีวิต; ยิ่งมาก ระบบนิเวศยิ่งเสถียร",
      "mm": "# ဘာသာရေး: ခေါ်မွေးများ၊ ရပ်တူညီမှုနှင့် အရပ်အဖြေ\n\n- ခေါ်မွေးသတ်မှတ်ချက်: အသင်္ချာများသည် ခေါ်မွေးများမှ ဖြစ်ပေါ်သည်\n- ခေါ်မွေး ခွဲခြမ်းခြင်း: Mitosis (ထုတ်လုပ်ခြင်း)၊ Meiosis (ဆက်ဆံလုပ်ခြင်း)\n- DNA: မြောက်ရည်ရွယ်ချက် ပေါင်းကစားနေသည်\n- အရပ်အဖြေ: ထုတ်လုပ်သူ (အပန်းရည်ပတ်)၊ သုံးသပ်သူ (တွေ့စဉ်းများ)",
      "takeaways": [
        "Cell theory: all living things made of cells",
        "Mitosis = growth/repair; Meiosis = reproduction (half chromosomes)",
        "DNA stores genetic instructions; genes code for traits",
        "Dominant masks recessive (Bb shows dominant trait)",
        "Food chain: producers > primary consumers > secondary consumers"
      ],
      "formulas": ["Photosynthesis: 6CO2 + 6H2O + light > C6H12O6 + 6O2", "Mitosis: 1 cell > 2 identical cells", "Meiosis: 1 cell > 4 unique cells (half chromosomes)"]
    }]
  },
  {
    "subjectCode": "science", "categoryType": "textbook", "sortOrder": 1,
    "title": "Physical Science & Earth Science",
    "titleTh": "วิทยาศาสตร์กายภาพและวิทยาศาสตร์โลก",
    "titleMm": "ကိုယ်ဓိဋ္ဌာန် ဘာသာရေးနှင့် မြေလိုက် ဘာသာရေး",
    "contents": [{
      "sortOrder": 0,
      "en": "# Physical Science & Earth Science\n\n## Chemistry Basics\n- **Atoms**: Protons (+), Neutrons (0), Electrons (-)\n- **Periodic Table**: Elements organized by atomic number\n- **Chemical reactions**: Atoms rearrange to form new substances\n- **Conservation of Mass**: Mass is neither created nor destroyed in reactions\n\n## Physics Basics\n- **Newton's Laws**:\n  1. Objects at rest stay at rest (inertia)\n  2. F = ma (force = mass x acceleration)\n  3. Every action has an equal and opposite reaction\n- **Energy types**: Kinetic (motion), Potential (stored), Thermal (heat)\n- **Energy conservation**: Energy cannot be created or destroyed, only transformed\n\n## Earth & Space Science\n- **Plate tectonics**: Earth's crust is divided into plates that move\n- **Weather vs Climate**: Weather = short-term; Climate = long-term patterns\n- **Greenhouse effect**: Gases trap heat in the atmosphere\n- **Water cycle**: Evaporation > Condensation > Precipitation > Collection\n- **Rock cycle**: Igneous > Sedimentary > Metamorphic > Igneous",
      "th": "# วิทยาศาสตร์กายภาพและวิทยาศาสตร์โลก\n\n## เคมีพื้นฐาน\n- **อะตอม**: โปรตอน (+), นิวตรอน (0), อิเล็กตรอน (-)\n- **ตารางธาตุ**: ธาตุเรียงตามเลขอะตอม\n- **ปฏิกิริยาเคมี**: อะตอมจัดเรียงใหม่เป็นสารใหม่\n- **กฎอนุรักษ์มวล**: มวลไม่ถูกสร้างหรือทำลายในปฏิกิริยา\n\n## ฟิสิกส์พื้นฐาน\n- **กฎของนิวตัน:**\n  1. วัตถุที่อยู่นิ่งจะคงอยู่นิ่ง (เฉื่อย)\n  2. F = ma (แรง = มวล x ความเร่ง)\n  3. ทุกแรงกระทำ มีแรงตอบสนองเท่ากันและตรงข้าม\n- **ประเภทพลังงาน**: จลน์ (เคลื่อนที่), ศักย์ (สะสม), ความร้อน\n- **กฎอนุรักษ์พลังงาน**: พลังงานไม่ถูกสร้างหรือทำลาย แต่เปลี่ยนรูป\n\n## วิทยาศาสตร์โลกและอวกาศ\n- **ทฤษฎีเปลือกโลกเคลื่อน**: เปลือกโลกแบ่งเป็นแผ่นเคลื่อนที่\n- **อากาศ vs ภูมิอากาศ**: อากาศ = ระยะสั้น; ภูมิอากาศ = รูปแบบระยะยาว\n- **ปรากฏการณ์เรือนกระจก**: ก๊าซกักเก็บความร้อนในบรรยากาศ\n- **วัฏจักรน้ำ**: ระเหย > การกลั่นตัว > การตกผลึก > การรวบรวม",
      "mm": "# ကိုယ်ဓိဋ္ဌာန် ဘာသာရေးနှင့် မြေလိုက် ဘာသာရေး\n\n- အိတ်မြူးများ: Protons (+), Neutrons (၀), Electrons (-)\n- Newton ၏ စည်မာများ: F = ma (အား = အလုံး x တိုးမှု)\n- အရာရောင်မှု အမျိုးအစား: လမ်းလျှင် (ခွဲခြမ်း), အဖွဲ (သေးချာ), အရေးနံရံ (အပူ)",
      "takeaways": [
        "Atoms: Protons (+), Neutrons (0), Electrons (-)",
        "Newton's 2nd Law: F = ma (force = mass x acceleration)",
        "Energy cannot be created or destroyed, only transformed",
        "Plate tectonics explains earthquakes and volcanoes",
        "Water cycle: Evaporation > Condensation > Precipitation > Collection"
      ],
      "formulas": ["F = ma (Newton's Second Law)", "KE = (1/2)mv^2 (Kinetic Energy)", "PE = mgh (Potential Energy)", "Speed = Distance / Time"]
    }]
  },

  # ==========================================================================
  # SOCIAL STUDIES — Exam Handbook (A)
  # ==========================================================================
  {
    "subjectCode": "ss", "categoryType": "handbook", "sortOrder": 0,
    "title": "GED Social Studies Test Format & Scoring",
    "titleTh": "รูปแบบและการให้คะแนนข้อสอบ GED สังคมศึกษา",
    "titleMm": "GED လိုက်စီးပညာရေး စမ်းပြဿနာ အသေးစိတ်နှင့် မှတ်တမ်း",
    "contents": [{
      "sortOrder": 0,
      "en": "# GED Social Studies Test Format & Scoring\n\nThe GED Social Studies test has **35 questions** in **70 minutes**.\n\n## Content Distribution\n- **Civics & Government (~50%)**: Constitution, branches of government, rights, elections\n- **U.S. History (~20%)**: Colonial era to present, key turning points\n- **Economics (~15%)**: Supply/demand, inflation, economic systems\n- **Geography & the World (~15%)**: Maps, regions, global issues\n\n## Question Types\n- Multiple Choice, Fill-in-the-Blank, Drag-and-Drop, Hot Spot\n- Extended Response (1 essay): Analyze a social studies argument\n\n## Scoring\n- Score range: 100-200 | Passing: **145** | College Ready: **165**\n\n## Key Skills\n- Analyzing historical documents and primary sources\n- Understanding cause-and-effect in history\n- Interpreting maps, charts, and political cartoons\n- Applying democratic principles to scenarios",
      "th": "# รูปแบบและการให้คะแนนข้อสอบ GED สังคมศึกษา\n\nข้อสอบ GED สังคมศึกษามี **35 ข้อ** เวลา **70 นาที**\n\n## สัดส่วนเนื้อหา\n- **พลเมืองและรัฐบาล (~50%)**: รัฐธรรมนูญ อำนาจรัฐบาล สิทธิ การเลือกตั้ง\n- **ประวัติศาสตร์สหรัฐ (~20%)**: ยุคอาณานิคมถึงปัจจุบัน เหตุการณ์สำคัญ\n- **เศรษฐศาสตร์ (~15%)**: อุปสงค์/อุปทาน เงินเฟ้อ ระบบเศรษฐศาสตร์\n- **ภูมิศาสตร์และโลก (~15%)**: แผนที่ ภูมิภาค ประเด็นโลก\n\n## ประเภทข้อสอบ\n- เลือกตอบ, เติมคำตอบ, ลากแล้ววาง, คลิกจุด\n- เรียงความ Extended Response (1 เรื่อง): วิเคราะห์อาร์กิวเมนต์สังคมศึกษา\n\n## การให้คะแนน\n- คะแนน: 100-200 | ผ่าน: **145** | College Ready: **165**\n\n## ทักษะสำคัญ\n- วิเคราะห์เอกสารทางประวัติศาสตร์และแหล่งข้อมูลต้นทาง\n- เข้าใจสาเหตุและผลในประวัติศาสตร์\n- ตีความแผนที่ แผนภูมิ และการ์ตูนการเมือง\n- นำหลักการประชาธิปไตยไปใช้กับสถานการณ์",
      "mm": "# GED လိုက်စီးပညာရေး စမ်းပြဿနာ အသေးစိတ်\n\nGED လိုက်စီးပညာရေးစမ်းပြဿနာတွင် **၃၅** ပြဿနာများရှိပြီး **၇၀** မိနစ် ကြာသည်။\n\n- ရလဒ်: ၁၀၀-၂၀၀ | အောင်မြင်ရန်: **၁၄၅**\n- ပညာရေးရေး (၅၀%): ပြဋ္ဌာန်ဘက်၊ အစိုးရရှင်း၊ ရေးကြီးသောအချက်များ",
      "takeaways": [
        "GED Social Studies has 35 questions in 70 minutes",
        "Civics & Government ~50%, History ~20%, Economics ~15%, Geography ~15%",
        "One Extended Response essay required",
        "Focus on analyzing documents and primary sources",
        "Passing score is 145; College Ready is 165"
      ],
      "formulas": []
    }]
  },
  {
    "subjectCode": "ss", "categoryType": "handbook", "sortOrder": 1,
    "title": "Document Analysis & Essay Strategies",
    "titleTh": "การวิเคราะห์เอกสารและกลยุทธ์เขียนเรียงความ",
    "titleMm": "စာရင်းစာတွေ့ ဖော်ပြချက်ခြင်းနှင့် ရေးသား လုပ်ဆောင်ချက်",
    "contents": [{
      "sortOrder": 0,
      "en": "# Document Analysis & Essay Strategies\n\n## Analyzing Historical Documents\n1. **Identify the source**: Who wrote it? When? For what audience?\n2. **Determine the purpose**: Inform, persuade, record, or express?\n3. **Contextualize**: What was happening at the time?\n4. **Identify bias**: What perspective does the author represent?\n5. **Extract key claims and evidence**: What is the main argument? What supports it?\n\n## Primary vs Secondary Sources\n- **Primary**: Created during the event (diaries, letters, speeches, photographs)\n- **Secondary**: Created after the event (textbooks, documentaries, analyses)\n\n## Extended Response Framework\n1. **Introduction**: State your thesis about the relationship between documents\n2. **Body**: Analyze how the documents support or contradict each other\n3. **Evidence**: Quote or reference specific parts of both documents\n4. **Conclusion**: Summarize your analysis and restate thesis\n\n## Tips for Success\n- Read BOTH documents completely before writing\n- Use specific quotes and details from the documents\n- Address the prompt directly — do not go off-topic\n- Organize with clear paragraphs",
      "th": "# การวิเคราะห์เอกสารและกลยุทธ์เขียนเรียงความ\n\n## การวิเคราะห์เอกสารทางประวัติศาสตร์\n1. **ระบุแหล่งที่มา**: ใครเขียน? เมื่อไหร่? เพื่อใคร?\n2. **กำหนดวัตถุประสงค์**: ให้ข้อมูล โน้มน้าว บันทึก หรือแสดงความคิด?\n3. **ใส่บริบท**: เกิดอะไรขึ้นในช่วงเวลานั้น?\n4. **ระบุอคติ**: ผู้เขียนแทนมุมมองไหน?\n5. **ดึงข้ออ้างและหลักฐานสำคัญ**: อาร์กิวเมนต์หลักคืออะไร? มีอะไรสนับสนุน?\n\n## แหล่งข้อมูลต้นทาง vs แหล่งข้อมูลรอง\n- **ต้นทาง**: สร้างระหว่างเหตุการณ์ (ไดอารี่ จดหมาย คำปราศรัย ภาพถ่าย)\n- **รอง**: สร้างหลังเหตุการณ์ (ตำรา สารคดี บทวิเคราะห์)\n\n## โครงสร้างเขียนเรียงความ Extended Response\n1. **บทนำ**: กล่าว thesis เกี่ยวกับความสัมพันธ์ระหว่างเอกสาร\n2. **ตัวเรื่อง**: วิเคราะห์ว่าเอกสารสนับสนุนหรือขัดแย้งกันอย่างไร\n3. **หลักฐาน**: อ้างอิงหรืออ้างถึงส่วนเฉพาะของทั้ง 2 เอกสาร\n4. **บทสรุป**: สรุปการวิเคราะห์และกล่าว thesis ซ้ำ",
      "mm": "# စာရင်းစာတွေ့ ဖော်ပြချက်ခြင်းနှင့် ရေးသား လုပ်ဆောင်ချက်\n\n1. ဘာသာရေး ရေးသားသူကို သတ်မှတ်ပါ\n2. ရည်ရွယ်ချက်ကို သတ်မှတ်ပါ\n3. အချက်အလွယ် ပြုစုဖြေရှင်းပါ\n4. နှစ်ခုလုံး စာရင်းများကို ဖတ်ပြီး ရေးပါ",
      "takeaways": [
        "Identify source, purpose, context, and bias in documents",
        "Primary sources = created during the event; Secondary = after",
        "Use specific quotes from BOTH documents in your essay",
        "Address the prompt directly — stay on topic",
        "Organize essay: intro (thesis) > body (analysis) > conclusion"
      ],
      "formulas": ["Primary Source: created DURING the event", "Secondary Source: created AFTER the event"]
    }]
  },
  # ==========================================================================
  # SOCIAL STUDIES — Core Textbook (B)
  # ==========================================================================
  {
    "subjectCode": "ss", "categoryType": "textbook", "sortOrder": 0,
    "title": "American Government & Civics",
    "titleTh": "รัฐบาลและพลเมืองของอเมริกา",
    "titleMm": "အမျိုးသားရေး အစိုးရရှင်းနှင့် ပညာရေးရေး",
    "contents": [{
      "sortOrder": 0,
      "en": "# American Government & Civics\n\n## The U.S. Constitution\n- **Supreme law** of the United States, written in 1787\n- **Preamble**: \"We the People...\" — establishes the purpose of government\n- **Articles**: Define the structure and powers of government\n- **Amendments**: Changes/additions; First 10 = Bill of Rights\n\n## Three Branches of Government\n1. **Legislative (Congress)**: Makes laws\n   - Senate (100 members, 2 per state) + House (435, by population)\n2. **Executive (President)**: Enforces laws\n   - Serves as Commander-in-Chief, appoints judges, vetoes bills\n3. **Judicial (Courts)**: Interprets laws\n   - Supreme Court is the highest court; 9 justices\n\n## Checks and Balances\nEach branch can limit the power of the others:\n- President vetoes Congress's laws\n- Congress can override veto with 2/3 vote\n- Supreme Court can declare laws unconstitutional\n- Congress confirms presidential appointments\n\n## Key Amendments\n- **1st**: Freedom of religion, speech, press, assembly, petition\n- **4th**: Protection against unreasonable search and seizure\n- **5th**: Due process, protection against self-incrimination\n- **6th**: Right to a fair and speedy trial\n- **14th**: Equal protection under the law\n- **19th**: Women's right to vote\n- **26th**: Voting age lowered to 18",
      "th": "# รัฐบาลและพลเมืองของอเมริกา\n\n## รัฐธรรมนูญสหรัฐฯ\n- **กฎหมายสูงสุด** ของสหรัฐฯ ลงนามปี 1787\n- **คำนำ**: \"เราประชาชน...\" — กำหนดวัตถุประสงค์ของรัฐบาล\n- **มาตรา**: กำหนดโครงสร้างและอำนาจของรัฐบาล\n- **การแก้ไขเพิ่มเติม**: 10 ข้อแรก = พิกัดสิทธิ\n\n## 3 สาขาของรัฐบาล\n1. **ฝ่ายนิติบัญญัติ (国会)**: ออกกฎหมาย\n   - วุฒิสภา (100 คน, รัฐละ 2 คน) + สภาผู้แทน (435 คน, ตามประชากร)\n2. **ฝ่ายบริหาร (ประธานาธิบดี)**: บังคับใช้กฎหมาย\n   - ผู้บัญชาการทหารสูงสุด แต่งตั้งผู้พิพากษา วีโต้อกฎหมาย\n3. **ฝ่ายตุลาการ (ศาล)**: ตีความกฎหมาย\n   - ศาลฎีกาเป็นศาลสูงสุด; 9 ผู้พิพากษา\n\n## ระบบตรวจสอบและถ่วงดุลอำนาจ\nแต่ละสาขาสามารถจำกัดอำนาจของอีกสาขา:\n- ประธานาธิบดีวีโต้อกฎหมายของรัฐสภา\n- รัฐสภาสามารถข้ามวีโต้ด้วยคะแนน 2/3\n- ศาลฎีกาสามารถประกาศกฎหมายขัดต่อรัฐธรรมนูญ\n- รัฐสภาอนุมัติการแต่งตั้งของประธานาธิบดี\n\n## การแก้ไขเพิ่มเติมสำคัญ\n- **ข้อ 1**: เสรีภาพศาสนา การพูด สื่อมวลชน การชุมนุม การร้องเรียน\n- **ข้อ 4**: ป้องกันการค้นและยึดที่ไม่ชอบธรรม\n- **ข้อ 5**: กระบวนการยุติธรรม ป้องกันการให้การณ์ตัวเอง\n- **ข้อ 14**: ความเสมอภาคภายใต้กฎหมาย\n- **ข้อ 19**: สิทธิ์ออกเสียงของสตรี\n- **ข้อ 26**: ลดอายุผู้มีสิทธิ์เลือกตั้งเป็น 18 ปี",
      "mm": "# အမျိုးသားရေး အစိုးရရှင်းနှင့် ပညာရေးရေး\n\n- ပြဋ္ဌာန်ဘက်သတ်မှတ်ချက်: အမျိုးသားရေး အထိတ်အပြု ဖြစ်သည်\n- အစိုးရရှင်း ပစ္စည်းး ၃ ခု: ဥပမာရေးပါ ပုဂ္ဂလ (ဥပမာရေးပါ)၊ အရေးရေး ပုဂ္ဂလ (အရေးရေး)၊ ဘောလိုက် ပုဂ္ဂလ (ဘော)\n- ကိုယ်ပိုင် ပယ်ရေး: နှစ်ခုလုံး အခြေခံ၍ ခွဲခြမ်းရန် ဖြစ်သည်\n- ပထမ ပြဿနာ ပြုပြင်ချက်: လမ်းပါ၊ ပြောစကား၊ အုတ်မြစ်ချက်၊ ဆုံးပြုခြင်း ပုံမှန် အချက်အလွယ်များ",
      "takeaways": [
        "Constitution = supreme law; Amendments = changes/additions",
        "3 branches: Legislative (laws), Executive (enforce), Judicial (interpret)",
        "Checks and balances: each branch limits the others",
        "1st Amendment: religion, speech, press, assembly, petition",
        "14th Amendment: equal protection under the law"
      ],
      "formulas": ["Legislative = makes laws", "Executive = enforces laws", "Judicial = interprets laws", "Override veto = 2/3 majority of Congress"]
    }]
  },
  {
    "subjectCode": "ss", "categoryType": "textbook", "sortOrder": 1,
    "title": "U.S. History, Economics & Geography",
    "titleTh": "ประวัติศาสตร์สหรัฐ เศรษฐศาสตร์ และภูมิศาสตร์",
    "titleMm": "အမျိုးသား သမိုင်း၊ စပ္ပါ တကယ်နှင့် ရေးလိုက်ခရီး",
    "contents": [{
      "sortOrder": 0,
      "en": "# U.S. History, Economics & Geography\n\n## Key Periods in U.S. History\n- **Colonial Era (1607-1776)**: European settlement, triangular trade\n- **American Revolution (1775-1783)**: Independence from Britain\n- **Civil War (1861-1865)**: Slavery abolition, Union vs. Confederacy\n- **Industrial Revolution (late 1800s)**: Urbanization, immigration, technology\n- **Great Depression (1929-1939)**: Economic collapse, New Deal programs\n- **Civil Rights Movement (1950s-1960s)**: End of legal segregation\n- **Cold War (1947-1991)**: U.S. vs. Soviet Union tension\n\n## Economics Fundamentals\n- **Supply and Demand**: Price determined by availability vs. desire\n  - High demand + low supply = high price\n  - Low demand + high supply = low price\n- **Inflation**: General increase in prices over time\n- **GDP**: Total value of all goods and services produced\n- **Unemployment rate**: % of labor force without jobs\n- **Types of economies**: Traditional, Command, Market (Mixed)",
      "th": "# ประวัติศาสตร์สหรัฐ เศรษฐศาสตร์ และภูมิศาสตร์\n\n## ยุคสำคัญในประวัติศาสตร์สหรัฐ\n- **ยุคอาณานิคม (1607-1776)**: ผู้ตั้งถิ่นยุโรป การค้าสามเหลี่ยม\n- **สงครามปฏิวัติอเมริกา (1775-1783)**: ได้รับเอกราชจากอังกฤษ\n- **สงครามกลางเมือง (1861-1865)**: ยกเลิกทาส สหภาพ vs สมาพันธ์\n- **การปฏิวัติอุตสาหกรรม (ปลายศตวรรษที่ 19)**: การพัฒนาเมือง การอพยพ  เทคโนโลยี\n- **ภาวะเศรษฐกิจตกต่ำ (1929-1939)**: เศรษฐกิจล้มเหลว โครงการ New Deal\n- **ขบวนการสิทธิพลเมือง (1950s-1960s)**: สิ้นสุดการแบ่งแยกทางกฎหมาย\n- **สงครามเย็น (1947-1991)**: ความตึงเครียดระหว่างสหรัฐฯ และสหภาพโซเวียต\n\n## เศรษฐศาสตร์พื้นฐาน\n- **อุปสงค์และอุปทาน**: ราคากำหนดโดยความพร้อมให้ vs ความต้องการ\n  - อุปสงค์สูง + อุปทานต่ำ = ราคาสูง\n  - อุปสงค์ต่ำ + อุปทานสูง = ราคาต่ำ\n- **เงินเฟ้อ**: ราคาสินค้าเพิ่มขึ้นทั่วไปตามเวลา\n- **GDP**: มูลค่ารวมของสินค้าและบริการทั้งหมดที่ผลิต\n- **อัตราว่างงาน**: % ของแรงงานที่ไม่มีงานทำ\n- **ประเภทเศรษฐศาสตร์**: ดั้งเดิม คำสั่ง ตลาด (ผสม)",
      "mm": "# အမျိုးသား သမိုင်း၊ စပ္ပါ တကယ်နှင့် ရေးလိုက်ခရီး\n\n- အမျိုးသား သမိုင်း အဓိပ္ပာယ်ရောက်ကြီးများ: အုပ်စုံရေး (၁၆၀၇-၁၇၇၆)၊ အုပ်စုံဖွံ့ဖြိုးရေး (၁၇၇၅-၁၇၈၃)၊ အရေးတွေ့ခြင်း (၁၈၆၁-၁၈၆၅)\n- စပ္ပါ တကယ်: ပေးပိုင်းနှင့် တားဆီးမှု၏ အခြေခံချက်များ\n- GDP: ထုတ်လုပ်ခဲ့သော အရာရောင်မှု အားလုံး၏ တိုက်ရိုက်",
      "takeaways": [
        "Key periods: Colonial, Revolution, Civil War, Industrial, Depression, Civil Rights, Cold War",
        "Supply/Demand: high demand + low supply = high price",
        "Inflation = general price increase over time",
        "GDP = total value of goods and services produced",
        "Economy types: Traditional, Command, Market (Mixed)"
      ],
      "formulas": ["Supply & Demand: Price = f(availability, desire)", "High demand + Low supply = High price", "GDP = Consumer spending + Investment + Government + Net exports"]
    }]
  },
]

# ============================================================================
# Generate TypeScript file
# ============================================================================

lines = []
lines.append('import { PrismaClient } from "@prisma/client";')
lines.append('')
lines.append('const prisma = new PrismaClient();')
lines.append('')
lines.append('// Auto-generated GED Handbook seed data')
lines.append('// Run: npx tsx prisma/seed-handbook.ts')
lines.append('')
lines.append('interface HContent {')
lines.append('  contentBodyEn: string;')
lines.append('  contentBodyTh: string;')
lines.append('  contentBodyMm: string;')
lines.append('  keyTakeaways: string[];')
lines.append('  formulaOrRules: string[];')
lines.append('  sortOrder: number;')
lines.append('}')
lines.append('')
lines.append('interface HTopic {')
lines.append('  subjectCode: string;')
lines.append('  categoryType: "handbook" | "textbook";')
lines.append('  title: string;')
lines.append('  titleTh: string;')
lines.append('  titleMm: string;')
lines.append('  sortOrder: number;')
lines.append('  contents: HContent[];')
lines.append('}')
lines.append('')
lines.append('const HANDBOOK_DATA: HTopic[] = [')

for topic in TOPICS:
  lines.append('  {')
  lines.append(f'    subjectCode: "{topic["subjectCode"]}",')
  lines.append(f'    categoryType: "{topic["categoryType"]}",')
  lines.append(f'    sortOrder: {topic["sortOrder"]},')
  lines.append(f'    title: {json.dumps(topic["title"])},')
  lines.append(f'    titleTh: {json.dumps(topic["titleTh"])},')
  lines.append(f'    titleMm: {json.dumps(topic["titleMm"])},')
  lines.append('    contents: [')
  for c in topic['contents']:
    lines.append('      {')
    lines.append(f'        sortOrder: {c["sortOrder"]},')
    lines.append(f'        contentBodyEn: {json.dumps(c["en"])},')
    lines.append(f'        contentBodyTh: {json.dumps(c["th"])},')
    lines.append(f'        contentBodyMm: {json.dumps(c["mm"])},')
    lines.append(f'        keyTakeaways: {json.dumps(c["takeaways"])},')
    lines.append(f'        formulaOrRules: {json.dumps(c["formulas"])},')
    lines.append('      },')
  lines.append('    ],')
  lines.append('  },')

lines.append('];')
lines.append('')

# Add seeding function
lines.append('''async function seedHandbook() {
  console.log("=== Seeding GED Handbook Data ===\\n");

  // Clear existing handbook data
  await prisma.handbookContent.deleteMany();
  await prisma.handbookTopic.deleteMany();

  let totalTopics = 0;
  let totalContents = 0;

  // Map to track topic IDs for question linking
  const topicIdMap: Record<string, string> = {};

  for (const topicData of HANDBOOK_DATA) {
    const subject = await prisma.subject.findUnique({
      where: { code: topicData.subjectCode },
    });

    if (!subject) {
      console.warn(`  Subject ${topicData.subjectCode} not found, skipping`);
      continue;
    }

    const topic = await prisma.handbookTopic.create({
      data: {
        subjectId: subject.id,
        title: topicData.title,
        titleTh: topicData.titleTh,
        titleMm: topicData.titleMm,
        categoryType: topicData.categoryType,
        sortOrder: topicData.sortOrder,
      },
    });

    // Store topic ID for linking (key: subjectCode + first word of title)
    const key = `${topicData.subjectCode}_${topicData.categoryType}_${topicData.sortOrder}`;
    topicIdMap[key] = topic.id;

    for (const contentData of topicData.contents) {
      await prisma.handbookContent.create({
        data: {
          topicId: topic.id,
          contentBodyEn: contentData.contentBodyEn,
          contentBodyTh: contentData.contentBodyTh,
          contentBodyMm: contentData.contentBodyMm,
          keyTakeaways: JSON.stringify(contentData.keyTakeaways),
          formulaOrRules: JSON.stringify(contentData.formulaOrRules),
          sortOrder: contentData.sortOrder,
        },
      });
      totalContents++;
    }

    totalTopics++;
    console.log(`  [${topicData.subjectCode}] ${topicData.categoryType}: ${topicData.title}`);
  }

  console.log(`\\nTotal handbook topics: ${totalTopics}`);
  console.log(`Total handbook contents: ${totalContents}`);

  // =======================================================================
  // LINK EXISTING QUESTIONS TO HANDBOOK TOPICS
  // =======================================================================
  console.log("\\n--- Linking Questions to Handbook Topics ---");

  // Get all subjects with their handbook topics
  const subjects = await prisma.subject.findMany({
    include: {
      handbookTopics: true,
      questions: { where: { relatedConceptId: null } },
    },
  });

  let linkedCount = 0;

  for (const subject of subjects) {
    const textbookTopics = subject.handbookTopics.filter(t => t.categoryType === "textbook");
    if (textbookTopics.length === 0) continue;

    const questionsToLink = subject.questions;
    if (questionsToLink.length === 0) continue;

    // Distribute questions across textbook topics evenly
    for (let i = 0; i < questionsToLink.length; i++) {
      const topicIndex = i % textbookTopics.length;
      const topicId = textbookTopics[topicIndex].id;

      await prisma.question.update({
        where: { id: questionsToLink[i].id },
        data: { relatedConceptId: topicId },
      });
      linkedCount++;
    }

    console.log(`  ${subject.code}: linked ${questionsToLink.length} questions to ${textbookTopics.length} handbook topics`);
  }

  console.log(`Total questions linked: ${linkedCount}`);
}

seedHandbook()
  .then(async () => {
    console.log("\\n=== Handbook Seed Complete ===");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Handbook seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });''')

output_path = "/home/z/my-project/prisma/seed-handbook.ts"
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print(f"Generated {output_path} ({len(lines)} lines)")
print(f"Topics: {len(TOPICS)}")
