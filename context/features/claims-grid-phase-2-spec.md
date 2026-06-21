# Claims Grid Phase 2 — Sort, Filter & Search

## Overview

Phase 3b. Add server-side sorting, filtering, and debounced search to the claims grid.

## Requirements

- **Sort**: clickable column headers → `sort` + `order` query params (claim number, status, date, amount)
- **Filters** (toolbar):
  - Claim number (text)
  - Status (select: open, pending, approved, denied)
  - Assignee (select from mock assignee list)
- **Search**: debounced 300 ms global search (`q` param) across claim number + assignee
- Reset filters button
- URL sync: filters reflected in search params for shareable state
- TanStack Query: keepPreviousData / placeholderData for smooth page transitions
- Empty state when no results

## Files to Create / Modify

- `libs/ui/data-grid/src/lib/claims-grid-toolbar.tsx`
- `libs/ui/data-grid/src/lib/claims-grid.tsx` — wire sort handlers
- `libs/claims/src/lib/queries/use-claims-query.ts` — extend params
- `apps/claims-portal/src/app/(app)/claims/page.tsx` — URL searchParams

## Performance

- Debounce search input 300 ms
- Do not refetch on every keystroke before debounce
- Memoize filter state → query key

## Testing

1. Sort by date desc — API called with correct params
2. Filter status=open — row count updates
3. Search debounces — max 1 request per 300 ms burst
4. Browser back restores filter state from URL

## References

- @context/features/claims-grid-phase-1-spec.md
- @context/features/claims-grid-phase-3-spec.md
