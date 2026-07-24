"use client";

import { useAppStore, SubjectSummary } from "@/lib/store";
import { SubjectCard } from "./SubjectCard";
import { ScoreTargetModal } from "./ScoreTargetModal";
import { AiTutorPanel, ScoreTargetChangeButton } from "./AiTutorPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, BarChart3, Target, Flame, Trophy } from "lucide-react";
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
  const { user, scoreTarget, setView, setSelectedSubject, setSelectedLesson, setPendingSubjectNav } = useAppStore();
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
      setSelectedLesson(null);
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
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { overall, subjects, recentQuizScores } = data;

  return (
    <div className="space-y-6">
      {/* Score Target Modal (overlay) */}
      <ScoreTargetModal />

      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            สวัสดี, {user?.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {scoreTarget
              ? `เป้าหมาย GED: ${scoreTarget} คะแนน — เริ่มต้นการเรียนวันนี้ได้เลย`
              : "เริ่มต้นการเรียนวันนี้ได้เลย"
            }
          </p>
        </div>
        <ScoreTargetChangeButton />
      </div>

      {/* AI Tutor Rigor Panel */}
      <AiTutorPanel />

      {/* Score Target Card (shown if no target set yet and modal dismissed) */}
      {!scoreTarget && (
        <button
          onClick={() => useAppStore.getState().setShowScoreTargetModal(true)}
          className="w-full rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 p-5 text-center hover:border-teal-400 hover:bg-teal-50/30 transition-all group"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 group-hover:bg-teal-100 transition-colors">
              <Target className="h-6 w-6 text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-teal-700 transition-colors">
                ตั้งค่าเป้าหมายคะแนน GED ของคุณ
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                คลิกเพื่อเลือกคะแนนเป้าหมาย 145-200 และให้ AI ติวเตอร์ปรับแผนการเรียนให้
              </p>
            </div>
          </div>
        </button>
      )}

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm bg-gradient-to-br from-teal-50 to-white">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">บทเรียนที่เสร็จแล้ว</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {overall.completedLessons}<span className="text-base font-normal text-gray-400">/{overall.totalLessons}</span>
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
                <BookOpen className="h-5 w-5 text-teal-600" />
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-teal-100">
              <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${overall.completionPct}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-white">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">คะแนนเฉลี่ยแบบทดสอบ</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{overall.avgQuizScore}<span className="text-base font-normal text-gray-400">%</span></p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
                <BarChart3 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-white">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">จำนวนแบบทดสอบ</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{overall.totalQuizAttempts}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100">
                <Target className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-gradient-to-br from-rose-50 to-white">
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500">ความคืบหน้ารวม</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{overall.completionPct}<span className="text-base font-normal text-gray-400">%</span></p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100">
                <Flame className="h-5 w-5 text-rose-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subjects */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">📚 วิชาเรียน GED</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} onClick={() => requestSubjectNav(subject.code)} />
          ))}
        </div>
      </div>

      {/* Recent scores */}
      {recentQuizScores.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">📊 แบบทดสอบล่าสุด</h2>
          <Card className="border-0 shadow-sm">
            <CardContent className="pt-4">
              <div className="space-y-2">
                {recentQuizScores.slice(0, 5).map((attempt) => (
                  <div key={attempt.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {attempt.quizType === "lesson_quiz" ? "แบบทดสอบบทเรียน" : "แบบทดสอบวิชา"}
                      </p>
                      <p className="text-xs text-gray-400">{attempt.totalQuestions} คำถาม</p>
                    </div>
                    <span className={`text-lg font-bold ${attempt.scorePercent >= 80 ? "text-teal-600" : attempt.scorePercent >= 60 ? "text-amber-600" : "text-rose-600"}`}>
                      {attempt.scorePercent.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}