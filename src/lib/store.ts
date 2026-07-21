import { create } from "zustand";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  role: string;
  status: string;
  scoreTarget?: number | null;
}

export interface SubjectSummary {
  id: string;
  code: string;
  title: string;
  description?: string;
  colorHex: string;
  totalLessons: number;
  completedLessons: number;
  completionPct: number;
  avgScore: number;
  totalAttempts: number;
  recentAttempts: { id: string; scorePercent: number; correctCount: number; totalQuestions: number; quizType: string; startedAt: string; completedAt: string | null }[];
}

export interface LessonWithProgress {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  durationMinutes: number;
  sortOrder: number;
  status: string;
  bodyContent: unknown;
  progress: { isCompleted: boolean; completionPct: number } | null;
}

export interface TopicWithLessons {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  lessons: LessonWithProgress[];
}

export interface ModuleWithTopics {
  id: string;
  title: string;
  description?: string;
  sortOrder: number;
  topics: TopicWithLessons[];
}

export interface SubjectFull {
  id: string;
  code: string;
  title: string;
  description?: string;
  colorHex: string;
  modules: ModuleWithTopics[];
}

export interface LessonDetail {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  durationMinutes: number;
  bodyContent: unknown;
  topic: { id: string; title: string; module: { id: string; title: string; subject: { id: string; title: string; code: string; colorHex: string } } } | null;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  questionText?: string;
  questionType: string;
  difficulty: string;
  points: number;
  hintText?: string;
  answers: { id: string; content: string }[];
}

export interface QuizAttemptData {
  id: string;
  userId: string;
  subjectId: string;
  lessonId: string | null;
  quizType: string;
  totalQuestions: number;
  status: string;
  startedAt: string;
}

export interface QuizAnswerResult {
  questionId: string;
  selectedAnswerIds: string[];
  correctAnswerIds: string[];
  isCorrect: boolean;
  timeSpentSecs: number;
  isFlagged: boolean;
  allAnswers: { id: string; content: string; isCorrect: boolean }[];
  explanation: string;
}

export interface QuizResult {
  attempt: {
    id: string;
    totalQuestions: number;
    correctCount: number;
    scorePercent: number;
    timeSpentSecs: number;
    startedAt: string;
    completedAt: string | null;
  };
  results: QuizAnswerResult[];
}

// ---------------------------------------------------------------------------
// AI Tutor Rigor System Types
// ---------------------------------------------------------------------------
export type RigorLevel = 1 | 2 | 3;

export interface RigorConfig {
  level: RigorLevel;
  label: string;
  shortLabel: string;
  description: string;
  personality: string;
  personalityDesc: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconEmoji: string;
  rules: string[];
  lockThreshold: number | null;   // Quiz score below this triggers lock
  unlockThreshold: number | null; // Must reach this to unlock
  dailyQuizRequired: boolean;
  flashcardRequired: boolean;
  missPenaltyDays: number;        // 0 = no penalty, 1 = 1 day miss = penalty
  scoreDeductionOnMiss: boolean;  // Level 3: deduct discipline score
  hardModeOnMiss: boolean;        // Level 3: inject hard mode quiz on miss
  doubleScheduleOnFail: boolean;  // Level 3: double schedule if mock exam < 175
}

export function getRigorConfig(scoreTarget: number | null | undefined): RigorConfig | null {
  if (!scoreTarget) return null;

  if (scoreTarget >= 145 && scoreTarget <= 160) {
    return {
      level: 1,
      label: "ระดับผ่านเกณฑ์มาตรฐาน",
      shortLabel: "ประคอง",
      description: "เน้นประคองและย้ำคิดย้ำทำ",
      personality: "ใจดีแต่เด็ดขาด",
      personalityDesc: "ติวเตอร์ใจดีแต่เด็ดขาด เน้นความเข้าใจพื้นฐาน คอยเตือนเบาๆ และช่วยให้คุณกลับมาเรียนได้ทุกเมื่อ",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconEmoji: "🌿",
      rules: [
        "ตรวจสอบภารกิจประจำวัน",
        "หากไม่เข้าเรียน 2 วันติดกัน ระบบจะส่ง Notification เตือนเบาๆ",
        "ล็อกเนื้อหาบทถัดไปจนกว่าจะเคลียร์บทเรียนเก่าเสร็จ",
      ],
      lockThreshold: null,
      unlockThreshold: null,
      dailyQuizRequired: false,
      flashcardRequired: false,
      missPenaltyDays: 2,
      scoreDeductionOnMiss: false,
      hardModeOnMiss: false,
      doubleScheduleOnFail: false,
    };
  }

  if (scoreTarget >= 161 && scoreTarget <= 175) {
    return {
      level: 2,
      label: "ระดับคะแนนดีเกียรตินิยม",
      shortLabel: "เข้มงวด",
      description: "เข้มงวด แผนการเรียนชัดเจน",
      personality: "มืออาชีพสายสตริกต์",
      personalityDesc: "ติวเตอร์มืออาชีพสายเข้มงวด พูดตรงประเด็น เน้นจุดผิดพลาด ไม่ปรานี",
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconEmoji: "⚡",
      rules: [
        "บังคับทำโจทย์และทวน Due Flashcards ทุกวัน",
        "คะแนน Quiz ต่ำกว่า 150 = ล็อกบทเรียนถัดไปทันที",
        "บังคับอ่านเนื้อหาจุดอ่อนซ้ำ + ทำแบบทดสอบแก้ตัวใหม่",
        "ต้องทำคะแนนผ่านเกณฑ์ 155 คะแนนจึงจะปลดล็อก",
      ],
      lockThreshold: 150,
      unlockThreshold: 155,
      dailyQuizRequired: true,
      flashcardRequired: true,
      missPenaltyDays: 1,
      scoreDeductionOnMiss: false,
      hardModeOnMiss: false,
      doubleScheduleOnFail: false,
    };
  }

  // 176 - 200
  return {
    level: 3,
    label: "ระดับท็อปประเทศ / College Ready",
    shortLabel: "จอมโหด",
    description: "โหมดจอมโหดเพื่อความเป็นที่หนึ่ง",
    personality: "สถาบันชั้นนำที่เฮี้ยนขั้นสุด",
    personalityDesc: "ติวเตอร์ระดับสถาบันชั้นนำ เฮี้ยนและเข้มงวดขั้นสุด ไม่มีข้อแม้ ต้องเป็นที่ 1",
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    iconEmoji: "🔥",
    rules: [
      "กดข้าม Due Flashcards หรือขาดเรียนแม้แต่คืนเดียว = ตัดคะแนนวินัยทันที",
      "ส่งโจทย์ Hard Mode เข้าขัดจังหวะหน้าจอแอปให้แก้ตัว",
      "ข้อสอบจำลอง < 175 คะแนน = วิเคราะห์จุดอ่อนขยี้จุดผิดตรงไปตรงมา",
      "บังคับตารางเรียนชดเชยเพิ่ม 2 เท่าในวันถัดไป",
      "ไม่มีการยกเว้น ไม่มีข้อแม้ ต้องทำทุกอย่างให้ครบ",
    ],
    lockThreshold: 175,
    unlockThreshold: 180,
    dailyQuizRequired: true,
    flashcardRequired: true,
    missPenaltyDays: 1,
    scoreDeductionOnMiss: true,
    hardModeOnMiss: true,
    doubleScheduleOnFail: true,
  };
}

