import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// Simple ID generator for edge runtime
function genId(): string {
  const a = "abcdefghijklmnopqrstuvwxyz0123456789";
  const ts = Math.floor(Date.now() / 1000).toString(36);
  let id = ts;
  for (let i = id.length; i < 25; i++) id += a[Math.floor(Math.random() * a.length)];
  return id;
}

function esc(val: string | null | undefined): string {
  if (val == null) return "NULL";
  return "'" + String(val).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
}

// Minimal question seed data for emergency reseed (math subset)
const EMERGENCY_QUESTIONS: Record<string, { questionText: string; answers: [string, boolean][]; difficulty: string; explanation: string }[]> = {
  math: [
    { questionText: "Which of the following is a linear equation?", answers: [["3x + 5 = 17", true], ["x^2 + 2x = 8", false], ["1/x + 3 = 7", false], ["sqrt(x) = 4", false]], difficulty: "easy", explanation: "A linear equation has variables only to the first power." },
    { questionText: "Solve for x: 4(x - 2) = 20", answers: [["7", true], ["5", false], ["8", false], ["6", false]], difficulty: "medium", explanation: "Distribute: 4x - 8 = 20. Add 8: 4x = 28. x = 7." },
    { questionText: "What is the mean of 4, 8, 12, 16?", answers: [["10", true], ["12", false], ["8", false], ["14", false]], difficulty: "easy", explanation: "Mean = (4+8+12+16)/4 = 40/4 = 10." },
    { questionText: "What is 25% of 200?", answers: [["50", true], ["25", false], ["75", false], ["100", false]], difficulty: "easy", explanation: "25% x 200 = 0.25 x 200 = 50." },
    { questionText: "If f(x) = 2x + 3, what is f(4)?", answers: [["11", true], ["8", false], ["10", false], ["14", false]], difficulty: "easy", explanation: "f(4) = 2(4) + 3 = 8 + 3 = 11." },
  ],
  science: [
    { questionText: "What is the powerhouse of the cell?", answers: [["Mitochondria", true], ["Nucleus", false], ["Ribosome", false], ["Endoplasmic reticulum", false]], difficulty: "easy", explanation: "Mitochondria produce ATP energy through cellular respiration." },
    { questionText: "Which organelle contains the cell's genetic material?", answers: [["Nucleus", true], ["Mitochondria", false], ["Cytoplasm", false], ["Cell membrane", false]], difficulty: "easy", explanation: "The nucleus stores DNA and controls cell activities." },
    { questionText: "Newton's First Law is also called the Law of:", answers: [["Inertia", true], ["Acceleration", false], ["Action-Reaction", false], ["Gravity", false]], difficulty: "easy", explanation: "An object at rest stays at rest unless acted upon by a force." },
    { questionText: "DNA stands for:", answers: [["Deoxyribonucleic acid", true], ["Dinitrogen acid", false], ["Deoxyribose nitrogen acid", false], ["Dynamic nucleic acid", false]], difficulty: "easy", explanation: "DNA = Deoxyribonucleic acid." },
    { questionText: "In a chemical reaction, reactants are:", answers: [["The substances that start the reaction", true], ["The substances produced", false], ["The energy released", false], ["The catalyst used", false]], difficulty: "easy", explanation: "Reactants are the starting materials in a chemical reaction." },
  ],
  rla: [
    { questionText: "Which of the following best defines 'inference'?", answers: [["A conclusion based on evidence and reasoning", true], ["A direct statement of fact", false], ["A comparison using like or as", false], ["The main idea of a passage", false]], difficulty: "easy", explanation: "An inference is a conclusion reached from evidence." },
    { questionText: "What is the purpose of a transition word?", answers: [["To connect ideas between sentences and paragraphs", true], ["To replace nouns", false], ["To indicate the title of a work", false], ["To create rhyming patterns", false]], difficulty: "easy", explanation: "Transition words help connect and flow between ideas." },
    { questionText: "Which sentence is a fragment?", answers: [["Because she was late.", true], ["She was late because of traffic.", false], ["The dog barked loudly.", false], ["I enjoy reading books.", false]], difficulty: "easy", explanation: "A fragment lacks a complete thought - 'Because she was late' is a dependent clause." },
    { questionText: "What is the author's purpose in a persuasive essay?", answers: [["To convince the reader to agree with a viewpoint", true], ["To entertain with a story", false], ["To list facts only", false], ["To describe a process", false]], difficulty: "easy", explanation: "Persuasive writing aims to convince the reader." },
    { questionText: "Which is an example of a metaphor?", answers: [["Time is money", true], ["She runs like the wind", false], ["He is as strong as an ox", false], ["The flower smells sweet", false]], difficulty: "medium", explanation: "A metaphor directly compares two things without using like or as." },
  ],
  ss: [
    { questionText: "What does the Bill of Rights protect?", answers: [["Individual freedoms and civil liberties", true], ["Only property rights", false], ["Only voting rights", false], ["Only state governments", false]], difficulty: "easy", explanation: "The Bill of Rights protects fundamental freedoms like speech, religion, and due process." },
    { questionText: "Which branch of government interprets laws?", answers: [["Judicial Branch", true], ["Legislative Branch", false], ["Executive Branch", false], ["Military Branch", false]], difficulty: "easy", explanation: "The judicial branch, headed by the Supreme Court, interprets laws." },
    { questionText: "What is inflation?", answers: [["A general increase in prices over time", true], ["A decrease in population", false], ["An increase in wages only", false], ["A decrease in taxes", false]], difficulty: "easy", explanation: "Inflation is when the general price level of goods and services rises." },
    { questionText: "The three branches of U.S. government are:", answers: [["Legislative, Executive, Judicial", true], ["Senate, House, President", false], ["Federal, State, Local", false], ["Democratic, Republican, Independent", false]], difficulty: "easy", explanation: "The U.S. government has three branches: Legislative, Executive, and Judicial." },
    { questionText: "What is the purpose of checks and balances?", answers: [["To prevent any one branch from becoming too powerful", true], ["To speed up lawmaking", false], ["To increase the president's power", false], ["To eliminate political parties", false]], difficulty: "easy", explanation: "Checks and balances limit each branch's power to prevent tyranny." },
  ],
};

