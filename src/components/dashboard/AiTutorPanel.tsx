"use client";

import { useAppStore, RigorConfig } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Flame, ChevronRight, Target, Brain, BookOpen, Clock, AlertTriangle, Settings } from "lucide-react";

export function AiTutorPanel() {
  const { rigorConfig, scoreTarget, setShowScoreTargetModal, setView, user } = useAppStore();

  if (!rigorConfig || !scoreTarget) return null;

  return (
    <div className={`rounded-xl border-2 ${rigorConfig.borderColor} ${rigorConfig.bgColor} overflow-hidden`}>
      {/* Header */}
      <div className={`px-4 py-3 border-b ${rigorConfig.borderColor} bg-white/50`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{rigorConfig.iconEmoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  rigorConfig.level === 1 ? "bg-emerald-100 text-emerald-800" :
                  rigorConfig.level === 2 ? "bg-amber-100 text-amber-800" :
                  "bg-rose-100 text-rose-800"
                }`}>
                  ระดับ {rigorConfig.level}
                </span>
                <span className={`text-sm font-bold ${rigorConfig.color}`}>
                  {rigorConfig.shortLabel}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">AI ติวเตอร์ — {rigorConfig.personality}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-right">
              <p className="text-xs text-gray-400">เป้าหมาย</p>
              <p className="text-lg font-bold text-gray-900 leading-none">{scoreTarget}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
              <Target className="h-4 w-4 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3 space-y-3">
        {/* AI Message */}
        <div className="flex gap-2.5">
          <div className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${
            rigorConfig.level === 1 ? "bg-emerald-200" :
            rigorConfig.level === 2 ? "bg-amber-200" :
            "bg-rose-200"
          }`}>
            <Brain className={`h-4 w-4 ${
              rigorConfig.level === 1 ? "text-emerald-700" :
              rigorConfig.level === 2 ? "text-amber-700" :
              "text-rose-700"
            }`} />
          </div>
          <div className="flex-1 rounded-lg bg-white/80 px-3 py-2.5 shadow-sm">
            <p className="text-sm text-gray-700 leading-relaxed">
              {getAiGreeting(rigorConfig, user?.firstName ?? "นักเรียน")}
            </p>
          </div>
        </div>

        {/* Rigor Rules */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
            กฎระเบียบ AI ติวเตอร์ของคุณ
          </p>
          <div className="space-y-1.5">
            {rigorConfig.rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded flex-shrink-0 ${
                  rigorConfig.level === 1 ? "bg-emerald-100" :
                  rigorConfig.level === 2 ? "bg-amber-100" :
                  "bg-rose-100"
                }`}>
                  {rigorConfig.level === 1 ? (
                    <Shield className="h-3 w-3 text-emerald-600" />
                  ) : rigorConfig.level === 2 ? (
                    <Zap className="h-3 w-3 text-amber-600" />
                  ) : (
                    <Flame className="h-3 w-3 text-rose-600" />
                  )}
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{rule}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <RigorStatCard
            label="คะแนนต่ำสุดที่ปลดล็อก"
            value={rigorConfig.unlockThreshold !== null ? `${rigorConfig.unlockThreshold}` : "-"}
            color={rigorConfig.color}
          />
          <RigorStatCard
            label="ทำ Quiz ทุกวัน"
            value={rigorConfig.dailyQuizRequired ? "บังคับ" : "ไม่บังคับ"}
            color={rigorConfig.color}
          />
          <RigorStatCard
            label="ทบทวน Flashcards"
            value={rigorConfig.flashcardRequired ? "บังคับ" : "แนะนำ"}
            color={rigorConfig.color}
          />
        </div>
      </div>
    </div>
  );
}

function RigorStatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg bg-white/60 px-2.5 py-2 text-center">
      <p className={`text-sm font-bold ${color}`}>{value}</p>
      <p className="text-[10px] text-gray-500 mt-0.5 leading-tight">{label}</p>
    </div>
  );
}

function getAiGreeting(config: RigorConfig, userName: string): string {
  if (config.level === 1) {
    return `สวัสดี ${userName}! ผมคือ AI ติวเตอร์ของคุณ เป้าหมายของเราคือ ${config.shortLabel} — อย่ากังวลนะ ผมจะคอยเตือนเบาๆ และช่วยให้คุณเข้าใจพื้นฐานให้แข็งแรงก่อนไปต่อ ทำไปทีละก้าว ไม่ต้องรีบ!`;
  }
  if (config.level === 2) {
    return `${userName} เป้าหมาย ${config.shortLabel}ไม่ใช่เรื่องง่าย แต่ผมจะทำให้คุณทำได้ กฎคือ: ทำโจทย์ทุกวัน, ทบทวน Flashcards ทุกวัน คะแนนต่ำกว่า 150 ผมจะล็อกบทถัดไป ไม่มีข้อแม้ พร้อมหรือยัง?`;
  }
  return `${userName} เป้าหมายระดับท็อปประเทศ เริ่มตอนนี้เลย ผมไม่ยอมให้คุณกดข้าม Flashcards ขาดเรียนแม้คืนเดียว — ตัดคะแนนวินัยทันที ข้อสอบจำลองต่ำกว่า 175 — ผมจะเพิ่มโหลดเรียนให้ 2 เท่า นี่ไม่ใช่เกม พร้อมจะเป็นที่ 1 หรือยัง?`;
}

export function ScoreTargetChangeButton() {
  const { scoreTarget, setShowScoreTargetModal } = useAppStore();

  return (
    <button
      onClick={() => setShowScoreTargetModal(true)}
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-teal-600 transition-colors"
    >
      <Settings className="h-3 w-3" />
      {scoreTarget ? `เป้าหมาย: ${scoreTarget} คะแนน` : "ตั้งเป้าหมายคะแนน"}
    </button>
  );
}