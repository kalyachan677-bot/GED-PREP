"use client";

import { useAppStore, SubjectSummary, getRigorWarnings, loadRigorState, RigorDailyState } from "@/lib/store";
import { useText } from "@/lib/ui-texts";
import { SubjectCard } from "./SubjectCard";
import { ScoreTargetModal } from "./ScoreTargetModal";
import { AiTutorPanel, ScoreTargetChangeButton } from "./AiTutorPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, BarChart3, Target, TrendingUp, Flame, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface DashboardData {
  subjects: SubjectSummary[];
  overall: {
    totalLessons: number;
    completedLessons: number;
    completionPct: number;
    avgQuizScore: number;
    totalQuizAttempts: number;
  };
  recentQuizScores: {
    id: string;
    scorePercent: number;
    correctCount: number;
    totalQuestions: number;
    quizType: string;
    startedAt: string;
    subjectId: string;
  }[];
}

export function Dashboard() {
  const { user, scoreTarget, setView, setSelectedSubject, setPendingSubjectNav } = useAppStore();
  const { tx } = useText();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        const res = await fetch(`/api/dashboard?userId=${user.id}`);
        const json = await res.json();
        if (json.data) setData(json.data);
      } catch (e) {
        console.error("Failed to load dashboard", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  function requestSubjectNav(code: string) {
    if (!user) return;
    const navFn = async () => {
      setView("subject");
      setSelectedSubject(null);
      try {
        const res = await fetch(`/api/subjects/${code}?userId=${user.id}`);
        const json = await res.json();
        if (json.data) setSelectedSubject(json.data);
      } catch (e) {
        console.error("Failed to load subject", e);
      }
    };
    setPendingSubjectNav({ code, navFn });
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overall, subjects, recentQuizScores } = data;

  return (
    <div className="space-y-6">
      <ScoreTargetModal />

      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {tx("hello")}, {user?.displayName || user?.firstName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium leading-relaxed">
            {scoreTarget
              ? tx("scoreTargetMsg", { score: scoreTarget })
              : tx("startLearning")}
          </p>
        </div>
        <ScoreTargetChangeButton />
      </div>

      {/* AI Tutor Rigor Panel */}
      <AiTutorPanel />

      {/* ═══════ Rigor Daily Status ═══════ */}
      <RigorDailyStatus />

      {/* Score Target Card */}
      {!scoreTarget && (
        <button
          onClick={() => useAppStore.getState().setShowScoreTargetModal(true)}
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-center hover:border-violet-300 hover:bg-violet-50/30 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 group-hover:bg-violet-100 transition-colors">
              <Target className="h-6 w-6 text-slate-400 group-hover:text-violet-600 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 group-hover:text-violet-700 transition-colors">
                {tx("setTargetTitle")}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {tx("setTargetDashDesc")}
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={tx("lessonsCompleted")}
          value={`${overall.completedLessons}`}
          subValue={`/${overall.totalLessons}`}
          icon={<BookOpen className="h-5 w-5 text-white" />}
          gradient="from-violet-500 to-indigo-600"
          shadowColor="shadow-violet-200/50"
          progress={overall.completionPct}
          progressColor="from-violet-500 to-indigo-500"
        />
        <StatCard
          label={tx("avgScore")}
          value={`${overall.avgQuizScore}`}
          subValue="%"
          icon={<BarChart3 className="h-5 w-5 text-white" />}
          gradient="from-amber-500 to-orange-500"
          shadowColor="shadow-amber-200/50"
        />
        <StatCard
          label={tx("totalQuizzes")}
          value={`${overall.totalQuizAttempts}`}
          subValue={tx("times")}
          icon={<Target className="h-5 w-5 text-white" />}
          gradient="from-emerald-500 to-teal-600"
          shadowColor="shadow-emerald-200/50"
        />
        <StatCard
          label={tx("overallProgress")}
          value={`${overall.completionPct}`}
          subValue="%"
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          gradient="from-rose-500 to-pink-600"
          shadowColor="shadow-rose-200/50"
        />
      </div>

      {/* Subjects */}
      <div>
        <h2 className="mb-4 text-lg font-extrabold text-slate-800 tracking-tight">{tx("gedSubjects")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onClick={() => requestSubjectNav(subject.code)} />
          ))}
        </div>
      </div>

      {/* Recent scores */}
      {recentQuizScores.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-extrabold text-slate-800 tracking-tight">{tx("recentQuizzes")}</h2>
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentQuizScores.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {attempt.quizType === "lesson_quiz" ? tx("lessonQuiz") : attempt.quizType === "subject_test" ? tx("subjectTest") : tx("quiz")}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{attempt.totalQuestions} {tx("questions")}</p>
                  </div>
                  <span
                    className={"text-lg font-extrabold tracking-tight " +
                      (attempt.scorePercent >= 80
                        ? "text-emerald-600"
                        : attempt.scorePercent >= 60
                          ? "text-amber-600"
                          : "text-rose-600")}
                  >
                    {attempt.scorePercent.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, subValue, icon, gradient, shadowColor, progress, progressColor }: {
  label: string;
  value: string;
  subValue: string;
  icon: React.ReactNode;
  gradient: string;
  shadowColor: string;
  progress?: number;
  progressColor?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="mt-1.5 text-2xl font-extrabold text-slate-900 tracking-tight">
            {value}<span className="text-base font-medium text-slate-300">{subValue}</span>
          </p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${shadowColor}`}>
          {icon}
        </div>
      </div>
      {progress !== undefined && progressColor && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div className={`h-full rounded-full bg-gradient-to-r ${progressColor} transition-all`} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

/* ═══════════════ RIGOR DAILY STATUS ═══════════════ */
function RigorDailyStatus() {
  const { rigorConfig, rigorState } = useAppStore();
  const { tx } = useText();
  const [state, setState] = useState<RigorDailyState | null>(rigorState);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setState(loadRigorState());
    }
  }, [rigorState]);

  if (!rigorConfig || !state) return null;

  const warnings = getRigorWarnings(rigorConfig, state);
  const vocabCount = Object.keys(state.vocabDoneToday || {}).length;

  return (
    <div className={`rounded-2xl border-2 ${rigorConfig.borderColor} ${rigorConfig.bgColor} overflow-hidden`}>
      <div className={`px-5 py-3 flex items-center justify-between border-b ${rigorConfig.borderColor} bg-white/50`}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{rigorConfig.iconEmoji}</span>
          <div>
            <p className={`text-sm font-bold ${rigorConfig.color}`}>{tx("dailyMission")} — {tx("level", { level: rigorConfig.level })}</p>
            <p className="text-[11px] text-slate-400">{new Date().toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
          </div>
        </div>
        {rigorConfig.level === 3 && (
          <div className="text-right">
            <p className="text-[10px] text-slate-400">{tx("disciplineScore")}</p>
            <p className={`text-xl font-extrabold leading-none ${state.disciplineScore >= 80 ? "text-emerald-600" : state.disciplineScore >= 50 ? "text-amber-600" : "text-rose-600"}`}>
              {state.disciplineScore}<span className="text-xs font-medium text-slate-300">/100</span>
            </p>
          </div>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        {/* Daily Checklist */}
        <div className="grid grid-cols-2 gap-2">
          <CheckItem
            label={tx("reviewFlashcards")}
            done={vocabCount >= 4}
            sub={`${vocabCount}/4 ${tx("subjects_done")}`}
            required={rigorConfig.flashcardRequired}
          />
          <CheckItem
            label={tx("doQuiz")}
            done={state.quizDoneToday}
            sub={state.quizDoneToday ? tx("done") : tx("notDone")}
            required={rigorConfig.dailyQuizRequired}
          />
        </div>

        {/* Missed days */}
        {state.consecutiveMissDays > 0 && (
          <div className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
            state.consecutiveMissDays >= rigorConfig.missPenaltyDays
              ? "bg-rose-100/80"
              : "bg-amber-100/80"
          }`}>
            <AlertTriangle className={`h-4 w-4 ${
              state.consecutiveMissDays >= rigorConfig.missPenaltyDays ? "text-rose-500" : "text-amber-500"
            }`} />
            <span className={`text-xs font-semibold ${
              state.consecutiveMissDays >= rigorConfig.missPenaltyDays ? "text-rose-700" : "text-amber-700"
            }`}>
              {tx("missedDays", { days: state.consecutiveMissDays })}
              {rigorConfig.scoreDeductionOnMiss && tx("scoreDeducted")}
            </span>
          </div>
        )}

        {/* Double schedule */}
        {state.doubleScheduleToday && (
          <div className="flex items-center gap-2 rounded-lg bg-rose-100/80 px-3 py-2">
            <Flame className="h-4 w-4 text-rose-500" />
            <span className="text-xs font-semibold text-rose-700">
              {tx("doubleMode")}
            </span>
          </div>
        )}

        {/* Warnings */}
        {warnings.map((w, i) => (
          <div key={i} className="flex items-start gap-2 rounded-lg bg-white/60 px-3 py-2">
            <ShieldAlert className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${rigorConfig.level === 3 ? "text-rose-500" : "text-amber-500"}`} />
            <p className="text-xs text-slate-700 leading-relaxed">{w}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckItem({ label, done, sub, required }: { label: string; done: boolean; sub: string; required: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
      done ? "bg-emerald-100/80" : required ? "bg-white border border-dashed border-slate-300" : "bg-white/60"
    }`}>
      {done ? (
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
      ) : required ? (
        <div className="h-4 w-4 rounded-full border-2 border-amber-400 shrink-0" />
      ) : (
        <div className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
      )}
      <div className="min-w-0">
        <p className={`text-xs font-semibold ${done ? "text-emerald-700" : "text-slate-600"}`}>
          {label}
          {required && !done && <span className="text-amber-500 ml-1">*</span>}
        </p>
        <p className="text-[10px] text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}