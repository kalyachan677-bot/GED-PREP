"use client";

import { useAppStore, QuizQuestion, QuizResult } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Flag, Clock, Send, Loader2 } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";

export function QuizView() {
  const { quizAttempt, quizQuestions, user, setQuizResult, clearQuiz, setView, selectedLesson } = useAppStore();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  function handleExit() {
    const answered = Object.keys(selectedAnswers).length;
    if (answered > 0) {
      setShowExitConfirm(true);
    } else {
      clearQuiz();
      setView("lesson");
    }
  }

  function confirmExit() {
    setShowExitConfirm(false);
    clearQuiz();
    setView("lesson");
  }

  const question = quizQuestions[currentIdx];
  const totalQ = quizQuestions.length;

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  function formatTime(secs: number) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function selectAnswer(answerId: string) {
    if (!question) return;
    setSelectedAnswers((prev) => ({ ...prev, [question.id]: answerId }));
  }

  function toggleFlag() {
    if (!question) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(question.id)) next.delete(question.id);
      else next.add(question.id);
      return next;
    });
  }

  function goNext() {
    if (currentIdx < totalQ - 1) {
      setCurrentIdx((i) => i + 1);
      setQuestionStart(Date.now());
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      setCurrentIdx((i) => i - 1);
      setQuestionStart(Date.now());
    }
  }

  const handleSubmit = useCallback(async () => {
    if (!quizAttempt || !user) return;
    setSubmitting(true);
    try {
      const answers = quizQuestions.map((q) => ({
        questionId: q.id,
        selectedAnswerIds: selectedAnswers[q.id] ? [selectedAnswers[q.id]] : [],
        timeSpentSecs: 10,
        isFlagged: flagged.has(q.id),
      }));

      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId: quizAttempt.id, answers }),
      });
      const json = await res.json();
      if (json.data) {
        setQuizResult(json.data);
      }
    } catch (e) {
      console.error("Failed to submit quiz", e);
    } finally {
      setSubmitting(false);
    }
  }, [quizAttempt, user, quizQuestions, selectedAnswers, flagged, setQuizResult]);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "n") goNext();
      if (e.key === "ArrowLeft" || e.key === "p") goPrev();
      if (e.key >= "1" && e.key <= "4" && question) {
        const idx = parseInt(e.key) - 1;
        if (question.answers[idx]) selectAnswer(question.answers[idx].id);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  });

  if (!quizAttempt || quizQuestions.length === 0) return null;

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="space-y-4">
      {/* Exit confirm dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">ออกจากแบบทดสอบ?</h3>
            <p className="mt-2 text-sm text-gray-600">
              คุณตอบไปแล้ว {Object.keys(selectedAnswers).length} ข้อจาก {totalQ} ข้อ หากออกตอนนี้คะแนนจะไม่ถูกบันทึก
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                ทำต่อ
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600"
              >
                ออกจากแบบทดสอบ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <BackButton label="บทเรียน" onClick={handleExit} />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          {formatTime(elapsed)}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-teal-500 transition-all"
            style={{ width: `${((currentIdx + 1) / totalQ) * 100}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-500 shrink-0">
          {currentIdx + 1}/{totalQ}
        </span>
      </div>

      {/* Question navigator - desktop */}
      <div className="hidden lg:flex gap-2 flex-wrap">
        {quizQuestions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => { setCurrentIdx(i); setQuestionStart(Date.now()); }}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
              i === currentIdx
                ? "bg-teal-500 text-white"
                : selectedAnswers[q.id]
                ? "bg-teal-50 text-teal-700 border border-teal-200"
                : flagged.has(q.id)
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      {question && (
        <Card className="border-0 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700">
                  {currentIdx + 1}
                </span>
                <Badge variant="outline" className="text-xs">
                  {question.difficulty === "easy" ? "ง่าย" : question.difficulty === "medium" ? "ปานกลาง" : "ยาก"}
                </Badge>
              </div>
              <button
                onClick={toggleFlag}
                className={`p-1.5 rounded-lg transition-colors ${
                  flagged.has(question.id)
                    ? "text-amber-500 bg-amber-50"
                    : "text-gray-300 hover:text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Flag className="h-4 w-4" />
              </button>
            </div>

            {/* Question text - show hintText as placeholder since we don't have questionText in schema */}
            <p className="text-base font-medium text-gray-900 mb-6">
              {question.questionText || question.hintText || `คำถามที่ ${currentIdx + 1}`}
            </p>

            {/* Answers */}
            <div className="space-y-3">
              {question.answers.map((answer, i) => (
                <button
                  key={answer.id}
                  onClick={() => selectAnswer(answer.id)}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                    selectedAnswers[question.id] === answer.id
                      ? "border-teal-500 bg-teal-50 ring-1 ring-teal-200"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      selectedAnswers[question.id] === answer.id
                        ? "bg-teal-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-gray-700">{answer.content}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          ก่อนหน้า
        </Button>

        {currentIdx === totalQ - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < totalQ}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            ส่งคำตอบ ({answeredCount}/{totalQ})
          </Button>
        ) : (
          <Button onClick={goNext} variant="outline">
            ถัดไป
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Mobile question dots */}
      <div className="flex lg:hidden justify-center gap-1.5 flex-wrap pb-4">
        {quizQuestions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => { setCurrentIdx(i); setQuestionStart(Date.now()); }}
            className={`h-2.5 w-2.5 rounded-full transition-colors ${
              i === currentIdx
                ? "bg-teal-500"
                : selectedAnswers[q.id]
                ? "bg-teal-300"
                : flagged.has(q.id)
                ? "bg-amber-400"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}