"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppStore, AppLanguage } from "./store";

/**
 * useTranslation — แปลข้อความภาษาอังกฤษ → ภาษาที่เลือก
 * ใช้ cache ใน Zustand store + localStorage
 */
export function useTranslation() {
  const { language, translationCache, setTranslationCache } = useAppStore();
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingRef = useRef<Set<string>>(new Set());

  // โหลด cache จาก localStorage เมื่อ mount
  useEffect(() => {
    if (language === "en") return;
    try {
      const saved = localStorage.getItem(`ged-tcache-${language}`);
      if (saved) {
        setTranslationCache({ ...translationCache, [language]: JSON.parse(saved) });
      }
    } catch {
      // ignore
    }
  }, [language]); // eslint-disable-line react-hooks/exhaustive-deps

  // บันทึก cache ลง localStorage
  const saveCache = useCallback(
    (lang: string, cache: Record<string, string>) => {
      try {
        localStorage.setItem(`ged-tcache-${lang}`, JSON.stringify(cache));
      } catch {
        // quota exceeded — ignore
      }
    },
    []
  );

  // แปลข้อความเดี่ยว (ใช้ cache)
  const t = useCallback(
    (text: string): string => {
      if (!text || language === "en") return text;
      const langCache = translationCache[language];
      if (langCache && langCache[text]) return langCache[text];
      return text; // ยังไม่แปล — ใช้ข้อความต้นฉบับ
    },
    [language, translationCache]
  );

  // แปลหลายข้อความแบบ batch พร้อม fetch จาก API
  const translateBatch = useCallback(
    async (texts: string[]): Promise<string[]> => {
      if (!texts.length || language === "en") return texts;

      const langCache = translationCache[language] || {};

      // กรองเฉพาะที่ยังไม่มีใน cache
      const uncached: { text: string; index: number }[] = [];
      const results = texts.map((text, i) => {
        if (langCache[text]) return langCache[text];
        uncached.push({ text, index: i });
        return text;
      });

      if (uncached.length === 0) return results;

      setIsTranslating(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            texts: uncached.map((e) => e.text),
            targetLang: language,
          }),
          signal: AbortSignal.timeout(30000),
        });
        const json = await res.json();
        const newTranslations: string[] = json.translations || [];

        // อัปเดต cache
        const updatedLangCache = { ...langCache };
        uncached.forEach((entry, i) => {
          const translated = newTranslations[i] || entry.text;
          updatedLangCache[entry.text] = translated;
          results[entry.index] = translated;
        });

        const updatedCache = { ...translationCache, [language]: updatedLangCache };
        setTranslationCache(updatedCache);
        saveCache(language, updatedLangCache);

        return results;
      } catch (err) {
        console.error("Translation batch failed:", err);
        return texts;
      } finally {
        setIsTranslating(false);
      }
    },
    [language, translationCache, setTranslationCache, saveCache]
  );

  return { t, translateBatch, isTranslating, language };
}
