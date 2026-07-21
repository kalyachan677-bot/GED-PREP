import { NextRequest, NextResponse } from "next/server";

const LANG_MAP: Record<string, string> = {
  th: "th",
  my: "my",
};

const MYMEMORY_BASE = "https://api.mymemory.translated.net/get";

async function translateSingle(text: string, langPair: string): Promise<string> {
  try {
    const url = `${MYMEMORY_BASE}?q=${encodeURIComponent(text)}&langpair=${langPair}&de=gedprep@demo.com`;
    const res = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    const json = await res.json();
    if (json.responseStatus === 200 && json.responseData?.translatedText) {
      let translated = json.responseData.translatedText;
      // MyMemory sometimes returns uppercase for short texts
      if (text.length > 20 && translated === translated.toUpperCase()) {
        translated = translated.charAt(0) + translated.slice(1).toLowerCase();
      }
      return translated;
    }
    return text;
  } catch {
    return text;
  }
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

    // Filter out empty/null/undefined texts
    const validEntries = texts
      .map((t: string, i: number) => ({ text: t, index: i }))
      .filter((e: { text: string }) => e.text && e.text.trim().length > 0);

    if (validEntries.length === 0) {
      return NextResponse.json({ translations: texts.map(() => "") });
    }

    const langPair = `en|${LANG_MAP[targetLang]}`;

    // Batch translate (MyMemory supports batch via array)
    // But for reliability, translate in parallel with concurrency limit
    const CONCURRENCY = 3;
    const results: Record<number, string> = {};

    for (let i = 0; i < validEntries.length; i += CONCURRENCY) {
      const batch = validEntries.slice(i, i + CONCURRENCY);
      const batchResults = await Promise.all(
        batch.map(async (entry: { text: string; index: number }) => {
          const translated = await translateSingle(entry.text, langPair);
          return { index: entry.index, translated };
        })
      );
      batchResults.forEach((r) => {
        results[r.index] = r.translated;
      });
    }

    // Build full translations array maintaining original order
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