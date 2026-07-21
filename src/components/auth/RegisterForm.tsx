"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Loader2, ArrowLeft } from "lucide-react";

export function RegisterForm() {
  const { setUser, setView } = useAppStore();
  const [studentName, setStudentName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, studentId, studentName }),
      });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "การสมัครสมาชิกล้มเหลว");
        setLoading(false);
        return;
      }

      setUser(json.data);
      setView("dashboard");
    } catch {
      setError("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-200">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">GED Prep</h1>
          <p className="mt-1 text-sm text-gray-500">สร้างบัญชีผู้เข้าเรียน</p>
        </div>

        <Card className="border-0 shadow-xl shadow-gray-200/50">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl">สมัครสมาชิก</CardTitle>
            <CardDescription>กรอกข้อมูลเพื่อเริ่มต้นการเรียน</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">ชื่อผู้เข้าเรียน</Label>
                <Input
                  id="name"
                  placeholder="ชื่อ-นามสกุล"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-email">อีเมล</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reg-studentId">รหัสผู้เข้าเรียน</Label>
                <Input
                  id="reg-studentId"
                  type="text"
                  placeholder="เช่น GED-002"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                สมัครสมาชิก
              </Button>

              <div className="text-center text-sm">
                <button
                  type="button"
                  onClick={() => setView("login")}
                  className="inline-flex items-center gap-1 font-medium text-teal-600 hover:text-teal-700"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  กลับไปเข้าสู่ระบบ
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}