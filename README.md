# CuteVerse — Frontend

React + Vite + TypeScript + Tailwind CSS + Framer Motion frontend for CuteVerse.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev            # http://localhost:5173
```

In development, `/api` requests are proxied to `http://localhost:4000` (see `vite.config.ts`).

## Environment variables

| Var | Description |
| --- | --- |
| `VITE_API_URL` | Backend base URL, e.g. `https://cuteverse-backend.vercel.app` |

## Scripts

- `npm run dev` — Vite dev server
- `npm run build` — type-check + production build to `dist/`
- `npm run preview` — preview production build
