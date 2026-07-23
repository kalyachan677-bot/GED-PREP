-- AlterTable
ALTER TABLE "User" ADD COLUMN "scoreTarget" INTEGER;

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "subjectId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Flashcard_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DailyFlashcardQuizLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "answeredAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,
    "userAnswer" TEXT NOT NULL,
    CONSTRAINT "DailyFlashcardQuizLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DailyFlashcardQuizLog_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Flashcard_subjectId_idx" ON "Flashcard"("subjectId");

-- CreateIndex
CREATE INDEX "Flashcard_subjectId_sortOrder_idx" ON "Flashcard"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX "DailyFlashcardQuizLog_userId_answeredAt_idx" ON "DailyFlashcardQuizLog"("userId", "answeredAt");

-- CreateIndex
CREATE INDEX "DailyFlashcardQuizLog_userId_idx" ON "DailyFlashcardQuizLog"("userId");
