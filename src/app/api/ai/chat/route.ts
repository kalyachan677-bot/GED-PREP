import { NextRequest, NextResponse } from "next/server";
import { GED_TUTOR_SYSTEM_PROMPT, buildSubjectContext } from "@/lib/ai-tutor-prompt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, subjectCode, categoryName, conversationHistory = [] } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Build system prompt with optional subject/category context
    let systemPrompt = GED_TUTOR_SYSTEM_PROMPT;
    if (subjectCode) {
      const subjectCtx = buildSubjectContext(subjectCode, categoryName);
      systemPrompt += `\n\n## CURRENT FOCUS\n${subjectCtx}`;
    }

    // Build messages array for the AI
    const messages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-10), // keep last 10 messages for context
      { role: "user", content: message },
    ];

    // Call AI API (using z-ai-web-dev-sdk or OpenAI-compatible endpoint)
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
    const baseUrl = process.env.AI_BASE_URL || "https://api.openai.com/v1";
    const model = process.env.AI_MODEL || "gpt-4o-mini";

    if (!apiKey) {
      // Fallback: return a structured response without AI call
      return NextResponse.json({
        role: "assistant",
        content: getFallbackResponse(message, subjectCode, categoryName),
        usedFallback: true,
      });
    }

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI API error:", response.status, errText);
      return NextResponse.json({
        role: "assistant",
        content: getFallbackResponse(message, subjectCode, categoryName),
        usedFallback: true,
        error: "AI API unavailable",
      });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I could not generate a response.";

    return NextResponse.json({
      role: "assistant",
      content: aiMessage,
      usedFallback: false,
      model: data.model,
      tokens: data.usage,
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getFallbackResponse(
  message: string,
  subjectCode?: string,
  categoryName?: string
): string {
  const subjectName: Record<string, string> = {
    math: "คณิตศาสตร์",
    rla: "ภาษาเชิงวิเคราะห์",
    science: "วิทยาศาสตร์",
    ss: "สังคมศึกษา",
  };

  const sub = subjectCode ? subjectName[subjectCode] || subjectCode : "GED";
  const cat = categoryName ? ` (หมวด: ${categoryName})` : "";

  return `สวัสดี! ผมเป็น AI ติวเตอร์สำหรับวิชา${sub}${cat}

ตอนนี้ระบบ AI กำลังอยู่ในโหมดตัวอย่าง — คุณสามารถลองถามคำถามเกี่ยวกับเนื้อหาได้เลย แต่การตอบจะเป็นแบบ template ชั่วคราว

คำถามที่คุณถาม: "${message}"

💡 เมื่อ AI API พร้อมใช้งาน ผมจะสามารถ:
- ตั้งคำถาม Socratic เพื่อทดสอบความเข้าใจ
- อธิบายแนวคิดตามหลักสูตร GED ที่แม่นยำ
- สร้างโจทย์แบบฝึกหัดจากหมวดหมู่ที่เกี่ยวข้อง
- ให้เฉลยอธิบายอย่างละเอียด`;
}
