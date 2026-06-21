# Coding Standards

## TypeScript

- Strict mode enabled (`tsconfig.base.json`)
- No `any` — use proper typing or `unknown`
- Shared types in `@org/shared`; domain types in `@org/claims`, `@org/documents`, `@org/auth`
- Use type inference where obvious, explicit types for public APIs

## Nx Monorepo

- Run tasks via Nx: `pnpm nx dev @org/claims-portal`, `pnpm nx test @org/claims`, etc.
- Respect dependency boundaries (see `.cursor/rules/project.mdc`)
- Apps compose; domain logic lives in `libs/`
- Link workspace packages via package manager — do not patch with tsconfig paths alone

## File Organization

| Concern | Location |
|---------|----------|
| Pages / routes | `apps/claims-portal/src/app/` |
| API handlers | `apps/claims-portal/src/app/api/` |
| Grid UI | `libs/ui/data-grid/src/` |
| Shell layout | `libs/ui/layout/src/` |
| Claims domain | `libs/claims/src/` |
| Documents / viewer | `libs/documents/src/` |
| Auth / RBAC | `libs/auth/src/` |
| Shared utils/types | `libs/shared/src/` |
| Design tokens / UI | `libs/design-system/src/` |

## React

- Functional components only
- Server components by default in Next.js app
- `'use client'` only for interactivity, hooks, browser APIs (grid, viewer, dialogs)
- One job per component; extract logic into custom hooks
- Memoize grid column defs and cell renderers; avoid unnecessary re-renders

## Next.js

- App Router in `apps/claims-portal`
- API route handlers for mock backend (pagination, jobs, RBAC checks)
- `dynamic()` for heavy client bundles (PDF viewer, grid, dialogs)
- Middleware for route protection (mock auth)

## Data Fetching

- **Server state**: TanStack Query in client islands (`useClaimsQuery`, etc.)
- **UI state**: Zustand (theme, sidebar, selected claim, panel toggles)
- Never fetch all 20k+ claims — server-side pagination only
- Validate API inputs; return proper HTTP status codes (403 for RBAC violations)

## Styling

- Tailwind CSS v4 — configure via `@theme` in CSS, not `tailwind.config.js`
- shadcn/ui primitives from `@org/design-system`
- SCSS modules where colocated (existing lib pattern)
- Light and dark theme support

## Authorization

- API is source of truth for permissions
- `@org/auth`: `usePermission()`, `<Can permission="...">` for UX
- Never rely on hidden UI alone for security

## Error Handling

- Error boundaries around grid, viewer, and job tracker
- User-friendly toasts for mutation failures
- Retry/cancel for long-running document jobs

## Code Quality

- No commented-out code unless specified
- No unused imports or variables
- Keep functions focused; extract when logic grows
- Tests for RBAC matrix, pagination helpers, job state — via `pnpm nx test <project>`
