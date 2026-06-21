# Insurance Platform

Nx monorepo for the ABC Insurance **Senior UI case study** — a claims adjudication portal handling 20k+ records and large PDF documents with RBAC.

## Quick start

```bash
pnpm install
pnpm nx dev @org/claims-portal
```

Open [http://localhost:3000](http://localhost:3000).

## Workspace

| Project | Path | Role |
|---------|------|------|
| `@org/claims-portal` | `apps/claims-portal` | Next.js app, routes, mock API |
| `@org/claims-portal-e2e` | `apps/claims-portal-e2e` | Playwright e2e |
| `@org/design-system` | `libs/design-system` | Tokens, shadcn/ui |
| `@org/shared` | `libs/shared` | Types, utils, API client |
| `@org/auth` | `libs/auth` | Mock auth, RBAC |
| `@org/claims` | `libs/claims` | Claims domain hooks |
| `@org/documents` | `libs/documents` | PDF viewer, jobs, comments |
| `@org/data-grid` | `libs/ui/data-grid` | Virtualized claims grid |
| `@org/layout` | `libs/ui/layout` | App shell |

## Commands

```bash
pnpm nx dev @org/claims-portal          # Dev server
pnpm nx build @org/claims-portal        # Production build
pnpm nx affected -t lint test build     # CI-style check
pnpm nx graph                           # Dependency graph
```

## Feature development

Specs live in `context/features/`. Use the feature skill:

```text
/feature load foundation-phase-0-spec
/feature start
```

Index: `context/features/claims-portal-master-spec.md`

## Documentation

| Location | Content |
|----------|---------|
| `.cursor/rules/project.mdc` | Full implementation plan, architecture, trade-offs |
| `context/project-overview.md` | Case study summary |
| `context/coding-standards.md` | Code conventions |
| `docs/` | Architecture docs (Phase 12) |

## Tech stack

Next.js 16 · React 19 · TypeScript · Nx 23 · Tailwind v4 · shadcn/ui · TanStack Query/Table/Virtual · Zustand · PDF.js

## Deploy to Vercel

The claims portal is a **single Next.js deployment**: UI pages and mock API (`/api/*`) ship together as [Vercel Serverless Functions](https://vercel.com/docs/functions). No separate backend service is required for the case-study mock API.

### One-time project setup

1. Sign in at [Vercel](https://vercel.com/hemants-projects-bcff30f7) and **Import** this Git repository.
2. Leave **Root Directory** empty (monorepo root). Do not point it at `apps/claims-portal`.
3. Framework preset: **Next.js**.
4. Confirm build settings (also defined in `vercel.json` at repo root):

   | Setting | Value |
   |---------|-------|
   | Install Command | `npm install` |
   | Build Command | `npx nx build @org/claims-portal` |
   | Output Directory | `apps/claims-portal/.next` |
   | Ignored Build Step | `npx nx-ignore @org/claims-portal` |

5. Enable **Include source files outside of the Root Directory** if Vercel prompts for monorepo support.

### API routes (hosted backend)

These deploy automatically with the app:

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/login` | Mock login (role cookie) |
| `GET /api/auth/session` | Current session |
| `GET /api/claims` | Paginated claims list |
| `GET/PUT/DELETE /api/claims/:id` | Claim CRUD |
| `GET /api/documents/:id` | Document metadata |
| `GET/POST /api/comments` | Comments |
| `POST /api/jobs/split`, `POST /api/jobs/merge` | Document jobs |
| `GET /api/jobs/:id` | Job progress |

The frontend uses relative `/api/...` URLs, so no `NEXT_PUBLIC_API_URL` is needed when UI and API share the same Vercel domain.

### CLI deploy (optional)

```bash
npx vercel login
npx vercel link          # select team + link to existing project
npx vercel --prod        # production deploy
```

### Notes

- Mock data is **in-memory** per serverless instance; edits may not persist across cold starts (acceptable for the case study).
- Auth uses an httpOnly cookie with `secure` in production.

## License

MIT
