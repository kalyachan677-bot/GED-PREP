"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { BookOpen, Send, CheckCircle2, XCircle, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useText } from "@/lib/ui-texts";

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

function getRotationOffset(): number {
  const now = new Date();
  const epoch = new Date("2026-01-01").getTime();
  const daysSinceEpoch = Math.floor((now.getTime() - epoch) / (1000 * 60 * 60 * 24));
  // 2-day rotation: day 0-1 = group 0, day 2-3 = group 1, ...
  return Math.floor(daysSinceEpoch / 2) % 4;
}

// ── TTS: Speak English words (wait for voices to load) ──
let voicesReady = false;
let voicesPromise: Promise<SpeechSynthesisVoice[]> | null = null;

function getVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve([]);
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    voicesReady = true;
    return Promise.resolve(voices);
  }
  if (voicesPromise) return voicesPromise;
  voicesPromise = new Promise<SpeechSynthesisVoice[]>((resolve) => {
 const handler = () => {
      voicesReady = true;
      const v = window.speechSynthesis?.getVoices() || [];
      window.speechSynthesis?.removeEventListener("voiceschanged", handler);
      voicesPromise = null;
      resolve(v);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler);
    // fallback timeout
    setTimeout(() => {
      if (!voicesReady) {
        window.speechSynthesis?.removeEventListener("voiceschanged", handler);
        voicesPromise = null;
        resolve(window.speechSynthesis?.getVoices() || []);
      }
    }, 3000);
  });
  return voicesPromise;
}

