// Auto-generated idempotent migration SQL
export const MIGRATION_SQL = `
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE IF NOT EXISTS "User" (
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
CREATE TABLE IF NOT EXISTS "Subject" (
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
CREATE TABLE IF NOT EXISTS "Module" (
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
CREATE TABLE IF NOT EXISTS "Topic" (
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
CREATE TABLE IF NOT EXISTS "TopicCategory" (
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
CREATE TABLE IF NOT EXISTS "Lesson" (
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
CREATE TABLE IF NOT EXISTS "Question" (
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
CREATE TABLE IF NOT EXISTS "HandbookTopic" (
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
CREATE TABLE IF NOT EXISTS "HandbookContent" (
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
CREATE TABLE IF NOT EXISTS "Answer" (
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
CREATE TABLE IF NOT EXISTS "QuizAttempt" (
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
CREATE TABLE IF NOT EXISTS "QuizAttemptAnswer" (
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
CREATE TABLE IF NOT EXISTS "SpacedRepetition" (
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
CREATE TABLE IF NOT EXISTS "LessonProgress" (
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
CREATE TABLE IF NOT EXISTS "AiConversation" (
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
CREATE TABLE IF NOT EXISTS "AiMessage" (
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
CREATE TABLE IF NOT EXISTS "EssayPrompt" (
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
CREATE TABLE IF NOT EXISTS "EssaySubmission" (
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
CREATE TABLE IF NOT EXISTS "EssayGradingDetail" (
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
CREATE TABLE IF NOT EXISTS "Flashcard" (
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
CREATE TABLE IF NOT EXISTS "DailyFlashcardQuizLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "flashcardId" TEXT NOT NULL,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isCorrect" BOOLEAN NOT NULL,
    "userAnswer" TEXT NOT NULL,

    CONSTRAINT "DailyFlashcardQuizLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ReadinessScore" (
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
CREATE TABLE IF NOT EXISTS "ReadinessHistory" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Subject_code_key" ON "Subject"("code");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Module_subjectId_idx" ON "Module"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Module_subjectId_sortOrder_idx" ON "Module"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Topic_moduleId_idx" ON "Topic"("moduleId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Topic_moduleId_sortOrder_idx" ON "Topic"("moduleId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TopicCategory_subjectId_idx" ON "TopicCategory"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "TopicCategory_subjectId_sortOrder_idx" ON "TopicCategory"("subjectId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lesson_topicId_idx" ON "Lesson"("topicId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lesson_topicId_sortOrder_idx" ON "Lesson"("topicId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lesson_slug_idx" ON "Lesson"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lesson_topicCategoryId_idx" ON "Lesson"("topicCategoryId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Lesson_lessonType_idx" ON "Lesson"("lessonType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Question_lessonId_idx" ON "Question"("lessonId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Question_subjectId_idx" ON "Question"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Question_questionType_idx" ON "Question"("questionType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Question_difficulty_idx" ON "Question"("difficulty");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Question_isActive_idx" ON "Question"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Question_relatedConceptId_idx" ON "Question"("relatedConceptId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "HandbookTopic_subjectId_idx" ON "HandbookTopic"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "HandbookTopic_subjectId_categoryType_idx" ON "HandbookTopic"("subjectId", "categoryType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "HandbookTopic_subjectId_sortOrder_idx" ON "HandbookTopic"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "HandbookContent_topicId_idx" ON "HandbookContent"("topicId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "HandbookContent_topicId_sortOrder_idx" ON "HandbookContent"("topicId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Answer_questionId_idx" ON "Answer"("questionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_idx" ON "QuizAttempt"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttempt_subjectId_idx" ON "QuizAttempt"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttempt_userId_subjectId_idx" ON "QuizAttempt"("userId", "subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttempt_status_idx" ON "QuizAttempt"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttempt_quizType_idx" ON "QuizAttempt"("quizType");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttemptAnswer_attemptId_idx" ON "QuizAttemptAnswer"("attemptId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "QuizAttemptAnswer_questionId_idx" ON "QuizAttemptAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "QuizAttemptAnswer_attemptId_questionId_key" ON "QuizAttemptAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SpacedRepetition_userId_idx" ON "SpacedRepetition"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SpacedRepetition_nextReviewAt_idx" ON "SpacedRepetition"("nextReviewAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "SpacedRepetition_userId_srStatus_idx" ON "SpacedRepetition"("userId", "srStatus");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "SpacedRepetition_userId_questionId_key" ON "SpacedRepetition"("userId", "questionId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "LessonProgress_userId_idx" ON "LessonProgress"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "LessonProgress_userId_isCompleted_idx" ON "LessonProgress"("userId", "isCompleted");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "LessonProgress_userId_lessonId_key" ON "LessonProgress"("userId", "lessonId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AiConversation_userId_idx" ON "AiConversation"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AiConversation_contextType_contextRefId_idx" ON "AiConversation"("contextType", "contextRefId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AiMessage_conversationId_idx" ON "AiMessage"("conversationId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EssayPrompt_subjectId_idx" ON "EssayPrompt"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EssayPrompt_isActive_idx" ON "EssayPrompt"("isActive");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EssaySubmission_userId_idx" ON "EssaySubmission"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EssaySubmission_promptId_idx" ON "EssaySubmission"("promptId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EssaySubmission_status_idx" ON "EssaySubmission"("status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EssayGradingDetail_submissionId_idx" ON "EssayGradingDetail"("submissionId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "EssayGradingDetail_submissionId_dimension_key" ON "EssayGradingDetail"("submissionId", "dimension");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Flashcard_subjectId_idx" ON "Flashcard"("subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Flashcard_subjectId_sortOrder_idx" ON "Flashcard"("subjectId", "sortOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DailyFlashcardQuizLog_userId_answeredAt_idx" ON "DailyFlashcardQuizLog"("userId", "answeredAt");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "DailyFlashcardQuizLog_userId_idx" ON "DailyFlashcardQuizLog"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ReadinessScore_userId_key" ON "ReadinessScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ReadinessScore_userId_subjectId_key" ON "ReadinessScore"("userId", "subjectId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ReadinessHistory_userId_subjectId_calculatedAt_idx" ON "ReadinessHistory"("userId", "subjectId", "calculatedAt");`;
