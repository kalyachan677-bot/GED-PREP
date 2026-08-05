"use client";

import { useAppStore, SubjectFull, RigorConfig, computeRigorLockedLessons, getRigorWarnings, markVocabDoneForSubject, markQuizDone, RigorDailyState, loadRigorState } from "@/lib/store";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, BookOpen, RotateCcw, Brain, Play, Lock, ShieldAlert, Flame, Zap, Shield, AlertTriangle, BookCheck, PenTool } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/BackButton";
import { VocabReview } from "./VocabReview";
import { useText } from "@/lib/ui-texts";

const SUBJECT_GRADIENTS: Record<string, string> = {
  math: "from-blue-600 to-cyan-600",
  science: "from-emerald-600 to-teal-600",
  rla: "from-amber-500 to-orange-600",
  ss: "from-rose-500 to-pink-600",
};

const SUBJECT_DESCRIPTION_KEYS: Record<string, string> = {
  math: "mathDesc",
  science: "scienceDesc",
  rla: "rlaDesc",
  ss: "ssDesc",
};

const SUBJECT_ICONS: Record<string, string> = {
  math: "\u{1F9EE}",
  science: "\u{1F52C}",
  rla: "\u{1F4D6}",
  ss: "\u{1F3DB}\uFE0F",
};

