# Architecture Documentation

## Overview

Phase 12. Document architecture decisions, trade-offs, and how to run the project for case study review.

## Requirements

- **README** update at repo root (or `apps/claims-portal/README.md`):
  - Problem statement summary
  - How to run: `pnpm nx dev @org/claims-portal`
  - Demo users / roles for RBAC testing
- **Architecture diagram** (mermaid in docs):
  - Layers: Presentation → Business → Data → Infrastructure
  - Nx project dependency graph description
- **Trade-off matrix** (from project.mdc):
  - Pagination + virtualization vs infinite scroll
  - Streaming vs full download
  - RBAC backend vs frontend
  - TanStack Query vs Zustand boundaries
  - Optimistic vs pessimistic mutations
- **Performance strategy** section:
  - Grid: server ops + virtual rows
  - Documents: page virtualization + chunked load + workers
- **API assumptions** — list mock endpoints and future real backend swap

## Files to Create / Modify

- `README.md` — claims portal section
- `docs/architecture.md` — full write-up (new file OK for this spec)

## Deliverables Checklist

- [ ] Layer diagram
- [ ] Trade-off table
- [ ] Performance narrative
- [ ] Run instructions
- [ ] RBAC enforcement explanation

## References

- @.cursor/rules/project.mdc
- @context/features/claims-portal-master-spec.md
- @context/features/performance-pass-spec.md
