export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// POST /api/quiz/start — Create a new quiz attempt with fetched questions
// Body: { userId, subjectId, lessonId?, quizType }
// Returns the attempt with questions + shuffled answers (no isCorrect)
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subjectId, lessonId, quizType } = body as {
      userId: string;
      subjectId: string;
      lessonId?: string;
      quizType?: string;
    };

    if (!userId || !subjectId) {
      return NextResponse.json(
        { error: "userId and subjectId are required" },
        { status: 400 }
      );
    }

    const type = quizType || "lesson_quiz";
    const questionLimit = type === "subject_test" ? 10 : type === "lesson_quiz" ? 5 : 10;

    // Fetch questions
    const whereClause: Record<string, unknown> = {
      subjectId,
      isActive: true,
      ...(lessonId ? { lessonId } : {}),
    };

    const questions = await db.question.findMany({
      where: whereClause,
      include: {
        answers: {
          orderBy: { sortOrder: "asc" },
        },
      },
      take: questionLimit,
      orderBy: { createdAt: "asc" },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions available for this quiz" },
        { status: 400 }
      );
    }

    // Create the quiz attempt
    const attempt = await db.quizAttempt.create({
      data: {
        userId,
        subjectId,
        lessonId: lessonId ?? null,
        quizType: type,
        totalQuestions: questions.length,
        status: "in_progress",
        startedAt: new Date(),
      },
    });

    // Shuffle answers for each question (Fisher-Yates)
    const shuffledQuestions = questions.map((q) => {
      const shuffledAnswers = [...q.answers];
      for (let i = shuffledAnswers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAnswers[i], shuffledAnswers[j]] = [
          shuffledAnswers[j],
          shuffledAnswers[i],
        ];
      }
      return {
        id: q.id,
        questionText: q.questionText,
        questionType: q.questionType,
        difficulty: q.difficulty,
        points: q.points,
        hintText: q.hintText,
        relatedConceptId: q.relatedConceptId,
        answers: shuffledAnswers.map((a) => ({
          id: a.id,
          content: a.content,
        })),
      };
    });

    return NextResponse.json({
      data: {
        attempt: {
          id: attempt.id,
          userId: attempt.userId,
          subjectId: attempt.subjectId,
          lessonId: attempt.lessonId,
          quizType: attempt.quizType,
          totalQuestions: attempt.totalQuestions,
          status: attempt.status,
          startedAt: attempt.startedAt,
        },
        questions: shuffledQuestions,
      },
    });
  } catch (error) {
    console.error("[POST /api/quiz/start] Error:", error);
    return NextResponse.json(
      { error: "Failed to start quiz" },
      { status: 500 }
    );
  }
}