import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// ---------------------------------------------------------------------------
// POST /api/quiz/attempt/submit — Submit answers for grading
// Body: { attemptId, answers: [{ questionId, selectedAnswerIds: string[], timeSpentSecs }] }
// ---------------------------------------------------------------------------

interface SubmitAnswer {
  questionId: string
  selectedAnswerIds: string[]
  timeSpentSecs?: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { attemptId, answers } = body as {
      attemptId: string
      answers: SubmitAnswer[]
    }

    if (!attemptId || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'attemptId and answers are required' },
        { status: 400 }
      )
    }

    // Fetch the attempt
    const attempt = await db.quizAttempt.findUnique({
      where: { id: attemptId },
    })

    if (!attempt) {
      return NextResponse.json({ error: 'Quiz attempt not found' }, { status: 404 })
    }

    if (attempt.status !== 'in_progress') {
      return NextResponse.json(
        { error: `Quiz attempt is already ${attempt.status}` },
        { status: 400 }
      )
    }

    // Fetch all correct answers for the questions in this submission
    const questionIds = answers.map((a) => a.questionId)
    const correctAnswers = await db.answer.findMany({
      where: {
        questionId: { in: questionIds },
      },
      select: {
        id: true,
        questionId: true,
        isCorrect: true,
        content: true,
        explanation: true,
        sortOrder: true,
      },
    })

    // Build a map: questionId -> array of correct answer IDs
    const correctAnswerMap: Record<string, string[]> = {}
    const answerDetailsMap: Record<string, { id: string; content: string; explanation: string | null; sortOrder: number }[]> = {}
    for (const answer of correctAnswers) {
      if (!correctAnswerMap[answer.questionId]) {
        correctAnswerMap[answer.questionId] = []
        answerDetailsMap[answer.questionId] = []
      }
      if (answer.isCorrect) {
        correctAnswerMap[answer.questionId].push(answer.id)
      }
      answerDetailsMap[answer.questionId].push({
        id: answer.id,
        content: answer.content,
        explanation: answer.explanation,
        sortOrder: answer.sortOrder,
      })
    }

    // Grade each answer
    let totalCorrect = 0
    let totalTimeSpent = 0
    const gradedAnswers: {
      questionId: string
      selectedAnswerIds: string[]
      correctAnswerIds: string[]
      isCorrect: boolean
      timeSpentSecs: number
      allAnswers: { id: string; content: string; explanation: string | null; sortOrder: number; isCorrect: boolean }[]
    }[] = []

    // Use a transaction for atomicity
    const result = await db.$transaction(async (tx) => {
      const createdAnswers = []

      for (const answer of answers) {
        const correctIds = correctAnswerMap[answer.questionId] ?? []
        const allAnswerDetails = (answerDetailsMap[answer.questionId] ?? []).map((a) => ({
          ...a,
          isCorrect: correctIds.includes(a.id),
        }))

        // Determine correctness:
        // - Sort both arrays for comparison
        const selectedSorted = [...answer.selectedAnswerIds].sort()
        const correctSorted = [...correctIds].sort()
        const isCorrect =
          selectedSorted.length === correctSorted.length &&
          selectedSorted.every((id, idx) => id === correctSorted[idx])

        if (isCorrect) totalCorrect++
        totalTimeSpent += answer.timeSpentSecs ?? 0

        createdAnswers.push(
          tx.quizAttemptAnswer.create({
            data: {
              attemptId,
              questionId: answer.questionId,
              selectedAnswerIds: JSON.stringify(answer.selectedAnswerIds),
              isCorrect,
              timeSpentSecs: answer.timeSpentSecs ?? 0,
              answeredAt: new Date(),
            },
          })
        )

        gradedAnswers.push({
          questionId: answer.questionId,
          selectedAnswerIds: answer.selectedAnswerIds,
          correctAnswerIds: correctIds,
          isCorrect,
          timeSpentSecs: answer.timeSpentSecs ?? 0,
          allAnswers: allAnswerDetails,
        })
      }

      await Promise.all(createdAnswers)

      // Calculate final score
      const totalQuestions = answers.length
      const scorePercent = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 10000) / 100 : 0

      // Update the quiz attempt
      const updatedAttempt = await tx.quizAttempt.update({
        where: { id: attemptId },
        data: {
          status: 'completed',
          correctCount: totalCorrect,
          scorePercent,
          timeSpentSecs: totalTimeSpent,
          completedAt: new Date(),
        },
      })

      return updatedAttempt
    })

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
    })
  } catch (error) {
    console.error('[POST /api/quiz/attempt/submit] Error:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz attempt' },
      { status: 500 }
    )
  }
}