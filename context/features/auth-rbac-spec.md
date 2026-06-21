# Auth Phase 2 — RBAC & Permission Components

## Overview

Phase 2b. Role-based access control. Backend is source of truth; frontend hides/disables unauthorized UI.

## Roles & Permissions

| Role | Permissions |
|------|-------------|
| Claim Processor | `claim.view`, `claim.edit`, `comment.create`, `comment.edit` |
| Supervisor | Processor + `claim.delete`, `claim.assign`, `claim.approve` |
| Auditor | `claim.view` only |

## Requirements

- Permission map in `@org/auth` derived from role
- `usePermission(permission: string): boolean`
- `<Can permission="claim.edit">` — renders children or fallback
- `<Can permission="claim.delete" fallback={<DisabledButton />}>` — disable pattern
- Apply to layout user menu and grid action placeholders
- Document: API must re-check permissions (see mock-api-spec)

## Files to Create / Modify

- `libs/auth/src/lib/permissions.ts` — role → permission map
- `libs/auth/src/lib/use-permission.ts`
- `libs/auth/src/lib/can.tsx`
- `libs/auth/src/index.ts` — export all
- Unit tests for permission matrix

## Constraints

- Never use UI-only hiding as security — pair with API enforcement
- Permissions as string constants in `@org/shared` for shared typing

## Testing

1. Login as Auditor — Edit/Delete/Assign actions hidden or disabled
2. Login as Supervisor — all row actions visible
3. `pnpm nx test @org/auth` — permission hook tests pass

## References

- @context/features/auth-mock-login-spec.md
- @context/features/mock-api-spec.md
- @context/features/claims-grid-phase-3-spec.md