async function speakEnglish(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  try {
    const voices = await getVoices();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    utter.rate = 0.8;
    utter.pitch = 1;
    const enVoice = voices.find((v) => v.lang.startsWith("en") && v.localService);
    if (enVoice) {
      utter.voice = enVoice;
    } else {
      const anyEn = voices.find((v) => v.lang.startsWith("en"));
      if (anyEn) utter.voice = anyEn;
    }
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

async function speakThai(text: string): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  try {
    const voices = await getVoices();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "th-TH";
    utter.rate = 0.9;
    const thVoice = voices.find((v) => v.lang.startsWith("th") && v.localService);
    if (thVoice) utter.voice = thVoice;
    else {
      const anyTh = voices.find((v) => v.lang.startsWith("th"));
      if (anyTh) utter.voice = anyTh;
    }
    window.speechSynthesis.speak(utter);
    return true;
  } catch {
    return false;
  }
}

// Fuzzy matching for meaning comparison
function isMeaningMatch(userInput: string, correctTranslation: string): boolean {
  const ans = userInput.trim().toLowerCase().replace(/\s+/g, "");
  if (!ans) return false;

  const correctOptions = correctTranslation
    .toLowerCase()
    .split(/[,/]/)
    .map((w) => w.trim().replace(/\s+/g, ""))
    .filter(Boolean);

  for (const correct of correctOptions) {
    if (ans === correct) return true;
    if (correct.includes(ans) && ans.length >= 2) return true;
    if (ans.includes(correct) && correct.length >= 2) return true;
    const maxLen = Math.max(ans.length, correct.length);
    if (maxLen >= 3) {
      const dist = levenshtein(ans, correct);
      const threshold = Math.max(2, Math.floor(maxLen * 0.3));
      if (dist <= threshold) return true;
    }
  }
  return false;
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ── localStorage helpers for progress ──
function getVocabProgress(subjectId: string): { currentIndex: number; answers: AnswerState[]; correctCount: number; isComplete: boolean } | null {
  try {
    const raw = localStorage.getItem(`ged-vocab-${subjectId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveVocabProgress(subjectId: string, data: { currentIndex: number; answers: AnswerState[]; correctCount: number; isComplete: boolean }) {
  try {
    localStorage.setItem(`ged-vocab-${subjectId}`, JSON.stringify(data));
  } catch { /* quota */ }
}

function clearVocabProgress(subjectId: string) {
  try {
    localStorage.removeItem(`ged-vocab-${subjectId}`);
  } catch { /* ignore */ }
}

export function VocabReview({ subjectId, showAll }: { subjectId: string; showAll?: boolean }) {
  const { tx } = useText();
  const [cards, setCards] = useState<VocabCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [input, setInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [ttsError, setTtsError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoredFromSaved = useRef(false);

  // Load speech synthesis voices
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      getVoices(); // preload
    }
  }, []);

  useEffect(() => {
    if (!subjectId) return;
    setLoading(true);
    fetch(`/api/flashcards/subject?subjectId=${subjectId}&count=10`)
      .then((r) => r.json())
      .then((j) => {
        if (j.data) {
          let flashcards: VocabCard[];
          if (!showAll && j.data.length > 10) {
            const offset = getRotationOffset();
            const groupSize = 10;
            const totalGroups = Math.ceil(j.data.length / groupSize);
            const groupIndex = offset % totalGroups;
            const start = groupIndex * groupSize;
            const end = Math.min(start + groupSize, j.data.length);
            flashcards = j.data.slice(start, end);
          } else {
            flashcards = j.data;
          }
          setCards(flashcards);

          // Try loading saved progress
          const saved = getVocabProgress(subjectId);
          if (saved && saved.answers && saved.answers.length === flashcards.length) {
            setCurrentIndex(saved.currentIndex);
            setAnswers(saved.answers);
            setCorrectCount(saved.correctCount);
            setIsComplete(saved.isComplete);
            restoredFromSaved.current = true;
          } else {
            setAnswers(flashcards.map(() => ({ userInput: "", submitted: false, isCorrect: false })));
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [subjectId, showAll]);

  // Save progress on every change
  useEffect(() => {
    if (!subjectId || cards.length === 0) return;
    saveVocabProgress(subjectId, { currentIndex, answers, correctCount, isComplete });
  }, [subjectId, currentIndex, answers, correctCount, isComplete, cards.length]);

  useEffect(() => {
    if (!loading && !isComplete && cards.length > 0) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [loading, isComplete, currentIndex, cards.length]);

  const checkAnswer = useCallback(() => {
    if (!input.trim() || !cards[currentIndex]) return;
    const card = cards[currentIndex];
    const isCorrect = isMeaningMatch(input, card.translation);

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

  async function handleSpeak(term: string, cardId: string) {
    setSpeakingId(cardId);
    setTtsError(false);
    const ok = await speakEnglish(term);
    if (!ok) setTtsError(true);
    setTimeout(() => setSpeakingId(null), 1500);
  }

  function handleReset() {
    clearVocabProgress(subjectId);
    setCurrentIndex(0);
    setAnswers(cards.map(() => ({ userInput: "", submitted: false, isCorrect: false })));
    setInput("");
    setCorrectCount(0);
    setIsComplete(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      checkAnswer();
    }
  }

  // Dispatch event when vocab completes (for rigor tracking)
  useEffect(() => {
    if (isComplete && cards.length > 0) {
      window.dispatchEvent(new CustomEvent("ged-vocab-complete", { detail: { subjectId } }));
      // Save recent score for rigor locking
      try {
        const scores: number[] = JSON.parse(localStorage.getItem(`ged-recent-scores-${subjectId}`) || "[]");
        const pct = Math.round((correctCount / cards.length) * 100);
        scores.unshift(pct);
        localStorage.setItem(`ged-recent-scores-${subjectId}`, JSON.stringify(scores.slice(0, 5)));
      } catch { /* ignore */ }
    }
  }, [isComplete, subjectId, cards.length, correctCount]);

  // ── Loading ──
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">{tx("vocabReview")}</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-5 w-5 border-2 border-violet-300 border-t-violet-600 rounded-full mr-3" />
          <span className="text-sm text-slate-400">{tx("vocabLoading")}</span>
        </div>
      </div>
    );
  }

  if (cards.length === 0) return null;

  // Show resuming message
  const savedInfo = restoredFromSaved.current && (currentIndex > 0 || isComplete);

  // ── Complete Screen ──
  if (isComplete) {
    const pct = Math.round((correctCount / cards.length) * 100);
    const wrongItems = answers
      .map((a, i) => ({ ...a, card: cards[i] }))
      .filter((a) => a.submitted && !a.isCorrect);
    let msg = tx("vocabMsgLow");
    if (pct >= 80) msg = tx("vocabMsgHigh");
    else if (pct >= 50) msg = tx("vocabMsgMid");

    return (
      <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-white" />
              <h2 className="text-base font-bold text-white">{tx("vocabSummaryTitle")}</h2>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-center gap-4 py-3">
            <div
              className={"text-5xl font-extrabold tracking-tight " +
                (pct >= 80 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600")}
            >
              {correctCount}/{cards.length}
            </div>
            <div
              className={"h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg " +
                (pct >= 80
                  ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                  : pct >= 50
                    ? "bg-gradient-to-br from-amber-500 to-orange-500"
                    : "bg-gradient-to-br from-rose-500 to-pink-600")}
            >
              {pct}%
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 font-medium">{msg}</p>

          {wrongItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{tx("vocabNeedsReview")}</p>
              {wrongItems.map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-100 px-4 py-3 flex items-start gap-3"
                >
                  <XCircle className="h-4 w-4 text-rose-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{item.card.term}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{tx("vocabTranslationLabel")} {item.card.translation}</p>
                    {item.userInput && (
                      <p className="text-xs text-rose-500 mt-0.5">{tx("vocabYouAnswered")} &ldquo;{item.userInput}&rdquo;</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-all active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            {tx("vocabReviewAgain")}
          </button>
        </div>
      </div>
    );
  }

  // ── Active Vocab Review ──
  const currentCard = cards[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className="rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-5 w-5 text-white" />
            <h2 className="text-base font-bold text-white">{tx("vocabReview")}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-white/15 text-white/80 hover:bg-white/25 hover:text-white transition-all active:scale-95"
              title={tx("restart")}
            >
              <RotateCcw className="h-3 w-3" />
              {tx("restart")}
            </button>
            <span className="text-xs text-white/70 font-semibold bg-white/10 px-2.5 py-1 rounded-full">
              {currentIndex + 1}/{cards.length}
            </span>
          </div>
        </div>
        <div className="mt-3 h-1.5 bg-white/15 rounded-full">
          <div
            className="h-full bg-white/90 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + (currentAnswer?.submitted ? 1 : 0)) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {savedInfo && (
        <div className="bg-amber-50 border-b border-amber-100 px-5 py-2.5 flex items-center justify-between">
          <p className="text-xs text-amber-700 font-medium">{tx("vocabResuming")}</p>
          <button
            onClick={handleReset}
            className="text-xs text-amber-600 hover:text-amber-800 font-semibold underline"
          >
            {tx("restart")}
          </button>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div className="space-y-3">
          {cards.map((card, i) => {
            const ans = answers[i];
            const isCurrent = i === currentIndex && !ans.submitted;
            const isPast = ans.submitted;
            const isFuture = i > currentIndex && !ans.submitted;

            let borderCls = "border-slate-100 bg-slate-50/30";
            if (isCurrent) borderCls = "border-indigo-300 bg-indigo-50/50 ring-2 ring-indigo-200/60";
            else if (isPast && ans.isCorrect) borderCls = "border-emerald-200 bg-emerald-50/50";
            else if (isPast && !ans.isCorrect) borderCls = "border-rose-200 bg-rose-50/50";
            if (isFuture) borderCls += " opacity-50";

            return (
              <div key={card.id} className={"rounded-xl border p-4 transition-all duration-300 " + borderCls}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{tx("vocabWordN", { n: i + 1 })}</span>
                  <div className="flex items-center gap-1.5">
                    {isPast && ans.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                    {isPast && !ans.isCorrect && <XCircle className="h-4 w-4 text-rose-500" />}
                    {isCurrent && <span className="text-[11px] text-indigo-600 font-semibold animate-pulse">{tx("vocabAsking")}</span>}
                  </div>
                </div>

                {/* English vocabulary + speak button */}
                <div className="flex items-center gap-2.5 mb-1">
                  <p className="text-lg font-bold text-slate-900">{card.term}</p>
                  <button
                    onClick={() => handleSpeak(card.term, card.id)}
                    className={"inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-all active:scale-95 cursor-pointer " +
                      (speakingId === card.id
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                        : ttsError
                          ? "bg-rose-100 text-rose-500 hover:bg-rose-200"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200")}
                  >
                    {ttsError ? <VolumeX className="h-3 w-3" /> : <Volume2 className={"h-3 w-3 " + (speakingId === card.id ? "animate-pulse" : "")} />}
                    {ttsError ? tx("vocabNoAudio") : tx("vocabListen")}
                  </button>
                </div>

                {/* Thai pronunciation subtitle */}
                {card.pronunciation && (
                  <button
                    onClick={() => {
                      setSpeakingId(card.id + "-pron");
                      speakThai(card.pronunciation).then((ok) => {
                        if (!ok) setTtsError(true);
                        setTimeout(() => setSpeakingId(null), 2000);
                      });
                    }}
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium mb-1 transition-colors cursor-pointer"
                  >
                    📢 {card.pronunciation}
                  </button>
                )}

                {/* Result after answering */}
                {isPast && (
                  <div
                    className={"rounded-lg px-3 py-2.5 text-xs font-medium " +
                      (ans.isCorrect
                        ? "bg-emerald-100/80 text-emerald-800"
                        : "bg-rose-100/80 text-rose-800")}
                  >
                    {ans.isCorrect ? (
                      <p>{tx("vocabCorrectBang")} {card.translation}</p>
                    ) : (
                      <div>
                        <p className="text-rose-600">{tx("vocabYouAnswered")} &ldquo;{ans.userInput}&rdquo;</p>
                        <p className="mt-1 font-semibold">{tx("vocabAnswer")} {card.translation}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Input for current word */}
                {isCurrent && !ans.submitted && (
                  <div className="mt-3">
                    <p className="text-xs text-indigo-600 font-semibold mb-2">
                      {tx("vocabTranslateHint", { term: card.term })}
                    </p>
                    <div className="flex gap-2">
                      <input
                        ref={i === currentIndex ? inputRef : undefined}
                        type="text"
                        value={i === currentIndex ? input : ""}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tx("vocabTypeTranslation")}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 placeholder:text-slate-300 transition-all"
                      />
                      <button
                        onClick={checkAnswer}
                        disabled={!input.trim()}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-200/50 hover:shadow-lg hover:shadow-indigo-300/50 disabled:opacity-40 disabled:shadow-none transition-all active:scale-95"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-400">{tx("vocabTypeHint")}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
