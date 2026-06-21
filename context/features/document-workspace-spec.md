# Document Workspace — PDF Viewer & Toolbar

## Overview

Phase 5. Document workspace for a selected claim: toolbar, PDF viewer, metadata panel.

## Requirements

- Route: `/claims/[claimId]` or `/claims/[claimId]/documents/[docId]`
- Layout (inside `@org/documents` + app page):

```txt
Toolbar (zoom, rotate, page nav, back to grid)
Document Viewer (PDF canvas)
Side panel slot (comments — wired in later spec)
```

- **Viewer** (PDF.js / react-pdf):
  - Page navigation (prev/next, jump to page input)
  - Zoom in/out/fit-width
  - Rotate 90°
- **Metadata bar**: page count, file size, last modified (from `GET /api/documents/:id`)
- **Toolbar**: back to claims grid breadcrumb
- Error boundary around viewer
- `'use client'` viewer component; lazy loaded via `dynamic()`

## Files to Create / Modify

- `libs/documents/src/lib/document-viewer.tsx`
- `libs/documents/src/lib/document-toolbar.tsx`
- `libs/documents/src/lib/use-document-query.ts`
- `libs/documents/src/index.ts`
- `apps/claims-portal/src/app/(app)/claims/[claimId]/page.tsx`

## Performance

- Do not load full PDF binary on mount — fetch metadata first
- Lazy import PDF viewer library (separate chunk)

## Testing

1. Open claim from grid → workspace renders with metadata
2. Page nav changes visible page
3. Zoom/rotate apply without full reload
4. Back link returns to `/claims`

## References

- @context/features/claims-grid-phase-3-spec.md
- @context/features/grid-to-workspace-spec.md
- @context/features/large-document-spec.md
