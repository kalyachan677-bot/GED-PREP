"use client";

import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { BackButton } from "@/components/ui/BackButton";
import { TranslatingIndicator } from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/lib/useTranslation";
import { useEffect, useMemo, useState, useCallback } from "react";

export function QuizResult() {
  const { quizResult, quizQuestions, setView, clearQuiz } = useAppStore();
  const { language, translateBatch, isTranslating } = useTranslation();

  // ดึงข้อความที่ต้องแปล: explanations + answer contents
  const allTexts = useMemo(() => {
    if (!quizResult) return [];
    const texts: string[] = [];
    for (const r of quizResult.results) {
      if (r.explanation) texts.push(r.explanation);
      for (const a of r.allAnswers) texts.push(a.content);
    }
    return texts;
  }, [quizResult]);

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
    score >= 80 ? "text-teal-600" : score >= 60 ? "text-amber-600" : "text-rose-600";
  const scoreBg =
    score >= 80 ? "bg-teal-50" : score >= 60 ? "bg-amber-50" : "bg-rose-50";
  const scoreRing =
    score >= 80 ? "stroke-teal-500" : score >= 60 ? "stroke-amber-500" : "stroke-rose-500";

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Back button + indicator */}
      <div className="flex items-center justify-between">
        <BackButton label="บทเรียน" onClick={handleBackToLesson} />
        <TranslatingIndicator isTranslating={isTranslating} />
      </div>

      {/* Score card */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center">
            {/* Circular progress */}
            <div className="relative h-36 w-36">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#f3f4f6"
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
                <span className={`text-3xl font-bold ${scoreColor}`}>
                  {score.toFixed(0)}%
                </span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-teal-500" />
                {attempt.correctCount}/{attempt.totalQuestions} ถูกต้อง
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                {timeMin}:{timeSec.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={handleBackToLesson}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                กลับบทเรียน
              </Button>
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
              >
                <RotateCcw className="mr-1 h-4 w-4" />
                ลองอีกครั้ง
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question review */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">📝 ทบทวนคำตอบ</h2>
        <div className="space-y-3">
          {results.map((result, i) => (
            <Card key={result.questionId} className="border-0 shadow-sm">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {result.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-teal-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      คำถามที่ {i + 1}
                    </p>

                    {/* Your answer */}
                    {result.selectedAnswerIds.length > 0 && (
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 mb-1">คำตอบของคุณ:</p>
                        {result.allAnswers
                          .filter((a) => result.selectedAnswerIds.includes(a.id))
                          .map((a) => (
                            <span
                              key={a.id}
                              className={`inline-block rounded-lg px-3 py-1.5 text-sm mr-2 ${
                                result.isCorrect
                                  ? "bg-teal-50 text-teal-700 border border-teal-200"
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
                      <div className="mb-2">
                        <p className="text-xs text-gray-400 mb-1">คำตอบที่ถูกต้อง:</p>
                        {result.allAnswers
                          .filter((a) => result.correctAnswerIds.includes(a.id))
                          .map((a) => (
                            <span
                              key={a.id}
                              className="inline-block rounded-lg bg-teal-50 px-3 py-1.5 text-sm text-teal-700 border border-teal-200 mr-2"
                            >
                              {tr(a.content)}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Explanation */}
                    {result.explanation && (
                      <div className="mt-2 rounded-lg bg-gray-50 px-3 py-2">
                        <p className="text-xs text-gray-500">
                          💡 {tr(result.explanation)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}