// Helper: generate CUID-like ID (25 chars, alphanumeric)
function genId(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const ts = Math.floor(Date.now() / 1000).toString(36);
  let id = ts;
  for (let i = id.length; i < 25; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  return id;
}

// Helper: escape string for raw SQL
function esc(val: string | null | undefined): string {
  if (val == null) return 'NULL';
  return "'" + String(val).replace(/'/g, "''").replace(/\\/g, "\\\\") + "'";
}

// Build batch SQL rows for questions and answers
function buildBatchRows(
  lessonInfo: { id: string; subjectId: string },
  questions: [string, [string, boolean][], string, string, string[]][]
): { qRows: string[]; aRows: string[]; count: number } {
  const qRows: string[] = [];
  const aRows: string[] = [];
  let count = 0;

  for (const [qText, answers, difficulty, explanation, tags] of questions) {
    if (!qText) continue;
    const qId = genId();
    const pts = difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1;
    qRows.push(
      `('${qId}',${esc(lessonInfo.id)},${esc(lessonInfo.subjectId)},'multiple_choice',${esc(difficulty)},${pts},${esc(qText)},${esc(explanation)},NULL,true,NULL,${esc(JSON.stringify(tags))},NULL,NOW(),NOW())`
    );
    for (let i = 0; i < answers.length; i++) {
      const [content, isCorrect] = answers[i];
      aRows.push(`('${genId()}','${qId}',${esc(content)},${isCorrect},${i},NULL,NOW())`);
    }
    count++;
  }
  return { qRows, aRows, count };
}

// Execute batch INSERT (chunks to avoid query size limits)
async function batchInsert(sql: string, rows: string[], chunkSize: number) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const batch = rows.slice(i, i + chunkSize);
    await sql; // placeholder
  }
}

console.log('Helpers ready');
