---
Task ID: 1
Agent: main
Task: Post-Login Score Targeting & Adaptive AI Tutor Rigor System

Work Log:
- Added `scoreTarget Int?` field to User model in Prisma schema
- Ran `prisma db push` to apply schema to SQLite
- Created API route: GET/PUT /api/user/score-target (validate 145-200 range)
- Updated Zustand store: added scoreTarget, rigorConfig, showScoreTargetModal states
- Implemented `getRigorConfig()` function with 3 rigor levels:
  - Level 1 (145-160): "ประคอง" — gentle reminders, 2-day miss threshold
  - Level 2 (161-175): "เข้มงวด" — daily quiz + flashcards required, lock at <150, unlock at 155
  - Level 3 (176-200): "จอมโหด" — instant discipline deduction, hard mode injection, double schedule on fail <175
- Created ScoreTargetModal component with live slider + rigor level preview
- Created AiTutorPanel component showing AI personality, rules, and stats
- Updated Dashboard to integrate modal, AI panel, and score target banner

Stage Summary:
- All frontend + backend code complete
- Files created/modified:
  - prisma/schema.prisma (added scoreTarget)
  - src/app/api/user/score-target/route.ts (new)
  - src/lib/store.ts (rewritten with rigor system)
  - src/components/dashboard/ScoreTargetModal.tsx (new)
  - src/components/dashboard/AiTutorPanel.tsx (new)
  - src/components/dashboard/Dashboard.tsx (updated)---
Task ID: 1
Agent: main
Task: Seed curriculum structure (topic_categories, supplementary_lessons) and create AI Tutor system prompt

Work Log:
- Read existing schema.prisma: Found Subject→Module→Topic→Lesson hierarchy, no TopicCategory model
- Added TopicCategory model with fields: id, subjectId, name, nameTh, description, weightPercentage, categoryType (core/supplementary), sortOrder
- Added lessonType (core_topic/supplementary_topic) and topicCategoryId fields to Lesson model
- Created and ran Prisma migration: 20260723072432_add_topic_categories
- Created seed-curriculum.ts: 16 topic categories across 4 subjects (12 core + 4 supplementary)
- Created 10 supplementary lessons (Math:3, RLA:3, Science:2, SS:2)
- Linked all 32 core lessons to their correct topic categories via slug mapping
- Created ai-tutor-prompt.ts: Full GED curriculum-aware system prompt (5761 chars)
- Created ai/chat API route: POST endpoint with subject/category context injection

Stage Summary:
- 16 Topic Categories in DB (12 core weighted + 4 supplementary)
- 42 total lessons with topicCategoryId linked (32 core + 10 supplementary)
- AI Tutor system prompt covers all 4 subjects with exact category weights
- API route /api/ai/chat ready for integration
---
Task ID: 2
Agent: main
Task: Complete remaining tasks - fix popup flow, fill empty categories, verify build

Work Log:
- Fixed AppShell.tsx: Refactored popup chain using refs instead of state for pendingNavFn and pendingSubjectCodeRef. Flow is now: Daily Quiz → Pre-study Warning → Navigate to Subject
- Created seed-missing-lessons.ts: Added 10 core lessons for 4 previously empty categories
  - RLA Extended Response/Essay: 3 lessons (essay overview, claims/evidence, writing tips)
  - Science Earth & Space: 3 lessons (plate tectonics, weather/climate, solar system)
  - SS Economics: 2 lessons (supply/demand, economic systems)
  - SS Geography & World History: 2 lessons (maps/population, world history events)
- Verified all 16 core categories now have at least 2 lessons each
- Verified Next.js build passes successfully
- Verified APIs respond correctly (subjects, flashcards)
- Total: 52 lessons, 64 questions, 32 flashcards, 16 topic categories

Stage Summary:
- All core categories have lessons (0 empty categories remaining)
- Pre-study popup chain fixed with proper ref-based state management
- App builds and runs on port 3000
- All APIs functional
---
Task ID: 1
Agent: main
Task: Move vocabulary review to subject pages with pronunciation subtitles and 3-day rotation

Work Log:
- Added pronunciation field to Flashcard Prisma model
- Created and applied Prisma migration for pronunciation field
- Updated seed.ts with Thai pronunciation for all 32 flashcards across 4 subjects
- Updated /api/flashcards/subject API to return pronunciation field
- Rewrote VocabReview component: shows English word + Thai pronunciation subtitle, student types meaning
- Added 3-day rotation logic (divides 8 cards into 3 groups, rotates daily)
- Moved VocabReview from LessonView to SubjectView (each subject page has its own vocab section)
- Removed VocabReview from LessonView
- Re-seeded database with pronunciation data
- Built and started production server

Stage Summary:
- Each of the 4 subject pages now shows a vocabulary review section at the top
- Each vocab card shows: English term (bold) + pronunciation subtitle (Thai reading) + Thai translation
- Students type the meaning and get instant feedback
- 3-day rotation: vocab set changes every 3 days automatically
- Server running at localhost:3000
---
Task ID: 2
Agent: main
Task: GED Knowledge Base & Handbook Module — Full Implementation

