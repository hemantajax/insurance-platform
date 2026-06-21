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

## License

MIT