export type ViewState =
  | "login"
  | "register"
  | "dashboard"
  | "subject"
  | "lesson"
  | "quiz"
  | "quiz-result";

export type AppLanguage = "en" | "th" | "my";

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface AppStore {
  // Navigation
  view: ViewState;
  setView: (view: ViewState) => void;

  // Language / Translation
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  translationCache: Record<string, Record<string, string>>; // { "th": { "orig": "translated" } }
  setTranslationCache: (cache: Record<string, Record<string, string>>) => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

  // Score Target & Rigor
  scoreTarget: number | null;
  setScoreTarget: (target: number | null) => void;
  rigorConfig: RigorConfig | null;
  showScoreTargetModal: boolean;
  setShowScoreTargetModal: (show: boolean) => void;

  // Selected items
  selectedSubject: SubjectFull | null;
  setSelectedSubject: (s: SubjectFull | null) => void;

  selectedLesson: LessonDetail | null;
  setSelectedLesson: (l: LessonDetail | null) => void;

  // Quiz
  quizAttempt: QuizAttemptData | null;
  quizQuestions: QuizQuestion[];
  quizResult: QuizResult | null;
  startQuiz: (attempt: QuizAttemptData, questions: QuizQuestion[]) => void;
  setQuizResult: (result: QuizResult) => void;
  clearQuiz: () => void;

  // Actions
  logout: () => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  view: "login",
  setView: (view) => set({ view }),

  // Language / Translation
  language: (typeof window !== "undefined" ? (localStorage.getItem("ged-lang") as AppLanguage) : null) || "en",
  setLanguage: (lang) => {
    if (typeof window !== "undefined") localStorage.setItem("ged-lang", lang);
    set({ language: lang });
  },
  translationCache: {},
  setTranslationCache: (cache) => set({ translationCache: cache }),

  user: null,
  setUser: (user) => {
    const state = get();
    const scoreTarget = user?.scoreTarget ?? null;
    const rigorConfig = getRigorConfig(scoreTarget);
    // Show modal only if user has no score target set yet
    const showScoreTargetModal = user !== null && scoreTarget === null;
    set({
      user,
      scoreTarget,
      rigorConfig,
      showScoreTargetModal,
    });
  },

  scoreTarget: null,
  setScoreTarget: (target) => {
    const rigorConfig = getRigorConfig(target);
    set({ scoreTarget: target, rigorConfig, showScoreTargetModal: false });
  },

  rigorConfig: null,
  showScoreTargetModal: false,
  setShowScoreTargetModal: (show) => set({ showScoreTargetModal: show }),

  selectedSubject: null,
  setSelectedSubject: (s) => set({ selectedSubject: s }),

  selectedLesson: null,
  setSelectedLesson: (l) => set({ selectedLesson: l }),

  quizAttempt: null,
  quizQuestions: [],
  quizResult: null,
  startQuiz: (attempt, questions) =>
    set({ quizAttempt: attempt, quizQuestions: questions, quizResult: null, view: "quiz" }),
  setQuizResult: (result) => set({ quizResult: result, view: "quiz-result" }),
  clearQuiz: () => set({ quizAttempt: null, quizQuestions: [], quizResult: null }),

  logout: () =>
    set({
      user: null,
      view: "login",
      scoreTarget: null,
      rigorConfig: null,
      showScoreTargetModal: false,
      selectedSubject: null,
      selectedLesson: null,
      quizAttempt: null,
      quizQuestions: [],
      quizResult: null,
    }),
}));