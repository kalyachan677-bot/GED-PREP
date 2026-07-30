"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { useText } from "@/lib/ui-texts";
import { RegisterForm } from "./RegisterForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";

export function LoginForm() {
  const { setUser, setView } = useAppStore();
  const { tx } = useText();
  const [email, setEmail] = useState("demo@ged.com");
  const [password, setPassword] = useState("demo1234");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || tx("loginFailed"));
        setLoading(false);
        return;
      }
      setUser(json.data);
      setView("dashboard");
    } catch {
      setError(tx("errorRetry"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-violet-50/30 to-indigo-50/30 p-4">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-violet-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-300/40">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">GED Prep</h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">Smart Learning Platform — {tx("loginSubtitle")}</p>
        </div>
        <Card className="border-0 shadow-2xl shadow-slate-200/50 rounded-2xl">
          <CardHeader className="pb-4 text-center">
            <CardTitle className="text-xl font-bold text-slate-800">{tx("loginTitle")}</CardTitle>
            <CardDescription className="text-slate-400">{tx("loginDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600 font-medium">{error}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-600 font-semibold text-xs uppercase tracking-wider">{tx("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="demo@ged.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl h-11 border-slate-200 focus:border-violet-400 focus:ring-violet-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-600 font-semibold text-xs uppercase tracking-wider">{tx("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="•••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl h-11 border-slate-200 focus:border-violet-400 focus:ring-violet-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-200/50 font-semibold"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {tx("loginBtn")}
              </Button>
              <div className="text-center text-sm">
                <span className="text-slate-500">{tx("noAccount")}</span>
                <button type="button" onClick={() => setView("register")} className="font-semibold text-violet-600 hover:text-violet-700">
                  {tx("registerBtn")}
                </button>
              </div>
            </form>
            {/* Quick demo */}
            <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <Sparkles className="h-3 w-3 text-violet-500" />
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{tx("tryDemo")}</p>
              </div>
              <button
                type="button"
                onClick={() => { setEmail("demo@ged.com"); setPassword("demo1234"); }}
                className="text-xs text-violet-600 hover:text-violet-700 font-medium"
              >
                {tx("demoAccount")}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AuthSwitch() {
  const { view } = useAppStore();
  if (view === "register") return <RegisterForm />;
  return <LoginForm />;
}
