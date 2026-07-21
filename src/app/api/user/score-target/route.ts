import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/user/score-target?userId=xxx
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "จำเป็นต้องระบุ userId" }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, scoreTarget: true },
    });

    if (!user) {
      return NextResponse.json({ error: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("[GET /api/user/score-target] Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// PUT /api/user/score-target
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, scoreTarget } = body as { userId: string; scoreTarget: number };

    if (!userId) {
      return NextResponse.json({ error: "จำเป็นต้องระบุ userId" }, { status: 400 });
    }

    if (!scoreTarget || scoreTarget < 145 || scoreTarget > 200) {
      return NextResponse.json(
        { error: "คะแนนเป้าหมายต้องอยู่ระหว่าง 145 ถึง 200" },
        { status: 400 }
      );
    }

    const user = await db.user.update({
      where: { id: userId },
      data: { scoreTarget: Math.round(scoreTarget) },
      select: { id: true, scoreTarget: true },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error("[PUT /api/user/score-target] Error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดในการบันทึก" }, { status: 500 });
  }
}