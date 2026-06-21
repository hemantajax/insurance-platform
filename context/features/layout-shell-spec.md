# Application Shell — Layout & Global UI

## Overview

Phase 1. Build the responsive app shell in `@org/layout` with global UX primitives. Claims portal pages compose inside this shell.

## Requirements

- **Layout components** in `libs/ui/layout`:
  - Header (logo, nav, user profile area)
  - Collapsible sidebar (nav links: Dashboard, placeholder routes)
  - Breadcrumb
  - Main content area with consistent padding
- **Global components** (design-system or layout):
  - Page loader / skeleton
  - Error boundary wrapper
  - Empty state component
  - Permission wrapper shell (accepts children; RBAC wired in auth spec)
- **Zustand store** in `@org/shared` or `@org/layout`:
  - `theme` (if not CSS-only)
  - `sidebarOpen`
  - `selectedClaimId`
  - Workspace panel state (comments open, annotation mode)
- Wire shell into `apps/claims-portal/src/app/layout.tsx`
- Dashboard route placeholder at `/` or `/claims` inside shell

## Files to Create / Modify

- `libs/ui/layout/src/lib/` — Header, Sidebar, Breadcrumb, AppShell
- `libs/ui/layout/src/index.ts`
- `libs/shared/src/lib/store/` — Zustand store (or colocated in layout if preferred)
- `apps/claims-portal/src/app/layout.tsx`
- `apps/claims-portal/src/app/(app)/layout.tsx` — optional route group for authenticated shell

## Constraints

- Layout lib may import `@org/design-system`, `@org/shared`, `@org/auth` (for profile slot only)
- Keep `page.tsx` thin — compose `<AppShell>` only
- Responsive: sidebar collapses on tablet breakpoint

## Testing

1. `pnpm nx test @org/layout`
2. Dev server shows header + sidebar + main area on `/`
3. Sidebar toggle persists during navigation

## References

- @context/features/foundation-phase-0-spec.md
- @context/features/auth-mock-login-spec.md
- @context/features/claims-portal-master-spec.md
