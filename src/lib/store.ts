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

export type ViewState =
  | "login"
  | "register"
  | "dashboard"
  | "subject"
  | "lesson"
  | "quiz"
  | "quiz-result";

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------
interface AppStore {
  // Navigation
  view: ViewState;
  setView: (view: ViewState) => void;

  // Auth
  user: User | null;
  setUser: (user: User | null) => void;

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

export const useAppStore = create<AppStore>((set) => ({
  view: "login",
  setView: (view) => set({ view }),

  user: null,
  setUser: (user) => set({ user }),

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
      selectedSubject: null,
      selectedLesson: null,
      quizAttempt: null,
      quizQuestions: [],
      quizResult: null,
    }),
}));