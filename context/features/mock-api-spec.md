# Mock Backend — Next.js Route Handlers

## Overview

Phase 4. Simulate enterprise APIs with in-memory fake DB, pagination, delays, and permission checks. Implement **before** claims grid so the grid has real endpoints.

## Requirements

### Endpoints

```http
GET    /api/claims              ?page=&pageSize=&sort=&order=&status=&assignee=&q=
GET    /api/claims/:id
PUT    /api/claims/:id
DELETE /api/claims/:id
GET    /api/documents/:id       # metadata + pageCount, sizeBytes, rangeUrl template
GET    /api/documents/:id/pages/:page  # optional page chunk mock
POST   /api/comments
GET    /api/comments?documentId=&page=
POST   /api/jobs/split
POST   /api/jobs/merge
GET    /api/jobs/:id
```

### Fake DB

- Seed **50,000** mock claims (generate at startup or lazy)
- Each claim links to a mock document id
- In-memory store; optional JSON seed file in `apps/claims-portal/src/lib/mock-db/`

### Behavior

- Server-side pagination, sort, filter on claims list
- Artificial delay (200–800 ms configurable) on list/detail
- Error simulation query param: `?simulateError=500` for testing
- **RBAC on API**: filter claims by role; reject unauthorized PUT/DELETE with 403
- Job endpoints: return job id; progress 0→100 via polling

## Files to Create / Modify

- `apps/claims-portal/src/app/api/claims/route.ts`
- `apps/claims-portal/src/app/api/claims/[id]/route.ts`
- `apps/claims-portal/src/app/api/documents/[id]/route.ts`
- `apps/claims-portal/src/app/api/comments/route.ts`
- `apps/claims-portal/src/app/api/jobs/split/route.ts`
- `apps/claims-portal/src/app/api/jobs/merge/route.ts`
- `apps/claims-portal/src/app/api/jobs/[id]/route.ts`
- `libs/shared/src/lib/types/` — Claim, Document, Comment, Job types
- `libs/shared/src/lib/api-client.ts` — typed fetch helpers

## Constraints

- Types shared via `@org/shared`; handlers stay in app
- Validate request bodies; return proper HTTP status codes
- No full document binary in memory — mock page URLs only

## Testing

1. `GET /api/claims?page=1&pageSize=50` returns 50 items + total count ≥ 20000
2. Auditor DELETE → 403
3. Job poll returns increasing progress

## References

- @context/features/auth-rbac-spec.md
- @context/features/claims-grid-phase-1-spec.md
- @.cursor/rules/project.mdc
