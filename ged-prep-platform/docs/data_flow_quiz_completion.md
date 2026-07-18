# GED Prep Platform — Data Flow: Quiz Completion

## Overview

เมื่อผู้ใช้ทำข้อสอบ (Quiz) หนึ่งชุดเสร็จสมบูรณ์ ข้อมูลจะถูกบันทึกผ่าน **5 ตาราง** ใน PostgreSQL โดยมีการสัมพันธ์กันแบบ Foreign Key และ Trigger auto-calculate ดังนี้:

---

## Data Flow Step-by-Step

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

## ER Relationship Summary (Quiz Flow)

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
  └── 1:N ──→ lesson_progress ── N:1 ──→ lessons

subjects
  ├── 1:N ──→ modules ── 1:N ──→ topics ── 1:N ──→ lessons
  │                                                      │
  └── 1:N ──→ questions                                  └── 1:1 ──→ MongoDB (LessonContent)
```

---

## Key Design Decisions

| ตัดสินใจ | เหตุผล |
|---|---|
| `quiz_attempt_answers` แยกตาราง | รองรับการ track รายข้อ, flag, time per question สำหรับ GED Simulator |
| Trigger `trg_recalc_score` | ลดโอกาส inconsistent score ระหว่าง raw answers กับ aggregate |
| `spaced_repetition` เก็บใน PostgreSQL (ไม่ใช่ MongoDB) | เพราะต้อง JOIN กับ users และ questions, ต้อง index เพื่อ query "due cards" ได้เร็ว |
| `lesson body_content` เก็บใน MongoDB | เนื้อหาเป็น block-based rich content ที่มีโครงสร้างไม่แน่นอน, เหมาะกับ document DB |
| `flagged_question_ids` เป็น Array | ใช้สำหรับ GED Ready Simulator ที่ผู้ใช้ต้อง mark ข้อเพื่อทบทวนก่อน submit |