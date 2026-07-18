#!/usr/bin/env node
// ============================================================================
// Loop 2 — Start server + run tests + auto-shutdown
// ============================================================================

const { spawn } = require('child_process');
const http = require('http');

const BASE = 'http://localhost:4000';
const SERVER_TIMEOUT = 15000; // kill server after this

function request(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const req = http.request({
      hostname: url.hostname, port: url.port,
      path: url.pathname, method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 3000,
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.end();
  });
}

function requestRaw(method, path, rawBody, contentLength) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const req = http.request({
      hostname: url.hostname, port: url.port,
      path: url.pathname, method,
      headers: { 'Content-Type': 'application/json', 'Content-Length': String(contentLength) },
      timeout: 3000,
    }, (res) => {
      let data = '';
      res.on('data', (c) => { data += c; });
      res.on('end', () => {
        let parsed;
        try { parsed = JSON.parse(data); } catch { parsed = data; }
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
    req.write(rawBody);
    req.end();
  });
}

let failures = 0;
function assert(cond, msg) {
  if (!cond) { console.error(`  FAIL: ${msg}`); failures++; }
  else { console.log(`  PASS: ${msg}`); }
}

async function waitForServer(maxMs) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await request('GET', '/api');
      return true;
    } catch { await new Promise(r => setTimeout(r, 300)); }
  }
  return false;
}

async function runTests() {
  // Test 1: GET / redirects
  console.log('\n--- Test 1: GET / redirects ---');
  try {
    const r = await request('GET', '/');
    assert(r.status === 302 || r.status === 301, `Expected redirect, got ${r.status}`);
  } catch (e) { assert(false, `Request failed: ${e.message}`); }

  // Test 2: GET /api
  console.log('\n--- Test 2: GET /api returns API info ---');
  try {
    const r = await request('GET', '/api');
    assert(r.status === 200, `Expected 200, got ${r.status}`);
    assert(r.body && r.body.success === true, 'success: true');
    assert(r.body.data && r.body.data.name === 'GED Prep Platform API', 'API name');
    assert(r.body.data && r.body.data.version === '0.1.0', 'version 0.1.0');
  } catch (e) { assert(false, `Request failed: ${e.message}`); }

  // Test 3: GET /api/health (degraded)
  console.log('\n--- Test 3: GET /api/health (degraded without DB) ---');
  try {
    const r = await request('GET', '/api/health');
    assert(r.status === 503, `Expected 503, got ${r.status}`);
    assert(r.body.success === false, 'success: false');
    assert(r.body.error && r.body.error.code === 503, 'error.code: 503');
    assert(r.body.error.details && r.body.error.details.server === 'ok', 'server: ok');
    assert(r.body.error.details && r.body.error.details.postgresql === 'error', 'postgresql: error');
    assert(r.body.error.details && r.body.error.details.mongodb === 'error', 'mongodb: error');
    assert(r.body.error.details && typeof r.body.error.details.uptime === 'number', 'has uptime');
    assert(r.body.error.details && typeof r.body.error.details.responseTimeMs === 'number', 'has responseTimeMs');
  } catch (e) { assert(false, `Request failed: ${e.message}`); }

  // Test 4: 404
  console.log('\n--- Test 4: GET /api/nonexistent returns 404 ---');
  try {
    const r = await request('GET', '/api/nonexistent');
    assert(r.status === 404, `Expected 404, got ${r.status}`);
    assert(r.body.success === false, 'success: false');
  } catch (e) { assert(false, `Request failed: ${e.message}`); }

  // Test 5: Bad JSON
  console.log('\n--- Test 5: POST with invalid JSON returns 400 ---');
  try {
    const body = '{bad json';
    const r = await requestRaw('POST', '/api/health', body, body.length);
    assert(r.status === 400, `Expected 400, got ${r.status}`);
    assert(r.body.success === false, 'success: false');
    assert(r.body.error && r.body.error.message.includes('JSON'), 'mentions JSON');
  } catch (e) { assert(false, `Request failed: ${e.message}`); }

  // Test 6: Security headers
  console.log('\n--- Test 6: Security headers present ---');
  try {
    const r = await request('GET', '/api');
    assert(r.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options: nosniff');
    assert(r.headers['x-frame-options'] !== undefined, 'X-Frame-Options present');
  } catch (e) { assert(false, `Request failed: ${e.message}`); }

  // Test 7: Rate limit headers
  console.log('\n--- Test 7: Rate limit headers present ---');
  try {
    const r = await request('GET', '/api');
    assert(r.headers['ratelimit-limit'] !== undefined, 'RateLimit-Limit header');
    assert(r.headers['ratelimit-remaining'] !== undefined, 'RateLimit-Remaining header');
  } catch (e) { assert(false, `Request failed: ${e.message}`); }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('Starting server...');
  const serverCwd = require('path').join(__dirname, '..');
  const server = spawn('node', ['src/index.js'], {
    cwd: serverCwd,
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env },
  });

  let serverOutput = '';
  server.stdout.on('data', (d) => { serverOutput += d.toString(); });
  server.stderr.on('data', (d) => { serverOutput += d.toString(); });

  const up = await waitForServer(8000);
  if (!up) {
    console.error('Server failed to start within 8s. Output:');
    console.error(serverOutput);
    server.kill('SIGKILL');
    process.exit(1);
  }
  console.log('Server is up.');

  await runTests();

  server.kill('SIGTERM');
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n========================================');
  if (failures === 0) {
    console.log('  ALL TESTS PASSED (Loop 2)');
  } else {
    console.log(`  ${failures} TEST(S) FAILED (Loop 2)`);
  }
  console.log('========================================\n');

  process.exit(failures > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});