import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function test() {
  // 1. Get math subject
  const math = await prisma.subject.findUnique({ where: { code: "math" } });
  console.log("Math subject ID:", math?.id);

  // 2. Check topics for math
  const topics = await prisma.handbookTopic.findMany({
    where: { subjectId: math?.id },
    include: { contents: true },
  });
  console.log("Math handbook topics:", topics.length);
  for (const t of topics) {
    console.log("  ", t.categoryType, t.title, "contents:", t.contents.length);
  }

  // 3. Check categoryType values
  const types = await prisma.handbookTopic.findMany({
    select: { categoryType: true },
    distinct: ["categoryType"],
  });
  console.log("\nDistinct categoryTypes:", types.map(t => t.categoryType));

  // 4. Verify contents have non-empty body
  const firstContent = await prisma.handbookContent.findFirst();
  if (firstContent) {
    console.log("\nFirst content body length (EN):", firstContent.contentBodyEn.length);
    console.log("First content body length (TH):", firstContent.contentBodyTh.length);
  }
}
test().then(() => prisma.$disconnect());
