# Claims Portal — Master Feature Index

## Overview

Master index for the ABC Insurance Senior UI case study. Load individual phase specs with the `/feature` skill (e.g. `/feature load foundation-phase-0-spec`).

Implementation order follows `.cursor/rules/project.mdc`. Priorities: **architecture**, **performance**, **code quality**.

## Nx Projects

| Package | Path | Responsibility |
|---------|------|----------------|
| `@org/claims-portal` | `apps/claims-portal` | Routes, API handlers, page composition |
| `@org/claims-portal-e2e` | `apps/claims-portal-e2e` | Playwright e2e |
| `@org/design-system` | `libs/design-system` | Tokens, shadcn/ui, theme |
| `@org/shared` | `libs/shared` | Types, utils, API client |
| `@org/auth` | `libs/auth` | Session, RBAC, `usePermission`, `<Can>` |
| `@org/claims` | `libs/claims` | Domain hooks, claim types |
| `@org/documents` | `libs/documents` | Viewer, comments, annotations, jobs |
| `@org/data-grid` | `libs/ui/data-grid` | TanStack Table + Virtual grid |
| `@org/layout` | `libs/ui/layout` | Header, sidebar, breadcrumb, shell |

## Feature Specs (implement in order)

| # | Spec file | Phase | Summary |
|---|-----------|-------|---------|
| 0 | `foundation-phase-0-spec.md` | 0 | Design tokens, shadcn/ui, theme |
| 1 | `layout-shell-spec.md` | 1 | App shell, error boundary, Zustand UI state |
| 2 | `auth-mock-login-spec.md` | 2a | Mock login, protected routes |
| 3 | `auth-rbac-spec.md` | 2b | Roles, `usePermission`, `<Can>` |
| 4 | `mock-api-spec.md` | 4 | Next route handlers, fake DB (do before grid) |
| 5 | `claims-grid-phase-1-spec.md` | 3a | Server-paginated grid scaffold |
| 6 | `claims-grid-phase-2-spec.md` | 3b | Sort, filter, debounced search |
| 7 | `claims-grid-phase-3-spec.md` | 3c | Row actions, bulk select, column visibility |
| 8 | `document-workspace-spec.md` | 5 | PDF viewer, toolbar, metadata |
| 9 | `grid-to-workspace-spec.md` | 5b | Row → workspace transition, progress |
| 10 | `large-document-spec.md` | 6 | Page virtualization, chunked loading |
| 11 | `comments-annotations-spec.md` | 7 | Page comments, annotation overlay |
| 12 | `split-merge-jobs-spec.md` | 8 | Split/merge dialogs, job polling |
| 13 | `performance-pass-spec.md` | 9 | Lazy routes, bundle tuning |
| 14 | `responsive-ux-spec.md` | 11 | Desktop / tablet / mobile layouts |
| 15 | `architecture-docs-spec.md` | 12 | README, trade-off matrix, diagrams |

## Optional (stretch)

| Spec file | Phase | Summary |
|-----------|-------|---------|
| `pwa-offline-spec.md` | 10 | Workbox, offline fallback |

## References

- @.cursor/rules/project.mdc
- @context/coding-standards.md
