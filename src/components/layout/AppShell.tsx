"use client";

import { useAppStore } from "@/lib/store";
import { GraduationCap, LogOut, User, ChevronRight, RotateCcw, Languages } from "lucide-react";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useEffect, useState } from "react";

function resetAllProgress() {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith("ged-vocab-") || key.startsWith("ged-tcache-"))) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
  window.location.reload();
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, view, setView, logout, selectedSubject, setSelectedSubject, pendingSubjectNav, setPendingSubjectNav } = useAppStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

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
      {/* ═══════════════ SIDEBAR (Desktop) ═══════════════ */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200/50 bg-white/90 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-100/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/40">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">GED Prep</h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Learning Platform</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setView("dashboard")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              view === "dashboard"
                ? "bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">{"\u{1F3E0}"}</span>
            หน้าหลัก
          </button>
          {user && ["math", "science", "rla", "ss"].map((code) => (
            <SubjectSidebarLink key={code} code={code} />
          ))}
        </nav>

        {/* ★ ปุ่มแปลภาษา — ย้ายมาไว้ตรงกลาง sidebar ให้เด่น */}
        <div className="px-3 pb-3">
          <div className="rounded-xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-white p-2.5">
            <LanguageToggle />
          </div>
        </div>

        {/* ★ ปุ่มรีเซ็ตทั้งแพลตฟอร์ม */}
        <div className="px-3 pb-3">
          {showResetConfirm ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2">
              <p className="text-xs font-semibold text-rose-700">ต้องการรีเซ็ตข้อมูลทั้งหมด?</p>
              <p className="text-[11px] text-rose-500">ความคืบหน้าและคำศัพท์ทั้งหมดจะถูกลบ</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { resetAllProgress(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-all active:scale-95"
                >
                  <RotateCcw className="h-3 w-3" />
                  ยืนยันรีเซ็ต
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/60 px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              รีเซ็ตข้อมูลการเรียน
            </button>
          )}
        </div>

        {/* User info */}
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

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 lg:pl-[260px] pb-20 lg:pb-0">
        {/* ★ Mobile Header — ปุ่มแปลภาษาใหญ่ขึ้น + เพิ่มปุ่มรีเซ็ต */}
        <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-xl px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-extrabold text-slate-800 tracking-tight">GED Prep</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* ปุ่มแปลภาษา — ใช้ไอคอนใหญ่ มองเห็นง่าย */}
            <MobileLangToggle />
            {/* ปุ่มรีเซ็ต */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title="รีเซ็ตข้อมูลการเรียน"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button onClick={logout} className="p-2 rounded-xl text-slate-400 hover:text-rose-600">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile Reset Confirm Dialog */}
        {showResetConfirm && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end justify-center">
            <div className="fixed inset-0 bg-black/30" onClick={() => setShowResetConfirm(false)} />
            <div className="relative w-full max-w-md rounded-t-2xl bg-white border-t border-slate-200 p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-rose-600" />
                <p className="text-sm font-bold text-slate-800">รีเซ็ตข้อมูลการเรียนทั้งหมด?</p>
              </div>
              <p className="text-xs text-slate-500">ความคืบหน้าคำศัพท์และข้อมูลทั้งหมดจะถูกลบ คุณต้องเริ่มเรียนใหม่ทั้งหมด</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { resetAllProgress(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-all active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  ยืนยันรีเซ็ต
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

/* ═══════════════ MOBILE LANG TOGGLE (inline, no dropdown) ═══════════════ */
function MobileLangToggle() {
  const { language, setLanguage } = useAppStore();
  const opts: { code: "en" | "th" | "my"; flag: string; label: string }[] = [
    { code: "en", flag: "\u{1F1FA}\u{1F1F8}", label: "EN" },
    { code: "th", flag: "\u{1F1F9}\u{1F1ED}", label: "TH" },
    { code: "my", flag: "\u{1F1F2}\u{1F1F1}", label: "MY" },
  ];
  const current = opts.find((o) => o.code === language) || opts[0];
  const nextIdx = (opts.indexOf(current) + 1) % opts.length;
  const next = opts[nextIdx];

  return (
    <button
      onClick={() => setLanguage(next.code)}
      className="flex items-center gap-1 rounded-xl bg-violet-50 border border-violet-100 px-2.5 py-1.5 transition-all hover:bg-violet-100 active:scale-95"
      title={`เปลี่ยนเป็น ${next.label}`}
    >
      <Languages className="h-4 w-4 text-violet-600" />
      <span className="text-sm leading-none">{current.flag}</span>
      <span className="text-xs font-bold text-violet-700">{current.label}</span>
    </button>
  );
}

const SUBJECT_META: Record<string, { label: string; icon: string; gradient: string }> = {
  math: { label: "คณิตศาสตร์", icon: "\u{1F9EE}", gradient: "from-blue-500 to-cyan-500" },
  science: { label: "วิทยาศาสตร์", icon: "\u{1F52C}", gradient: "from-emerald-500 to-teal-500" },
  rla: { label: "ภาษาอังกฤษ", icon: "\u{1F4D6}", gradient: "from-amber-500 to-orange-500" },
  ss: { label: "สังคมศึกษา", icon: "\u{1F3DB}\uFE0F", gradient: "from-rose-500 to-pink-500" },
};

function SubjectSidebarLink({ code }: { code: string }) {
  const { view, selectedSubject, user, setView, setSelectedSubject } = useAppStore();
  const meta = SUBJECT_META[code] || { label: code, icon: "\u{1F4DA}", gradient: "from-slate-400 to-slate-500" };
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
  const { view, setView, user, setSelectedSubject, selectedSubject } = useAppStore();
  const subjectCodes = ["math", "science", "rla", "ss"];

  async function navSubject(code: string) {
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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-slate-200/50 bg-white/90 backdrop-blur-xl px-1">
      <button
        onClick={() => setView("dashboard")}
        className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors ${
          view === "dashboard" ? "text-violet-600" : "text-slate-400"
        }`}
      >
        <span className="text-xl">{"\u{1F3E0}"}</span>
        <span className="text-[10px] font-semibold">หน้าหลัก</span>
      </button>
      {subjectCodes.map((code) => {
        const meta = SUBJECT_META[code];
        const isActive = view === "subject" && selectedSubject?.code === code;
        return (
          <button
            key={code}
            onClick={() => navSubject(code)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-colors ${
              isActive ? "text-violet-600" : "text-slate-400"
            }`}
          >
            <span className="text-lg">{meta.icon}</span>
            <span className="text-[10px] font-semibold">{meta.label}</span>
          </button>
        );
      })}
    </nav>
  );
}