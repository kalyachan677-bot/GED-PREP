# GED Prep Platform — Data Flow Documents

## Part 1: Quiz Completion Flow (Original)

### Overview

เมื่อผู้ใช้ทำข้อสอบ (Quiz) หนึ่งชุดเสร็จสมบูรณ์ ข้อมูลจะถูกบันทึกผ่าน **5 ตาราง** ใน PostgreSQL โดยมีการสัมพันธ์กันแบบ Foreign Key และ Trigger auto-calculate ดังนี้:

---

### Step 1: สร้าง Quiz Attempt (ตาราง `quiz_attempts`)

เมื่อผู้ใช้เริ่มทำแบบทดสอบ ระบบสร้าง record ใหม่ใน `quiz_attempts`:

```
quiz_attempts (status: 'in_progress')
├── user_id          → อ้างอิงไปยัง users.id (ใครทำ)
├── subject_id       → อ้างอิงไปยัง subjects.id (วิชาอะไร)
├── lesson_id        → อ้างอิงไปยัง lessons.id (บทเรียนไหน, ถ้าเป็น lesson_quiz)
├── quiz_type        → 'lesson_quiz' | 'module_review' | 'subject_test' | 'ged_ready_full'
├── total_questions  → จำนวนข้อทั้งหมดในชุดนี้
└── started_at       → เวลาเริ่มทำ
```

### Step 2: บันทึกคำตอบทีละข้อ (ตาราง `quiz_attempt_answers`)

ทุกครั้งที่ผู้ใช้ตอบข้อใดข้อหนึ่ง:

```
quiz_attempt_answers
├── attempt_id           → อ้างอิงไปยัง quiz_attempts.id (พ่อแม่)
├── question_id          → อ้างอิงไปยัง questions.id (ข้อสอบข้อไหน)
├── selected_answer_ids  → Array ของ answers.id ที่ผู้ใช้เลือก
├── is_correct           → true/false (เทียบกับ answers.is_correct)
├── is_flagged           → true/false (ผู้ใช้กด Flag for Review?)
├── time_spent_secs      → เวลาที่ใช้ตอบข้อนี้
└── answered_at          → เวลาตอบ
```

**Trigger ทำงานอัตโนมัติ:** `trg_recalc_score` จะ re-calculate `correct_count` และ `score_percent` ใน `quiz_attempts` ทุกครั้งที่มีการ INSERT/UPDATE ใน `quiz_attempt_answers`

### Step 3: อัปเดต Spaced Repetition (ตาราง `spaced_repetition`)

หลังจาก submit คำตอบทุกข้อ ระบบวนลูปผ่านแต่ละข้อที่ผู้ใช้ตอบ และอัปเดต `spaced_repetition`:

```
spaced_repetition (per user per question)
├── user_id         → อ้างอิง users.id
├── question_id     → อ้างอิง questions.id
├── sr_status       → อัปเดตตามผล: 'new' → 'learning' → 'review' → 'mastered'
├── ease_factor     → SM-2 algorithm ปรับค่า (1.30 - 2.50)
├── interval_days   → รอกี่วันจึงจะทบทวนอีกครั้ง
├── repetitions     → จำนวนครั้งที่ทบทวนแล้ว
├── next_review_at  → วันที่ควรทบทวนครั้งต่อไป
├── last_rating     → 0=Again, 1=Hard, 2=Good, 3=Easy
└── last_review_at  → วันที่ทบทวนล่าสุด
```

**Logic ของการอัปเดต:**
- ตอบ **ถูก** → rating = 2 (Good) หรือ 3 (Easy) → เพิ่ม interval_days, เลื่อน next_review_at
- ตอบ **ผิด** → rating = 0 (Again) → รีเซ็ตเป็น 'learning', interval = 0, ให้ทบทวนทันที

### Step 4: อัปเดต Lesson Progress (ตาราง `lesson_progress`)

ถ้าเป็น `lesson_quiz` และผ่านเกณฑ์ (เช่น score >= 80%):

```
lesson_progress
├── user_id        → อ้างอิง users.id
├── lesson_id      → อ้างอิง lessons.id
├── is_completed   → true
├── completion_pct → 100
└── completed_at   → NOW()
```

