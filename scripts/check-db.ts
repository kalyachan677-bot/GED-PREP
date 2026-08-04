import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function check() {
  const count = await prisma.handbookTopic.count();
  console.log("Topics:", count);
  const contentCount = await prisma.handbookContent.count();
  console.log("Contents:", contentCount);
  const topics = await prisma.handbookTopic.findMany({ include: { subject: true }, take: 5 });
  for (const t of topics) {
    console.log(t.subject.code, t.categoryType, t.title);
  }
  // Check subjects
  const subjects = await prisma.subject.findMany({ select: { id: true, code: true } });
  console.log("\nSubjects:");
  for (const s of subjects) {
    console.log(s.id, s.code);
  }
}
check().then(() => prisma.$disconnect());
