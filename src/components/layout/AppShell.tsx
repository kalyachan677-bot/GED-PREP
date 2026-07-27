"use client";

import { useAppStore } from "@/lib/store";
import { GraduationCap, LogOut, User, ChevronRight } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useEffect } from "react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, view, setView, logout, selectedSubject, setSelectedSubject, pendingSubjectNav, setPendingSubjectNav } = useAppStore();

  // Handle pending subject navigation directly (no popup)
  useEffect(() => {
    if (!pendingSubjectNav) return;
    setPendingSubjectNav(null);
    pendingSubjectNav.navFn();
  }, [pendingSubjectNav, setPendingSubjectNav]);

  if (view === "login" || view === "register") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-gray-100 bg-white">
        <div className="flex h-16 items-center gap-3 px-6 border-b border-gray-50">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">GED Prep</h1>
            <p className="text-[10px] text-gray-400">แพลตฟอร์มเตรียมสอบ</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setView("dashboard")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${view === "dashboard" ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
          >
            <span className="text-lg">🏠</span>
            แดชบอร์ด
          </button>
          {user && ["math", "science", "rla", "ss"].map((code) => (
            <SubjectSidebarLink key={code} code={code} />
          ))}
        </nav>
        <div className="border-t border-gray-50 px-4 py-3">
          <LanguageToggle />
        </div>
        <div className="border-t border-gray-50 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName || user?.firstName}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50" title="ออกจากระบบ">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 lg:pl-64 pb-20 lg:pb-0">
        <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-gray-100 bg-white/90 backdrop-blur-sm px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-500 to-emerald-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">GED Prep</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <button onClick={logout} className="p-2 rounded-lg text-gray-400 hover:text-gray-600">
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

function SubjectSidebarLink({ code }: { code: string }) {
  const { view, selectedSubject, user, setView, setSelectedSubject } = useAppStore();
  const labels: Record<string, string> = { math: "🧮 คณิตศาสตร์", science: "🔬 วิทยาศาสตร์", rla: "📖 ภาษาอังกฤษ", ss: "🏛️ สังคมศึกษา" };
  const isActive = view === "subject" && selectedSubject?.code === code;

  async function handleClick() {
    if (!user) return;
    setView("subject");
    setSelectedSubject(null);
    try {
      const res = await fetch(`/api/subjects/${code}?userId=${user.id}`);
      const json = await res.json();
      if (json.data) setSelectedSubject(json.data);
    } catch (e) { console.error(e); }
  }

  return (
    <button onClick={handleClick} className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${isActive ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
      {labels[code] || code}
      <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
    </button>
  );
}

function BottomNav() {
  const { view, setView } = useAppStore();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-gray-100 bg-white/95 backdrop-blur-sm">
      <button onClick={() => setView("dashboard")} className={`flex flex-col items-center gap-0.5 px-4 py-1 ${view === "dashboard" ? "text-teal-600" : "text-gray-400"}`}>
        <span className="text-xl">🏠</span>
        <span className="text-[10px] font-medium">หน้าหลัก</span>
      </button>
    </nav>
  );
}
