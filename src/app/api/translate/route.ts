export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";

const LANG_MAP: Record<string, string> = {
  th: "th",
  my: "my",
};

/**
 * ใช้ Google Translate (unofficial) เป็นหลัก
 * fallback → Lingva Translate
 */
async function translateViaGoogle(text: string, targetLang: string): Promise<string | null> {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(10000),
    });
    const json = await res.json();
    if (json && Array.isArray(json[0])) {
      // Google returns array of [translated, original, ...]
      const translated = json[0]
        .filter((item: unknown[]) => item[0])
        .map((item: unknown[]) => item[0] as string)
        .join("");
      return translated || null;
    }
    return null;
  } catch {
    return null;
  }
}

async function translateViaLingva(text: string, targetLang: string): Promise<string | null> {
  try {
    const instances = [
      "https://lingva.ml",
      "https://lingva.lunar.icu",
      "https://translate.plausibility.cloud",
    ];
    for (const base of instances) {
      try {
        const url = `${base}/api/v1/en/${targetLang}/${encodeURIComponent(text)}`;
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
        if (res.ok) {
          const json = await res.json();
          if (json.translation) return json.translation as string;
        }
      } catch {
        continue; // ลอง instance ถัดไป
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function translateSingle(text: string, targetLang: string): Promise<string> {
  // ลอง Google ก่อน
  const googleResult = await translateViaGoogle(text, targetLang);
  if (googleResult) return googleResult;

  // fallback → Lingva
  const lingvaResult = await translateViaLingva(text, targetLang);
  if (lingvaResult) return lingvaResult;

  // ไม่สามารถแปลได้ — คืนข้อความเดิม
  return text;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { texts, targetLang } = body;

    if (!texts || !Array.isArray(texts) || !targetLang || !LANG_MAP[targetLang]) {
      return NextResponse.json(
        { error: "Invalid request. Provide { texts: string[], targetLang: 'th' | 'my' }" },
        { status: 400 }
      );
    }

    // กรองข้อความว่าง
    const validEntries = texts
      .map((t: string, i: number) => ({ text: t, index: i }))
      .filter((e: { text: string }) => e.text && e.text.trim().length > 0);

    if (validEntries.length === 0) {
      return NextResponse.json({ translations: texts.map(() => "") });
    }

    const lang = LANG_MAP[targetLang];
    const CONCURRENCY = 3;
    const results: Record<number, string> = {};

    for (let i = 0; i < validEntries.length; i += CONCURRENCY) {
      const batch = validEntries.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (entry: { text: string; index: number }) => {
          const translated = await translateSingle(entry.text, lang);
          return { index: entry.index, translated };
        })
      );
      batchResults.forEach((r) => {
        results[r.index] = r.translated;
      });
    }

    const translations = texts.map((t: string, i: number) => results[i] || t);

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed", translations: [] },
      { status: 500 }
    );
  }
}