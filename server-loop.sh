#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date '+%H:%M:%S')] Starting next start..." >> /tmp/next-loop.log
  npx next start -p 3000 >> /tmp/next-loop.log 2>&1
  echo "[$(date '+%H:%M:%S')] Server exited, restarting in 2s..." >> /tmp/next-loop.log
  sleep 2
done
