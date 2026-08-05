#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting server..." >> /tmp/keeper.log
  npx next start -p 3000 2>&1 | tee -a /tmp/next-err.log
  echo "[$(date)] Crashed, restart in 2s" >> /tmp/keeper.log
  sleep 2
done
