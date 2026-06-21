# PWA & Offline Support (Optional Stretch)

## Overview

Phase 10 — optional. Service worker caching for enterprise readiness demo.

## Requirements

- Workbox integration with Next.js build
- Cache static assets: JS, CSS, fonts
- Cache `GET /api/claims` first page for offline dashboard preview
- Offline fallback page when network unavailable
- Installable app manifest (`manifest.json`)
- Do not cache large document binaries

## Files to Create / Modify

- `apps/claims-portal/public/manifest.json`
- Service worker config (next-pwa or Workbox manual setup)
- `apps/claims-portal/src/app/offline/page.tsx`

## Constraints

- Offline mode is best-effort for case study — claims list stale data OK
- Document viewer requires network for page chunks

## Testing

1. DevTools offline → app shell loads
2. Cached claims page 1 visible offline
3. Document workspace shows offline message

## References

- @context/features/performance-pass-spec.md
- @context/features/architecture-docs-spec.md
