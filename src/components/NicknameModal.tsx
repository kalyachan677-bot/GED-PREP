"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { User, Loader2, Smile } from "lucide-react";

export function NicknameModal() {
  const { user, setUser, showScoreTargetModal } = useAppStore();
  const [nickname, setNickname] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // แสดงเฉพาะเมื่อยังไม่มี displayName และยังไม่ได้แสดง ScoreTargetModal
  if (!user || user.displayName || showScoreTargetModal) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/nickname", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, nickname: nickname.trim() || user.firstName }),
      });
      const json = await res.json();
      if (json.data) {
        setUser(json.data);
      } else {
        setError("เกิดข้อผิดพลาด");
      }
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    // บันทึกชื่อจริงเป็น displayName เพื่อไม่ให้ modal แสดงอีก
    const fallbackName = user.firstName;
    fetch("/api/user/nickname", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, nickname: fallbackName }),
    }).then((r) => r.json()).then((json) => {
      if (json.data) setUser(json.data);
    }).catch(() => {});
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="rounded-2xl bg-white shadow-2xl p-6 space-y-5 border-0">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200">
              <User className="h-7 w-7 text-white" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-slate-800">ตั้งชื่อเล่นของคุณ</h2>
            <p className="mt-1 text-sm text-slate-500">
              ชื่อเล่นจะแสดงในระบบแทนชื่อจริง
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</div>
            )}
            <div className="relative">
              <Smile className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={user.firstName}
                maxLength={50}
                autoFocus
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-400 placeholder:text-slate-300 transition-all"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all"
              >
                ข้าม
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-200/50 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />}
                บันทึก
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