### Step 5: ปิด Quiz Attempt (ตาราง `quiz_attempts` — UPDATE สุดท้าย)

```
quiz_attempts (UPDATE เมื่อ submit สอบเสร็จ)
├── status          → 'completed'  (หรือ 'timed_out' ถ้าหมดเวลา)
├── correct_count   → จำนวนข้อถูก (จาก trigger แล้ว)
├── score_percent   → % คะแนน (จาก trigger แล้ว)
├── time_spent_secs → เวลารวมทั้งหมด
├── completed_at    → NOW()
└── flagged_question_ids → Array ของ question IDs ที่ผู้ใช้ flag
```

---

## Part 2: AI Study Buddy — Conversation Data Flow

### Overview

ผู้ใช้คุยกับ AI Study Buddy ใน 4 บริบท: `quiz_explanation`, `lesson_clarification`, `general_help`, `essay_feedback` ข้อมูลแบ่งเก็บระหว่าง PostgreSQL (relational metadata) กับ MongoDB (context payload ขนาดใหญ่)

---

### Step 1: สร้าง Conversation Thread (PostgreSQL `ai_conversations`)

เมื่อผู้ใช้เริ่มสนทนาใหม่:

```
ai_conversations (1 record = 1 สนทนา)
├── user_id           → อ้างอิง users.id
├── context_type      → 'quiz_explanation' | 'lesson_clarification' | 'general_help' | 'essay_feedback'
├── context_ref_id    → อ้างอิง ID ของสิ่งที่เกี่ยวข้อง
│                        quiz_explanation → quiz_attempt_answers.id
│                        lesson_clarification → lessons.id
│                        essay_feedback → essay_submissions.id
├── ai_provider       → 'openai' | 'anthropic' | 'google' | 'local_llm'
├── ai_model          → เช่น 'gpt-4o'
├── total_tokens_in   → สะสม input tokens
├── total_tokens_out  → สะสม output tokens
└── message_count     → สะสมจำนวนข้อความ (auto จาก trigger)
```

### Step 2: สร้าง Context Payload (MongoDB `AiConversationContext`)

พร้อมกับ Step 1 สร้าง document ใน MongoDB:

```
MongoDB: AiConversationContext
├── conversation_ref  → อ้างอิง ai_conversations.id (hex string)
├── context_type      → เดียวกับ PostgreSQL
├── system_prompt     → Prompt template ที่ใช้ (เก็บไว้เพื่อ reproducibility)
├── initial_context   → Mixed type — ข้อมูลบริบทจริง
│                        quiz_explanation: { question_text, correct_answer, user_answer, explanation }
│                        lesson_clarification: { lesson_title, lesson_summary, current_block_content }
│                        essay_feedback: { essay_text, grading_details, annotations }
├── total_input_tokens / total_output_tokens / estimated_cost_usd
└── user_rating / was_helpful (เก็บภายหลัง)
```

### Step 3: ส่ง/รับข้อความ (PostgreSQL `ai_messages`)

ทุกๆ ข้อความ (จาก user หรือ AI):

```
ai_messages
├── conversation_id   → อ้างอิง ai_conversations.id
├── role              → 'user' | 'assistant' | 'system'
├── content           → ข้อความนั้น
├── tokens_used       → token ที่ใช้สำหรับข้อความนี้
├── latency_ms        → เวลาตอบจาก AI provider (ms)
├── model_used        → model ที่ใช้ (อาจเปลี่ยนกลางสนทนา)
└── metadata_json     → JSONB — extra data เช่น { citations: [...], confidence: 0.95 }
```

**Trigger `trg_update_msg_count`:** ทุกครั้ง INSERT ข้อความ → auto UPDATE `ai_conversations.message_count`

### Step 4: อัปเดต Token Tracking

หลัง AI ตอบกลับ:

```
PostgreSQL: ai_conversations
├── total_tokens_in  += ข้อความล่าสุด input tokens
├── total_tokens_out += ข้อความล่าสุด output tokens

MongoDB: AiConversationContext
├── total_input_tokens  += ...
├── total_output_tokens += ...
└── estimated_cost_usd  += (คำนวณจาก model pricing)
```

### Step 5: ผู้ใช้ให้ Rating (Optional)

