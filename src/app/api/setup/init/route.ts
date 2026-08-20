import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { MIGRATION_SQL } from "@/lib/migration-sql";

export const dynamic = "force-dynamic";

// Lightweight init: tables + demo user + 4 subjects only.
// Designed to complete within 5 seconds on Vercel serverless.
export async function GET() {
  try {
    // 1) Create tables (idempotent CREATE IF NOT EXISTS)
    const statements = MIGRATION_SQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        await db.$executeRawUnsafe(stmt + ";");
      } catch {
        // Table already exists or constraint ok — skip
      }
    }

    // 2) Ensure demo user exists
    const existing = await db.user.findUnique({ where: { email: "demo@ged.com" } });
    if (!existing) {
      const hash = await bcrypt.hash("demo1234", 12);
      await db.user.create({
        data: {
          email: "demo@ged.com",
          passwordHash: hash,
          firstName: "Demo",
          lastName: "Student",
          displayName: "Demo Student",
          role: "student",
          status: "active",
          preferredLang: "th",
        },
      });
    }

    // 3) Ensure 4 subjects exist
    const subjectCount = await db.subject.count();
    if (subjectCount === 0) {
      const subjects = [
        { code: "math", title: "Mathematical Reasoning", description: "Algebra, geometry, data analysis", colorHex: "10B981", sortOrder: 0 },
        { code: "science", title: "Science", description: "Life, physical, and earth & space science", colorHex: "3B82F6", sortOrder: 1 },
        { code: "rla", title: "Reasoning Through Language Arts", description: "Reading comprehension, writing, grammar", colorHex: "F59E0B", sortOrder: 2 },
        { code: "ss", title: "Social Studies", description: "History, civics, economics, geography", colorHex: "EF4444", sortOrder: 3 },
      ];
      for (const s of subjects) {
        await db.subject.create({
          data: { ...s, status: "published" },
        });
      }
    }

    const users = await db.user.count();
    const subs = await db.subject.count();
    return NextResponse.json({
      status: "ready",
      users,
      subjects: subs,
      message: "Base init complete. Login is ready.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[setup/init] Error:", error);
    return NextResponse.json({ status: "error", error: msg }, { status: 500 });
  }
}
