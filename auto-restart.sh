#!/bin/bash
cd /home/z/my-project
while true; do
  npx next dev -p 3000 >> /tmp/dev-restart.log 2>&1
  echo "$(date '+%H:%M:%S') restart" >> /tmp/dev-restart.log
  sleep 2
done
