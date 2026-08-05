"use client";

import { useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { AuthSwitch } from "@/components/auth/LoginForm";
import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SubjectView } from "@/components/lessons/SubjectView";
import { LessonView } from "@/components/lessons/LessonView";
import { QuizView } from "@/components/quiz/QuizView";
import { QuizResult } from "@/components/quiz/QuizResult";
import { HandbookView } from "@/components/handbook/HandbookView";
import { NicknameModal } from "@/components/NicknameModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Page() {
  const { view, setView, lessonOrigin, setSelectedLesson } = useAppStore();
  const selectedLesson = useAppStore((s) => s.selectedLesson);
  const showLesson = view === "lesson" && selectedLesson;

  // LessonView error → กลับไปหน้าก่อนหน้าอัตโนมัติ
  const handleLessonError = useCallback(() => {
    setSelectedLesson(null);
    setView(lessonOrigin === "handbook" ? "handbook" : "subject");
  }, [lessonOrigin, setView, setSelectedLesson]);

  // Auth views (no shell)
  if (view === "login" || view === "register") {
    return <AuthSwitch />;
  }

  // App views (with shell + per-view error boundaries)
  return (
    <AppShell>
      <NicknameModal />
      {view === "dashboard" && (
        <ErrorBoundary><Dashboard /></ErrorBoundary>
      )}
      {view === "subject" && (
        <ErrorBoundary><SubjectView /></ErrorBoundary>
      )}
      {showLesson && (
        <ErrorBoundary
          onError={handleLessonError}
          fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 mb-4">
                <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-800 mb-2">เปิดบทเรียนไม่สำเร็จ</h2>
              <p className="text-sm text-slate-500 mb-4">กำลังกลับไปหน้าก่อนหน้า...</p>
              <div className="h-5 w-5 border-2 border-slate-300 border-t-violet-500 rounded-full animate-spin" />
            </div>
          }
        >
          <LessonView />
        </ErrorBoundary>
      )}
      {view === "quiz" && (
        <ErrorBoundary><QuizView /></ErrorBoundary>
      )}
      {view === "quiz-result" && (
        <ErrorBoundary><QuizResult /></ErrorBoundary>
      )}
      {view === "handbook" && (
        <ErrorBoundary><HandbookView /></ErrorBoundary>
      )}
    </AppShell>
  );
}