```
MongoDB: AiConversationContext
├── user_rating        → 1-5
├── user_feedback_text → ข้อความอธิบาย
└── was_helpful        → true/false
```

---

## Part 3: RLA Essay Auto-Grader — Submission to Grading Flow

### Overview

ผู้ใช้เขียนเรียงความ GED RLA → ส่ง → AI ตรวจ → คะแนนแบ่ง 5 มิติ → แปลงเป็น GED score → อัปเดต Readiness Score อัตโนมัติ

---

### Step 1: เริ่มเขียนเรียงความ (สร้าง Submission)

```
PostgreSQL: essay_submissions (status: 'draft')
├── user_id          → อ้างอิง users.id
├── prompt_id        → อ้างอิง essay_prompts.id (โจทย์ที่เลือก)
├── mongo_essay_id   → MongoDB ObjectId ที่จะสร้าง
├── status           → 'draft'
├── time_spent_secs  → 0 (เริ่มนับ)
└── started_at       → NOW()

MongoDB: EssayContent (สร้างพร้อมกัน)
├── submission_ref   → อ้างอิง essay_submissions.id (hex)
├── user_id          → อ้างอิง user
├── current_text     → '' (เริ่มว่าง)
├── drafts           → [] (ยังไม่มีรุ่น)
└── structure        → { has_introduction: false, ... }
```

### Step 2: Auto-Save ระหว่างเขียน (MongoDB เท่านั้น)

ทุกๆ ไม่กี่วินาที (debounced auto-save):

```
MongoDB: EssayContent (UPDATE)
├── current_text     → ข้อความล่าสุด
├── word_count       → auto-compute (pre-save hook)
├── sentence_count   → auto-compute
├── paragraph_count  → auto-compute
├── structure        → auto-analyze (has_introduction, avg_sentence_length, unique_word_ratio, etc.)
└── drafts           → push new version (max 20 รุ่น)
    ├── version
    ├── text
    ├── word_count
    ├── saved_at
    └── auto_saved: true
```

**PostgreSQL อัปเดตร่วม:**
```
essay_submissions
├── word_count       → sync จาก MongoDB
└── time_spent_secs  → elapsed time จาก started_at
```

### Step 3: Submit เรียงความ

```
PostgreSQL: essay_submissions (UPDATE)
├── status           → 'submitted'
├── word_count       → final word count
├── time_spent_secs  → total time
└── submitted_at     → NOW()
```

### Step 4: AI Grading (async — อาจใช้เวลา 10-30 วินาที)

```
PostgreSQL: essay_submissions (UPDATE)
├── status           → 'grading'
```

ระบบส่ง essay text + rubric prompt ไปยัง AI provider:

```
AI Request Payload:
├── System: "You are a GED RLA essay grader. Score on 5 dimensions (0-4 each)..."
├── User: { essay_text, prompt_text, passage_text }
└── Response: { claim: 3, evidence: 2, organization: 3, language: 2, reasoning: 2 }
```

### Step 5: บันทึกผลการตรวจ

**PostgreSQL — รายมิติ (5 แถว ต่อ 1 submission):**
```
essay_grading_details (5 rows — 1 per dimension)
├── submission_id    → อ้างอิง essay_submissions.id
├── dimension        → 'claim' | 'evidence' | 'organization' | 'language' | 'reasoning'
├── score            → 0-4 (0=Not Present, 1=Inadequate, 2=Adequate, 3=Effective, 4=Excellent)
├── max_score        → 4
├── feedback         → AI-generated feedback สำหรับมิตินี้
├── strengths        → TEXT[] — จุดแข็ง
├── improvements     → TEXT[] — สิ่งที่ควรปรับปรุง
└── mongo_feedback_id → ถ้ามี rich feedback → MongoDB
```

**Trigger `trg_recalc_essay_score`:** ทุกครั้ง INSERT/UPDATE dimension → auto คำนวณ:
```
essay_submissions
├── total_score      → (sum of 5 scores / 20) * 100  → 0-100 scale
├── ged_equivalent   → 100 + total_score  → 100-200 scale (145 = passing)
├── ai_provider      → ผู้ให้บริการที่ใช้ตรวจ
├── ai_model         → model ที่ใช้
├── grading_tokens_used → tokens ที่ใช้ในการตรวจ
├── status           → 'graded'
└── graded_at        → NOW()
```

