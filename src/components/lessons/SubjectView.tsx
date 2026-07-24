"use client";

import { useAppStore, SubjectFull } from "@/lib/store";
import { ChevronDown, ChevronRight, CheckCircle2, Circle, Clock, BookOpen } from "lucide-react";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/BackButton";
import { VocabReview } from "./VocabReview";

export function SubjectView() {
  const { selectedSubject, setView, setSelectedLesson, user } = useAppStore();

  if (!selectedSubject) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const totalLessons = selectedSubject.modules.reduce(
    (sum, m) => sum + m.topics.reduce((s, t) => s + t.lessons.length, 0),
    0
  );
  const completedLessons = selectedSubject.modules.reduce(
    (sum, m) => sum + m.topics.reduce(
      (s, t) => s + t.lessons.filter((l) => l.progress?.isCompleted).length,
      0
    ),
    0
  );

  async function openLesson(lessonId: string) {
    setView("lesson");
    setSelectedLesson(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}`);
      const json = await res.json();
      if (json.data) setSelectedLesson(json.data);
    } catch (e) {
      console.error("Failed to load lesson", e);
    }
  }

  return (
    <div className="space-y-6">
      {/* Back button + Breadcrumb */}
      <div className="flex items-center justify-between">
        <BackButton label="แดชบอร์ด" onClick={() => { setView("dashboard"); setSelectedSubject(null); }} />
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">แดชบอร์ด</span>
          <ChevronRight className="h-3.5 w-3.5 text-gray-300" />
          <span className="font-medium text-gray-900">{selectedSubject.title}</span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{selectedSubject.title}</h1>
        <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            {completedLessons}/{totalLessons} บทเรียน
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}% สำเร็จ
          </span>
        </div>
      </div>

      {/* ทบทวนคำศัพท์ของวิชานี้ */}
      {selectedSubject.id && (
        <VocabReview subjectId={selectedSubject.id} />
      )}

      {/* Modules */}
      <div className="space-y-3">
        {selectedSubject.modules.map((mod) => (
          <ModuleSection key={mod.id} module={mod} onOpenLesson={openLesson} />
        ))}
      </div>
    </div>
  );
}

function ModuleSection({ module, onOpenLesson }: { module: SubjectFull["modules"][0]; onOpenLesson: (id: string) => void }) {
  const [open, setOpen] = useState(true);
  const totalLessons = module.topics.reduce((s, t) => s + t.lessons.length, 0);

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
      >
        <div>
          <p className="font-semibold text-gray-900">{module.title}</p>
          <p className="mt-0.5 text-xs text-gray-400">{totalLessons} บทเรียน</p>
        </div>
        {open ? (
          <ChevronDown className="h-4 w-4 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-400" />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-50 px-4 py-2">
          {module.topics.map((topic) => (
            <div key={topic.id} className="mb-3 last:mb-0">
              <p className="px-2 pt-2 pb-1 text-xs font-medium text-gray-400 uppercase tracking-wider">
                {topic.title}
              </p>
              {topic.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => onOpenLesson(lesson.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50 group"
                >
                  {lesson.progress?.isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                      {lesson.title}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                    <Clock className="h-3 w-3" />
                    {lesson.durationMinutes} นาที
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}