# Current Feature: Claims Grid — Phases 1–3

## Status

In Progress

## Goals

- [x] Auth mock login + protected routes (portal lib + shared session)
- [x] RBAC permissions + usePermission + Can
- [x] Mock API with 50k claims, RBAC, jobs, comments
- [x] Server-paginated virtualized claims grid
- [x] Sort, filter, debounced search, URL sync
- [x] Permission-gated row actions (edit, delete, assign)
- [ ] Document workspace (next feature)

## Notes

- `@org/auth` / `@org/claims` libs root-owned — auth/claims hooks live in `apps/claims-portal/src/lib/` until permissions fixed
- Session + permissions core in `@org/shared/lib/auth`
- Specs: auth-mock-login, auth-rbac, mock-api, claims-grid phases 1–3

## History

- Foundation Phase 0 — Design System & Tokens
- Application Shell — Layout & Global UI
