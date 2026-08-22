import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

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

    // Check if DB connection works at all
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: "DATABASE_URL ไม่ได้ตั้งค่าในเซิร์ฟเวอร์" },
        { status: 500 }
      );
    }

    let user;
    try {
      user = await db.user.findUnique({ where: { email } });
    } catch (dbError) {
      const msg = dbError instanceof Error ? dbError.message : String(dbError);
      console.error("[login] DB query failed:", msg);
      // If table doesn't exist, suggest running init
      if (msg.includes("does not exist") || msg.includes("relation")) {
        return NextResponse.json(
          { error: "ฐานข้อมูลยังไม่พร้อม กรุณารอสักครู่แล้วลองใหม่" },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { error: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้: " + msg.substring(0, 100) },
        { status: 500 }
      );
    }

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
