# Grid → Workspace Transition

## Overview

Phase 5b. Smooth, performant transition from claims grid row selection to document workspace (150 MB–1 GB docs).

## Requirements

- On row select / navigate:
  - Immediate route change with shared layout (no full page flash)
  - Progress indicator while document metadata + first page load
  - Cancel button aborts in-flight fetch (`AbortController`)
- Prefetch on row hover (from grid phase 3) — workspace opens faster when prefetched
- Loading states:
  - Skeleton toolbar + skeleton page placeholder
  - Progress bar for initial document chunk (mock % based on pages loaded)
- Error state with retry button
- Preserve scroll position on grid when navigating back (optional: TanStack Query cache)

## Files to Create / Modify

- `libs/documents/src/lib/document-loading-state.tsx`
- `libs/documents/src/lib/use-document-loader.ts` — abort, progress
- `apps/claims-portal/src/app/(app)/claims/[claimId]/loading.tsx` — Next.js loading UI
- Update grid row navigation in `@org/data-grid`

## UX

- Perceived performance: show shell immediately, stream viewer content
- Toast on recoverable errors

## Testing

1. Slow network (dev tools throttle) — progress UI visible
2. Cancel during load — no memory leak / stale state update
3. Prefetched claim opens workspace with shorter loading phase

## References

- @context/features/document-workspace-spec.md
- @context/features/large-document-spec.md