export function SubjectView() {
  const { selectedSubject, setView, setSelectedLesson, user, startQuiz, rigorConfig, rigorState, setLessonOrigin } = useAppStore();
  const { tx } = useText();
  const [startingQuiz, setStartingQuiz] = useState(false);
  const [vocabComplete, setVocabComplete] = useState(false);

  if (!selectedSubject) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  const totalLessons = selectedSubject.modules.reduce(
    (sum, m) => sum + m.topics.reduce((s, t) => s + t.lessons.length, 0),
    0
  );
  const completedLessons = selectedSubject.modules.reduce(
    (sum, m) => sum + m.topics.reduce(
      (s, t) => s + t.lessons.filter((l) => l.progress?.isCompleted).length,
      0
    ),
  );
  const grad = SUBJECT_GRADIENTS[selectedSubject.code] || "from-violet-600 to-indigo-600";
  const desc = tx(SUBJECT_DESCRIPTION_KEYS[selectedSubject.code] || "", {});
  const icon = SUBJECT_ICONS[selectedSubject.code] || "\u{1F4DA}";
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ── Rigor: compute locked lessons ──
  const recentScores = useMemo(() => {
    if (!user || typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem("ged-recent-quiz-scores");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }, [user, selectedSubject.id]);

  const lockedLessonIds = useMemo(() => {
    return computeRigorLockedLessons(selectedSubject, rigorConfig, recentScores);
  }, [selectedSubject, rigorConfig, recentScores]);

  // ── Rigor: check if vocab done for this subject today ──
  const vocabDoneToday = rigorState?.vocabDoneToday?.[selectedSubject.id] === true;
  const quizDoneToday = rigorState?.quizDoneToday === true;

  // Level 2+: quiz blocked if vocab not done
  const quizBlockedByVocab = rigorConfig && rigorConfig.level >= 2 && rigorConfig.flashcardRequired && !vocabDoneToday;

  // ── Rigor warnings ──
  const warnings = useMemo(() => {
    if (!rigorConfig || !rigorState) return [];
    return getRigorWarnings(rigorConfig, rigorState);
  }, [rigorConfig, rigorState]);

  async function openLesson(lessonId: string) {
    if (lockedLessonIds.has(lessonId)) return; // BLOCKED by rigor
    setLessonOrigin("subject");
    setView("lesson");
    setSelectedLesson(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const json = await res.json();
      if (json.data) setSelectedLesson(json.data);
    } catch (e) {
      console.error("Failed to load lesson", e);
    }
  }

  function resetVocabProgress() {
    if (!selectedSubject.id) return;
    try {
      localStorage.removeItem(`ged-vocab-${selectedSubject.id}`);
    } catch { /* ignore */ }
    window.location.reload();
  }

  async function handleSubjectQuiz() {
    if (!user || !selectedSubject) return;
    // Rigor: Block quiz if vocab not done (level 2+)
    if (quizBlockedByVocab) return;
    setStartingQuiz(true);
    try {
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          subjectId: selectedSubject.id,
          quizType: "subject_test",
        }),
      });
      const json = await res.json();
      if (json.data?.attempt && Array.isArray(json.data.questions)) {
        startQuiz(json.data.attempt, json.data.questions);
        markQuizDone();
        useAppStore.getState().setRigorState(loadRigorState());
      }
    } catch (e) {
      console.error("Failed to start subject quiz", e);
    } finally {
      setStartingQuiz(false);
    }
  }

  function handleVocabComplete() {
    markVocabDoneForSubject(selectedSubject.id);
    setVocabComplete(true);
    useAppStore.getState().setRigorState(loadRigorState());
  }

  // Check if subject quiz is locked by rigor
  const quizLockedByScore = useMemo(() => {
    if (!rigorConfig || !rigorConfig.lockThreshold || recentScores.length === 0) return false;
    const lockPct = (rigorConfig.lockThreshold / 200) * 100;
    return recentScores[0] < lockPct;
  }, [rigorConfig, recentScores]);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton label={tx("backToDashboard")} onClick={() => { setView("dashboard"); setSelectedSubject(null); }} />
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-slate-400 font-medium">{tx("backToDashboard")}</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-semibold text-slate-800">{selectedSubject.title}</span>
        </div>
      </div>

      {/* ═══════ RIGOR LEVEL BANNER ═══════ */}
      {rigorConfig && (
        <RigorBanner config={rigorConfig} rigorState={rigorState} warnings={warnings} vocabDoneToday={vocabDoneToday} quizDoneToday={quizDoneToday} />
      )}

      {/* Header Card */}
      <div className={`rounded-2xl bg-gradient-to-r ${grad} p-6 text-white shadow-lg overflow-hidden relative`} style={{ borderRadius: "1rem" }}>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-white/5 rounded-full translate-y-1/2" />
        <div className="relative flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <span className="text-4xl mt-0.5">{icon}</span>
            <div className="flex-1">
              <h1 className="text-2xl font-extrabold tracking-tight">{selectedSubject.title}</h1>
              {desc && <p className="mt-2 text-sm text-white/70 font-medium leading-relaxed">{desc}</p>}
            </div>
          </div>
          <button
            onClick={resetVocabProgress}
            className="flex items-center gap-1.5 rounded-xl bg-white/15 hover:bg-white/25 px-3 py-2 text-xs font-medium text-white/80 hover:text-white transition-all active:scale-95 shrink-0"
            title={tx("resetVocabTitle")}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {tx("restart")}
          </button>
        </div>
        <div className="relative mt-4 flex items-center gap-5 text-sm text-white/80 font-medium">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {completedLessons}/{totalLessons} {tx("lessons")}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            {pct}% {tx("completed")}
          </span>
        </div>
        <div className="relative mt-3 h-1.5 w-full rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white/80 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ═══════ Vocab Review ═══════ */}
      {selectedSubject.id && (
        <div>
          <VocabReviewWrapper
            subjectId={selectedSubject.id}
            rigorLevel={rigorConfig?.level ?? null}
            isRequired={rigorConfig?.flashcardRequired ?? false}
            onVocabComplete={handleVocabComplete}
          />
        </div>
      )}

      {/* Subject Quiz Button */}
      <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200/50">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{tx("subjectQuiz")}</p>
              <p className="text-xs text-slate-400 font-medium">{tx("subjectTestDesc")}</p>
            </div>
          </div>
          {quizBlockedByVocab ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-amber-100 border border-amber-200 px-4 py-2.5 self-start sm:self-auto">
              <Lock className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">{tx("flashcardsFirst")}</span>
            </div>
          ) : quizLockedByScore ? (
            <div className="flex items-center gap-1.5 rounded-xl bg-rose-100 border border-rose-200 px-4 py-2.5 self-start sm:self-auto">
              <ShieldAlert className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-semibold text-rose-700">{tx("scoreTooLow")}</span>
            </div>
          ) : (
            <button
              onClick={handleSubjectQuiz}
              disabled={startingQuiz}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-violet-300/50 transition-all active:scale-95 disabled:opacity-50 self-start sm:self-auto"
            >
              {startingQuiz ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {tx("startTest")}
            </button>
          )}
        </div>
      </div>

      {/* Modules — with rigor locking */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">{tx("lessons")}</h2>
        {selectedSubject.modules.map((mod) => (
          <ModuleSection key={mod.id} module={mod} onOpenLesson={openLesson} lockedIds={lockedLessonIds} rigorLevel={rigorConfig?.level ?? null} />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════ RIGOR BANNER ═══════════════ */
function RigorBanner({ config, rigorState, warnings, vocabDoneToday, quizDoneToday }: {
  config: RigorConfig;
  rigorState: import("@/lib/store").RigorDailyState | null;
  warnings: string[];
  vocabDoneToday: boolean;
  quizDoneToday: boolean;
}) {
  const { tx } = useText();
  const levelConfig = {
    1: { bg: "bg-emerald-50", border: "border-emerald-200", icon: <Shield className="h-5 w-5 text-emerald-600" />, badgeBg: "bg-emerald-100 text-emerald-800" },
    2: { bg: "bg-amber-50", border: "border-amber-200", icon: <Zap className="h-5 w-5 text-amber-600" />, badgeBg: "bg-amber-100 text-amber-800" },
    3: { bg: "bg-rose-50", border: "border-rose-200", icon: <Flame className="h-5 w-5 text-rose-600" />, badgeBg: "bg-rose-100 text-rose-800" },
  }[config.level];

  return (
    <div className={`rounded-2xl border-2 ${levelConfig.border} ${levelConfig.bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-5 py-3 flex items-center justify-between border-b ${levelConfig.border} bg-white/50`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.iconEmoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelConfig.badgeBg}`}>{tx("level", { level: config.level })}</span>
              <span className={`text-sm font-bold ${config.color}`}>{config.shortLabel}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">{tx("aiTutorLabel")} {config.personality}</p>
          </div>
        </div>
        {config.level === 3 && rigorState && (
          <div className="text-right">
            <p className="text-[10px] text-slate-400">{tx("disciplineScore")}</p>
            <p className={`text-lg font-bold leading-none ${rigorState.disciplineScore >= 80 ? "text-emerald-600" : rigorState.disciplineScore >= 50 ? "text-amber-600" : "text-rose-600"}`}>
              {rigorState.disciplineScore}
            </p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 space-y-3">
        {/* Rules */}
        <div className="space-y-1.5">
          {config.rules.map((rule, i) => (
            <div key={i} className="flex items-start gap-2">
              <ChevronRight className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${config.color}`} />
              <p className="text-xs text-slate-600 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>

        {/* Daily Checklist (level 2+) */}
        {config.level >= 2 && (
          <div className="border-t border-slate-200/50 pt-3 space-y-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{tx("dailyMission")}</p>
            <div className="grid grid-cols-2 gap-2">
              <DailyCheckItem label={tx("reviewFlashcards")} done={vocabDoneToday} icon={<BookCheck className="h-3.5 w-3.5" />} />
              <DailyCheckItem label={tx("doQuiz")} done={quizDoneToday} icon={<PenTool className="h-3.5 w-3.5" />} />
            </div>
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="border-t border-slate-200/50 pt-3 space-y-1.5">
            {warnings.map((w, i) => (
              <div key={i} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2">
                <AlertTriangle className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${config.level === 3 ? "text-rose-500" : "text-amber-500"}`} />
                <p className="text-xs text-slate-700 leading-relaxed">{w}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DailyCheckItem({ label, done, icon }: { label: string; done: boolean; icon: React.ReactNode }) {
  const { tx } = useText();
  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${done ? "bg-emerald-100/80 text-emerald-700" : "bg-white/60 text-slate-500"}`}>
      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : icon}
      {label}
      {done && <span className="ml-auto text-[10px] font-bold">{tx("done")}</span>}
    </div>
  );
}

/* ═══════════════ VOCAB WRAPPER (with rigor tracking) ═══════════════ */
function VocabReviewWrapper({ subjectId, rigorLevel, isRequired, onVocabComplete }: {
  subjectId: string;
  rigorLevel: number | null;
  isRequired: boolean;
  onVocabComplete: () => void;
}) {
  const { tx } = useText();
  const [localComplete, setLocalComplete] = useState(false);
  const prevCompleteRef = useState(false);

  useEffect(() => {
    if (localComplete && !prevCompleteRef[0]) {
      prevCompleteRef[1](true);
      onVocabComplete();
    }
  }, [localComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {isRequired && !localComplete && (
        <div className="flex items-center gap-2 mb-2 px-1">
          {rigorLevel === 3 ? (
            <Flame className="h-4 w-4 text-rose-500" />
          ) : (
            <Zap className="h-4 w-4 text-amber-500" />
          )}
          <span className={`text-xs font-bold ${rigorLevel === 3 ? "text-rose-600" : "text-amber-600"}`}>
            {tx("mustComplete")}
          </span>
        </div>
      )}
      <VocabReviewWithCallback subjectId={subjectId} onComplete={() => setLocalComplete(true)} />
    </div>
  );
}

/* VocabReview that calls onComplete when all cards answered */
function VocabReviewWithCallback({ subjectId, onComplete }: { subjectId: string; onComplete: () => void }) {
  const [key, setKey] = useState(0);
  const savedCompleteRef = useState(false);

  // Listen for vocab completion via custom event
  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent).detail;
      if (detail?.subjectId === subjectId && !savedCompleteRef[0]) {
        savedCompleteRef[1](true);
        onComplete();
      }
    }
    window.addEventListener("ged-vocab-complete", handler);
    return () => window.removeEventListener("ged-vocab-complete", handler);
  }, [subjectId, onComplete]);

  // Check if already completed today
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(`ged-vocab-${subjectId}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.isComplete && !savedCompleteRef[0]) {
          savedCompleteRef[1](true);
          onComplete();
        }
      }
    } catch { /* ignore */ }
  }, [subjectId, onComplete, key]);

  return (
    <div key={key}>
      <VocabReview subjectId={subjectId} />
    </div>
  );
}

/* ═══════════════ MODULE SECTION (with locking) ═══════════════ */
function ModuleSection({ module, onOpenLesson, lockedIds, rigorLevel }: {
  module: import("@/lib/store").SubjectFull["modules"][0];
  onOpenLesson: (id: string) => void;
  lockedIds: Set<string>;
  rigorLevel: number | null;
}) {
  const { tx } = useText();
  const [open, setOpen] = useState(true);
  const totalLessons = module.topics.reduce((s, t) => s + t.lessons.length, 0);
  const hasLocked = module.topics.some((t) => t.lessons.some((l) => lockedIds.has(l.id)));

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div>
            <p className="font-bold text-slate-800">{module.title}</p>
            <p className="mt-0.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{tx("lessonsCount", { count: totalLessons })}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasLocked && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
              <Lock className="h-3 w-3" />
              {tx("locked")}
            </span>
          )}
          {open ? (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-3">
          {module.topics.map((topic) => (
            <div key={topic.id} className="mb-3 last:mb-0">
              <p className="px-2 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {topic.title}
              </p>
              {topic.lessons.map((lesson) => {
                const isLocked = lockedIds.has(lesson.id);
                return (
                  <LessonRow
                    key={lesson.id}
                    lesson={lesson}
                    isLocked={isLocked}
                    rigorLevel={rigorLevel}
                    onOpen={() => onOpenLesson(lesson.id)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson, isLocked, rigorLevel, onOpen }: {
  lesson: import("@/lib/store").LessonWithProgress;
  isLocked: boolean;
  rigorLevel: number | null;
  onOpen: () => void;
}) {
  const { tx } = useText();
  if (isLocked) {
    return (
      <div className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 opacity-50">
        <Lock className="h-4 w-4 text-rose-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-400 truncate">{lesson.title}</p>
          <p className="text-[10px] text-rose-400 font-semibold mt-0.5">
            {rigorLevel === 3
              ? tx("lockReasonScore")
              : rigorLevel === 2
                ? tx("lockReasonQuizScore")
                : tx("lockReasonLesson")
            }
          </p>
        </div>
        <span className="flex items-center gap-1 text-[11px] text-slate-300 font-medium shrink-0">
          <Clock className="h-3 w-3" />
          {lesson.durationMinutes} {tx("minutes")}
        </span>
      </div>
    );
  }

  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all hover:bg-slate-50 group"
    >
      {lesson.progress?.isCompleted ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : (
        <Circle className="h-4 w-4 text-slate-300 shrink-0" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-600 group-hover:text-slate-900 truncate">
          {lesson.title}
        </p>
      </div>
      <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0">
        <Clock className="h-3 w-3" />
        {lesson.durationMinutes} {tx("minutes")}
      </span>
    </button>
  );
}
