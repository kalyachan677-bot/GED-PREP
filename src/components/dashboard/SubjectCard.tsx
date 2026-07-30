"use client";

import { SubjectSummary } from "@/lib/store";
import { useText } from "@/lib/ui-texts";
import { ChevronRight, BookOpen, BarChart3 } from "lucide-react";

const SUBJECT_ICONS: Record<string, string> = {
  math: "🧮",
  science: "🔬",
  rla: "📖",
  ss: "🏛️",
};

const SUBJECT_LABEL_KEYS: Record<string, string> = {
  math: "math",
  science: "science",
  rla: "rla",
  ss: "ss",
};

const SUBJECT_DESC_KEYS: Record<string, string> = {
  math: "mathDesc",
  science: "scienceDesc",
  rla: "rlaDesc",
  ss: "ssDesc",
};

interface SubjectCardProps {
  subject: SubjectSummary;
  onClick: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  const { tx } = useText();

  return (
    <div
      className="group cursor-pointer rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden"
      onClick={onClick}
    >
      {/* Color accent top bar */}
      <div
        className="h-1.5 w-full"
        style={{ backgroundColor: subject.colorHex }}
      />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl shadow-sm"
              style={{ backgroundColor: subject.colorHex + "15" }}
            >
              {SUBJECT_ICONS[subject.code] || "📘"}
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {tx(SUBJECT_LABEL_KEYS[subject.code] || "math")}
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 leading-tight">
                {subject.title}
              </p>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
                {tx(SUBJECT_DESC_KEYS[subject.code] || "")}
              </p>
            </div>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {subject.completedLessons}/{subject.totalLessons} {tx("lessons")}
          </span>
          {subject.totalAttempts > 0 && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              {tx("avg")} {subject.avgScore}%
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${subject.completionPct}%`,
              backgroundColor: subject.colorHex,
            }}
          />
        </div>
        <p className="mt-1.5 text-right text-xs text-slate-400 font-semibold">
          {subject.completionPct}% {tx("completed")}
        </p>
      </div>
    </div>
  );
}
