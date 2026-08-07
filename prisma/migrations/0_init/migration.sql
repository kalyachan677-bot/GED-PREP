
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "displayName" TEXT,
    "role" TEXT NOT NULL DEFAULT 'student',
    "status" TEXT NOT NULL DEFAULT 'active',
    "avatarUrl" TEXT,
    "preferredLang" TEXT NOT NULL DEFAULT 'en',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "targetGedDate" TEXT,
    "scoreTarget" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "iconUrl" TEXT,
    "colorHex" TEXT NOT NULL DEFAULT '#3B82F6',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "estimatedHours" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TopicCategory" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameTh" TEXT NOT NULL,
    "description" TEXT,
    "weightPercentage" INTEGER NOT NULL DEFAULT 0,
    "categoryType" TEXT NOT NULL DEFAULT 'core',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TopicCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT,
    "subjectId" TEXT NOT NULL,
    "questionType" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "points" INTEGER NOT NULL DEFAULT 1,
    "questionText" TEXT,
    "explanation" TEXT,
    "hintText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sourceTag" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "relatedConceptId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandbookTopic" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleTh" TEXT NOT NULL DEFAULT '',
    "titleMm" TEXT NOT NULL DEFAULT '',
    "categoryType" TEXT NOT NULL DEFAULT 'core',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HandbookTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HandbookContent" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "contentBodyEn" TEXT NOT NULL DEFAULT '',
    "contentBodyTh" TEXT NOT NULL DEFAULT '',
    "contentBodyMm" TEXT NOT NULL DEFAULT '',
    "keyTakeaways" TEXT NOT NULL DEFAULT '[]',
    "formulaOrRules" TEXT NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HandbookContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "explanation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "lessonId" TEXT,
    "quizType" TEXT NOT NULL DEFAULT 'lesson_quiz',
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "scorePercent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "timeSpentSecs" INTEGER NOT NULL DEFAULT 0,
    "flaggedQuestionIds" TEXT NOT NULL DEFAULT '[]',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttemptAnswer" (
    "id" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedAnswerIds" TEXT NOT NULL DEFAULT '[]',
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "timeSpentSecs" INTEGER NOT NULL DEFAULT 0,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpacedRepetition" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "srStatus" TEXT NOT NULL DEFAULT 'new',
    "easeFactor" DOUBLE PRECISION NOT NULL DEFAULT 2.50,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "nextReviewAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewAt" TIMESTAMP(3),
    "lastRating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpacedRepetition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completionPct" INTEGER NOT NULL DEFAULT 0,
    "lastAccessed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contextType" TEXT NOT NULL,
    "contextRefId" TEXT,
    "title" TEXT,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "aiProvider" TEXT NOT NULL DEFAULT 'openai',
    "aiModel" TEXT NOT NULL DEFAULT 'gpt-4o',
    "totalTokensIn" INTEGER NOT NULL DEFAULT 0,
    "totalTokensOut" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokensUsed" INTEGER NOT NULL DEFAULT 0,
    "latencyMs" INTEGER,
    "modelUsed" TEXT,
    "metadataJson" TEXT NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssayPrompt" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "passageText" TEXT NOT NULL,
    "mongoPassageId" TEXT,
    "promptText" TEXT NOT NULL,
    "minWords" INTEGER NOT NULL DEFAULT 250,
    "maxWords" INTEGER NOT NULL DEFAULT 500,
    "timeLimitMins" INTEGER NOT NULL DEFAULT 45,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "sourceTag" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EssayPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssaySubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "mongoEssayId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "timeSpentSecs" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "gradedAt" TIMESTAMP(3),
    "totalScore" INTEGER,
    "gedEquivalent" INTEGER,
    "aiProvider" TEXT,
    "aiModel" TEXT,
    "gradingTokensUsed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EssaySubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EssayGradingDetail" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "dimension" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "maxScore" INTEGER NOT NULL DEFAULT 4,
    "feedback" TEXT NOT NULL DEFAULT '',
    "strengths" TEXT NOT NULL DEFAULT '[]',
    "improvements" TEXT NOT NULL DEFAULT '[]',
    "mongoFeedbackId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EssayGradingDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flashcard" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "translation" TEXT NOT NULL,
    "pronunciation" TEXT NOT NULL DEFAULT '',
    "meaning" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Flashcard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyFlashcardQuizLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,
    "userAnswer" TEXT NOT NULL,

    CONSTRAINT "DailyFlashcardQuizLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "predictedGedScore" INTEGER NOT NULL,
    "confidenceLevel" TEXT NOT NULL,
    "passProbability" DOUBLE PRECISION NOT NULL,
    "quizScoreFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "completionFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "masteryFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "recencyFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistencyFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "essayFactor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "inputSnapshot" TEXT NOT NULL DEFAULT '{}',
    "bestGedReadyScore" DOUBLE PRECISION,
    "bestGedReadyDate" TIMESTAMP(3),
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReadinessScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadinessHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "predictedGedScore" INTEGER NOT NULL,
    "confidenceLevel" TEXT NOT NULL,
    "passProbability" DOUBLE PRECISION NOT NULL,
    "triggerEvent" TEXT NOT NULL DEFAULT 'auto',
    "inputSnapshot" TEXT NOT NULL DEFAULT '{}',
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadinessHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX "Module_subjectId_idx" ON "Module"("subjectId");

