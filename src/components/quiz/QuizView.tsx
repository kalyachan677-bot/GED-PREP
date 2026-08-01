"use client";

import { useAppStore, QuizQuestion } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback, useMemo } from "react";
import { ChevronLeft, ChevronRight, Flag, Clock, Send, Loader2, HelpCircle, BookOpen } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { TranslatingIndicator } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/lib/useTranslation";
import { useText } from "@/lib/ui-texts";

export function QuizView() {
  const { quizAttempt, quizQuestions, user, setQuizResult, clearQuiz, setView } = useAppStore();
  const { tx } = useText();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [startTime] = useState(Date.now());
  const [questionStart, setQuestionStart] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showConceptPanel, setShowConceptPanel] = useState(false);
  const [conceptData, setConceptData] = useState<any>(null);
  const [loadingConcept, setLoadingConcept] = useState(false);

  const { language, translateBatch, isTranslating } = useTranslation();

  // Extract all texts to translate from each question
  const allTexts = useMemo(() => {
    const texts: string[] = [];
    for (const q of quizQuestions) {
      if (q.questionText) texts.push(q.questionText);
      if (q.hintText) texts.push(q.hintText);
      for (const a of q.answers) texts.push(a.content);
    }
    return texts;
  }, [quizQuestions]);

  const [translatedMap, setTranslatedMap] = useState<Record<string, string>>({});

  const doTranslate = useCallback(async () => {
    if (language === "en" || allTexts.length === 0) {
      setTranslatedMap({});
      return;
    }
    const results = await translateBatch(allTexts);
    const map: Record<string, string> = {};
    allTexts.forEach((orig, i) => {
      if (results[i] && results[i] !== orig) map[orig] = results[i];
    });
    setTranslatedMap(map);
  }, [language, allTexts, translateBatch]);

  useEffect(() => {
    doTranslate();
  }, [doTranslate]);

  const tr = useCallback(
    (text: string | undefined): string => {
      if (!text) return "";
      if (language === "en") return text;
      return translatedMap[text] || text;
    },
    [language, translatedMap]
  );

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

  async function openConceptGuide(conceptId: string) {
    setShowConceptPanel(true);
    setLoadingConcept(true);
    try {
      const res = await fetch(`/api/handbook/concept/${conceptId}`);
      const json = await res.json();
      if (json.data) setConceptData(json.data);
    } catch (e) {
      console.error('Failed to load concept', e);
    } finally {
      setLoadingConcept(false);
    }
  }

  if (!quizAttempt || quizQuestions.length === 0) return null;

  const answeredCount = Object.keys(selectedAnswers).length;

  // Extract question text
  const questionDisplayText = question?.questionText
    ? tr(question.questionText)
    : question?.hintText
      ? tr(question.hintText)
      : tx("questionN", { n: currentIdx + 1 });

  return (
    <div className="space-y-4">
      {/* Exit confirm dialog */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">{tx("exitQuiz")}</h3>
            <p className="mt-2 text-sm text-gray-600">
              {tx("exitQuizMsg", { n: Object.keys(selectedAnswers).length, m: totalQ })}
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all"
              >
                {tx("continue")}
              </button>
              <button
                onClick={confirmExit}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-600 transition-all"
              >
                {tx("exitQuizBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <BackButton label={tx("backToLesson")} onClick={handleExit} />
        <div className="flex items-center gap-2">
          <TranslatingIndicator isTranslating={isTranslating} />
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            {formatTime(elapsed)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all"
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
                ? "bg-violet-500 text-white shadow-md"
                : selectedAnswers[q.id]
                ? "bg-violet-50 text-violet-700 border border-violet-200"
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
        <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
          {/* Question header */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50/80 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-bold text-white shadow-sm">
                {currentIdx + 1}
              </span>
              <Badge
                variant="outline"
                className={`text-xs font-medium ${
                  question.difficulty === "easy"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : question.difficulty === "medium"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {question.difficulty === "easy" ? tx("easy") : question.difficulty === "medium" ? tx("medium") : tx("hard")}
              </Badge>
            </div>
            <button
              onClick={toggleFlag}
              className={`p-2 rounded-xl transition-all ${
                flagged.has(question.id)
                  ? "text-amber-500 bg-amber-50"
                  : "text-gray-300 hover:text-gray-500 hover:bg-gray-50"
              }`}
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>

          {/* Question text — PROMINENT */}
          <div className="px-5 py-5 bg-gradient-to-br from-violet-50/50 to-indigo-50/30 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-base font-semibold text-slate-900 leading-relaxed">
                  {questionDisplayText}
                </p>
                {question.relatedConceptId && (
                  <button
                    onClick={() => openConceptGuide(question.relatedConceptId!)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100 transition-all"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    {tx("readConceptGuide")}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Answers */}
          <div className="p-5 space-y-3">
            {question.answers.map((answer, i) => {
              const isSelected = selectedAnswers[question.id] === answer.id;
              return (
                <button
                  key={answer.id}
                  onClick={() => selectAnswer(answer.id)}
                  className={`flex w-full items-center gap-3.5 rounded-xl border-2 px-4 py-3.5 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-violet-500 bg-violet-50 ring-1 ring-violet-200 shadow-sm"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      isSelected
                        ? "bg-violet-500 text-white shadow-sm"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-slate-700 font-medium">{tr(answer.content)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goPrev}
          disabled={currentIdx === 0}
          className="rounded-xl"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {tx("previous")}
        </Button>

        {currentIdx === totalQ - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting || answeredCount < totalQ}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-200/50"
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            {tx("submitAnswer", { n: answeredCount, m: totalQ })}
          </Button>
        ) : (
          <Button onClick={goNext} variant="outline" className="rounded-xl">
            {tx("next")}
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
                ? "bg-violet-500"
                : selectedAnswers[q.id]
                ? "bg-violet-300"
                : flagged.has(q.id)
                ? "bg-amber-400"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Concept Guide Panel */}
      {showConceptPanel && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowConceptPanel(false)} />
          <div className="relative w-full sm:max-w-lg max-h-[80vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4 rounded-t-2xl sm:rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-white" />
                  <h3 className="text-base font-bold text-white">
                    {language === "th" && conceptData?.titleTh ? conceptData.titleTh : conceptData?.titleMm ? (language === "my" ? conceptData.titleMm : conceptData?.title) : conceptData?.title || "..."}
                  </h3>
                </div>
                <button onClick={() => setShowConceptPanel(false)} className="text-white/80 hover:text-white text-xl font-bold">&times;</button>
              </div>
            </div>
            <div className="p-5">
              {loadingConcept ? (
                <div className="flex items-center justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-blue-500" /></div>
              ) : conceptData?.contents?.[0] ? (
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap">
                    {language === "th" && conceptData.contents[0].contentBodyTh
                      ? conceptData.contents[0].contentBodyTh
                      : language === "my" && conceptData.contents[0].contentBodyMm
                        ? conceptData.contents[0].contentBodyMm
                        : conceptData.contents[0].contentBodyEn}
                  </div>
                  {conceptData.contents[0].keyTakeaways?.length > 0 && (
                    <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                      <p className="text-xs font-bold text-amber-800 mb-2">{tx("keyTakeaways")}</p>
                      <ul className="space-y-1">
                        {conceptData.contents[0].keyTakeaways.slice(0, 5).map((t: string, i: number) => (
                          <li key={i} className="text-xs text-amber-900">{t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {conceptData.contents[0].formulaOrRules?.length > 0 && conceptData.contents[0].formulaOrRules[0] && (
                    <div className="rounded-xl bg-violet-50 border border-violet-200 p-4">
                      <p className="text-xs font-bold text-violet-800 mb-2">{tx("formulasAndRules")}</p>
                      <ul className="space-y-1">
                        {conceptData.contents[0].formulaOrRules.slice(0, 8).map((f: string, i: number) => (
                          <li key={i} className="text-xs text-violet-900 font-mono">{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No content available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
