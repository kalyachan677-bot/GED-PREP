#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_OPTIONS='--max-old-space-size=384' npx next start -p 3000 2>>/tmp/next-server.log
  echo "[$(date)] Server exited, restarting in 2s..." >> /tmp/next-server.log
  sleep 2
done
