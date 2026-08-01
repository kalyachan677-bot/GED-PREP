"use client";

import { useAppStore, markQuizDone } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw, ArrowLeft, HelpCircle, BookOpen } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { TranslatingIndicator } from "@/components/ui/LanguageToggle";
import { ConceptGuidePanel } from "@/components/handbook/HandbookView";
import { useTranslation } from "@/lib/useTranslation";
import { useText } from "@/lib/ui-texts";
import { useEffect, useMemo, useState, useCallback } from "react";

export function QuizResult() {
  const { quizResult, quizQuestions, setView, clearQuiz } = useAppStore();
  const { language, translateBatch, isTranslating } = useTranslation();
  const { tx } = useText();
  const [expandedWrong, setExpandedWrong] = useState<string | null>(null);

  // Extract texts to translate: questionText + explanations + answer contents
  const allTexts = useMemo(() => {
    if (!quizResult) return [];
    const texts: string[] = [];
    for (let i = 0; i < quizResult.results.length; i++) {
      const r = quizResult.results[i];
      const q = quizQuestions[i];
      if (q?.questionText) texts.push(q.questionText);
      if (r.explanation) texts.push(r.explanation);
      for (const a of r.allAnswers) texts.push(a.content);
    }
    return texts;
  }, [quizResult, quizQuestions]);

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

  // Mark quiz as done for rigor tracking + save score for rigor locking
  useEffect(() => {
    if (quizResult) {
      markQuizDone();
      // Save score for rigor lock checking
      try {
        const subjectId = quizResult.attempt.id; // We'll use attempt's subject context
        // Store in a generic key since we don't have subjectId directly here
        const scores: number[] = JSON.parse(localStorage.getItem("ged-recent-quiz-scores") || "[]");
        scores.unshift(quizResult.attempt.scorePercent);
        localStorage.setItem("ged-recent-quiz-scores", JSON.stringify(scores.slice(0, 10)));
      } catch { /* ignore */ }
    }
  }, [quizResult]);

  if (!quizResult) return null;

  const { attempt, results } = quizResult;
  const score = attempt.scorePercent;
  const timeMin = Math.floor(attempt.timeSpentSecs / 60);
  const timeSec = attempt.timeSpentSecs % 60;

  function handleBackToLesson() {
    clearQuiz();
    setView("lesson");
  }

  function handleRetry() {
    clearQuiz();
    setView("lesson");
  }

  const scoreColor =
    score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-rose-600";
  const scoreBg =
    score >= 80 ? "bg-emerald-50" : score >= 60 ? "bg-amber-50" : "bg-rose-50";
  const scoreRing =
    score >= 80 ? "stroke-emerald-500" : score >= 60 ? "stroke-amber-500" : "stroke-rose-500";

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Back button + indicator */}
      <div className="flex items-center justify-between">
        <BackButton label={tx("backToLesson")} onClick={handleBackToLesson} />
        <TranslatingIndicator isTranslating={isTranslating} />
      </div>

      {/* Score card */}
      <div className="rounded-2xl border border-slate-200/60 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-8 flex flex-col items-center">
          {/* Circular progress */}
          <div className="relative h-36 w-36">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#f1f5f9"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                className={scoreRing}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Trophy className={`h-5 w-5 mb-1 ${scoreColor}`} />
              <span className={`text-3xl font-extrabold ${scoreColor}`}>
                {score.toFixed(0)}%
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              {attempt.correctCount}/{attempt.totalQuestions} {tx("correct")}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-slate-400" />
              {timeMin}:{timeSec.toString().padStart(2, "0")}
            </span>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              onClick={handleBackToLesson}
              className="rounded-xl"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {tx("backToLessonBtn")}
            </Button>
            <Button
              onClick={handleRetry}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-200/50"
            >
              <RotateCcw className="mr-1 h-4 w-4" />
              {tx("tryAgain")}
            </Button>
          </div>
        </div>
      </div>

      {/* Question review */}
      <div>
        <h2 className="mb-4 text-lg font-extrabold text-slate-800 tracking-tight">{tx("reviewAnswers")}</h2>
        <div className="space-y-3">
          {results.map((result, i) => {
            const q = quizQuestions[i];
            const questionText = q?.questionText
              ? tr(q.questionText)
              : tx("questionN", { n: i + 1 });
            return (
              <div
                key={result.questionId}
                className={`rounded-2xl border overflow-hidden ${
                  result.isCorrect
                    ? "border-emerald-100 bg-white"
                    : "border-rose-100 bg-white"
                } shadow-sm`}
              >
                {/* Question header */}
                <div className={`flex items-center gap-3 px-4 py-3 ${
                  result.isCorrect ? "bg-emerald-50/50" : "bg-rose-50/50"
                }`}>
                  {result.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-rose-500 shrink-0" />
                  )}
                  <div className="flex items-center gap-2 min-w-0">
                    <HelpCircle className="h-4 w-4 text-slate-400 shrink-0" />
                    <p className="text-sm font-semibold text-slate-800 truncate">{questionText}</p>
                  </div>
                </div>

                {/* Answer details */}
                <div className="px-4 py-3 space-y-2">
                  {/* Your answer */}
                  {result.selectedAnswerIds.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1">{tx("yourAnswer")}</p>
                      {result.allAnswers
                        .filter((a) => result.selectedAnswerIds.includes(a.id))
                        .map((a) => (
                          <span
                            key={a.id}
                            className={`inline-block rounded-lg px-3 py-1.5 text-sm mr-2 font-medium ${
                              result.isCorrect
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {tr(a.content)}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Correct answer (show if wrong) */}
                  {!result.isCorrect && (
                    <div>
                      <p className="text-xs text-slate-400 font-medium mb-1">{tx("correctAnswer")}</p>
                      {result.allAnswers
                        .filter((a) => result.correctAnswerIds.includes(a.id))
                        .map((a) => (
                          <span
                            key={a.id}
                            className="inline-block rounded-lg bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700 border border-emerald-200 mr-2 font-medium"
                          >
                            {tr(a.content)}
                          </span>
                        ))}
                    </div>
                  )}

                  {/* Explanation */}
                  {result.explanation && (
                    <div className="rounded-lg bg-slate-50 px-3 py-2">
                      <p className="text-xs text-slate-500">
                        💡 {tr(result.explanation)}
                      </p>
                    </div>
                  )}
                  {result.isCorrect ? null : q?.relatedConceptId ? (
                    <div className="pt-1">
                      <ConceptGuidePanel conceptId={q.relatedConceptId} />
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
