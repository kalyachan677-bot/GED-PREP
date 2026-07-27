"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Send, CheckCircle2, XCircle, RotateCcw, Sparkles, Volume2 } from "lucide-react";

interface VocabCard {
  id: string;
  term: string;
  translation: string;
  pronunciation: string;
  meaning: string;
}

interface AnswerState {
  userInput: string;
  submitted: boolean;
  isCorrect: boolean;
}

// 3-day rotation: วันนี้เป็นวันที่เท่าไหร่ของรอบ 3 วัน (0, 1, 2)
function getRotationOffset(): number {
  const now = new Date();
  const epoch = new Date("2026-01-01").getTime();
  const daysSinceEpoch = Math.floor((now.getTime() - epoch) / (1000 * 60 * 60 * 24));
  return daysSinceEpoch % 3;
}

export function VocabReview({ subjectId, showAll }: { subjectId: string; showAll?: boolean }) {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    fetch(`/api/flashcards/subject?subjectId=${subjectId}&count=8`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          // 3-day rotation: แบ่งการ์ดเป็น 3 กลุ่ม แล้วเลือกกลุ่มตามวัน
          if (!showAll && j.data.length > 3) {
            const offset = getRotationOffset();
            const groupSize = Math.ceil(j.data.length / 3);
            const start = offset * groupSize;
            const rotated = j.data.slice(start, start + groupSize);
            setCards(rotated);
            setAnswers(rotated.map(() => ({ userInput: "", submitted: false, isCorrect: false })));
          } else {
            setCards(j.data);
            setAnswers(j.data.map(() => ({ userInput: "", submitted: false, isCorrect: false })));
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [subjectId, showAll]);

  useEffect(() => {
    if (!loading && !isComplete && cards.length > 0) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [loading, isComplete, currentIndex, cards.length]);

  const checkAnswer = useCallback(() => {
    if (!input.trim() || !cards[currentIndex]) return;
    const card = cards[currentIndex];
    const answer = input.trim().toLowerCase();
    // ตรวจสอบคำตอบ: ผู้เรียนพิมพ์คำแปลภาษาไทย
    const thaiWords = card.translation.toLowerCase().split(/[/,]/).map((w) => w.trim());
    const isCorrect = thaiWords.some((tw) => {
      const clean = tw.replace(/\s+/g, "");
      const ansClean = answer.replace(/\s+/g, "");
      return clean.includes(ansClean) || ansClean.includes(clean);
    });

    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      userInput: input.trim(),
      submitted: true,
      isCorrect,
    };
    setAnswers(newAnswers);
    if (isCorrect) setCorrectCount((c) => c + 1);
    setInput("");

    if (currentIndex + 1 < cards.length) {
      setTimeout(() => setCurrentIndex((i) => i + 1), isCorrect ? 600 : 1800);
    } else {
      setTimeout(() => setIsComplete(true), isCorrect ? 600 : 1800);
    }
  }, [input, cards, currentIndex, answers]);

  function handleReset() {
    setCurrentIndex(0);
    setAnswers(cards.map(() => ({ userInput: "", submitted: false, isCorrect: false })));
    setInput("");
    setCorrectCount(0);
    setIsComplete(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") { e.preventDefault(); checkAnswer(); }
  }

  // ── Loading ──
  if (loading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="h-5 w-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-gray-900">ทบทวนคำศัพท์</h2>
        </div>
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin h-5 w-5 border-2 border-indigo-300 border-t-indigo-600 rounded-full mr-3" />
          <span className="text-sm text-gray-400">กำลังโหลดคำศัพท์...</span>
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  // ── Complete Screen ──
  if (isComplete) {
    const pct = Math.round((correctCount / cards.length) * 100);
    const wrongItems = answers.map((a, i) => ({ ...a, card: cards[i] })).filter((a) => a.submitted && !a.isCorrect);
    let msg = "ควรทบทวนคำศัพท์เพิ่มเติม ลองอีกครั้งนะ";
    if (pct >= 80) msg = "ยอดเยี่ยม! คุณจดจำคำศัพท์ได้ดีมาก พร้อมเรียนบทต่อไป!";
    else if (pct >= 50) msg = "พอใช้ได้ ลองทบทวนคำที่ผิดอีกสักครั้ง";

    return (
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-white" />
            <h2 className="text-base font-bold text-white">สรุปผลการทบทวนคำศัพท์</h2>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-center gap-3 py-3">
            <div className={"text-4xl font-bold " + (pct >= 80 ? "text-teal-600" : pct >= 50 ? "text-amber-600" : "text-rose-600")}>
              {correctCount}/{cards.length}
            </div>
            <div className={"h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-sm " + (pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500")}>
              {pct}%
            </div>
          </div>
          <p className="text-center text-sm text-gray-600">{msg}</p>

          {wrongItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">คำที่ต้องทบทวนเพิ่มเติม</p>
              {wrongItems.map((item, i) => (
                <div key={i} className="rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900">{item.card.term}</p>
                    <p className="text-xs text-gray-500 mt-0.5">คำแปล: {item.card.translation}</p>
                    {item.userInput && (
                      <p className="text-xs text-rose-500 mt-0.5">คุณตอบ: &ldquo;{item.userInput}&rdquo;</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            ทบทวนอีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  // ── Active Vocab Review ──
  const currentCard = cards[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-white" />
            <h2 className="text-base font-bold text-white">ทบทวนคำศัพท์</h2>
          </div>
          <span className="text-xs text-indigo-200 font-medium">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>
        <div className="mt-2 h-1 bg-white/20 rounded-full">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + (currentAnswer?.submitted ? 1 : 0)) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* แสดงคำศัพท์ทั้งหมดเป็นรายการ */}
        <div className="space-y-3">
          {cards.map((card, i) => {
            const ans = answers[i];
            const isCurrent = i === currentIndex && !ans.submitted;
            const isPast = ans.submitted;
            const isFuture = i > currentIndex && !ans.submitted;

            let borderCls = "border-gray-100 bg-gray-50/50";
            if (isCurrent) borderCls = "border-indigo-300 bg-indigo-50 ring-2 ring-indigo-200";
            else if (isPast && ans.isCorrect) borderCls = "border-emerald-200 bg-emerald-50";
            else if (isPast && !ans.isCorrect) borderCls = "border-rose-200 bg-rose-50";
            if (isFuture) borderCls += " opacity-60";

            return (
              <div key={card.id} className={"rounded-xl border p-4 transition-all duration-300 " + borderCls}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-400">คำที่ {i + 1}</span>
                  <div className="flex items-center gap-1">
                    {isPast && ans.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    {isPast && !ans.isCorrect && <XCircle className="h-4 w-4 text-rose-500" />}
                    {isCurrent && <span className="text-xs text-indigo-500 font-medium animate-pulse">กำลังถาม</span>}
                  </div>
                </div>

                {/* คำศัพท์ภาษาอังกฤษ (หัวข้อหลัก) */}
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-bold text-gray-900">{card.term}</p>
                  {card.pronunciation && (
                    <span className="inline-flex items-center gap-1 text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                      <Volume2 className="h-3 w-3" />
                      {card.pronunciation}
                    </span>
                  )}
                </div>

                {/* ซับไตเติ้ล: คำอ่าน — ซ่อนคำแปลไว้ เพราะให้ผู้เรียนเป็นคนแปลเอง */}

                {/* ถ้าตอบแล้ว - แสดงผล */}
                {isPast && (
                  <div className={"rounded-lg px-3 py-2 text-xs " + (ans.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")}>
                    {ans.isCorrect ? (
                      <p>ถูกต้อง! {card.translation}</p>
                    ) : (
                      <div>
                        <p className="text-rose-600">คุณตอบ: &ldquo;{ans.userInput}&rdquo;</p>
                        <p className="mt-1 font-medium">คำแปล: {card.translation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Input ถ้าเป็นคำปัจจุบัน */}
                {isCurrent && !ans.submitted && (
                  <div className="mt-3">
                    <p className="text-xs text-indigo-600 font-medium mb-1.5">
                      &ldquo;{card.term}&rdquo; แปลว่าอะไร?
                    </p>
                    <div className="flex gap-2">
                      <input
                        ref={i === currentIndex ? inputRef : undefined}
                        type="text"
                        value={i === currentIndex ? input : ""}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="พิมพ์คำแปลภาษาไทย..."
                        className="flex-1 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 placeholder:text-gray-300"
                      />
                      <button
                        onClick={checkAnswer}
                        disabled={!input.trim()}
                        className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 disabled:opacity-40 disabled:hover:bg-indigo-500 transition-all active:scale-95"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
          <p className="text-xs text-gray-400">พิมพ์คำแปลภาษาไทย แล้วกด Enter เพื่อส่ง</p>
          {correctCount > 0 && <span className="text-xs font-medium text-emerald-600">{correctCount} ถูกต้อง</span>}
        </div>
      </div>
    </div>
  );
}
