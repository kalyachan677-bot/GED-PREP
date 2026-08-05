#!/bin/bash
# Auto-restart Next.js server
while true; do
  echo "[$(date)] Starting Next.js server..."
  npx next start -p 3000 2>&1 | tee -a /tmp/next-err.log
  EXIT=$?
  echo "[$(date)] Server exited with code $EXIT, restarting in 3s..."
  sleep 3
done
