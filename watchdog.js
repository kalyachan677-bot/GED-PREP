const { spawn } = require('child_process');
const fs = require('fs');

const log = fs.openSync('/tmp/next-watchdog.log', 'a');

function startServer() {
  const time = new Date().toISOString();
  fs.writeSync(log, `[${time}] Starting next server...\n`);
  
  const child = spawn('npx', ['next', 'start', '-p', '3000'], {
    cwd: '/home/z/my-project',
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=384' },
    stdio: ['ignore', log, log],
    detached: false
  });
  
  child.on('exit', (code) => {
    const t = new Date().toISOString();
    fs.writeSync(log, `[${t}] Server exited with code ${code}, restarting in 3s...\n`);
    setTimeout(startServer, 3000);
  });
  
  child.on('error', (err) => {
    const t = new Date().toISOString();
    fs.writeSync(log, `[${t}] Server error: ${err.message}, restarting in 3s...\n`);
    setTimeout(startServer, 3000);
  });
}

startServer();
fs.writeSync(log, 'Watchdog started\n');
