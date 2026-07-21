"use client";

import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label?: string;
  onClick: () => void;
  variant?: "default" | "danger";
  className?: string;
}

export function BackButton({
  label = "ย้อนกลับ",
  onClick,
  variant = "default",
  className = "",
}: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        variant === "danger"
          ? "text-rose-600 hover:bg-rose-50 active:bg-rose-100"
          : "text-gray-600 hover:bg-gray-100 active:bg-gray-200"
      } ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}