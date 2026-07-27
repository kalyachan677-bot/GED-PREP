"use client";

import { SubjectSummary } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, BookOpen, BarChart3 } from "lucide-react";

const SUBJECT_ICONS: Record<string, string> = {
  math: "🧮",
  science: "🔬",
  rla: "📖",
  ss: "🏛️",
};

const SUBJECT_LABELS: Record<string, string> = {
  math: "คณิตศาสตร์",
  science: "วิทยาศาสตร์",
  rla: "ภาษาอังกฤษ",
  ss: "สังคมศึกษา",
};

const SUBJECT_DESCS: Record<string, string> = {
  math: "สมการ เรขาคณิต สถิติ",
  science: "ชีววิทยา เคมี ฟิสิกส์",
  rla: "การอ่าน เขียน ไวยากรณ์",
  ss: "ประวัติศาสตร์ เศรษฐศาสตร์",
};

interface SubjectCardProps {
  subject: SubjectSummary;
  onClick: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <Card
      className="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-200 rounded-2xl"
      style={{ borderLeft: `4px solid ${subject.colorHex}` }}
      onClick={onClick}
    >
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{SUBJECT_ICONS[subject.code] || "📘"}</span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {SUBJECT_LABELS[subject.code] || subject.code}
              </p>
              <p className="mt-0.5 text-sm font-bold text-slate-900 leading-tight">
                {subject.title}
              </p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                {SUBJECT_DESCS[subject.code] || ""}
              </p>
            </div>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {subject.completedLessons}/{subject.totalLessons} บทเรียน
          </span>
          {subject.totalAttempts > 0 && (
            <span className="flex items-center gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              เฉลี่ย {subject.avgScore}%
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
        <p className="mt-1 text-right text-xs text-slate-400 font-medium">
          {subject.completionPct}%
        </p>
      </CardContent>
    </Card>
  );
}
