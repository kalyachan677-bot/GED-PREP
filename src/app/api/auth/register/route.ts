import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, studentId, studentName } = body as {
      email: string;
      studentId: string;
      studentName: string;
    };

    if (!email || !studentId || !studentName) {
      return NextResponse.json(
        { error: "จำเป็นต้องกรอก อีเมล รหัสผู้เข้าเรียน และชื่อผู้เข้าเรียน" },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingEmail = await db.user.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "อีเมลนี้ลงทะเบียนแล้ว" },
        { status: 409 }
      );
    }

    // Check duplicate studentId
    const existingStudentId = await db.user.findUnique({ where: { studentId } });
    if (existingStudentId) {
      return NextResponse.json(
        { error: "รหัสผู้เข้าเรียนนี้ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    const nameParts = studentName.trim().split(/\s+/);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const user = await db.user.create({
      data: {
        email,
        studentId: studentId.trim(),
        firstName,
        lastName,
        displayName: studentName,
        role: "student",
        status: "active",
      },
    });

    // Return user without sensitive fields (none now)
    const { id, email: e, studentId: sid, firstName: fn, lastName: ln, displayName, role, status, createdAt, updatedAt } = user;
    return NextResponse.json({
      data: { id, email: e, studentId: sid, firstName: fn, lastName: ln, displayName, role, status, createdAt, updatedAt }
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/auth/register] Error:", error);
    return NextResponse.json(
      { error: "การสมัครสมาชิกล้มเหลว" },
      { status: 500 }
    );
  }
}