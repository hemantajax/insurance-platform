# Split / Merge Jobs & Progress Tracking

## Overview

Phase 8. Long-running document operations with job polling, cancel, and retry.

## Requirements

### Split

- Dialog: select page ranges (e.g. `1-10`, `11-20`) from current document
- Submit → `POST /api/jobs/split` → returns `jobId`
- Validate ranges (no overlap, within page count)

### Merge

- Dialog: select multiple document ids (from claim or mock picker)
- Submit → `POST /api/jobs/merge` → returns `jobId`

### Job Tracking

- Poll `GET /api/jobs/:id` every 1–2 s while status `running`
- Progress UI: 0% → 25% → 50% → 75% → 100%
- States: `queued`, `running`, `completed`, `failed`, `cancelled`
- Cancel button → mock cancel endpoint or client abort
- Retry on `failed` with same payload
- On complete: refresh document metadata / invalidate queries
- Toast notifications for success/failure

## Files to Create / Modify

- `libs/documents/src/lib/split-dialog.tsx`
- `libs/documents/src/lib/merge-dialog.tsx`
- `libs/documents/src/lib/job-progress.tsx`
- `libs/documents/src/lib/use-job-polling.ts`
- `apps/claims-portal/src/app/api/jobs/` — ensure progress simulation

## Constraints

- Pessimistic UX — do not mark complete until API confirms
- Consistent document state after job (invalidate document + claims caches)
- Handle partial failure message in UI

## Testing

1. Split job shows progress bar advancing
2. Failed job shows error + retry works
3. Cancel stops polling and resets UI
4. Completed job refreshes viewer metadata

## References

- @context/features/comments-annotations-spec.md
- @context/features/performance-pass-spec.md
