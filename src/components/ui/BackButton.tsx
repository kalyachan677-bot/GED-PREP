"use client";

import { ArrowLeft } from "lucide-react";
import { useText } from "@/lib/ui-texts";

interface BackButtonProps {
  label?: string;
  onClick: () => void;
  variant?: "default" | "danger";
  className?: string;
}

export function BackButton({
  label,
  onClick,
  variant = "default",
  className = "",
}: BackButtonProps) {
  const { tx } = useText();
  const displayLabel = label ?? tx("backBtn");
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        variant === "danger"
          ? "text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-xl"
          : "text-slate-600 hover:bg-slate-50 active:bg-slate-100 rounded-xl"
      } ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {displayLabel}
    </button>
  );
}