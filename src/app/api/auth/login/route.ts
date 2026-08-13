export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "จำเป็นต้องกรอกอีเมลและรหัสผ่าน" },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "บัญชีถูกระงับ" }, { status: 403 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    console.error("[POST /api/auth/login] Error:", error);
    return NextResponse.json({ error: "การเข้าสู่ระบบล้มเหลว" }, { status: 500 });
  }
}