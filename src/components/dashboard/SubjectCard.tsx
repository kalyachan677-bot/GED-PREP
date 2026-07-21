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

interface SubjectCardProps {
  subject: SubjectSummary;
  onClick: () => void;
}

export function SubjectCard({ subject, onClick }: SubjectCardProps) {
  return (
    <Card
      className="group cursor-pointer border-0 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
      style={{ borderLeft: `4px solid ${subject.colorHex}` }}
      onClick={onClick}
    >
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{SUBJECT_ICONS[subject.code] || "📘"}</span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-400">
                {SUBJECT_LABELS[subject.code] || subject.code}
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900 leading-tight">
                {subject.title}
              </p>
            </div>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
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
        <div className="mt-3 h-1.5 w-full rounded-full bg-gray-100">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${subject.completionPct}%`,
              backgroundColor: subject.colorHex,
            }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-gray-400">
          {subject.completionPct}%
        </p>
      </CardContent>
    </Card>
  );
}