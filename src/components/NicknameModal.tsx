"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { User, Loader2, Smile } from "lucide-react";
import { useText } from "@/lib/ui-texts";

export function NicknameModal() {
  const { user, setUser } = useAppStore();
  const { tx } = useText();
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const promptedRef = useState(false);

  // Show modal on every new login (check session, not displayName)
  useEffect(() => {
    if (user && !promptedRef[0]) {
      promptedRef[1](true);
      setNickname(user.displayName || user.firstName || "");
      setVisible(true);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible || !user) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const name = nickname.trim() || user.firstName;
      const res = await fetch("/api/user/nickname", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, nickname: name }),
      });
      const json = await res.json();
      if (json.data) {
        setUser(json.data);
        setVisible(false);
      } else {
        setError(tx("error"));
      }
    } catch {
      setError(tx("errorRetry"));
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    setVisible(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} />
      <div className="relative w-full max-w-sm mx-4 mb-0 sm:mb-0 rounded-t-2xl sm:rounded-2xl bg-white shadow-2xl p-6 space-y-5 border-0 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200">
            <User className="h-7 w-7 text-white" />
          </div>
          <h2 className="mt-4 text-lg font-bold text-slate-800">{tx("setNickname")}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {tx("nicknameDesc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</div>
          )}
          <div className="relative">
            <Smile className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder={user.firstName}
              maxLength={50}
              autoFocus
              enterKeyHint="done"
              className="w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 placeholder:text-slate-300 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              {tx("skip")}
            </button>
            <button
              type="submit"
              disabled={loading || !nickname.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-violet-200/50 hover:shadow-lg transition-all disabled:opacity-50 active:scale-[0.98]"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
              {tx("save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
