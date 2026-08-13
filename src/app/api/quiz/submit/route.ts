export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// POST /api/quiz/submit — Submit answers for grading
// Body: { attemptId, answers: [{ questionId, selectedAnswerIds, timeSpentSecs, isFlagged }] }
// Implements SM-2 spaced repetition update
// ---------------------------------------------------------------------------
interface SubmitAnswer {
  questionId: string;
  selectedAnswerIds: string[];
  timeSpentSecs?: number;
  isFlagged?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId, answers } = body as {
      attemptId: string;
      answers: SubmitAnswer[];
    };

    if (!attemptId || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "attemptId and answers are required" },
        { status: 400 }
      );
    }

    const attempt = await db.quizAttempt.findUnique({ where: { id: attemptId } });
    if (!attempt) {
      return NextResponse.json({ error: "Quiz attempt not found" }, { status: 404 });
    }
    if (attempt.status !== "in_progress") {
      return NextResponse.json(
        { error: `Quiz attempt is already ${attempt.status}` },
        { status: 400 }
      );
    }

    const questionIds = answers.map((a) => a.questionId);
    const correctAnswers = await db.answer.findMany({
      where: { questionId: { in: questionIds } },
      select: { id: true, questionId: true, isCorrect: true, content: true, explanation: true, sortOrder: true },
    });

    const correctAnswerMap: Record<string, string[]> = {};
    const answerDetailsMap: Record<string, { id: string; content: string; explanation: string | null; sortOrder: number; isCorrect: boolean }[]> = {};
    for (const a of correctAnswers) {
      if (!correctAnswerMap[a.questionId]) {
        correctAnswerMap[a.questionId] = [];
        answerDetailsMap[a.questionId] = [];
      }
      if (a.isCorrect) correctAnswerMap[a.questionId].push(a.id);
      answerDetailsMap[a.questionId].push({ ...a, isCorrect: a.isCorrect });
    }

    // Fetch question explanations
    const questions = await db.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true, explanation: true },
    });
    const questionExplanationMap: Record<string, string> = {};
    for (const q of questions) {
      questionExplanationMap[q.id] = q.explanation || "";
    }

    const gradedAnswers: {
      questionId: string;
      selectedAnswerIds: string[];
      correctAnswerIds: string[];
      isCorrect: boolean;
      timeSpentSecs: number;
      isFlagged: boolean;
      allAnswers: { id: string; content: string; isCorrect: boolean }[];
      explanation: string;
    }[] = [];

    const result = await db.$transaction(async (tx) => {
      let totalCorrect = 0;
      let totalTimeSpent = 0;

      for (const answer of answers) {
        const correctIds = correctAnswerMap[answer.questionId] ?? [];
        const allAnswerDetails = (answerDetailsMap[answer.questionId] ?? []);
        const selectedSorted = [...answer.selectedAnswerIds].sort();
        const correctSorted = [...correctIds].sort();
        const isCorrect =
          selectedSorted.length === correctSorted.length &&
          selectedSorted.every((id, idx) => id === correctSorted[idx]);

        if (isCorrect) totalCorrect++;
        totalTimeSpent += answer.timeSpentSecs ?? 0;

        await tx.quizAttemptAnswer.create({
          data: {
            attemptId,
            questionId: answer.questionId,
            selectedAnswerIds: JSON.stringify(answer.selectedAnswerIds),
            isCorrect,
            isFlagged: answer.isFlagged ?? false,
            timeSpentSecs: answer.timeSpentSecs ?? 0,
            answeredAt: new Date(),
          },
        });

        // SM-2 Spaced Repetition update
        const rating = isCorrect ? 3 : 0; // 3=Easy, 0=Again
        const existingSR = await tx.spacedRepetition.findUnique({
          where: { userId_questionId: { userId: attempt.userId, questionId: answer.questionId } },
        });

        if (existingSR) {
          let { easeFactor, intervalDays, repetitions } = existingSR;
          if (rating >= 3) {
            if (repetitions === 0) intervalDays = 1;
            else if (repetitions === 1) intervalDays = 6;
            else intervalDays = Math.round(intervalDays * easeFactor);
            repetitions += 1;
          } else {
            repetitions = 0;
            intervalDays = 1;
          }
          easeFactor = Math.max(1.3, easeFactor + (0.1 - (3 - rating) * (0.08 + (3 - rating) * 0.02)));

          await tx.spacedRepetition.update({
            where: { id: existingSR.id },
            data: {
              easeFactor,
              intervalDays,
              repetitions,
              lastReviewAt: new Date(),
              nextReviewAt: new Date(Date.now() + intervalDays * 86400000),
              lastRating: rating,
              srStatus: isCorrect ? (repetitions >= 3 ? "mastered" : "review") : "learning",
              updatedAt: new Date(),
            },
          });
        } else {
          await tx.spacedRepetition.create({
            data: {
              userId: attempt.userId,
              questionId: answer.questionId,
              srStatus: isCorrect ? "review" : "learning",
              easeFactor: 2.5,
              intervalDays: isCorrect ? 6 : 1,
              repetitions: isCorrect ? 1 : 0,
              lastReviewAt: new Date(),
              nextReviewAt: new Date(Date.now() + (isCorrect ? 6 : 1) * 86400000),
              lastRating: rating,
            },
          });
        }

        // Mark lesson as completed if all questions in this lesson are answered correctly
        if (answer.selectedAnswerIds.length > 0) {
          await tx.lessonProgress.upsert({
            where: { userId_lessonId: { userId: attempt.userId, lessonId: attempt.lessonId || "" } },
            update: {
              lastAccessed: new Date(),
              isCompleted: isCorrect,
              completionPct: 100,
              completedAt: isCorrect ? new Date() : undefined,
            },
            create: {
              userId: attempt.userId,
              lessonId: attempt.lessonId || "",
              lastAccessed: new Date(),
              isCompleted: isCorrect,
              completionPct: 100,
              completedAt: isCorrect ? new Date() : undefined,
            },
          }).catch(() => {});
        }

        gradedAnswers.push({
          questionId: answer.questionId,
          selectedAnswerIds: answer.selectedAnswerIds,
          correctAnswerIds: correctIds,
          isCorrect,
          timeSpentSecs: answer.timeSpentSecs ?? 0,
          isFlagged: answer.isFlagged ?? false,
          allAnswers: allAnswerDetails.map((a) => ({ id: a.id, content: a.content, isCorrect: a.isCorrect })),
          explanation: questionExplanationMap[answer.questionId] || "",
        });
      }

      const totalQuestions = answers.length;
      const scorePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 10000) / 100 : 0;

      const updatedAttempt = await tx.quizAttempt.update({
        where: { id: attemptId },
        data: {
          status: "completed",
          correctCount: totalCorrect,
          scorePercent,
          timeSpentSecs: totalTimeSpent,
          completedAt: new Date(),
        },
      });

      return updatedAttempt;
    });

    return NextResponse.json({
      data: {
        attempt: {
          id: result.id,
          userId: result.userId,
          subjectId: result.subjectId,
          lessonId: result.lessonId,
          quizType: result.quizType,
          status: result.status,
          totalQuestions: result.totalQuestions,
          correctCount: result.correctCount,
          scorePercent: result.scorePercent,
          timeSpentSecs: result.timeSpentSecs,
          startedAt: result.startedAt,
          completedAt: result.completedAt,
        },
        results: gradedAnswers,
      },
    });
  } catch (error) {
    console.error("[POST /api/quiz/submit] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}