-- CreateIndex
CREATE INDEX "Module_subjectId_sortOrder_idx" ON "Module"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX "Topic_moduleId_idx" ON "Topic"("moduleId");

-- CreateIndex
CREATE INDEX "Topic_moduleId_sortOrder_idx" ON "Topic"("moduleId", "sortOrder");

-- CreateIndex
CREATE INDEX "TopicCategory_subjectId_idx" ON "TopicCategory"("subjectId");

-- CreateIndex
CREATE INDEX "TopicCategory_subjectId_sortOrder_idx" ON "TopicCategory"("subjectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_topicId_idx" ON "Lesson"("topicId");

-- CreateIndex
CREATE INDEX "Lesson_topicId_sortOrder_idx" ON "Lesson"("topicId", "sortOrder");

-- CreateIndex
CREATE INDEX "Lesson_slug_idx" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_topicCategoryId_idx" ON "Lesson"("topicCategoryId");

-- CreateIndex
CREATE INDEX "Lesson_lessonType_idx" ON "Lesson"("lessonType");

-- CreateIndex
CREATE INDEX "Question_lessonId_idx" ON "Question"("lessonId");

-- CreateIndex
CREATE INDEX "Question_subjectId_idx" ON "Question"("subjectId");

-- CreateIndex
CREATE INDEX "Question_questionType_idx" ON "Question"("questionType");

-- CreateIndex
CREATE INDEX "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX "Question_isActive_idx" ON "Question"("isActive");

-- CreateIndex
CREATE INDEX "Question_relatedConceptId_idx" ON "Question"("relatedConceptId");

-- CreateIndex
CREATE INDEX "HandbookTopic_subjectId_idx" ON "HandbookTopic"("subjectId");

-- CreateIndex
CREATE INDEX "HandbookTopic_subjectId_categoryType_idx" ON "HandbookTopic"("subjectId", "categoryType");

-- CreateIndex
CREATE INDEX "HandbookTopic_subjectId_sortOrder_idx" ON "HandbookTopic"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX "HandbookContent_topicId_idx" ON "HandbookContent"("topicId");

-- CreateIndex
CREATE INDEX "HandbookContent_topicId_sortOrder_idx" ON "HandbookContent"("topicId", "sortOrder");

-- CreateIndex
CREATE INDEX "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX "QuizAttempt_subjectId_idx" ON "QuizAttempt"("subjectId");

-- CreateIndex
CREATE INDEX "QuizAttempt_userId_subjectId_idx" ON "QuizAttempt"("userId", "subjectId");

-- CreateIndex
CREATE INDEX "QuizAttempt_status_idx" ON "QuizAttempt"("status");

-- CreateIndex
CREATE INDEX "QuizAttempt_quizType_idx" ON "QuizAttempt"("quizType");

-- CreateIndex
CREATE INDEX "QuizAttemptAnswer_attemptId_idx" ON "QuizAttemptAnswer"("attemptId");

-- CreateIndex
CREATE INDEX "QuizAttemptAnswer_questionId_idx" ON "QuizAttemptAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "QuizAttemptAnswer_attemptId_questionId_key" ON "QuizAttemptAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX "SpacedRepetition_userId_idx" ON "SpacedRepetition"("userId");

-- CreateIndex
CREATE INDEX "SpacedRepetition_nextReviewAt_idx" ON "SpacedRepetition"("nextReviewAt");

-- CreateIndex
CREATE INDEX "SpacedRepetition_userId_srStatus_idx" ON "SpacedRepetition"("userId", "srStatus");

-- CreateIndex
CREATE UNIQUE INDEX "SpacedRepetition_userId_questionId_key" ON "SpacedRepetition"("userId", "questionId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX "LessonProgress_userId_isCompleted_idx" ON "LessonProgress"("userId", "isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX "AiConversation_userId_idx" ON "AiConversation"("userId");

-- CreateIndex
CREATE INDEX "AiConversation_contextType_contextRefId_idx" ON "AiConversation"("contextType", "contextRefId");

-- CreateIndex
CREATE INDEX "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX "EssayPrompt_subjectId_idx" ON "EssayPrompt"("subjectId");

-- CreateIndex
CREATE INDEX "EssayPrompt_isActive_idx" ON "EssayPrompt"("isActive");

-- CreateIndex
CREATE INDEX "EssaySubmission_userId_idx" ON "EssaySubmission"("userId");

-- CreateIndex
CREATE INDEX "EssaySubmission_promptId_idx" ON "EssaySubmission"("promptId");

-- CreateIndex
CREATE INDEX "EssaySubmission_status_idx" ON "EssaySubmission"("status");

-- CreateIndex
CREATE INDEX "EssayGradingDetail_submissionId_idx" ON "EssayGradingDetail"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX "EssayGradingDetail_submissionId_dimension_key" ON "EssayGradingDetail"("submissionId", "dimension");

-- CreateIndex
CREATE INDEX "Flashcard_subjectId_idx" ON "Flashcard"("subjectId");

-- CreateIndex
CREATE INDEX "Flashcard_subjectId_sortOrder_idx" ON "Flashcard"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX "DailyFlashcardQuizLog_userId_answeredAt_idx" ON "DailyFlashcardQuizLog"("userId", "answeredAt");

-- CreateIndex
CREATE INDEX "DailyFlashcardQuizLog_userId_idx" ON "DailyFlashcardQuizLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadinessScore_userId_key" ON "ReadinessScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadinessScore_userId_subjectId_key" ON "ReadinessScore"("userId", "subjectId");

-- CreateIndex
CREATE INDEX "ReadinessHistory_userId_subjectId_calculatedAt_idx" ON "ReadinessHistory"("userId", "subjectId", "calculatedAt");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TopicCategory" ADD CONSTRAINT "TopicCategory_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_topicCategoryId_fkey" FOREIGN KEY ("topicCategoryId") REFERENCES "TopicCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_relatedConceptId_fkey" FOREIGN KEY ("relatedConceptId") REFERENCES "HandbookTopic"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandbookTopic" ADD CONSTRAINT "HandbookTopic_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HandbookContent" ADD CONSTRAINT "HandbookContent_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "HandbookTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpacedRepetition" ADD CONSTRAINT "SpacedRepetition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpacedRepetition" ADD CONSTRAINT "SpacedRepetition_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LessonProgress" ADD CONSTRAINT "LessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiConversation" ADD CONSTRAINT "AiConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiMessage" ADD CONSTRAINT "AiMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AiConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayPrompt" ADD CONSTRAINT "EssayPrompt_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssaySubmission" ADD CONSTRAINT "EssaySubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssaySubmission" ADD CONSTRAINT "EssaySubmission_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "EssayPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EssayGradingDetail" ADD CONSTRAINT "EssayGradingDetail_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "EssaySubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flashcard" ADD CONSTRAINT "Flashcard_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyFlashcardQuizLog" ADD CONSTRAINT "DailyFlashcardQuizLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyFlashcardQuizLog" ADD CONSTRAINT "DailyFlashcardQuizLog_flashcardId_fkey" FOREIGN KEY ("flashcardId") REFERENCES "Flashcard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessScore" ADD CONSTRAINT "ReadinessScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessScore" ADD CONSTRAINT "ReadinessScore_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessHistory" ADD CONSTRAINT "ReadinessHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessHistory" ADD CONSTRAINT "ReadinessHistory_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadinessHistory" ADD CONSTRAINT "ReadinessHistory_userId_subjectId_fkey" FOREIGN KEY ("userId", "subjectId") REFERENCES "ReadinessScore"("userId", "subjectId") ON DELETE CASCADE ON UPDATE CASCADE;

