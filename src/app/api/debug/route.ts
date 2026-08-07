import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const count = await db.subject.count();
    return NextResponse.json({ status: "ok", subjects: count });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ status: "error", error: msg, envUrl: process.env.DATABASE_URL?.replace(/:\/\/.+@/, "://***@")?.substring(0, 80) });
  }
}
