#!/usr/bin/env bash
# Start backend and frontend for local development and write logs reliably
# Usage: ./start-all.sh

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

BACKEND_LOG="$ROOT_DIR/backend/backend.log"
FRONTEND_LOG="$ROOT_DIR/frontend.log"

mkdir -p "$(dirname "$BACKEND_LOG")"
touch "$BACKEND_LOG" "$FRONTEND_LOG"

echo "Stopping any processes on ports 5000 or 3000..."
PIDS_TO_KILL="$(lsof -tiTCP:5000 -sTCP:LISTEN || true) $(lsof -tiTCP:3000 -sTCP:LISTEN || true)" || true
for pid in $PIDS_TO_KILL; do
  if [ -n "$pid" ]; then
    echo "Killing PID $pid"
    kill "$pid" || true
  fi
done

echo "Starting backend (logs -> $BACKEND_LOG)"
cd "$ROOT_DIR"
nohup node backend/server.js > "$BACKEND_LOG" 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"

echo "Starting frontend static server on port 3000 (logs -> $FRONTEND_LOG)"
nohup python3 -m http.server 3000 --directory "$ROOT_DIR/frontend" > "$FRONTEND_LOG" 2>&1 &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo "All services started. Backend: http://localhost:5000/api  Frontend: http://localhost:3000"
echo "To stop: kill $BACKEND_PID $FRONTEND_PID"

echo "Tailing logs (backend first, then frontend). Use Ctrl-C to stop tailing." 
tail -n +1 -f "$BACKEND_LOG" "$FRONTEND_LOG"
