# Large Document Strategy — Virtualization & Chunked Loading

## Overview

Phase 6. Handle 150 MB–1 GB documents without blowing client memory.

## Requirements

- **Page-level virtualization**: only render visible PDF pages (+ small overscan)
- **Lazy page load**: fetch page N on demand via range/chunk API mock
- **Skeleton pages**: placeholder for unloaded pages during scroll
- **Memory cleanup**: evict page render buffers when scrolled out of view (LRU cap, e.g. 5 pages)
- **Concurrent render limit**: max 2 pages rendering at once
- Smooth vertical scroll through 500+ page mock document
- Optional Web Worker for page decode offload under `libs/documents/src/workers/`

## Files to Create / Modify

- `libs/documents/src/lib/virtualized-pdf-viewer.tsx`
- `libs/documents/src/lib/page-cache.ts` — LRU page bitmap cache
- `libs/documents/src/lib/use-page-loader.ts`
- `libs/documents/src/workers/pdf-page.worker.ts` (optional)
- Extend `GET /api/documents/:id/pages/:page` mock handler

## Performance Targets

- Memory: bounded regardless of total page count
- Scroll: 60 fps target on desktop with mock 200+ page doc
- Never `fetch()` entire 1 GB file into client memory

## Trade-off (document in code comment or README)

- Chosen: page-range streaming + virtualization
- Rejected: full client download

## Testing

1. Open 200-page mock doc — memory stable in devtools heap snapshot after scroll
2. Fast scroll shows skeletons then resolves pages
3. Scroll back up — evicted pages reload without crash

## References

- @context/features/document-workspace-spec.md
- @context/features/comments-annotations-spec.md
