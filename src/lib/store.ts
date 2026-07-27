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
  lockThreshold: number | null;   // GED score (150/175) — mapped to %
  unlockThreshold: number | null; // GED score (155/180) — mapped to %
  dailyQuizRequired: boolean;
  flashcardRequired: boolean;
  missPenaltyDays: number;
  scoreDeductionOnMiss: boolean;
  hardModeOnMiss: boolean;
  doubleScheduleOnFail: boolean;
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
      iconEmoji: "\u{1F33F}",
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
      iconEmoji: "\u26A1",
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
    iconEmoji: "\u{1F525}",
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

// ---------------------------------------------------------------------------
// Rigor Helper: compute locked lesson IDs based on rigor rules
// ---------------------------------------------------------------------------
export function computeRigorLockedLessons(
  subject: SubjectFull,
  rigorConfig: RigorConfig | null,
  recentQuizScores: number[] // scorePercent values (0-100)
): Set<string> {
  const locked = new Set<string>();
  if (!rigorConfig) return locked;

  const modules = subject.modules;

  // Rule for ALL levels: lock next module if current module has incomplete lessons
  for (let mi = 1; mi < modules.length; mi++) {
    // Check all previous modules for completion
    let anyPrevIncomplete = false;
    for (let prev = 0; prev < mi; prev++) {
      const prevLessons = modules[prev].topics.flatMap((t) => t.lessons);
      const allDone = prevLessons.every((l) => l.progress?.isCompleted);
      if (!allDone) {
        anyPrevIncomplete = true;
        break;
      }
    }
    if (anyPrevIncomplete) {
      const modLessons = modules[mi].topics.flatMap((t) => t.lessons);
      modLessons.forEach((l) => locked.add(l.id));
    }
  }

  // Level 2+: If recent quiz score is below lock threshold → lock ALL remaining incomplete lessons
  if (rigorConfig.lockThreshold !== null && recentQuizScores.length > 0) {
    // Convert GED score threshold to percentage: 150/200 = 75%
    const lockPct = (rigorConfig.lockThreshold / 200) * 100;
    const latestScore = recentQuizScores[0];
    if (latestScore < lockPct) {
      modules.forEach((mod) => {
        mod.topics.forEach((topic) => {
          topic.lessons.forEach((lesson) => {
            if (!lesson.progress?.isCompleted) locked.add(lesson.id);
          });
        });
      });
    }
  }

  return locked;
}

// ---------------------------------------------------------------------------
// Rigor Daily Tracking (localStorage)
// ---------------------------------------------------------------------------
const RIGOR_KEY = "ged-rigor-tracking";

