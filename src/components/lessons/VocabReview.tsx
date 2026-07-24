"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Send, CheckCircle2, XCircle, RotateCcw, Sparkles } from "lucide-react";

interface VocabCard {
  id: string;
  term: string;
  translation: string;
  meaning: string;
}

interface AnswerState {
  userInput: string;
  submitted: boolean;
  isCorrect: boolean;
  correctAnswer: string;
}

export function VocabReview({ subjectId }: { subjectId: string }) {
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    fetch(`/api/flashcards/subject?subjectId=${subjectId}&count=8`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          setCards(j.data);
          setAnswers(j.data.map(() => ({ userInput: "", submitted: false, isCorrect: false, correctAnswer: "" })));
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [subjectId]);

  useEffect(() => {
    if (!loading && !isComplete && cards.length > 0) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [loading, isComplete, currentIndex, cards.length]);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector(`[data-ci="${currentIndex}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  const checkAnswer = useCallback(() => {
    if (!input.trim() || !cards[currentIndex]) return;
    const card = cards[currentIndex];
    const answer = input.trim().toLowerCase();
    const eng = card.term.split("/(")[0].trim().toLowerCase();
    const thaiWords = card.translation.toLowerCase().split(/[\/,,]/).map((w) => w.trim());
    const isCorrect =
      eng.includes(answer) ||
      answer.includes(eng) ||
      thaiWords.some((tw) => answer.includes(tw.split(" ")[0]) || tw.split(" ")[0].includes(answer));

    const newAnswers = [...answers];
    newAnswers[currentIndex] = {
      userInput: input.trim(),
      submitted: true,
      isCorrect,
      correctAnswer: card.term + " = " + card.translation,
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
    setAnswers(cards.map(() => ({ userInput: "", submitted: false, isCorrect: false, correctAnswer: "" })));
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
      <div className="rounded-xl border border-gray-100 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-violet-500" />
          <h2 className="text-lg font-semibold text-gray-900">ทบทวนคำศัพท์</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-3xl mr-3">📚</div>
          <span className="text-sm text-gray-400">กำลังโหลดคำศัพท์...</span>
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  // ── Complete Screen ──
  if (isComplete) {
    const pct = Math.round((correctCount / cards.length) * 100);
    const wrongAnswers = answers.filter((a) => a.submitted && !a.isCorrect);
    let msg = "ควรทบทวนคำศัพท์เพิ่มเติม ลองอ่านบทเรียนซ้ำอีกครั้ง";
    if (pct >= 80) msg = "ยอดเยี่ยม! คุณจดจำคำศัพท์ได้ดีมาก พร้อมทำแบบทดสอบแล้ว!";
    else if (pct >= 50) msg = "พอใช้ได้ ลองทบทวนคำที่ผิดอีกสักครั้งนะ";

    return (
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-4">
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

          {wrongAnswers.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">คำที่ต้องทบทวนเพิ่ม</p>
              {wrongAnswers.map((a, i) => (
                <WrongAnswerItem key={i} correctAnswer={a.correctAnswer} userInput={a.userInput} />
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

  // ── Active Quiz ──
  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-white" />
            <h2 className="text-base font-bold text-white">ทบทวนคำศัพท์</h2>
          </div>
          <span className="text-xs text-violet-200 font-medium">
            {currentIndex + 1}/{cards.length}
          </span>
        </div>
        <div className="mt-2 h-1 bg-white/20 rounded-full">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${(currentIndex / cards.length) * 100}%` }} />
        </div>
      </div>

      <div ref={scrollRef} className="max-h-[420px] overflow-y-auto p-4 space-y-3">
        {cards.map((card, i) => {
          const ans = answers[i];
          const isCurrent = i === currentIndex && !ans.submitted;
          const isPast = ans.submitted;
          const isFuture = i > currentIndex && !ans.submitted;
          let borderCls = "border-gray-100 bg-gray-50 opacity-50";
          if (isCurrent) borderCls = "border-violet-300 bg-violet-50 shadow-md ring-2 ring-violet-200";
          else if (isPast && ans.isCorrect) borderCls = "border-emerald-200 bg-emerald-50";
          else if (isPast && !ans.isCorrect) borderCls = "border-rose-200 bg-rose-50";

          return (
            <div key={card.id} data-ci={i} className={"rounded-xl border p-4 transition-all duration-300 " + borderCls}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-400">คำที่ {i + 1}</span>
                {isPast && ans.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                {isPast && !ans.isCorrect && <XCircle className="h-4 w-4 text-rose-500" />}
                {isCurrent && <span className="text-xs text-violet-500 font-medium">▼ กำลังตอบ</span>}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-1">
                <span className="font-semibold text-gray-900">{card.meaning}</span>
              </p>
              <p className="text-xs text-gray-400 mb-3">
                แปลว่า: <span className="text-gray-500">{card.translation}</span>
              </p>

              {isPast && (
                <div className={"rounded-lg px-3 py-2 text-xs " + (ans.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800")}>
                  <p><span className="font-medium">คำตอบภาษาอังกฤษ:</span> {card.term}</p>
                  {!ans.isCorrect && <p className="mt-1 text-rose-600">คุณตอบ: {"\u201c" + ans.userInput + "\u201d"}</p>}
                </div>
              )}

              {isCurrent && !ans.submitted && (
                <div className="mt-2">
                  <p className="text-xs text-violet-600 font-medium mb-1.5">พิมพ์คำศัพท์ภาษาอังกฤษที่ตรงกับความหมายนี้:</p>
                  <div className="flex gap-2">
                    <input
                      ref={i === currentIndex ? inputRef : undefined}
                      type="text"
                      value={i === currentIndex ? input : ""}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type the English term..."
                      className="flex-1 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 placeholder:text-violet-300"
                    />
                    <button
                      onClick={checkAnswer}
                      disabled={!input.trim()}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500 text-white shadow-sm hover:bg-violet-600 disabled:opacity-40 disabled:hover:bg-violet-500 transition-all active:scale-95"
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

      <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">พิมพ์คำศัพท์ภาษาอังกฤษ แล้วกด Enter เพื่อส่งคำตอบ</p>
        {correctCount > 0 && <span className="text-xs font-medium text-emerald-600">{correctCount} ถูกต้อง ✓</span>}
      </div>
    </div>
  );
}

function WrongAnswerItem({ correctAnswer, userInput }: { correctAnswer: string; userInput: string }) {
  return (
    <div className="rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 flex items-start gap-2">
      <XCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-rose-700">
          <span className="font-medium">คำตอบที่ถูกต้อง:</span> {correctAnswer}
        </p>
        <p className="text-xs text-rose-500 mt-0.5">
          คุณตอบ: {"\u201c" + userInput + "\u201d"}
        </p>
      </div>
    </div>
  );
}
