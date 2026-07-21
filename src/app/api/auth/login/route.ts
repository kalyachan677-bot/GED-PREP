import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, studentId, studentName } = body as {
      email?: string;
      studentId?: string;
      studentName?: string;
    };

    // Must provide at least email or studentId
    if (!email && !studentId) {
      return NextResponse.json(
        { error: "จำเป็นต้องกรอก อีเมล หรือ รหัสผู้เข้าเรียน" },
        { status: 400 }
      );
    }

    // Try to find user by email or studentId
    let user = null;
    if (email) {
      user = await db.user.findUnique({ where: { email: email.trim() } });
    }
    if (!user && studentId) {
      user = await db.user.findUnique({ where: { studentId: studentId.trim() } });
    }

    if (!user) {
      return NextResponse.json(
        { error: "ไม่พบข้อมูลผู้เข้าเรียน" },
        { status: 404 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json({ error: "บัญชีถูกระงับ" }, { status: 403 });
    }

    // If studentName provided, verify it matches (optional validation)
    if (studentName) {
      const fullName = `${user.firstName} ${user.lastName}`.trim().toLowerCase();
      if (!fullName.includes(studentName.trim().toLowerCase())) {
        return NextResponse.json(
          { error: "ชื่อผู้เข้าเรียนไม่ตรงกับข้อมูลที่ลงทะเบียน" },
          { status: 401 }
        );
      }
    }

    const { id, email: e, studentId: sid, firstName, lastName, displayName, role, status, createdAt, updatedAt } = user;
    return NextResponse.json({
      data: { id, email: e, studentId: sid, firstName, lastName, displayName, role, status, createdAt, updatedAt }
    });
  } catch (error) {
    console.error("[POST /api/auth/login] Error:", error);
    return NextResponse.json({ error: "การเข้าสู่ระบบล้มเหลว" }, { status: 500 });
  }
}
