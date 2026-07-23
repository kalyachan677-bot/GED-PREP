"use client";

import { useAppStore, AppLanguage } from "@/lib/store";
import { Languages, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LANG_OPTIONS: { code: AppLanguage; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "th", label: "ไทย", flag: "🇹🇭" },
  { code: "my", label: "မြန်မာ", flag: "🇲🇲" },
];

export function LanguageToggle() {
  const { language, setLanguage } = useAppStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // คลิกนอก dropdown ให้ปิด
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = LANG_OPTIONS.find((l) => l.code === language) || LANG_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95"
        title="เปลี่ยนภาษา / Change Language"
      >
        <Languages className="h-4 w-4 text-gray-500" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline text-xs">{current.label}</span>
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* dropdown */}
          <div className="absolute right-0 top-full z-50 mt-1.5 w-44 rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg animate-in fade-in slide-in-from-top-1 duration-150">
            <p className="px-3 pb-1.5 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              เลือกภาษา
            </p>
            {LANG_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setLanguage(opt.code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  language === opt.code
                    ? "bg-teal-50 text-teal-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span className="text-base leading-none">{opt.flag}</span>
                <span className="flex-1 text-left">{opt.label}</span>
                {language === opt.code && (
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/** แสดง loading indicator ขณะแปล */
export function TranslatingIndicator({ isTranslating }: { isTranslating: boolean }) {
  if (!isTranslating) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700">
      <Loader2 className="h-3 w-3 animate-spin" />
      กำลังแปล...
    </div>
  );
}