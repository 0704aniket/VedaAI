# VedaAI — AI Assessment Creator

Full-stack monorepo for an AI-powered question paper generator. Teachers describe an assignment (subject, class, question mix); the system generates a structured paper via Gemini, persists it to MongoDB, and streams progress to the browser over WebSocket.

---

## Architecture

```
┌─────────────┐       HTTP / WS      ┌──────────────────┐      BullMQ     ┌──────────────┐
│  Next.js 16 │ ───────────────────▶ │ Express + Socket │ ──────────────▶ │  Worker      │
│  (apps/web) │  REST + Socket.IO    │ (apps/server)    │     (Redis)     │  + Gemini    │
└─────────────┘                      └──────────────────┘                 └──────┬───────┘
                                              │                                  │
                                              └─────────  MongoDB Atlas  ◀───────┘
```

- **Frontend** — Next.js 16 (App Router) + TypeScript + Tailwind v4 + Zustand + Socket.IO client
- **Backend** — Node + Express + TypeScript + Mongoose + Socket.IO + BullMQ
- **AI** — Google Gemini (`@google/generative-ai`) with JSON-mode prompt
- **Queue** — Redis 7 + BullMQ (in-process fallback if Redis disabled)
- **PDF** — Puppeteer on the backend (`/api/assignments/:id/pdf`)
- **Shared types** — `packages/shared`

---

## Prerequisites

- Node.js ≥ 20
- npm 10+
- Docker Desktop (for local Redis) — optional but recommended
- A MongoDB Atlas cluster (or local `mongod`)
- A Google Gemini API key — https://aistudio.google.com/app/apikey

---

## Setup

```bash
# 1. Install all workspaces
npm install

# 2. Configure env files
#    apps/server/.env       — already populated in this repo (rotate before deploy)
#    apps/web/.env.local    — points to http://localhost:5000

# 3. Start Redis (optional but enables BullMQ)
docker compose up -d
# Then flip apps/server/.env:
#   REDIS_ENABLED=true

# 4. Build the shared package (first run only)
cd packages/shared && npx tsc && cd ../..

# 5. Run everything via turbo
npm run dev
```

Frontend on http://localhost:3000, backend on http://localhost:5000.

> If `REDIS_ENABLED=false`, generation runs in-process. Useful when Docker isn't available — WebSocket progress still works.

---

## Environment variables

### `apps/server/.env`

| Var | Purpose |
|---|---|
| `PORT` | Express + Socket.IO port (default `5000`) |
| `MONGODB_USER` / `MONGODB_PASSWORD` / `MONGODB_CLUSTER_HOST` / `MONGODB_DB` | Atlas connection parts (preferred — password-safe encoding) |
| `MONGODB_URI` | Alternative single URI |
| `REDIS_ENABLED` | `true` to use BullMQ + Redis, `false` for in-process generation |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | Used when `REDIS_URL` not set |
| `REDIS_URL` | Optional full URL (e.g. Upstash `rediss://...`) |
| `GOOGLE_GEMINI_API_KEY` | Required for AI generation |
| `GOOGLE_GEMINI_MODEL` | Default `gemini-2.0-flash` |
| `LLM_PROVIDER` | `gemini` (only one wired today) |
| `WS_CORS_ORIGIN` | Frontend origin for CORS + Socket.IO |

### `apps/web/.env.local`

| Var | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend REST base, e.g. `http://localhost:5000/api` |
| `NEXT_PUBLIC_WS_URL` | Backend Socket.IO base, e.g. `http://localhost:5000` |

---

## Project structure

