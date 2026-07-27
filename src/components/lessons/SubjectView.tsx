"use client";

import { useAppStore, SubjectFull } from "@/lib/store";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, BookOpen, RotateCcw, Brain, Play } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/BackButton";
import { VocabReview } from "./VocabReview";

const SUBJECT_GRADIENTS: Record<string, string> = {
  math: "from-blue-600 to-cyan-600",
  science: "from-emerald-600 to-teal-600",
  rla: "from-amber-500 to-orange-600",
  ss: "from-rose-500 to-pink-600",
};

const SUBJECT_DESCRIPTIONS: Record<string, string> = {
  math: "คณิตศาสตร์เชิงการใช้เหตุผล — สมการ เรขาคณิต สถิติ และการแก้ปัญหาเชิงปริมาณ",
  science: "วิทยาศาสตร์ — ชีววิทยา เคมี ฟิสิกส์ และวิทยาศาสตร์โลก",
  rla: "ภาษาอังกฤษ — การอ่าน เขียน ไวยากรณ์ และการแสดงความคิดเห็น",
  ss: "สังคมศึกษา — ประวัติศาสตร์ รัฐธรรมนูญ เศรษฐศาสตร์ และภูมิศาสตร์",
};

const SUBJECT_ICONS: Record<string, string> = {
  math: "🧮",
  science: "🔬",
  rla: "📖",
  ss: "🏛️",
};

export function SubjectView() {
  const { selectedSubject, setView, setSelectedLesson, user, startQuiz } = useAppStore();
  const [startingQuiz, setStartingQuiz] = useState(false);

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
  const desc = SUBJECT_DESCRIPTIONS[selectedSubject.code] || "";
  const icon = SUBJECT_ICONS[selectedSubject.code] || "📘";
  const pct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  async function openLesson(lessonId: string) {
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
      if (json.data) {
        startQuiz(json.data.attempt, json.data.questions);
      }
    } catch (e) {
      console.error("Failed to start subject quiz", e);
    } finally {
      setStartingQuiz(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton label="แดชบอร์ด" onClick={() => { setView("dashboard"); setSelectedSubject(null); }} />
        <div className="flex items-center gap-1.5 text-sm">
          <span className="text-slate-400 font-medium">แดชบอร์ด</span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-semibold text-slate-800">{selectedSubject.title}</span>
        </div>
      </div>

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
            title="รีเซ็ตความคืบหน้าคำศัพท์"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            เริ่มใหม่
          </button>
        </div>
        <div className="relative mt-4 flex items-center gap-5 text-sm text-white/80 font-medium">
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            {completedLessons}/{totalLessons} บทเรียน
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            {pct}% สำเร็จ
          </span>
        </div>
        <div className="relative mt-3 h-1.5 w-full rounded-full bg-white/20">
          <div className="h-full rounded-full bg-white/80 transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* ทบทวนคำศัพท์ */}
      {selectedSubject.id && <VocabReview subjectId={selectedSubject.id} />}

      {/* Subject Quiz Button */}
      <div className="rounded-2xl border border-violet-200/60 bg-gradient-to-r from-violet-50 to-indigo-50 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-200/50">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">แบบทดสอบวิชา</p>
              <p className="text-xs text-slate-400 font-medium">ทดสอบความเข้าใจรวมทุกบทเรียนในวิชานี้</p>
            </div>
          </div>
          <button
            onClick={handleSubjectQuiz}
            disabled={startingQuiz}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-200/50 hover:shadow-xl hover:shadow-violet-300/50 transition-all active:scale-95 disabled:opacity-50"
          >
            {startingQuiz ? (
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="h-4 w-4" />
            )}
            เริ่มทำแบบทดสอบ
          </button>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-3">
        <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">บทเรียน</h2>
        {selectedSubject.modules.map((mod) => (
          <ModuleSection key={mod.id} module={mod} onOpenLesson={openLesson} />
        ))}
      </div>
    </div>
  );
}

function ModuleSection({ module, onOpenLesson }: { module: SubjectFull["modules"][0]; onOpenLesson: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  const totalLessons = module.topics.reduce((s, t) => s + t.lessons.length, 0);

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
      >
        <div>
          <p className="font-bold text-slate-800">{module.title}</p>
          <p className="mt-0.5 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">{totalLessons} บทเรียน</p>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-3">
          {module.topics.map((topic) => (
            <div key={topic.id} className="mb-3 last:mb-0">
              <p className="px-2 pt-2 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {topic.title}
              </p>
              {topic.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onOpenLesson(lesson.id)}
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
                    {lesson.durationMinutes} นาที
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}