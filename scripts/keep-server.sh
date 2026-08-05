#!/bin/bash
cd /home/z/my-project
while true; do
  npx next dev -p 3000 2>&1 | tee -a /tmp/next-err.log
  echo "[$(date)] RESTART" >> /tmp/keeper.log
  sleep 2
done