```
apps/
  server/
    src/
      config/         # env, db, redis, mongoUri builder
      controllers/    # assignment, generate, pdf
      jobs/           # BullMQ queue + worker + in-process fallback
      models/         # Mongoose: Assignment, GeneratedPaper
      routes/
      services/       # ai.service.ts (Gemini prompt + JSON parse)
      websocket/      # Socket.IO room-based emits
      index.ts
  web/
    src/
      app/            # Next.js routes
        assignments/
          page.tsx           # list
          [id]/page.tsx      # OUTPUT page
        create-assignment/page.tsx
        home, groups, ai-toolkit, library, settings/  # stub pages
      components/
        layout/       # AppLayout, Sidebar, TopBar, MobileNav
        create/       # multi-step form
        assignments/  # grid, cards, filters
        output/       # PaperHeader, StudentInfo, PaperSection,
                      # QuestionItem, DifficultyBadge, AnswerKey, ActionBar
      hooks/useWebSocket.ts
      store/          # Zustand: useAssignmentStore, useCreateStore, useSocketStore
packages/
  shared/             # shared TS types (Assignment, GeneratedPaper, WS payloads)
docker-compose.yml    # local redis
```

---

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | health probe |
| `GET` | `/api/assignments` | list (`?search=`, `?status=`, `?page=`, `?limit=`) |
| `POST` | `/api/assignments` | create (returns draft) |
| `GET` | `/api/assignments/:id` | one (with populated paper) |
| `DELETE` | `/api/assignments/:id` | delete + cascade paper |
| `POST` | `/api/assignments/:id/generate` | queue paper generation |
| `GET` | `/api/assignments/:id/paper` | fetch generated paper |
| `GET` | `/api/assignments/:id/pdf` | render paper as PDF (Puppeteer) |

### WebSocket events (Socket.IO)

Client → server: `join:assignment`, `leave:assignment`
Server → client: `generation:started`, `generation:progress`, `generation:completed`, `generation:error`, `assignment:updated`

---

## Generation flow

1. `POST /api/assignments` — persist draft
2. `POST /api/assignments/:id/generate` — enqueue (BullMQ) or run in-process
3. Worker emits `generation:progress` at 10/20/30/70/85/100
4. Worker calls Gemini, parses + validates JSON, writes `GeneratedPaper`
5. Worker emits `generation:completed` with the paper
6. Frontend subscribed to the assignment room redirects to `/assignments/:id`

---

## Output page

Route: `/assignments/[id]` — renders the question paper with:

- School / subject / class / time / max-marks header
- Printable Student Info row (name, roll number, section)
- Sections (A, B, C …) each with title, instruction, question list
- Per-question difficulty badge (Easy / Moderate / Challenging) + marks
- MCQ options laid out in two columns when present
- Collapsible Answer Key
- Sticky Action Bar: Back / Regenerate / Download PDF
- Fully mobile-responsive (`sm:`/`md:` breakpoints) and print-friendly (`print:` utilities)

---

## Validation rules

- Title, due date, at least one question type required
- Question count > 0, marks per question > 0 (server-side check)
- Difficulty restricted to `Easy | Moderate | Challenging` (Mongoose enum + AI fallback)
- AI response parsed through `cleanJsonResponse` and structurally validated before persistence — **no raw LLM output is rendered**

---

## Bonus features delivered

- ✅ PDF download via Puppeteer (`/api/assignments/:id/pdf`)
- ✅ Regenerate action on output page
- ✅ Difficulty badges with semantic colours
- ✅ Redis-disabled fallback (still works without Docker)
- ✅ Mobile-responsive layout + sticky action bar
- ✅ Answer key collapsible panel
- ✅ Cached `GET /:id` and paper responses when Redis is on

---

## Scripts

```bash
npm run dev      # turbo dev (server + web)
npm run build    # turbo build
```

Per-workspace:

```bash
npm --workspace @vedaai/server run dev
npm --workspace @vedaai/web run dev
```

---

## Troubleshooting

- **`Failed to parse AI response` / `404 model not found`** — set `GOOGLE_GEMINI_MODEL=gemini-2.0-flash` (or `gemini-2.5-flash`). Older `gemini-1.5-*` IDs are no longer served on `v1beta`.
- **Mongo auth failed** — password containing `@` must use the split `MONGODB_USER` / `MONGODB_PASSWORD` form (encoded automatically by `mongoUri.ts`).
- **PDF endpoint hangs on first call** — Puppeteer downloads Chromium on first invocation; subsequent calls are fast.
- **WebSocket not connecting** — check `WS_CORS_ORIGIN` on backend matches your frontend origin exactly.
