# Auth Phase 1 — Mock Login & Protected Routes

## Overview

Phase 2a. Mock authentication for the case study — no real OAuth. Session carries user id and role for downstream RBAC.

## Requirements

- Mock login page at `/login` with role selector or preset users:
  - Claim Processor
  - Supervisor
  - Auditor
- Session storage: cookie or localStorage JWT mock (case study acceptable)
- Parse session to extract `userId`, `role`, `permissions[]`
- Protect app routes: unauthenticated → redirect to `/login`
- After login → redirect to claims dashboard
- Export session hooks from `@org/auth`:
  - `useSession()`
  - `useAuth()` with `signIn`, `signOut`

## Files to Create / Modify

- `libs/auth/src/lib/session.ts` — mock session parse/store
- `libs/auth/src/lib/auth-provider.tsx` — context provider
- `libs/auth/src/index.ts`
- `apps/claims-portal/src/app/login/page.tsx`
- `apps/claims-portal/src/middleware.ts` — route protection (or Next.js 16 proxy pattern)
- `apps/claims-portal/src/app/api/auth/login/route.ts` — optional mock login API

## Constraints

- No Prisma / NextAuth for case study unless explicitly extended later
- Session types live in `@org/shared` or `@org/auth`
- Middleware must be edge-compatible (no heavy deps)

## Testing

1. Visit `/` unauthenticated → redirects to `/login`
2. Login as Processor → lands on dashboard
3. Refresh preserves session

## References

- @context/features/layout-shell-spec.md
- @context/features/auth-rbac-spec.md
- @context/features/claims-portal-master-spec.md