**MongoDB — ริชฟีดแบ็ค:**
```
EssayContent (UPDATE)
├── overall_feedback     → สรุปรวม
├── annotations          → [] ของ TextAnnotation
│    ├── start_offset / end_offset / text_segment
│    ├── annotation_type → 'error' | 'warning' | 'suggestion' | 'praise' | 'highlight'
│    ├── category → 'grammar' | 'spelling' | 'evidence_usage' | 'organization' | ...
│    ├── comment
│    └── suggestion
├── improved_version     → AI-generated เวอร์ชันที่ปรับปรุงแล้ว (optional)
├── grading_model        → model ที่ใช้
└── grading_completed_at → NOW()
```

---

## Part 4: Readiness Score — Calculation Flow

### Overview

Readiness Score คำนวณจากหลาย factor และถูก trigger ให้ recalculate หลังเหตุการณ์สำคัญ (ทำ quiz เสร็จ, ส่ง essay เสร็จ) หรือเมื่อผู้ใช้กด refresh ด้วยตนเอง

---

### Step 1: Trigger Event เกิดขึ้น

เหตุการณ์ที่ทำให้ระบบคำนวณ Readiness Score ใหม่:
- **หลังทำ quiz เสร็จ** (auto, trigger_event = 'auto')
- **หลังส่ง essay และตรวจเสร็จ** (auto, trigger_event = 'auto')
- **ผู้ใช้กด "Refresh Score"** (manual, trigger_event = 'manual')

### Step 2: ดึงข้อมูล Input Factors ทั้งหมด

```
Query ข้อมูลจาก PostgreSQL:
├── quiz_attempts    → คะแนน quiz ล่าสุด (weighted ตาม quiz_type)
│                        ged_ready_full: weight 1.0
│                        ged_ready_subject: weight 0.8
│                        subject_test: weight 0.6
│                        module_review: weight 0.4
│                        lesson_quiz: weight 0.2
├── lesson_progress  → % บทเรียนที่เสร็จใน subject นั้น
├── spaced_repetition → % ข้อที่ sr_status = 'mastered'
├── essay_submissions → คะแนน essay ล่าสุด (เฉพาะ RLA)
└── คำนวณ factors:
     ├── quiz_score_factor     = weighted avg * 100
     ├── completion_factor     = (lessons_completed / total_lessons) * 100
     ├── mastery_factor        = (mastered_count / total_questions_answered) * 100
     ├── recency_factor        = exponential decay ตามอายุของคะแนนล่าสุด
     ├── consistency_factor    = 100 - (stddev(scores) * penalty)
     └── essay_factor          = essay_score หรือ N/A
```

### Step 3: คำนวณ Composite Score

```
Weighted Composite (ตัวอย่าง weights):
├── quiz_score_factor     × 0.35
├── completion_factor     × 0.15
├── mastery_factor        × 0.20
├── recency_factor        × 0.10
├── consistency_factor    × 0.10
└── essay_factor          × 0.10
─────────────────────────────────
= composite_score (0-100)
```

Map → GED scale 100-200:
```
predicted_ged_score = 100 + composite_score  (clamped 100-200)
```

Map → Confidence Level:
```
pass_probability = statistical estimate จากคะแนน + consistency

confidence_level:
├── 'not_ready'      → predicted_ged_score < 135
├── 'approaching'    → 135-144
├── 'likely_pass'    → 145-164
└── 'strong_pass'    → 165+
```

### Step 4: บันทึก/อัปเดต Readiness Score

```
PostgreSQL: readiness_scores (UPSERT — มีอยู่แล้ว UPDATE, ยังไม่มี INSERT)
├── user_id                  → ผู้ใช้
├── subject_id               → วิชา
├── predicted_ged_score      → คะแนนที่คาดการณ์ (100-200)
├── confidence_level         → 'not_ready' | 'approaching' | 'likely_pass' | 'strong_pass'
├── pass_probability         → % โอกาสผ่าน 145+
├── quiz_score_factor        → ค่า factor
├── completion_factor        → ค่า factor
├── mastery_factor           → ค่า factor
├── recency_factor           → ค่า factor
├── consistency_factor       → ค่า factor
├── essay_factor             → ค่า factor
├── input_snapshot           → JSONB { total_quizzes: 45, avg_score: 78.5, ... }
├── best_ged_ready_score     → คะแนน ged_ready ที่ดีที่สุด (ถ้ามี)
├── best_ged_ready_date      → วันที่ทำ ged_ready ที่ดีที่สุด
└── calculated_at            → NOW()
```

