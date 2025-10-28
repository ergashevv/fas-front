# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Core commands

- Install deps (pnpm preferred):
  - pnpm install
- Dev (Vite + Express middleware on port 8080):
  - pnpm dev
- Build
  - Full: pnpm build
  - Frontend only: pnpm build:client (outputs dist/spa)
  - Backend bundle (Vite SSR build -> dist/server): pnpm build:server
- Run (production)
  - Docker/Render bundle: node dist/server/production.mjs
  - Netlify (frontend + serverless API): pnpm build:client (Netlify picks up netlify.toml)
- Typecheck: pnpm typecheck
- Format: pnpm run format.fix
- Tests (Vitest)
  - All: pnpm test
  - Watch: pnpm vitest
  - Single file: pnpm vitest run client/lib/utils.spec.ts
  - Single test by name: pnpm vitest run client/lib/utils.spec.ts -t "cn function"
- Seed database (Mongo)
  - If the script alias fails, run directly: pnpm tsx fas-back/scripts/seed.ts

## Architecture overview

- Client (SPA)
  - React 18 + React Router 6, TypeScript, Vite, Tailwind.
  - Entry/routing: client/App.tsx; routes live in client/pages/* (Index.tsx = home). UI components under client/components/*; state via Zustand in client/store/*; shared utilities in client/lib/*.
  - Path aliases: '@/…' -> client/*, '@shared/…' -> shared/* (see vite.config.ts and tsconfig.json).
  - API client: client/lib/api.ts. It resolves base URL from VITE_API_BASE (dev defaults to http://localhost:8080). Uses fetch with auth header helper and shared types.
  - Shared types: shared/api.ts used by both client and server.

- Backend (Express + MongoDB)
  - Source under fas-back/*.
  - fas-back/index.ts exports createServer() (used by Vite dev middleware and Netlify function wrapper).
  - fas-back/server.ts starts the standalone HTTP server (serves /api and, in production mode, the built SPA from dist/spa).
  - Routes: fas-back/routes/* implement products, categories, comments, auth, orders. DB via Mongoose models (see route imports) and connection in fas-back/config/database.ts. Swagger is configured at /api-docs and /api-docs.json.
  - Seeding: fas-back/scripts/seed.ts ingests public/mocks/*.json into MongoDB.

- Dev server integration
  - vite.config.ts registers an expressPlugin() that mounts createServer() into the Vite dev server (single-port dev on 8080).
  - SSR server build config lives in vite.config.server.ts, targeting Node and outputting dist/server/production.mjs.

- Serverless/hosting config
  - Netlify: netlify.toml builds the SPA (build:client), redirects /api/* to netlify/functions/api (serverless-http wrapper calling createServer()).
  - Vercel: vercel.json serves dist/spa as a static SPA with rewrites.
  - Docker/Render: Dockerfile builds the backend bundle (pnpm run build:server) and starts node dist/server/production.mjs.

## Gotchas and tips specific to this repo

- Backend path vs script aliases: package.json has some scripts referring to server/*, but the actual backend sources are under fas-back/*. If pnpm start:dev or pnpm seed fail, invoke the targets directly with tsx (e.g., pnpm tsx fas-back/server.ts, pnpm tsx fas-back/scripts/seed.ts).
- Express import in Vite/Netlify: Code expects a top-level module named ./server providing createServer() (vite.config.ts and netlify/functions/api.ts). That is implemented in fas-back/index.ts. If tooling cannot resolve ./server, add a small top-level server.ts that re-exports from 'fas-back/index' or update imports to 'fas-back/index'.
- API base URL: client/lib/api.ts reads VITE_API_BASE; in dev, it defaults to http://localhost:8080. In production it targets https://faskids.shop by default; override via VITE_API_BASE if needed.

## Pointers to key files

- Build/dev config: vite.config.ts, vite.config.server.ts, tsconfig.json
- Frontend entry/routing: client/App.tsx
- API client: client/lib/api.ts
- Shared types: shared/api.ts
- Express app: fas-back/index.ts (createServer), fas-back/server.ts (standalone server)
- Routes: fas-back/routes/*
- Serverless: netlify/functions/api.ts, netlify.toml
- Container/deploy: Dockerfile, RENDER_DEPLOYMENT.md, PRODUCTION_DEPLOYMENT.md, DEPLOYMENT.md
