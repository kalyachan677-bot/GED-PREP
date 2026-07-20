"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  BarChart3,
  ChevronRight,
  Layers,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Subject {
  id: string;
  code: string;
  title: string;
  description: string;
  iconUrl: string;
  colorHex: string;
  sortOrder: number;
  _count: { modules: number; topics: number; lessons: number };
}

interface Lesson {
  id: string;
  title: string;
  slug: string;
  contentType: string;
  durationMinutes: number;
  sortOrder: number;
  status: string;
  bodyContent: string;
  topic?: { id: string; title: string };
  module?: { id: string; title: string };
  subject?: { id: string; title: string; code: string };
  questions?: Question[];
}

interface Question {
  id: string;
  questionType: string;
  difficulty: string;
  explanation?: string;
  hintText?: string;
  answers?: Answer[];
}

interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
  sortOrder: number;
}

interface QuizAttempt {
  id: string;
  status: string;
  quizType: string;
  scorePercent: number;
  totalQuestions: number;
  correctCount: number;
  completedAt: string | null;
  subject?: { title: string; code: string };
}

interface ProgressData {
  totalLessons: number;
  completedLessons: number;
  completionPct: number;
  perSubject: Array<{
    subject: { title: string; code: string; colorHex: string };
    totalLessons: number;
    completed: number;
    avgScore: number;
    attemptsCount: number;
  }>;
  recentAttempts: QuizAttempt[];
  dueFlashcardsCount: number;
  readinessScore: unknown;
}

