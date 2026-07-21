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
  - src/components/dashboard/Dashboard.tsx (updated)