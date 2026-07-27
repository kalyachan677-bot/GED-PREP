"use client";

import { useAppStore } from "@/lib/store";
import { GraduationCap, LogOut, User, ChevronRight, Languages, RotateCcw } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useEffect, useState } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, view, setView, logout, selectedSubject, setSelectedSubject, pendingSubjectNav, setPendingSubjectNav } = useAppStore();

  useEffect(() => {
    if (!pendingSubjectNav) return;
    setPendingSubjectNav(null);
    pendingSubjectNav.navFn();
  }, [pendingSubjectNav, setPendingSubjectNav]);

  if (view === "login" || view === "register") {
    return <>{children}</>;
  }

  const displayName = user?.displayName || user?.firstName || "";

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/20">
      {/* Sidebar */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200/50 bg-white/80 backdrop-blur-xl">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/40">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">GED Prep</h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Learning Platform</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setView("dashboard")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              view === "dashboard"
                ? "bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">🏠</span>
            หน้าหลัก
          </button>
          {user && ["math", "science", "rla", "ss"].map((code) => (
            <SubjectSidebarLink key={code} code={code} />
          ))}
        </nav>
        <div className="border-t border-slate-100/80 px-4 py-3">
          <LanguageToggle />
        </div>
        <div className="border-t border-slate-100/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100">
              <User className="h-4 w-4 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 truncate font-medium">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="ออกจากระบบ"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:pl-[260px] pb-20 lg:pb-0">
        <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-xl px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-extrabold text-slate-800 tracking-tight">GED Prep</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button onClick={logout} className="p-2 rounded-xl text-slate-400 hover:text-rose-600">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

const SUBJECT_META: Record<string, { label: string; icon: string; gradient: string }> = {
  math: { label: "คณิตศาสตร์", icon: "🧮", gradient: "from-blue-500 to-cyan-500" },
  science: { label: "วิทยาศาสตร์", icon: "🔬", gradient: "from-emerald-500 to-teal-500" },
  rla: { label: "ภาษาอังกฤษ", icon: "📖", gradient: "from-amber-500 to-orange-500" },
  ss: { label: "สังคมศึกษา", icon: "🏛️", gradient: "from-rose-500 to-pink-500" },
};

function SubjectSidebarLink({ code }: { code: string }) {
  const { view, selectedSubject, user, setView, setSelectedSubject } = useAppStore();
  const meta = SUBJECT_META[code] || { label: code, icon: "📚", gradient: "from-slate-400 to-slate-500" };
  const isActive = view === "subject" && selectedSubject?.code === code;

  async function handleClick() {
    if (!user) return;
    setView("subject");
    setSelectedSubject(null);
    try {
      const res = await fetch(`/api/subjects/${code}?userId=${user.id}`);
      const json = await res.json();
      if (json.data) setSelectedSubject(json.data);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all ${
        isActive
          ? `bg-gradient-to-r ${meta.gradient} text-white font-semibold shadow-md`
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-base">{meta.icon}</span>
        <span className="font-medium">{meta.label}</span>
      </div>
      <ChevronRight className={`h-3.5 w-3.5 ${isActive ? "text-white/60" : "text-slate-300"}`} />
    </button>
  );
}

function BottomNav() {
  const { view, setView } = useAppStore();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-slate-200/50 bg-white/90 backdrop-blur-xl">
      <button
        onClick={() => setView("dashboard")}
        className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors ${
          view === "dashboard" ? "text-violet-600" : "text-slate-400"
        }`}
      >
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-semibold">หน้าหลัก</span>
      </button>
    </nav>
  );
}