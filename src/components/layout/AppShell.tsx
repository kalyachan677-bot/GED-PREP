"use client";

import { useAppStore } from "@/lib/store";
import { GraduationCap, LogOut, User, ChevronRight, RotateCcw, Languages, Globe } from "lucide-react";
import { useEffect, useState, useRef } from "react";

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

/* ═══════════════ LANG OPTIONS (shared) ═══════════════ */
const LANG_OPTIONS: { code: "en" | "th" | "my"; flag: string; label: string; sub: string }[] = [
  { code: "en", flag: "\u{1F1FA}\u{1F1F8}", label: "English", sub: "EN" },
  { code: "th", flag: "\u{1F1F9}\u{1F1ED}", label: "\u{0E44}\u{0E17}\u{0E22}", sub: "TH" },
  { code: "my", flag: "\u{1F1F2}\u{1F1F1}", label: "\u{1000}\u{103C}\u{1019}\u{103A}\u{1018}\u{102C}", sub: "MY" },
];

/* ═══════════════ DESKTOP LANG TOGGLE (full-width sidebar button + dropdown) ═══════════════ */
function DesktopLangToggle() {
  const { language, setLanguage } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANG_OPTIONS.find((o) => o.code === language) || LANG_OPTIONS[0];

  return (
    <div className="relative w-full" ref={ref}>
      {/* Full-width trigger button — เหมือน nav link อื่นๆ */}
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100/80 px-3 py-2.5 text-sm font-medium text-violet-700 transition-all hover:from-violet-100 hover:to-indigo-100 hover:shadow-sm active:scale-[0.98]"
      >
        <Globe className="h-5 w-5 text-violet-500" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="flex-1 text-left">{current.label}</span>
        <ChevronRight className={`h-3.5 w-3.5 text-violet-400 transition-transform ${open ? "rotate-90" : ""}`} />
      </button>

      {/* Dropdown — เปิดจากซ้าย ไม่ชิดขอบ */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1.5 w-full min-w-[220px] rounded-xl border border-violet-200/80 bg-white py-1.5 shadow-xl shadow-violet-100/40">
          <p className="px-3 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {"\u{0E40}\u{0E25}\u{0E37}\u{0E01}\u{0E20}\u{0E32}\u{0E29}\u{0E32} / Language"}
          </p>
          {LANG_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { setLanguage(opt.code); setOpen(false); }}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                language === opt.code
                  ? "bg-violet-50 text-violet-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <span className="text-lg leading-none">{opt.flag}</span>
              <span className="flex-1 text-left">{opt.label}</span>
              {language === opt.code && (
                <span className="text-[10px] font-bold text-violet-500 bg-violet-100 rounded-md px-1.5 py-0.5">{opt.sub}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════ MOBILE LANG TOGGLE (inline, cycles on tap) ═══════════════ */
function MobileLangToggle() {
  const { language, setLanguage } = useAppStore();
  const current = LANG_OPTIONS.find((o) => o.code === language) || LANG_OPTIONS[0];
  const nextIdx = (LANG_OPTIONS.indexOf(current) + 1) % LANG_OPTIONS.length;
  const next = LANG_OPTIONS[nextIdx];

  return (
    <button
      onClick={() => setLanguage(next.code)}
      className="flex items-center gap-1.5 rounded-xl bg-violet-50 border border-violet-100 px-3 py-2 transition-all hover:bg-violet-100 active:scale-95"
      title={`${"\u{0E40}\u{0E1B}\u{0E25}\u{0E35}\u{0E22}\u{0E19}\u{0E40}\u{0E1B}\u{0E47}\u{0E19}"} ${next.label}`}
    >
      <Globe className="h-4 w-4 text-violet-600" />
      <span className="text-sm leading-none">{current.flag}</span>
      <span className="text-xs font-bold text-violet-700">{current.sub}</span>
    </button>
  );
}

/* ═══════════════ SUBJECT META ═══════════════ */
const SUBJECT_META: Record<string, { label: string; icon: string; gradient: string }> = {
  math: { label: "\u{0E04}\u{0E13}\u{0E34}\u{0E15}\u{0E28}\u{0E32}\u{0E2A}\u{0E15}\u{0E23}\u{0E4C}", icon: "\u{1F9EE}", gradient: "from-blue-500 to-cyan-500" },
  science: { label: "\u{0E27}\u{0E34}\u{0E17}\u{0E22}\u{0E32}\u{0E28}\u{0E32}\u{0E2A}\u{0E15}\u{0E23}\u{0E4C}", icon: "\u{1F52C}", gradient: "from-emerald-500 to-teal-500" },
  rla: { label: "\u{0E20}\u{0E32}\u{0E29}\u{0E32}\u{0E2D}\u{0E31}\u{0E07}\u{0E01}\u{0E24}\u{0E29}", icon: "\u{1F4D6}", gradient: "from-amber-500 to-orange-500" },
  ss: { label: "\u{0E2A}\u{0E31}\u{0E07}\u{0E04}\u{0E21}\u{0E28}\u{0E36}\u{0E01}\u{0E29}\u{0E32}", icon: "\u{1F3DB}\uFE0F", gradient: "from-rose-500 to-pink-500" },
};

/* ═══════════════ MAIN SHELL ═══════════════ */
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
      {/* ═══════════════ SIDEBAR (Desktop / Large Tablet landscape) ═══════════════ */}
      <aside className="hidden lg:flex lg:w-[260px] lg:flex-col lg:fixed lg:inset-y-0 border-r border-slate-200/50 bg-white/90 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-100/80">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-200/40">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight">GED Prep</h1>
            <p className="text-[10px] text-slate-400 font-medium">Smart Learning Platform</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <button
            onClick={() => setView("dashboard")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              view === "dashboard"
                ? "bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-700 shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <span className="text-lg">{"\u{1F3E0}"}</span>
            {"\u{0E2B}\u{0E19}\u{0E49}\u{0E32}\u{0E2B}\u{0E25}\u{0E31}\u{0E01}"}
          </button>
          {user && ["math", "science", "rla", "ss"].map((code) => (
            <SubjectSidebarLink key={code} code={code} />
          ))}
        </nav>

        {/* ★ ปุ่มแปลภาษา — เต็มความกว้าง ไม่ชิดขอบ */}
        <div className="px-3 pb-2">
          <DesktopLangToggle />
        </div>

        {/* ★ ปุ่มรีเซ็ตทั้งแพลตฟอร์ม */}
        <div className="px-3 pb-3">
          {showResetConfirm ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2">
              <p className="text-xs font-semibold text-rose-700">{"\u{0E15}\u{0E49}\u{0E2D}\u{0E07}\u{0E01}\u{0E32}\u{0E23}\u{0E23}\u{0E35}\u{0E40}\u{0E0B}\u{0E15}\u{0E02}\u{0E49}\u{0E2D}\u{0E21}\u{0E39}\u{0E25}\u{0E17}\u{0E31}\u{0E49}\u{0E07}\u{0E2B}\u{0E21}\u{0E14}?"}</p>
              <p className="text-[11px] text-rose-500">{"\u{0E04}\u{0E27}\u{0E32}\u{0E21}\u{0E04}\u{0E37}\u{0E1A}\u{0E2B}\u{0E19}\u{0E49}\u{0E32} \u{0E41}\u{0E25}\u{0E30} \u{0E04}\u{0E33}\u{0E28}\u{0E31}\u{0E1E}\u{0E17}\u{0E4C}\u{0E17}\u{0E31}\u{0E49}\u{0E07}\u{0E2B}\u{0E21}\u{0E14} \u{0E08}\u{0E30}\u{0E16}\u{0E39}\u{0E01}\u{0E25}\u{0E1A}"}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => { resetAllProgress(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-all active:scale-95"
                >
                  <RotateCcw className="h-3 w-3" />
                  {"\u{0E22}\u{0E37}\u{0E22}\u{0E31}\u{0E19}\u{0E23}\u{0E35}\u{0E40}\u{0E0B}\u{0E15}"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {"\u{0E22}\u{0E01}\u{0E40}\u{0E25}\u{0E34}\u{0E01}"}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/60 bg-white/60 px-3 py-2.5 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {"\u{0E23}\u{0E35}\u{0E40}\u{0E0B}\u{0E15}\u{0E02}\u{0E49}\u{0E2D}\u{0E21}\u{0E39}\u{0E25}\u{0E01}\u{0E32}\u{0E23}\u{0E40}\u{0E23}\u{0E35}\u{0E22}\u{0E19}"}
            </button>
          )}
        </div>

        {/* User info */}
        <div className="border-t border-slate-100/80 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100">
              <User className="h-4 w-4 text-violet-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-[11px] text-slate-400 truncate font-medium">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title={"\u{0E2D}\u{0E2D}\u{0E01}\u{0E08}\u{0E32}\u{0E01}\u{0E23}\u{0E30}\u{0E1A}\u{0E1A}"}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <main className="flex-1 lg:pl-[260px] pb-20 lg:pb-0">
        {/* ★ Mobile/Tablet Header — สำหรับทุกหน้าจอที่ไม่มี sidebar */}
        <header className="lg:hidden sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/50 bg-white/80 backdrop-blur-xl px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <GraduationCap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-sm font-extrabold text-slate-800 tracking-tight">GED Prep</span>
          </div>
          <div className="flex items-center gap-2">
            {/* ปุ่มแปลภาษา — ใหญ่ กดง่าย มองเห็นชัด */}
            <MobileLangToggle />
            {/* ปุ่มรีเซ็ต */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
              title={"\u{0E23}\u{0E35}\u{0E40}\u{0E0B}\u{0E15}\u{0E02}\u{0E49}\u{0E2D}\u{0E21}\u{0E39}\u{0E25}\u{0E01}\u{0E32}\u{0E23}\u{0E40}\u{0E23}\u{0E35}\u{0E22}\u{0E19}"}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={logout}
              className="flex items-center justify-center w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95"
              title={"\u{0E2D}\u{0E2D}\u{0E01}\u{0E08}\u{0E32}\u{0E01}\u{0E23}\u{0E30}\u{0E1A}\u{0E1A}"}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Mobile/Tablet Reset Confirm Dialog */}
        {showResetConfirm && (
          <div className="lg:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
            <div className="relative w-full max-w-md mx-4 sm:mx-0 rounded-t-2xl sm:rounded-2xl bg-white border-t sm:border border-slate-200 p-5 space-y-3 animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-rose-600" />
                <p className="text-sm font-bold text-slate-800">{"\u{0E23}\u{0E35}\u{0E40}\u{0E0B}\u{0E15}\u{0E02}\u{0E49}\u{0E2D}\u{0E21}\u{0E39}\u{0E25}\u{0E01}\u{0E32}\u{0E23}\u{0E40}\u{0E23}\u{0E35}\u{0E22}\u{0E19}\u{0E17}\u{0E31}\u{0E49}\u{0E07}\u{0E2B}\u{0E21}\u{0E14}?"}</p>
              </div>
              <p className="text-xs text-slate-500">{"\u{0E04}\u{0E27}\u{0E32}\u{0E21}\u{0E04}\u{0E37}\u{0E1A}\u{0E2B}\u{0E19}\u{0E49}\u{0E32}\u{0E04}\u{0E33}\u{0E28}\u{0E31}\u{0E1E}\u{0E17}\u{0E4C} \u{0E41}\u{0E25}\u{0E30} \u{0E02}\u{0E49}\u{0E2D}\u{0E21}\u{0E39}\u{0E25}\u{0E17}\u{0E31}\u{0E49}\u{0E07}\u{0E2B}\u{0E21}\u{0E14} \u{0E08}\u{0E30}\u{0E16}\u{0E39}\u{0E01}\u{0E25}\u{0E1A} \u{0E04}\u{0E38}\u{0E13}\u{0E15}\u{0E49}\u{0E2D}\u{0E07}\u{0E40}\u{0E23}\u{0E34}\u{0E48}\u{0E21}\u{0E40}\u{0E23}\u{0E35}\u{0E22}\u{0E19}\u{0E43}\u{0E2B}\u{0E21}\u{0E48}"}</p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => { resetAllProgress(); }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 transition-all active:scale-95"
                >
                  <RotateCcw className="h-4 w-4" />
                  {"\u{0E22}\u{0E37}\u{0E22}\u{0E31}\u{0E19}\u{0E23}\u{0E35}\u{0E40}\u{0E0B}\u{0E15}"}
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
                >
                  {"\u{0E22}\u{0E01}\u{0E40}\u{0E25}\u{0E34}\u{0E01}"}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}

/* ═══════════════ SUBJECT SIDEBAR LINK ═══════════════ */
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

/* ═══════════════ BOTTOM NAV (Mobile/Tablet) ═══════════════ */
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
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-center justify-around border-t border-slate-200/50 bg-white/95 backdrop-blur-xl safe-area-bottom">
      {/* ใช้ safe-area-inset-bottom สำหรับ iPhone ที่มี home indicator */}
      <div className="flex w-full items-center justify-around h-16 pb-[env(safe-area-inset-bottom)]">
        <button
          onClick={() => setView("dashboard")}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors active:scale-95 ${
            view === "dashboard" ? "text-violet-600" : "text-slate-400"
          }`}
        >
          <span className="text-xl">{"\u{1F3E0}"}</span>
          <span className="text-[10px] font-semibold">{"\u{0E2B}\u{0E19}\u{0E49}\u{0E32}\u{0E2B}\u{0E25}\u{0E31}\u{0E01}"}</span>
        </button>
        {subjectCodes.map((code) => {
          const meta = SUBJECT_META[code];
          const isActive = view === "subject" && selectedSubject?.code === code;
          return (
            <button
              key={code}
              onClick={() => navSubject(code)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-xl transition-colors active:scale-95 ${
                isActive ? "text-violet-600" : "text-slate-400"
              }`}
            >
              <span className="text-lg">{meta.icon}</span>
              <span className="text-[10px] font-semibold">{meta.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
