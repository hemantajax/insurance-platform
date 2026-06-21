# Responsive UX — Desktop, Tablet, Mobile

## Overview

Phase 11. Responsive layouts for claims grid and document workspace.

## Requirements

### Desktop (≥ 1024px)

- Full shell: sidebar + grid + workspace with comments panel

### Tablet (768px–1023px)

- Collapsible sidebar (overlay drawer)
- Workspace: comments panel collapses to bottom sheet or toggle
- Grid remains primary view

### Mobile (< 768px)

- Dashboard / claims grid only (simplified columns: claim #, status, assignee)
- Hide column visibility and bulk actions
- Document workspace: read-only viewer (no split/merge dialogs)
- Sidebar → hamburger drawer
- Touch-friendly tap targets (min 44px)

## Files to Create / Modify

- `libs/ui/layout/src/lib/` — responsive sidebar / mobile nav
- `libs/ui/data-grid/src/lib/claims-grid.tsx` — responsive column sets
- `libs/documents/src/lib/document-workspace-layout.tsx`
- Tailwind/CSS breakpoints in layout SCSS modules

## Testing

1. Resize browser — layout adapts without horizontal scroll on grid
2. Mobile: row tap opens read-only workspace
3. Tablet: comments panel toggles without breaking viewer

## References

- @context/features/layout-shell-spec.md
- @context/features/document-workspace-spec.md