Work Log:
- Analyzed existing codebase: schema already had HandbookTopic/HandbookContent + Question.relatedConceptId
- APIs /api/handbook/:subjectId and /api/handbook/concept/:conceptId already functional
- HandbookView component with subject tabs, category tabs, ConceptGuidePanel already built
- Identified missing: seed data, QuizView concept button, QuizResult concept panel, question linking
- Fixed build-breaking unicode escape in HandbookView.tsx line 99
- Switched Prisma schema to PostgreSQL for production (Supabase)
- Created comprehensive handbook seed script: 19 topics across 4 subjects
  - Category A (handbook): Exam overview, calculator guide, time strategies, essay guide, document analysis
  - Category B (textbook): Number ops, algebra, geometry, life/physical/earth science, reading, grammar, civics, history/economics
- All content trilingual (EN/TH/MM) with key takeaways and formula/rule boxes
- Ran seed: 19 handbook topics, 19 content sections created
- Created question-to-concept linker script: 32/64 questions linked via relatedConceptId
- Added "Read Concept Guide" button to QuizView with inline concept panel overlay
- Wired ConceptGuidePanel into QuizResult for wrong-answer review
- Fixed all build errors, verified successful Next.js build
- Switched schema to PostgreSQL provider for Vercel/Supabase deployment

Stage Summary:
- 19 Handbook Topics seeded (10 exam handbook + 9 core textbook)
- 32 of 64 questions linked to handbook concepts via relatedConceptId
- "อ่านคู่มือเรื่องนี้" button active in QuizView for linked questions
- ConceptGuidePanel shows in QuizResult for wrong answers with related concept
- Build passes successfully with PostgreSQL schema
- Ready for Vercel deployment with Supabase DATABASE_URL
---
Task ID: 3
Agent: main
Task: Fix Tab C (Lessons) in Handbook — make 32 lessons accessible from Knowledge Base

Work Log:
- Verified HandbookView.tsx already had Tab C code with LessonsModuleCard component
- Verified API /api/handbook/lessons/[subjectId] returns correct module>topic>lesson data (8 modules, 32 lessons across 4 subjects)
- Verified API /api/lessons/[id] returns lesson content with bodyContent blocks and questions
- Verified LessonView component renders content blocks, handles translation, and shows quiz button
- Added `lessonOrigin` state to Zustand store for proper back navigation ("handbook" vs "subject")
- Updated HandbookView Tab C onOpenLesson to set lessonOrigin="handbook" before navigating
- Updated SubjectView openLesson to set lessonOrigin="subject"
- Updated LessonView handleBack to use lessonOrigin for back navigation
- Fixed HandbookView: removed redundant double-fetch of lessons data, added loading guard to useEffect
- Fixed HandbookView: separated empty state for lessons tab into its own conditional block
- Reverted allowedDevOrigins config (was causing server crashes in Next.js 16 Turbopack)
- Verified production build succeeds
- Verified all 4 subject lesson APIs return correct data (math:1785, science:1742, rla:1735, ss:1815 bytes)
- Verified single lesson API returns content blocks and questions

Stage Summary:
- Tab C "บทเรียน (Lessons) 🔵" now fully functional: shows 8 modules with 32 lessons across 4 subjects
- Clicking a lesson from Tab C opens LessonView with proper content rendering
- Back button from LessonView correctly returns to Handbook (not Subject view)
- All APIs verified working end-to-end
- Files modified: store.ts, HandbookView.tsx, LessonView.tsx, SubjectView.tsx, next.config.ts
---
Task ID: 1
Agent: main
Task: แก้ไข Tab C บทเรียน (Lessons) ใน HandbookView ให้ใช้งานได้

Work Log:
- อ่านไฟล์ HandbookView.tsx, LessonView.tsx, SubjectView.tsx, store.ts
- ตรวจ TypeScript compile error → ไม่มี error ใน src/
- วิเคราะห์พบปัญหาหลัก: onOpenLesson ใน Tab C เรียก setView("lesson") ก่อน fetch จะเสร็จ ทำให้ LessonView แสดง Skeleton และข้อมูลอาจหาย
- สร้าง LessonsTabContent component ใหม่ ที่ fetch ข้อมูลเสร็จก่อนค่อย setView
- เพิ่ม loading spinner ขณะ fetch lesson และป้องกัน double-click
- ทำความสะอาด unused imports ใน HandbookView
- เพิ่ม allowedDevOrigins: ["space-z.ai"] ใน next.config.ts
- Build production สำเร็จ ทดสอบ API ทั้ง 4 วิชา (math, science, rla, ss) ผ่าน
- ตั้ง server-loop.sh auto-restart เพื่อรองรับ server crash

Stage Summary:
- แก้ race condition ใน onOpenLesson (fetch ก่อน → setView ทีหลัง)
- API ทั้ง 4 วิชาตอบกลับถูกต้อง
- Individual lesson API ทำงานได้
- Server รัน production mode + auto-restart loop
