"use client";

import { useAppStore } from "@/lib/store";
import { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, BookOpen, Send, PartyPopper, X } from "lucide-react";

// ============================================================================
// Types
// ============================================================================
interface FlashcardItem {
  id: string;
  term: string;
  translation: string;
  meaning: string;
}

interface ChatMessage {
  role: "bot" | "user";
  text: string;
  isCorrect?: boolean;
}

// ============================================================================
// 1. PRE-STUDY WARNING POPUP
// ============================================================================
export function PreStudyWarning({
  subjectCode,
  onContinue,
}: {
  subjectCode: string;
  onContinue: () => void;
}) {
  const subjectLabels: Record<string, string> = {
    math: "\ud83e\uddf9 Mathematical Reasoning",
    science: "\ud83d\udd2c Science",
    rla: "\ud83d\udcd6 Reasoning Through Language Arts",
    ss: "\ud83c\udfdb\ufe0f Social Studies",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                \u26a0\ufe0f \ue02\ue49\u0e49\u0e2d\u0e04\u0e23\u0e23\u0e30\u0e27\u0e31\u0e07\u0e01\u0e48\u0e2d\u0e19\u0e40\u0e23\u0e34\u0e48\u0e21
              </h3>
              <p className="text-sm text-amber-100 mt-0.5">
                {subjectLabels[subjectCode] || subjectCode}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-sm text-amber-900 leading-relaxed">
              <span className="font-bold text-amber-700">\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e40\u0e09\u0e1e\u0e32\u0e30\u0e17\u0e32\u0e07\u0e21\u0e35\u0e1c\u0e25\u0e15\u0e48\u0e2d\u0e04\u0e30\u0e41\u0e19\u0e19\u0e2a\u0e2d\u0e1a GED \u0e16\u0e36\u0e07 80%</span>
              <br />
              \u0e42\u0e1b\u0e23\u0e14\u0e41\u0e19\u0e48\u0e43\u0e08\u0e27\u0e48\u0e32\u0e04\u0e38\u0e13\u0e44\u0e14\u0e49\u0e17\u0e1a\u0e17\u0e27\u0e19\u0e04\u0e25\u0e31\u0e07\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e02\u0e2d\u0e07\u0e27\u0e34\u0e0a\u0e32\u0e19\u0e35\u0e49\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e2a\u0e21\u0e48\u0e33\u0e40\u0e21\u0e37\u0e2d\u0e19\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e44\u0e21\u0e48\u0e43\u0e2b\u0e49\u0e41\u0e1b\u0e25\u0e42\u0e08\u0e17\u0e22\u0e4c\u0e1c\u0e34\u0e14\u0e1e\u0e25\u0e32\u0e14!
            </p>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <BookOpen className="h-3.5 w-3.5" />
            <span>\u0e40\u0e17\u0e34\u0e1b\u0e17\u0e2d\u0e22\u0e40\u0e23\u0e35\u0e22\u0e19\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e17\u0e38\u0e01\u0e27\u0e31\u0e19 \u0e0a\u0e48\u0e27\u0e22\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e42\u0e2d\u0e01\u0e32\u0e2a\u0e2a\u0e2d\u0e1a\u0e44\u0e14\u0e49\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e21\u0e35\u0e19\u0e31\u0e22\u0e22\u0e31\u0e21</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            onClick={onContinue}
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all active:scale-[0.98]"
          >
            \u0e23\u0e31\u0e1a\u0e17\u0e23\u0e32\u0e1a\u0e41\u0e25\u0e30\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e39\u0e48\u0e1a\u0e17\u0e40\u0e23\u0e35\u0e22\u0e19
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. DAILY 5-WORD ACTIVE RECALL CHATBOT QUIZ
// ============================================================================
export function DailyFlashcardQuiz({ onClose }: { onClose: () => void }) {
  const { user } = useAppStore();
  const [cards, setCards] = useState<FlashcardItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const correctCountRef = useRef(0);

  // Load 5 random flashcards
  useEffect(() => {
    if (!user) return;
    async function loadCards() {
      try {
        const res = await fetch(`/api/flashcards/daily?userId=${user.id}&count=5`);
        const json = await res.json();
        if (json.data?.cards?.length) {
          setCards(json.data.cards);
          setMessages([
            {
              role: "bot",
              text: `\ud83c\udf1f \u0e2a\u0e27\u0e31\u0e2a\u0e14\u0e35! \u0e21\u0e32\u0e17\u0e1a\u0e17\u0e27\u0e19\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e27\u0e31\u0e19\u0e01\u0e31\u0e19\u0e40\u0e25\u0e22 \u0e27\u0e31\u0e19\u0e19\u0e35\u0e49\u0e21\u0e35 5 \u0e04\u0e33 \u0e23\u0e32\u0e22\u0e0a\u0e37\u0e48\u0e2d\u0e04\u0e33\u0e41\u0e1b\u0e25\u0e2b\u0e23\u0e37\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e21\u0e32\u0e22\u0e02\u0e2d\u0e07\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e20\u0e32\u0e29\u0e32\u0e2d\u0e31\u0e07\u0e01\u0e24\u0e29\u0e17\u0e35\u0e48\u0e41\u0e2a\u0e14\u0e07\n\n\ud83d\udcdd \u0e04\u0e33\u0e17\u0e35\u0e48 1/5: **${json.data.cards[0].term}**`,
            },
          ]);
        }
      } catch (e) {
        console.error("Failed to load daily flashcards", e);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input
  useEffect(() => {
    if (!loading && !isComplete) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [loading, isComplete, currentIndex]);

  const checkAnswer = useCallback(
    (userAnswer: string) => {
      if (!cards[currentIndex] || submitting) return;
      const card = cards[currentIndex];
      const answer = userAnswer.trim().toLowerCase();
      const translationWords = card.translation.toLowerCase().split(/[\/]/).map(s => s.trim());
      // Check if any translation word is contained in the answer
      const isCorrect = translationWords.some(tw => {
        const firstWord = tw.split(" ")[0];
        return answer.includes(firstWord) || firstWord.includes(answer);
      });

      setSubmitting(true);

      // Log to server
      fetch("/api/flashcards/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id,
          flashcardId: card.id,
          userAnswer,
          isCorrect,
        }),
      }).catch(() => {});

      // Add user message
      const newMessages: ChatMessage[] = [
        ...messages,
        { role: "user", text: userAnswer },
      ];

      if (isCorrect) {
        correctCountRef.current += 1;
        setCorrectCount(correctCountRef.current);
        newMessages.push({
          role: "bot",
          text: `\u2728 \u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07! \u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e21\u0e32\u0e01! \u201c**${card.term}**\u201d \u0e41\u0e1b\u0e25\u0e27\u0e48\u0e32 \u201c${card.translation}\u201d`,
          isCorrect: true,
        });
      } else {
        newMessages.push({
          role: "bot",
          text: `\u274c \u0e40\u0e2a\u0e35\u0e22\u0e43\u0e08\u0e19\u0e34\u0e14\u0e19\u0e30 \n\n\ud83d\udcd6 \u0e04\u0e33\u0e41\u0e1b\u0e25\u0e17\u0e35\u0e48\u0e16\u0e39\u0e01\u0e15\u0e49\u0e2d\u0e07: **${card.translation}**\n\n\ud83d\udcdd \u0e04\u0e27\u0e32\u0e21\u0e2b\u0e21\u0e32\u0e22: ${card.meaning}`,
          isCorrect: false,
        });
      }

      setMessages(newMessages);
      setSubmitting(false);

      // Move to next card
      if (currentIndex + 1 < cards.length) {
        setTimeout(() => {
          const nextCard = cards[currentIndex + 1];
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: `\ud83d\udcdd \u0e04\u0e33\u0e17\u0e35\u0e48 ${currentIndex + 2}/5: **${nextCard.term}**`,
            },
          ]);
          setCurrentIndex((i) => i + 1);
        }, isCorrect ? 800 : 2000);
      } else {
        const finalCorrect = correctCountRef.current;
        setTimeout(() => {
          setIsComplete(true);
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: `\ud83c\udf89 \u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e21\u0e32\u0e01! \u0e27\u0e31\u0e19\u0e19\u0e35\u0e49\u0e04\u0e38\u0e13\u0e15\u0e2d\u0e1a\u0e16\u0e39\u0e01 **${finalCorrect}/${cards.length}** \n\n\u0e40\u0e22\u0e35\u0e48\u0e22\u0e21\u0e21\u0e32\u0e01! \u0e27\u0e31\u0e19\u0e19\u0e35\u0e49\u0e04\u0e38\u0e13\u0e40\u0e01\u0e47\u0e1a\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e2a\u0e30\u0e2a\u0e21\u0e40\u0e02\u0e49\u0e32\u0e2a\u0e21\u0e2d\u0e07\u0e40\u0e23\u0e35\u0e22\u0e1a\u0e23\u0e49\u0e2d\u0e22\u0e41\u0e25\u0e49\u0e27 \u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e25\u0e38\u0e22\u0e40\u0e19\u0e37\u0e49\u0e2d\u0e2b\u0e32\u0e16\u0e31\u0e14\u0e44\u0e1b\u0e44\u0e14\u0e49\u0e40\u0e25\u0e22! \ud83d\udcaa`,
            },
          ]);
        }, isCorrect ? 800 : 2000);
      }
    },
    [cards, currentIndex, messages, submitting, user?.id]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const answer = input;
    setInput("");
    checkAnswer(answer);
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center">
          <div className="animate-pulse text-4xl mb-3">\ud83d\udcda</div>
          <p className="text-sm text-gray-500">\u0e01\u0e33\u0e25\u0e31\u0e07\u0e40\u0e15\u0e23\u0e35\u0e22\u0e21\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e27\u0e31\u0e19...</p>
        </div>
      </div>
    );
  }

  if (cards.length === 0 && !loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="text-4xl mb-3">\ud83d\udced</div>
        <p className="text-sm text-gray-500 mb-4">\u0e22\u0e31\u0e07\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e43\u0e19\u0e23\u0e30\u0e1a\u0e1a</p>
        <button onClick={onClose} className="rounded-xl bg-gray-100 px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">\u0e1b\u0e34\u0e14</button>
      </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-500 to-purple-600">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-white" />
            <h3 className="text-base font-bold text-white">\u0e17\u0e1a\u0e17\u0e27\u0e19\u0e04\u0e33\u0e28\u0e31\u0e1e\u0e17\u0e4c\u0e1b\u0e23\u0e30\u0e08\u0e33\u0e27\u0e31\u0e19</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-violet-200">
              {isComplete
                ? `\u0e40\u0e2a\u0e23\u0e47\u0e08 ${correctCount}/${cards.length}`
                : `${currentIndex + 1}/${cards.length}`}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
            style={{
              width: `${((isComplete ? cards.length : currentIndex) / cards.length) * 100}%`,
            }}
          />
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 min-h-[250px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === "user"
                    ? "bg-violet-500 text-white rounded-br-md"
                    : msg.isCorrect === true
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-bl-md"
                    : msg.isCorrect === false
                    ? "bg-rose-50 text-rose-800 border border-rose-100 rounded-bl-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                {msg.text.split("\n").map((line, j) => (
                  <p key={j} className={j > 0 ? "mt-1.5" : ""}>
                    {renderTextWithBold(line)}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {isComplete && (
            <div className="flex justify-center pt-2">
              <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-violet-50 border border-emerald-200 px-5 py-2.5">
                <PartyPopper className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">\u0e17\u0e33\u0e40\u0e2a\u0e23\u0e47\u0e08\u0e41\u0e25\u0e49\u0e27!</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        {!isComplete && (
          <form
            onSubmit={handleSubmit}
            className="border-t border-gray-100 px-5 py-3 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="\u0e1e\u0e34\u0e21\u0e1e\u0e4c\u0e04\u0e33\u0e41\u0e1b\u0e25\u0e2b\u0e23\u0e37\u0e2d\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e21\u0e32\u0e22..."
              disabled={submitting}
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || submitting}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500 text-white shadow-md hover:bg-violet-600 disabled:opacity-40 disabled:hover:bg-violet-500 transition-all active:scale-95"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Close button when complete */}
        {isComplete && (
          <div className="border-t border-gray-100 px-5 py-3">
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-violet-600 hover:to-purple-700 transition-all active:scale-[0.98]"
            >
              \u0e40\u0e23\u0e34\u0e48\u0e21\u0e40\u0e23\u0e35\u0e22\u0e19\u0e40\u0e25\u0e22
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to render **bold** text
function renderTextWithBold(text: string) {
  const parts = text.split(/\*\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-bold">
        {part}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}