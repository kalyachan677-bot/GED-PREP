"use client";

import { useAppStore, LessonDetail } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Brain, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/BackButton";
import { useState } from "react";

interface ContentBlock {
  id: string;
  block_type: string;
  content?: string;
  level?: number;
  items?: string[];
  callout?: { variant: string; title: string; body: string };
}

const CALLOUT_COLORS: Record<string, string> = {
  tip: "border-teal-200 bg-teal-50",
  warning: "border-amber-200 bg-amber-50",
  info: "border-sky-200 bg-sky-50",
  formula: "border-violet-200 bg-violet-50",
  remember: "border-blue-200 bg-blue-50",
  example: "border-orange-200 bg-orange-50",
};

export function LessonView() {
  const { selectedLesson, setView, setSelectedSubject, user, startQuiz } = useAppStore();
  const [startingQuiz, setStartingQuiz] = useState(false);

  if (!selectedLesson) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  const blocks: ContentBlock[] = Array.isArray(selectedLesson.bodyContent)
    ? selectedLesson.bodyContent
    : [];

  async function handleStartQuiz() {
    if (!user || !selectedLesson) return;
    setStartingQuiz(true);
    try {
      const subjectId = selectedLesson.topic?.module?.subject?.id;
      if (!subjectId) return;
      const res = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          subjectId,
          lessonId: selectedLesson.id,
          quizType: "lesson_quiz",
        }),
      });
      const json = await res.json();
      if (json.data) {
        startQuiz(json.data.attempt, json.data.questions);
      }
    } catch (e) {
      console.error("Failed to start quiz", e);
    } finally {
      setStartingQuiz(false);
    }
  }

  function handleBack() {
    setView("subject");
  }

  const subjectTitle = selectedLesson.topic?.module?.subject?.title;
  const topicTitle = selectedLesson.topic?.title;

  return (
    <div className="space-y-6">
      {/* Back button + Breadcrumb */}
      <div className="flex items-center justify-between gap-4">
        <BackButton label={subjectTitle || "วิชาเรียน"} onClick={handleBack} />
        <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-gray-400 truncate">{subjectTitle}</span>
          {topicTitle && <>
            <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
            <span className="text-gray-400 truncate">{topicTitle}</span>
          </>}
          <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
          <span className="font-medium text-gray-900 truncate">{selectedLesson.title}</span>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{selectedLesson.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {selectedLesson.durationMinutes} นาที
          </span>
          <Badge variant="secondary">{selectedLesson.contentType}</Badge>
        </div>
      </div>

      {/* Content blocks */}
      <div className="space-y-5">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} />
        ))}
      </div>

      {/* Quiz button */}
      {selectedLesson.questions && selectedLesson.questions.length > 0 && (
        <div className="border-t pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              แบบทดสอบ ({selectedLesson.questions.length} คำถาม)
            </h2>
          </div>
          <Button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            size="lg"
            disabled={startingQuiz}
          >
            {startingQuiz && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            เริ่มทำแบบทดสอบ
          </Button>
        </div>
      )}
    </div>
  );
}

function BlockRenderer({ block }: { block: ContentBlock }) {
  if (block.block_type === "heading") {
    const Tag = (`h${block.level || 2}`) as keyof JSX.IntrinsicElements;
    const cls = block.level === 2
      ? "text-xl font-semibold text-gray-900 mt-6 mb-2"
      : "text-lg font-medium text-gray-800 mt-4 mb-1";
    return <Tag className={cls}>{block.content}</Tag>;
  }

  if (block.block_type === "paragraph") {
    return (
      <p
        className="text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: block.content || "" }}
      />
    );
  }

  if (block.block_type === "callout" && block.callout) {
    return (
      <div
        className={`rounded-lg border-l-4 p-4 ${CALLOUT_COLORS[block.callout.variant] || CALLOUT_COLORS.info}`}
      >
        {block.callout.title && (
          <p className="font-semibold text-gray-900 text-sm">{block.callout.title}</p>
        )}
        <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{block.callout.body}</p>
      </div>
    );
  }

  if (block.block_type === "numbered_list" && block.items) {
    return (
      <ol className="list-decimal pl-5 space-y-1 text-gray-700">
        {block.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ol>
    );
  }

  if (block.block_type === "bullet_list" && block.items) {
    return (
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {block.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
        ))}
      </ul>
    );
  }

  if (block.block_type === "divider") {
    return <hr className="my-6 border-gray-200" />;
  }

  return null;
}