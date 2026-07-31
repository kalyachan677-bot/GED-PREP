-- ============================================================
-- Migration: Add GED Knowledge Base & Handbook Module
-- Tables: handbook_topics, handbook_contents
-- Column:  questions.related_concept_id (FK → handbook_topics.id)
-- ============================================================

-- 1. handbook_topics
CREATE TABLE IF NOT EXISTS "handbook_topics" (
  "id"            TEXT NOT NULL PRIMARY KEY,
  "subjectId"     TEXT NOT NULL,
  "title"         TEXT NOT NULL DEFAULT '',
  "titleTh"       TEXT NOT NULL DEFAULT '',
  "titleMm"       TEXT NOT NULL DEFAULT '',
  "categoryType"  TEXT NOT NULL DEFAULT 'core',
  "sortOrder"     INTEGER NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "handbook_topics_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "handbook_topics_subjectId_idx" ON "handbook_topics"("subjectId");
CREATE INDEX IF NOT EXISTS "handbook_topics_subjectId_categoryType_idx" ON "handbook_topics"("subjectId", "categoryType");
CREATE INDEX IF NOT EXISTS "handbook_topics_subjectId_sortOrder_idx" ON "handbook_topics"("subjectId", "sortOrder");

-- 2. handbook_contents
CREATE TABLE IF NOT EXISTS "handbook_contents" (
  "id"              TEXT NOT NULL PRIMARY KEY,
  "topicId"         TEXT NOT NULL,
  "contentBodyEn"   TEXT NOT NULL DEFAULT '',
  "contentBodyTh"   TEXT NOT NULL DEFAULT '',
  "contentBodyMm"   TEXT NOT NULL DEFAULT '',
  "keyTakeaways"    TEXT NOT NULL DEFAULT '[]',
  "formulaOrRules"  TEXT NOT NULL DEFAULT '[]',
  "sortOrder"       INTEGER NOT NULL DEFAULT 0,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "handbook_contents_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "handbook_topics" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "handbook_contents_topicId_idx" ON "handbook_contents"("topicId");
CREATE INDEX IF NOT EXISTS "handbook_contents_topicId_sortOrder_idx" ON "handbook_contents"("topicId", "sortOrder");

-- 3. Add related_concept_id column to Question (nullable FK)
ALTER TABLE "Question" ADD COLUMN IF NOT EXISTS "relatedConceptId" TEXT;

-- Add FK constraint (only if column exists and no constraint yet)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Question_relatedConceptId_fkey'
  ) THEN
    ALTER TABLE "Question" ADD CONSTRAINT "Question_relatedConceptId_fkey"
      FOREIGN KEY ("relatedConceptId") REFERENCES "handbook_topics" ("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Question_relatedConceptId_idx" ON "Question"("relatedConceptId");
