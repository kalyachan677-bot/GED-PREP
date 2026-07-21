"use client";

import { useState } from "react";
import { useAppStore, getRigorConfig, RigorConfig } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, Loader2, ChevronRight, Shield, Zap, Flame, X } from "lucide-react";

export function ScoreTargetModal() {
  const { user, setScoreTarget, showScoreTargetModal, setShowScoreTargetModal } = useAppStore();
  const [value, setValue] = useState(175);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewRigor, setPreviewRigor] = useState<RigorConfig | null>(null);

  if (!showScoreTargetModal || !user) return null;

  // Live preview as slider moves
  const currentPreview = getRigorConfig(value) ?? previewRigor;

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/user/score-target", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, scoreTarget: value }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "เกิดข้อผิดพลาด");
        setLoading(false);
        return;
      }
      setScoreTarget(json.data.scoreTarget);
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  function handleSkip() {
    // User can skip, but modal won't show again for this session
    setShowScoreTargetModal(false);
  }

  function getLevelIcon(level: number) {
    if (level === 1) return <Shield className="h-5 w-5" />;
    if (level === 2) return <Zap className="h-5 w-5" />;
    return <Flame className="h-5 w-5" />;
  }

  function getLevelColor(level: number) {
    if (level === 1) return { text: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-300", badge: "bg-emerald-100 text-emerald-800" };
    if (level === 2) return { text: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300", badge: "bg-amber-100 text-amber-800" };
    return { text: "text-rose-700", bg: "bg-rose-100", border: "border-rose-300", badge: "bg-rose-100 text-rose-800" };
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-200">
              <Target className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="mt-4 text-xl">ตั้งค่าเป้าหมายคะแนน GED</CardTitle>
            <CardDescription>
              เลือกคะแนนที่คุณต้องการสอบให้ได้ เพื่อให้ระบบปรับแผนการเรียนให้เหมาะกับคุณ
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Score Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">คะแนนเป้าหมาย</span>
                <span className="text-2xl font-bold text-gray-900">{value}</span>
              </div>

              <input
                type="range"
                min={145}
                max={200}
                step={1}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-600"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`,
                }}
              />

              <div className="flex justify-between text-xs text-gray-400">
                <span>145 (ผ่านเกณฑ์)</span>
                <span>175 (ดีเยี่ยม)</span>
                <span>200 (สูงสุด)</span>
              </div>
            </div>

            {/* Rigor Level Preview */}
            {currentPreview && (
              <div className={`rounded-xl border-2 ${currentPreview.borderColor} ${currentPreview.bgColor} p-4 space-y-3 transition-all`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getLevelColor(currentPreview.level).bg}`}>
                    <span className="text-xl">{currentPreview.iconEmoji}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getLevelColor(currentPreview.level).badge}`}>
                        ระดับ {currentPreview.level}
                      </span>
                      <span className={`text-sm font-bold ${currentPreview.color}`}>
                        {currentPreview.shortLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{currentPreview.label}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentPreview.description}
                </p>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">
                    บุคลิก AI ติวเตอร์: {currentPreview.personality}
                  </p>
                  <p className="text-xs text-gray-500">{currentPreview.personalityDesc}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold text-gray-700">กฎระเบียบที่จะมีผล:</p>
                  <ul className="space-y-1">
                    {currentPreview.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-600">
                        <ChevronRight className={`h-3 w-3 mt-0.5 flex-shrink-0 ${currentPreview.color}`} />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleSkip}
                disabled={loading}
              >
                ข้าม
              </Button>
              <Button
                type="button"
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                ยืนยันเป้าหมาย {value} คะแนน
              </Button>
            </div>

            <p className="text-center text-xs text-gray-400">
              คุณสามารถเปลี่ยนเป้าหมายได้ภายหลังในหน้าตั้งค่า
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}