"use client";

import { useAppStore } from "@/lib/store";
import { AuthSwitch } from "@/components/auth/LoginForm";
import { AppShell } from "@/components/layout/AppShell";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { SubjectView } from "@/components/lessons/SubjectView";
import { LessonView } from "@/components/lessons/LessonView";
import { QuizView } from "@/components/quiz/QuizView";
import { QuizResult } from "@/components/quiz/QuizResult";

export default function Page() {
  const { view } = useAppStore();

  // Auth views (no shell)
  if (view === "login" || view === "register") {
    return <AuthSwitch />;
  }

  // App views (with shell)
  return (
    <AppShell>
      {view === "dashboard" && <Dashboard />}
      {view === "subject" && <SubjectView />}
      {view === "lesson" && <LessonView />}
      {view === "quiz" && <QuizView />}
      {view === "quiz-result" && <QuizResult />}
    </AppShell>
  );
}