/* ------------------------------------------------------------------ */
/*  Subject color map                                                 */
/* ------------------------------------------------------------------ */
const SUBJECT_ICONS: Record<string, string> = {
  math: "🧮",
  science: "🔬",
  rla: "📖",
  ss: "🏛️",
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function DashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Lesson | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"home" | "lesson">("home");

  /* ---- fetch subjects ---- */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/subjects");
        const json = await res.json();
        if (json.data) setSubjects(json.data);

        const pRes = await fetch("/api/progress?userId=demo");
        const pJson = await pRes.json();
        if (pJson.data) setProgress(pJson.data);
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  /* ---- fetch lesson detail ---- */
  async function openLesson(lessonId: string) {
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const json = await res.json();
      if (json.data) {
        setSelectedSubject(json.data);
        setTab("lesson");
      }
    } catch (e) {
      console.error("Failed to load lesson", e);
    }
  }

  function goHome() {
    setTab("home");
    setSelectedSubject(null);
  }

  /* ---- helpers ---- */
  function parseBody(content: string) {
    try {
      return JSON.parse(content) as Array<{
        id: string;
        block_type: string;
        content?: string;
        level?: number;
        items?: string[];
        callout?: { variant: string; title: string; body: string };
      }>;
    } catch {
      return [];
    }
  }

  /* ================================================================ */
  /*  RENDER                                                            */
  /* ================================================================ */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ---- Lesson Detail View ---- */
  if (tab === "lesson" && selectedSubject) {
    const blocks = parseBody(selectedSubject.bodyContent);
    const questions = selectedSubject.questions || [];

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm px-4 py-3">
          <div className="mx-auto flex max-w-4xl items-center gap-3">
            <button
              onClick={goHome}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
            >
              ← Dashboard
            </button>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <span className="text-sm text-gray-500">
              {selectedSubject.subject?.title}
            </span>
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <span className="text-sm font-medium">
              {selectedSubject.title}
            </span>
          </div>
        </header>

        <main className="mx-auto max-w-4xl px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedSubject.title}
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />{" "}
              {selectedSubject.durationMinutes} min
            </span>
            <Badge variant="secondary">{selectedSubject.contentType}</Badge>
            {selectedSubject.topic && (
              <span>Module: {selectedSubject.topic.title}</span>
            )}
          </div>

          {/* Lesson content blocks */}
          <div className="mt-6 space-y-4">
            {blocks.map((block) => {
              if (block.block_type === "heading") {
                const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                const className =
                  block.level === 2
                    ? "text-xl font-semibold text-gray-900 mt-6 mb-2"
                    : "text-lg font-medium text-gray-800 mt-4 mb-1";
                return (
                  <Tag key={block.id} className={className}>
                    {block.content}
                  </Tag>
                );
              }

              if (block.block_type === "paragraph") {
                return (
                  <p
                    key={block.id}
                    className="text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.content || "" }}
                  />
                );
              }

              if (block.block_type === "callout" && block.callout) {
                const colors: Record<string, string> = {
                  tip: "border-emerald-200 bg-emerald-50",
                  warning: "border-amber-200 bg-amber-50",
                  info: "border-sky-200 bg-sky-50",
                  formula: "border-violet-200 bg-violet-50",
                  remember: "border-blue-200 bg-blue-50",
                  example: "border-orange-200 bg-orange-50",
                };
                return (
                  <div
                    key={block.id}
                    className={`rounded-lg border-l-4 p-4 ${colors[block.callout.variant] || colors.info}`}
                  >
                    {block.callout.title && (
                      <p className="font-semibold text-gray-900 text-sm">
                        {block.callout.title}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                      {block.callout.body}
                    </p>
                  </div>
                );
              }

              if (block.block_type === "numbered_list" && block.items) {
                return (
                  <ol key={block.id} className="list-decimal pl-5 space-y-1 text-gray-700">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ol>
                );
              }

              if (block.block_type === "bullet_list" && block.items) {
                return (
                  <ul key={block.id} className="list-disc pl-5 space-y-1 text-gray-700">
                    {block.items.map((item, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{ __html: item }}
                      />
                    ))}
                  </ul>
                );
              }

              return null;
            })}
          </div>

          {/* Quiz section */}
          {questions.length > 0 && (
            <div className="mt-10 border-t pt-8">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Lesson Quiz ({questions.length} questions)
                </h2>
              </div>
              <div className="space-y-4">
                {questions.map((q, i) => (
                  <Card key={q.id}>
                    <CardContent className="pt-4">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Question {i + 1}{" "}
                        <Badge variant="outline" className="ml-2 text-xs">
                          {q.difficulty}
                        </Badge>
                      </p>
                      <p className="font-medium text-gray-900">{q.explanation || "Solve the given problem."}</p>
                      {q.answers && (
                        <div className="mt-3 space-y-1.5">
                          {q.answers.map((a) => (
                            <div
                              key={a.id}
                              className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
                            >
                              <span className="flex h-5 w-5 items-center justify-center rounded border text-xs">
                                {a.sortOrder + 1}
                              </span>
                              <span className="text-gray-700">{a.content}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  /* ---- Dashboard Home ---- */
  const completionPct = progress?.completionPct || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-lg font-bold text-white">
              G
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">GED Prep Platform</h1>
              <p className="text-xs text-gray-500">
                Your study dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>Loop 2 — API Base Active</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Stats row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {completionPct}%
                  </p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <Progress value={completionPct} className="mt-3 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Lessons</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progress?.totalLessons || 0}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-sky-500" />
              </div>
              <p className="mt-3 text-xs text-gray-400">
                {progress?.completedLessons || 0} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Due Flashcards</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progress?.dueFlashcardsCount || 0}
                  </p>
                </div>
                <Layers className="h-8 w-8 text-amber-500" />
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Ready for review now
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Quiz Attempts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {progress?.recentAttempts?.length || 0}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-violet-500" />
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Recent practice sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Subjects grid */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            📚 GED Subjects
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {subjects.map((subject) => {
              const subjectProgress = progress?.perSubject?.find(
                (p) => p.subject.code === subject.code
              );
              return (
                <Card
                  key={subject.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  style={{ borderLeft: `4px solid ${subject.colorHex}` }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {SUBJECT_ICONS[subject.code] || "📘"}
                        </span>
                        <div>
                          <CardTitle className="text-base">
                            {subject.title}
                          </CardTitle>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {subject._count.lessons} lessons ·{" "}
                            {subject._count.topics} topics
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-300" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {subject.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        {subject._count.modules} modules
                      </span>
                      {subjectProgress && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {subjectProgress.attemptsCount} attempts
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Quiz Attempts */}
        {progress?.recentAttempts && progress.recentAttempts.length > 0 && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              📊 Recent Quiz Attempts
            </h2>
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  {progress.recentAttempts.slice(0, 5).map((attempt) => (
                    <div
                      key={attempt.id}
                      className="flex items-center justify-between rounded-lg border px-4 py-3"
                    >
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          {attempt.subject?.title || "Unknown Subject"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attempt.quizType} · {attempt.totalQuestions} questions
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            attempt.scorePercent >= 80
                              ? "text-emerald-600"
                              : attempt.scorePercent >= 60
                                ? "text-amber-600"
                                : "text-red-500"
                          }`}
                        >
                          {attempt.scorePercent.toFixed(0)}%
                        </p>
                        <p className="text-xs text-gray-400">
                          {attempt.correctCount}/{attempt.totalQuestions} correct
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Endpoints Info */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            🔗 Loop 2 — API Endpoints
          </h2>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2 font-mono text-sm">
                {[
                  { method: "GET", path: "/api/subjects", desc: "All subjects with counts" },
                  { method: "GET", path: "/api/subjects/:id", desc: "Full subject tree" },
                  { method: "GET", path: "/api/lessons/:id", desc: "Lesson detail + quiz" },
                  { method: "POST", path: "/api/quiz/attempt", desc: "Start quiz attempt" },
                  { method: "POST", path: "/api/quiz/attempt/submit", desc: "Submit & grade" },
                  { method: "GET", path: "/api/progress?userId=xxx", desc: "Dashboard data" },
                  { method: "GET", path: "/api/flashcards/due?userId=xxx", desc: "Due flashcards" },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    className="flex items-center gap-3 rounded-md bg-gray-50 px-3 py-2"
                  >
                    <Badge
                      variant={
                        ep.method === "GET" ? "secondary" : "default"
                      }
                    >
                      {ep.method}
                    </Badge>
                    <span className="text-gray-800">{ep.path}</span>
                    <span className="text-gray-400 ml-auto text-xs">
                      {ep.desc}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}