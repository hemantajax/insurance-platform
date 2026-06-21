# Insurance Platform — Project Overview

ABC Insurance claims adjudication portal (Senior UI case study). Rebuild of a legacy document-heavy claims system with a modern React stack in an Nx monorepo.

## Problem

Insurance is data- and document-heavy. Claims arrive from email, SFTP, and structured/unstructured channels. Users must manage **20,000+ claim records** and work with **150 MB–1 GB documents** while respecting role-based access.

## Core Features

| Area | Capability |
|------|------------|
| Claims grid | 20k+ records, server sort/filter/pagination, row actions (Edit/Delete/Assign) |
| RBAC | Claim Processor, Supervisor, Auditor — backend enforces, frontend gates UX |
| Document workspace | PDF viewer, zoom, page nav, comments, annotations |
| Document ops | Split, merge, delete pages; long-running jobs with progress |
| Performance | Virtualized grid rows, virtualized PDF pages, chunked loading |

## Nx Workspace

```txt
apps/
├── claims-portal       @org/claims-portal
└── claims-portal-e2e   @org/claims-portal-e2e

libs/
├── design-system       @org/design-system
├── shared              @org/shared
├── auth                @org/auth
├── claims              @org/claims
├── documents           @org/documents
└── ui/
    ├── data-grid       @org/data-grid
    └── layout          @org/layout
```

## Tech Stack

- Nx 23 monorepo
- Next.js 16 (App Router), React 19, TypeScript strict
- Tailwind CSS v4, shadcn/ui, SCSS modules
- TanStack Query, TanStack Table, TanStack Virtual
- Zustand (UI state only)
- PDF.js / react-pdf
- Mock API via Next.js route handlers

## Roles

| Role | Access |
|------|--------|
| Claim Processor | View, edit, comment |
| Supervisor | + delete, assign, approve |
| Auditor | Read-only |

## Development

```bash
pnpm nx dev @org/claims-portal
pnpm nx affected -t lint test build
```

Feature workflow: load specs from `context/features/` via `/feature load <spec-name>`.

Master index: `context/features/claims-portal-master-spec.md`

Full implementation plan: `.cursor/rules/project.mdc`

## Status

- Workspace scaffolded (apps + libs)
- Feature specs defined for all phases
- Implementation in progress from Phase 0
