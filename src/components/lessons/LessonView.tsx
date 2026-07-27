"use client";

import { useAppStore, LessonDetail } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, Brain, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/ui/BackButton";
import { TranslatingIndicator } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/lib/useTranslation";
import { useState, useEffect, useMemo, useCallback } from "react";

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

// ดึงข้อความภาษาอังกฤษทั้งหมดจาก content blocks
function extractTexts(blocks: ContentBlock[]): string[] {
  const texts: string[] = [];
  for (const b of blocks) {
    if (b.content) texts.push(b.content);
    if (b.callout?.title) texts.push(b.callout.title);
    if (b.callout?.body) texts.push(b.callout.body);
    if (b.items) texts.push(...b.items);
  }
  return texts.filter((t) => t && t.trim().length > 0);
}

export function LessonView() {
  const { selectedLesson, setView, user, startQuiz } = useAppStore();
  const [startingQuiz, setStartingQuiz] = useState(false);
  const { language, translateBatch, isTranslating } = useTranslation();

  const blocks: ContentBlock[] = Array.isArray(selectedLesson?.bodyContent)
    ? (selectedLesson.bodyContent as ContentBlock[])
    : [];

  // สร้างชุดข้อความต้นฉบับ (stable reference)
  const originalTexts = useMemo(() => extractTexts(blocks), [blocks]);

  // translatedMap: originalText → translatedText
  const [translatedMap, setTranslatedMap] = useState<Record<string, string>>({});

  // เรียกแปลเมื่อเปลี่ยนภาษา
  const doTranslate = useCallback(async () => {
    if (language === "en" || originalTexts.length === 0) {
      setTranslatedMap({});
      return;
    }
    const results = await translateBatch(originalTexts);
    const map: Record<string, string> = {};
    originalTexts.forEach((orig, i) => {
      if (results[i] && results[i] !== orig) map[orig] = results[i];
    });
    setTranslatedMap(map);
  }, [language, originalTexts, translateBatch]);

  useEffect(() => {
    doTranslate();
  }, [doTranslate]);

  // helper แปลข้อความเดี่ยว
  const tr = useCallback(
    (text: string | undefined): string => {
      if (!text) return "";
      if (language === "en") return text;
      return translatedMap[text] || text;
    },
    [language, translatedMap]
  );

  if (!selectedLesson) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

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
      {/* Back button + Breadcrumb + Translate indicator */}
      <div className="flex items-center justify-between gap-4">
        <BackButton label={tr(subjectTitle) || "วิชาเรียน"} onClick={handleBack} />
        <div className="flex items-center gap-3 min-w-0">
          <TranslatingIndicator isTranslating={isTranslating} />
          <div className="hidden sm:flex items-center gap-1.5 text-sm">
            <span className="text-slate-400 truncate font-medium">{tr(subjectTitle)}</span>
            {topicTitle && <>
              <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
              <span className="text-slate-400 truncate font-medium">{tr(topicTitle)}</span>
            </>}
            <ChevronRight className="h-3.5 w-3.5 text-slate-300 shrink-0" />
            <span className="font-bold text-slate-800 truncate">{tr(selectedLesson.title)}</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{tr(selectedLesson.title)}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500 font-medium">
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
          <BlockRenderer key={block.id} block={block} tr={tr} />
        ))}
      </div>

      {/* Quiz button */}
      {selectedLesson.questions && selectedLesson.questions.length > 0 && (
        <div className="border-t pt-8">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="h-5 w-5 text-violet-600" />
            <h2 className="text-lg font-bold text-slate-800">
              แบบทดสอบ ({selectedLesson.questions.length} คำถาม)
            </h2>
          </div>
          <Button
            onClick={handleStartQuiz}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200/50"
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

function BlockRenderer({ block, tr }: { block: ContentBlock; tr: (s: string | undefined) => string }) {
  if (block.block_type === "heading") {
    const Tag = (`h${block.level || 2}`) as keyof JSX.IntrinsicElements;
    const cls = block.level === 2
      ? "text-xl font-bold text-slate-900 mt-6 mb-2"
      : "text-lg font-semibold text-slate-800 mt-4 mb-1";
    return <Tag className={cls}>{tr(block.content)}</Tag>;
  }

  if (block.block_type === "paragraph") {
    return (
      <p
        className="text-slate-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: tr(block.content) || "" }}
      />
    );
  }

  if (block.block_type === "callout" && block.callout) {
    return (
      <div
        className={`rounded-lg border-l-4 p-4 ${CALLOUT_COLORS[block.callout.variant] || CALLOUT_COLORS.info}`}
      >
        {block.callout.title && (
          <p className="font-semibold text-gray-900 text-sm">{tr(block.callout.title)}</p>
        )}
        <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">{tr(block.callout.body)}</p>
      </div>
    );
  }

  if (block.block_type === "numbered_list" && block.items) {
    return (
      <ol className="list-decimal pl-5 space-y-1 text-gray-700">
        {block.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: tr(item) || "" }} />
        ))}
      </ol>
    );
  }

  if (block.block_type === "bullet_list" && block.items) {
    return (
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {block.items.map((item, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: tr(item) || "" }} />
        ))}
      </ul>
    );
  }

  if (block.block_type === "divider") {
    return <hr className="my-6 border-gray-200" />;
  }

  return null;
}