### Step 5: บันทึก History (Auto จาก Trigger)

**Trigger `trg_log_readiness`:** ทุกครั้ง INSERT หรือ UPDATE `predicted_ged_score`:

```
readiness_history (INSERT อัตโนมัติ)
├── user_id
├── subject_id
├── predicted_ged_score
├── confidence_level
├── pass_probability
├── trigger_event           → 'auto' | 'manual'
├── input_snapshot           → snapshot ของข้อมูลตอนคำนวณ
└── calculated_at            → NOW()
```

นี่ช่วยให้ Dashboard แสดงกราฟความคืบหน้า (progress chart) ได้

---

## ER Relationship Summary (All Flows Combined)

```
users
  │
  ├── 1:N ──→ quiz_attempts ──── 1:N ──→ quiz_attempt_answers
  │              │                              │
  │              │                              ├── N:1 ──→ questions ── 1:N ──→ answers
  │              │                              │
  │              └── N:1 ──→ subjects
  │
  ├── 1:N ──→ spaced_repetition ── N:1 ──→ questions
  │
  ├── 1:N ──→ lesson_progress ── N:1 ──→ lessons
  │
  ├── 1:N ──→ ai_conversations ── 1:N ──→ ai_messages
  │              │
  │              └── 1:0.1 ──→ MongoDB: AiConversationContext
  │
  ├── 1:N ──→ essay_submissions ── 1:N ──→ essay_grading_details
  │              │
  │              ├── N:1 ──→ essay_prompts
  │              └── 1:0.1 ──→ MongoDB: EssayContent
  │
  ├── 1:N ──→ readiness_scores
  │
  └── 1:N ──→ readiness_history

subjects
  ├── 1:N ──→ modules ── 1:N ──→ topics ── 1:N ──→ lessons
  │                                                      │
  │                                                      └── 1:0.1 ──→ MongoDB: LessonContent
  │
  └── 1:N ──→ essay_prompts
```

---

## Key Design Decisions

| ตัดสินใจ | เหตุผล |
|---|---|
| `quiz_attempt_answers` แยกตาราง | รองรับการ track รายข้อ, flag, time per question สำหรับ GED Simulator |
| Trigger `trg_recalc_score` | ลดโอกาส inconsistent score ระหว่าง raw answers กับ aggregate |
| `spaced_repetition` เก็บใน PostgreSQL | ต้อง JOIN กับ users และ questions, ต้อง index เพื่อ query "due cards" ได้เร็ว |
| `lesson body_content` เก็บใน MongoDB | เนื้อหาเป็น block-based rich content ที่มีโครงสร้างไม่แน่นอน, เหมาะกับ document DB |
| `flagged_question_ids` เป็น Array | ใช้สำหรับ GED Ready Simulator ที่ผู้ใช้ต้อง mark ข้อเพื่อทบทวนก่อน submit |
| AI conversation เก็บ 2 ที่ (PG + Mongo) | PostgreSQL เก็บ metadata ที่ต้อง JOIN/filter/sort; MongoDB เก็บ context payload ใหญ่ |
| Essay drafts cap ที่ 20 รุ่น | ป้องกัน document เติบโตไม่จำกัดใน MongoDB |
| `essay_grading_details` แยกตาราง | รองรับ rubric 5 มิติแยกกัน, trigger คำนวณ total อัตโนมัติ |
| `readiness_scores` + `readiness_history` แยก | scores = ค่าล่าสุด (UPSERT ต่อ subject); history = log ทุกการเปลี่ยนแปลง (append-only) |
| `input_snapshot` เป็น JSONB | เก็บ raw data ตอนคำนวณไว้ debug/audit ได้โดยไม่ต้อง query หลายตาราง |