// Map subjectId -> subject code (cached across requests in edge)
let codeCache: Map<string, string> | null = null;
async function getSubjectCode(subjectId: string): Promise<string | undefined> {
  if (!codeCache) {
    const subjects = await db.subject.findMany({ select: { id: true, code: true } });
    codeCache = new Map(subjects.map((s) => [s.id, s.code]));
  }
  return codeCache.get(subjectId);
}

// Emergency reseed: insert minimum questions directly if DB is empty
async function emergencyReseed(subjectId: string): Promise<number> {
  try {
    const code = await getSubjectCode(subjectId);
    if (!code || !EMERGENCY_QUESTIONS[code]) return 0;

    const qRows: string[] = [];
    const aRows: string[] = [];

    for (const q of EMERGENCY_QUESTIONS[code]) {
      const qId = genId();
      qRows.push(
        `('${qId}',NULL,'${subjectId}','multiple_choice','${q.difficulty}',1,${esc(q.questionText)},${esc(q.explanation)},NULL,true,NULL,'[]',NULL,NOW(),NOW())`
      );
      for (let i = 0; i < q.answers.length; i++) {
        const [content, isCorrect] = q.answers[i];
        aRows.push(`('${genId()}','${qId}',${esc(content)},${isCorrect},${i},NULL,NOW())`);
      }
    }

    const Q_COLS = `"id","lessonId","subjectId","questionType","difficulty","points","questionText","explanation","hintText","isActive","sourceTag","tags","relatedConceptId","createdAt","updatedAt"`;
    await db.$executeRawUnsafe(`INSERT INTO "Question" (${Q_COLS}) VALUES ${qRows.join(",")}`);
    const A_COLS = `"id","questionId","content","isCorrect","sortOrder","explanation","createdAt"`;
    await db.$executeRawUnsafe(`INSERT INTO "Answer" (${A_COLS}) VALUES ${aRows.join(",")}`);

    console.log(`[quiz/start] Emergency reseeded ${qRows.length} questions for ${code}`);
    return qRows.length;
  } catch (e) {
    console.error("[quiz/start] Emergency reseed failed:", e);
    return 0;
  }
}

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

    let questions = await db.question.findMany({
      where: whereClause,
      include: {
        answers: {
          orderBy: { sortOrder: "asc" },
        },
      },
      take: questionLimit,
      orderBy: { createdAt: "asc" },
    });

    // ★ AUTO-RESEED: If no questions found, trigger emergency reseed and retry
    if (questions.length === 0) {
      console.log(`[quiz/start] No questions found for subject ${subjectId}, attempting emergency reseed...`);
      const seeded = await emergencyReseed(subjectId);
      if (seeded > 0) {
        questions = await db.question.findMany({
          where: whereClause,
          include: { answers: { orderBy: { sortOrder: "asc" } } },
          take: questionLimit,
          orderBy: { createdAt: "asc" },
        });
      }
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { error: "No questions available for this quiz. Please try again or contact support." },
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