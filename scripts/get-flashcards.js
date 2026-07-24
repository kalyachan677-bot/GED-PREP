const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
(async () => {
  const f = await p.flashcard.findMany({ orderBy: { sortOrder: 'asc' } });
  f.forEach(c => console.log(c.term + '|||' + c.meaning));
  await p.$disconnect();
})();
