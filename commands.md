# VedaAI Commands Reference

This document lists the commands to run, build, and manage the VedaAI monorepo.

## Prerequisite Services

Ensure you have MongoDB and Redis running before starting the server.

  cd C:/Users/User/Downloads/doc

  # 1. Install deps (once)
  npm install

  # 2. Build shared types (once)
  cd packages/shared && npx tsc && cd ../..

  # 3. (Optional) Start Redis via Docker
  docker compose up -d
  #    Then edit apps/server/.env: REDIS_ENABLED=true

  # 4. Run both apps via turbo
  npm run dev

  Or run apps separately in two terminals:

  # Terminal 1 — backend on :5000
  npm --workspace @vedaai/server run dev

  # Terminal 2 — frontend on :3000
  npm --workspace @vedaai/web run dev

  netstat -ano | grep ":5000" | grep LISTENING   # find PID
  taskkill //PID <pid> //F