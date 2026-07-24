-- CreateTable
CREATE TABLE "TopicCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "description" TEXT,
    "weightPercentage" INTEGER NOT NULL DEFAULT 0,
    "categoryType" TEXT NOT NULL DEFAULT 'core',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TopicCategory_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lesson" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "topicId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'text',
    "bodyContent" TEXT NOT NULL DEFAULT '{}',
    "videoUrl" TEXT,
    "durationMinutes" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrerequisite" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "lessonType" TEXT NOT NULL DEFAULT 'core_topic',
    "topicCategoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Lesson_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Lesson_topicCategoryId_fkey" FOREIGN KEY ("topicCategoryId") REFERENCES "TopicCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Lesson" ("bodyContent", "contentType", "createdAt", "durationMinutes", "id", "isPrerequisite", "slug", "sortOrder", "status", "title", "topicId", "updatedAt", "videoUrl") SELECT "bodyContent", "contentType", "createdAt", "durationMinutes", "id", "isPrerequisite", "slug", "sortOrder", "status", "title", "topicId", "updatedAt", "videoUrl" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");
CREATE INDEX "Lesson_topicId_idx" ON "Lesson"("topicId");
CREATE INDEX "Lesson_topicId_sortOrder_idx" ON "Lesson"("topicId", "sortOrder");
CREATE INDEX "Lesson_slug_idx" ON "Lesson"("slug");
CREATE INDEX "Lesson_topicCategoryId_idx" ON "Lesson"("topicCategoryId");
CREATE INDEX "Lesson_lessonType_idx" ON "Lesson"("lessonType");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TopicCategory_subjectId_idx" ON "TopicCategory"("subjectId");

-- CreateIndex
CREATE INDEX "TopicCategory_subjectId_sortOrder_idx" ON "TopicCategory"("subjectId", "sortOrder");
