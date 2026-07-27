"use client";

import { useAppStore, SubjectSummary } from "@/lib/store";
import { SubjectCard } from "./SubjectCard";
import { ScoreTargetModal } from "./ScoreTargetModal";
import { AiTutorPanel, ScoreTargetChangeButton } from "./AiTutorPanel";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, BarChart3, Target, TrendingUp, Flame } from "lucide-react";
import { useEffect, useState } from "react";

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
            สวัสดี, {user?.displayName || user?.firstName}
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 font-medium leading-relaxed">
            {scoreTarget
              ? `เป้าหมาย GED ${scoreTarget} คะแนน — เรียนต่อจากที่ค้างไว้ได้เลย ความคืบหน้าถูกบันทึกอัตโนมัติ`
              : "เริ่มต้นการเรียนวันนี้ — เลือกวิชาที่ต้องการเรียนด้านล่าง"}
          </p>
        </div>
        <ScoreTargetChangeButton />
      </div>

      {/* AI Tutor Rigor Panel */}
      <AiTutorPanel />

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
                ตั้งค่าเป้าหมายคะแนน GED ของคุณ
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                เลือกคะแนนเป้าหมาย 145-200 และให้ AI ติวเตอร์ปรับแผนการเรียนให้ตามระดับ
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="บทเรียนที่เสร็จ"
          value={`${overall.completedLessons}`}
          subValue={`/${overall.totalLessons}`}
          icon={<BookOpen className="h-5 w-5 text-white" />}
          gradient="from-violet-500 to-indigo-600"
          shadowColor="shadow-violet-200/50"
          progress={overall.completionPct}
          progressColor="from-violet-500 to-indigo-500"
        />
        <StatCard
          label="คะแนนเฉลี่ย"
          value={`${overall.avgQuizScore}`}
          subValue="%"
          icon={<BarChart3 className="h-5 w-5 text-white" />}
          gradient="from-amber-500 to-orange-500"
          shadowColor="shadow-amber-200/50"
        />
        <StatCard
          label="แบบทดสอบทั้งหมด"
          value={`${overall.totalQuizAttempts}`}
          subValue="ครั้ง"
          icon={<Target className="h-5 w-5 text-white" />}
          gradient="from-emerald-500 to-teal-600"
          shadowColor="shadow-emerald-200/50"
        />
        <StatCard
          label="ความคืบหน้ารวม"
          value={`${overall.completionPct}`}
          subValue="%"
          icon={<TrendingUp className="h-5 w-5 text-white" />}
          gradient="from-rose-500 to-pink-600"
          shadowColor="shadow-rose-200/50"
        />
      </div>

      {/* Subjects */}
      <div>
        <h2 className="mb-4 text-lg font-extrabold text-slate-800 tracking-tight">วิชาเรียน GED</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onClick={() => requestSubjectNav(subject.code)} />
          ))}
        </div>
      </div>

      {/* Recent scores */}
      {recentQuizScores.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-extrabold text-slate-800 tracking-tight">แบบทดสอบล่าสุด</h2>
          <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentQuizScores.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">
                      {attempt.quizType === "lesson_quiz" ? "แบบทดสอบบทเรียน" : attempt.quizType === "subject_test" ? "แบบทดสอบวิชา" : "แบบทดสอบ"}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{attempt.totalQuestions} คำถาม</p>
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