"use client";

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

export default function Page() {
  const { view } = useAppStore();

  // Auth views (no shell)
  if (view === "login" || view === "register") {
    return <AuthSwitch />;
  }

  // App views
  return (
    <AppShell>
      <NicknameModal />
      {view === "dashboard" && <Dashboard />}
      {view === "subject" && <SubjectView />}
      {view === "lesson" && <LessonView />}
      {view === "quiz" && <QuizView />}
      {view === "quiz-result" && <QuizResult />}
      {view === "handbook" && <HandbookView />}
    </AppShell>
  );
}
