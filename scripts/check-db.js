const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
  const subjects = await p.subject.findMany({ select: { id: true, code: true } });
  console.log('Subjects:', JSON.stringify(subjects, null, 2));
  const topicCount = await p.handbookTopic.count();
  console.log('Topics:', topicCount);
  const contentCount = await p.handbookContent.count();
  console.log('Contents:', contentCount);
  const topics = await p.handbookTopic.findMany({ select: { id: true, subjectId: true, title: true, categoryType: true } });
  console.log('Topics list:', JSON.stringify(topics, null, 2));
  await p.$disconnect();
}
main().catch(e => { console.error(e); p.$disconnect(); });
