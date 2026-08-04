// Persistent server with auto-restart
import { spawn } from 'child_process';
import fs from 'fs';

const LOG = '/home/z/my-project/server.log';

function start() {
  const child = spawn('npx', ['next', 'dev', '-p', '3000'], {
    cwd: '/home/z/my-project',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=384' }
  });

  const logStream = fs.createWriteStream(LOG, { flags: 'a' });
  child.stdout.pipe(logStream);
  child.stderr.pipe(logStream);

  child.on('exit', (code) => {
 const ts = new Date().toISOString();
    fs.appendFileSync(LOG, `\n[${ts}] Server exited with code ${code}, restarting in 2s...\n`);
    setTimeout(start, 2000);
  });

  return child;
}

// Clear old log
fs.writeFileSync(LOG, `=== Server started at ${new Date().toISOString()} ===\n`);
const server = start();

// Keep this process alive
process.on('SIGTERM', () => { server.kill(); process.exit(0); });
setInterval(() => {}, 60000); // prevent process from exiting
