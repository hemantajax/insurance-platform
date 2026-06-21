# Performance Pass — Lazy Loading & Cache Tuning

## Overview

Phase 9. Cross-cutting performance optimizations after core features work.

## Requirements

### Route-level code splitting

- `dynamic()` imports for:
  - `/claims` dashboard grid
  - `/claims/[id]` workspace
  - Split / merge / assign dialogs

### Component-level

- Lazy load: PDF viewer, comments panel, annotation layer
- React `Suspense` boundaries with skeleton fallbacks

### TanStack Query tuning

- `staleTime` / `gcTime` for claims list vs document metadata
- Prefetch claim detail on grid row hover (verify wired)
- Mutation invalidation scoped (don't invalidate entire 50k list unnecessarily)

### React optimizations

- Memo column defs and cell renderers in grid
- Isolate Zustand selectors to prevent shell re-renders on grid updates
- Profile with React DevTools; add `memo()` only where measured benefit

### Bundle

- Run `pnpm nx build @org/claims-portal` — note chunk sizes
- Document largest chunks in architecture notes

## Files to Create / Modify

- Update imports in `apps/claims-portal/src/app/` routes to use `dynamic()`
- `libs/documents/src/index.ts` — export lazy entry if needed
- Optional: `docs/performance-notes.md` (or defer to architecture-docs-spec)

## Testing

1. Network tab shows separate chunks for viewer vs grid
2. Navigate grid → workspace — no full app JS re-download
3. Grid scroll remains smooth after optimizations

## References

- @context/features/split-merge-jobs-spec.md
- @context/features/architecture-docs-spec.md
- @.cursor/rules/project.mdc
