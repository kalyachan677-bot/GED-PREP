export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body as {
      email: string;
      password: string;
      name: string;
    };

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "จำเป็นต้องกรอกอีเมล รหัสผ่าน และชื่อผู้เข้าเรียน" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "อีเมลนี้ลงทะเบียนแล้ว" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        displayName: name,
        role: "student",
        status: "active",
      },
    });

    const { passwordHash: _, ...safeUser } = user;
    return NextResponse.json({ data: safeUser }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register] Error:", error);
    return NextResponse.json(
      { error: "การสมัครสมาชิกล้มเหลว" },
      { status: 500 }
    );
  }
}