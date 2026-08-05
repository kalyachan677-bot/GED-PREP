#!/bin/bash
cd /home/z/my-project
while true; do
  echo "$(date '+%H:%M:%S') Starting server..." >> /tmp/keep-alive.log
  NODE_OPTIONS='--max-old-space-size=512' npx next start -p 3000 >> /tmp/keep-alive.log 2>&1
  EC=$?
  echo "$(date '+%H:%M:%S') Crashed (exit=$EC), restarting in 2s..." >> /tmp/keep-alive.log
  sleep 2
done
