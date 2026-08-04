#!/bin/bash
# Auto-restarting server for GED Prep Platform
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting server..."
  NODE_OPTIONS='--max-old-space-size=512' npx next start -p 3000 2>&1
  echo "[$(date)] Server exited, restarting in 3s..."
  sleep 3
done