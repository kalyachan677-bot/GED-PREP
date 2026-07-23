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
