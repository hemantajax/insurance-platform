# Comments & Annotations

## Overview

Phase 7. Page-level comments and mock annotation layer on the document workspace.

## Requirements

### Page Comments

- Comments panel (collapsible) in workspace side panel
- List comments filtered by current page number
- Add comment on current page (Processor, Supervisor)
- Edit / delete own comments; Supervisor can delete any
- `POST /api/comments`, `GET /api/comments?documentId=&page=`
- Optimistic UI for add comment; rollback on failure
- Auditor: read-only (no add/edit/delete)

### Annotations (mock)

- Overlay layer on PDF page canvas
- Tools: highlight, rectangle, sticky note (UI only — persist to local state or mock API)
- Toggle annotation mode from toolbar
- Annotations scoped to page number

## Files to Create / Modify

- `libs/documents/src/lib/comments-panel.tsx`
- `libs/documents/src/lib/use-comments-query.ts`
- `libs/documents/src/lib/use-comment-mutations.ts`
- `libs/documents/src/lib/annotation-layer.tsx`
- `libs/documents/src/lib/annotation-toolbar.tsx`
- Update workspace page layout for side panel

## Constraints

- Comments tied to `documentId` + `pageNumber` + `userId`
- Permission checks via `<Can>` and API validation

## Testing

1. Add comment on page 3 — appears in list; survives page nav away and back
2. Auditor cannot add comments
3. Annotation rectangle draws on current page (mock persist OK)

## References

- @context/features/large-document-spec.md
- @context/features/split-merge-jobs-spec.md
