import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ---------------------------------------------------------------------------
// PUT /api/user/nickname — Update user displayName
// Body: { userId: string, nickname: string }
// ---------------------------------------------------------------------------
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, nickname } = body as { userId: string; nickname: string };

    if (!userId || !nickname || nickname.trim().length === 0) {
      return NextResponse.json(
        { error: "userId and nickname are required" },
        { status: 400 }
      );
    }

    const trimmed = nickname.trim().slice(0, 50);

    const user = await db.user.update({
      where: { id: userId },
      data: { displayName: trimmed },
    });

    return NextResponse.json({
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        role: user.role,
        status: user.status,
        scoreTarget: user.scoreTarget,
      },
    });
  } catch (error) {
    console.error("[PUT /api/user/nickname] Error:", error);
    return NextResponse.json(
      { error: "Failed to update nickname" },
      { status: 500 }
    );
  }
}
