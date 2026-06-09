# OncoMind AI

OncoMind AI is a production-grade Next.js 15 portfolio application for a multi-agent cancer intelligence platform. It includes a polished landing page, authentication screens, analytics dashboards, cited AI chat, voice assistant, document upload center, cancer report analyzer, research assistant, clinical trial explorer, doctor visit preparation, evaluation telemetry, admin monitoring, and settings.

## Stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS with shadcn/ui-style primitives
- Framer Motion
- React Query
- Zustand
- Recharts
- Clerk-ready authentication
- Lucide Icons

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Copy `.env.example` to `.env.local` and update values when connecting real services.

```bash
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
CLERK_SECRET_KEY=sk_test_replace_me
GROQ_API_KEY=gsk_replace_me
PINECONE_API_KEY=pcsk_replace_me
PINECONE_INDEX_NAME=cancer-ai
PINECONE_HOST=
```

The app runs fully with mock data when these values are not configured.

## Project Structure

```text
app/          Next.js routes, layouts, loading, error, and not-found states
components/   Layout, UI primitives, widgets, charts, and reusable cards
hooks/        Shared React hooks
lib/          Utilities and mock domain data
services/     Backend-ready service layer for auth, chat, upload, analytics, evaluation
store/        Zustand settings store
types/        Shared TypeScript domain types
```

## Backend Integration

Service modules are isolated by concern:

- `services/auth-service.ts`
- `services/chat-service.ts`
- `services/upload-service.ts`
- `services/analytics-service.ts`
- `services/evaluation-service.ts`

Replace mock implementations with calls through `services/http.ts` once `NEXT_PUBLIC_API_URL` is available.

## Authentication

The app includes Clerk as a dependency and wraps the application with `ClerkProvider` when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is configured. Demo mode stays open so all portfolio pages are inspectable without external secrets. For strict production protection, replace the lightweight `middleware.ts` placeholder with Clerk's `clerkMiddleware` and `auth().protect()` flow.

## Deployment

The project includes `vercel.json` and is ready for Vercel. Secret values are intentionally not stored in `vercel.json`; add them in Vercel Project Settings -> Environment Variables.

```bash
npm run build
```

Set these Vercel environment variables only when you want live integrations:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `GROQ_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`
- `PINECONE_HOST`

## Notes

This interface is a healthcare AI product mockup. It is designed for portfolio and integration use and does not provide medical advice.
