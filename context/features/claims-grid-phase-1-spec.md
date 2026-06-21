# Claims Grid Phase 1 — Server-Paginated Grid Scaffold

## Overview

Phase 3a. First slice of the 20k+ claims dashboard: TanStack Table + Virtual with server-side pagination only.

## Requirements

- Claims dashboard page at `/claims` inside app shell
- `@org/data-grid` component:
  - TanStack Table column definitions (claim number, status, assignee, date, amount)
  - TanStack Virtual for row virtualization within current page
  - Server pagination controls (page size 50 default, prev/next, page indicator)
- `@org/claims` hooks:
  - `useClaimsQuery({ page, pageSize })` via TanStack Query
- Wire to `GET /api/claims`
- Loading skeleton and error state
- Stable row keys (`claim.id`); memoized columns

## Files to Create / Modify

- `libs/ui/data-grid/src/lib/claims-grid.tsx`
- `libs/ui/data-grid/src/lib/use-claims-table.ts`
- `libs/ui/data-grid/src/index.ts`
- `libs/claims/src/lib/queries/use-claims-query.ts`
- `libs/claims/src/index.ts`
- `apps/claims-portal/src/app/(app)/claims/page.tsx`

## Performance

- Never fetch all records — only current page
- Default page size 50; virtualize rows within page
- `'use client'` only on grid island; page can be server wrapper

## Testing

1. Grid renders 50 rows; total count shows 50k+
2. Page next/prev fetches new data
3. Scroll within page is smooth (virtual rows)

## References

- @context/features/mock-api-spec.md
- @context/features/claims-grid-phase-2-spec.md
- @context/features/claims-portal-master-spec.md