export interface RigorDailyState {
  lastLoginDate: string; // YYYY-MM-DD
  consecutiveMissDays: number;
  disciplineScore: number; // 100 start, level 3 only
  vocabDoneToday: Record<string, boolean>; // { subjectId: true }
  quizDoneToday: boolean;
  doubleScheduleToday: boolean; // level 3: double load
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadRigorState(): RigorDailyState {
  if (typeof window === "undefined") {
    return {
      lastLoginDate: todayStr(),
      consecutiveMissDays: 0,
      disciplineScore: 100,
      vocabDoneToday: {},
      quizDoneToday: false,
      doubleScheduleToday: false,
    };
  }
  try {
    const raw = localStorage.getItem(RIGOR_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    lastLoginDate: "",
    consecutiveMissDays: 0,
    disciplineScore: 100,
    vocabDoneToday: {},
    quizDoneToday: false,
    doubleScheduleToday: false,
  };
}

function saveRigorState(s: RigorDailyState) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(RIGOR_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

/** Call on login — handles day rollover, miss counting, discipline deduction */
export function recordDailyLogin(rigorConfig: RigorConfig | null): RigorDailyState {
  const state = loadRigorState();
  const today = todayStr();

  // Same day — no change
  if (state.lastLoginDate === today) return state;

  // Calculate days missed
  const lastDate = state.lastLoginDate ? new Date(state.lastLoginDate) : null;
  let missed = 0;
  if (lastDate) {
    const diffMs = new Date(today).getTime() - lastDate.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    missed = diffDays - 1; // If logged in yesterday, missed = 0
  }

  let newMissDays = missed > 0 ? state.consecutiveMissDays + missed : 0;
  let newDiscipline = state.disciplineScore;

  // Level 3: deduct discipline for any missed day
  if (rigorConfig && rigorConfig.scoreDeductionOnMiss && missed > 0) {
    newDiscipline = Math.max(0, newDiscipline - missed * 10); // -10 per missed day
  }

  // Check if we need double schedule (level 3: after low mock exam)
  const newDouble = state.doubleScheduleToday;

  const updated: RigorDailyState = {
    lastLoginDate: today,
    consecutiveMissDays: newMissDays,
    disciplineScore: newDiscipline,
    vocabDoneToday: {}, // Reset daily tasks
    quizDoneToday: false,
    doubleScheduleToday: newDouble,
  };
  saveRigorState(updated);
  return updated;
}

export function markVocabDoneForSubject(subjectId: string) {
  const state = loadRigorState();
  if (state.lastLoginDate !== todayStr()) return; // Don't mark for old days
  state.vocabDoneToday[subjectId] = true;
  saveRigorState(state);
}

export function markQuizDone() {
  const state = loadRigorState();
  if (state.lastLoginDate !== todayStr()) return;
  state.quizDoneToday = true;
  saveRigorState(state);
}

export function setDoubleSchedule(enabled: boolean) {
  const state = loadRigorState();
  state.doubleScheduleToday = enabled;
  saveRigorState(state);
}

export function deductDiscipline(amount: number) {
  const state = loadRigorState();
  state.disciplineScore = Math.max(0, state.disciplineScore - amount);
  saveRigorState(state);
  return state.disciplineScore;
}

export function getRigorWarnings(rigorConfig: RigorConfig | null, rigorState: RigorDailyState): string[] {
  if (!rigorConfig) return [];
  const warnings: string[] = [];

  // Missed days warning
  if (rigorState.consecutiveMissDays >= rigorConfig.missPenaltyDays && rigorConfig.missPenaltyDays > 0) {
    if (rigorConfig.level === 1) {
      warnings.push(`\u26A0\uFE0F คุณไม่เข้าเรียน ${rigorState.consecutiveMissDays} วันติดกันแล้ว อย่าทิ้งไปนะ!`);
    } else {
      warnings.push(`\u{1F6A8} ขาดเรียน ${rigorState.consecutiveMissDays} วันติดกัน — ${rigorConfig.scoreDeductionOnMiss ? "คะแนนวินัยถูกตัด" : "ต้องทำแบบฝึกเพิ่มเติม"}`);
    }
  }

  // Daily requirements not met (level 2+)
  if (rigorConfig.level >= 2) {
    const subjectsWithVocab = Object.keys(rigorState.vocabDoneToday).length;
    if (rigorConfig.flashcardRequired && subjectsWithVocab < 4) {
      warnings.push(`\u{1F4DA} ต้องทบทวน Flashcards ทุกวัน (ทำแล้ว ${subjectsWithVocab}/4 วิชา)`);
    }
    if (rigorConfig.dailyQuizRequired && !rigorState.quizDoneToday) {
      warnings.push(`\u{1F9EA} ยังไม่ได้ทำแบบทดสอบประจำวัน`);
    }
  }

  // Discipline score warning (level 3)
  if (rigorConfig.level === 3 && rigorState.disciplineScore < 80) {
    warnings.push(`\u{1F525} คะแนนวินัยต่ำ (${rigorState.disciplineScore}/100) — ต้องปรับปรุงทันที`);
  }

  // Double schedule (level 3)
  if (rigorConfig.doubleScheduleOnFail && rigorState.doubleScheduleToday) {
    warnings.push(`\u{1F504} โหมดชดเชย 2x เท่าวันนี้ — ตารางเรียนเพิ่มเติม`);
  }

  return warnings;
}

// ---------------------------------------------------------------------------
// View / Language Types
// ---------------------------------------------------------------------------
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
  translationCache: Record<string, Record<string, string>>;
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

  // Rigor daily state (reactive — updated on login)
  rigorState: RigorDailyState | null;
  setRigorState: (s: RigorDailyState | null) => void;

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

  // Pending subject navigation
  pendingSubjectNav: { code: string; navFn: () => void } | null;
  setPendingSubjectNav: (nav: { code: string; navFn: () => void } | null) => void;

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
    const scoreTarget = user?.scoreTarget ?? null;
    const rigorConfig = getRigorConfig(scoreTarget);
    const showScoreTargetModal = user !== null && scoreTarget === null;

    // Record daily login & get rigor state
    let rigorState: RigorDailyState | null = null;
    if (user && typeof window !== "undefined") {
      rigorState = recordDailyLogin(rigorConfig);
    }

    set({ user, scoreTarget, rigorConfig, showScoreTargetModal, rigorState });
  },

  scoreTarget: null,
  setScoreTarget: (target) => {
    const rigorConfig = getRigorConfig(target);
 set({ scoreTarget: target, rigorConfig, showScoreTargetModal: false });
  },

  rigorConfig: null,
  showScoreTargetModal: false,
  setShowScoreTargetModal: (show) => set({ showScoreTargetModal: show }),

  rigorState: null,
  setRigorState: (s) => set({ rigorState: s }),

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

  pendingSubjectNav: null,
  setPendingSubjectNav: (nav) => set({ pendingSubjectNav: nav }),

  logout: () =>
    set({
      user: null,
      view: "login",
      scoreTarget: null,
      rigorConfig: null,
      rigorState: null,
      showScoreTargetModal: false,
      selectedSubject: null,
      selectedLesson: null,
      quizAttempt: null,
      quizQuestions: [],
      quizResult: null,
      pendingSubjectNav: null,
    }),
}));