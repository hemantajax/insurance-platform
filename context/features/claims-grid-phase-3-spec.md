# Claims Grid Phase 3 — Row Actions & Bulk Operations

## Overview

Phase 3c. Permission-gated row actions, bulk selection, and column visibility.

## Requirements

- **Row actions** (actions column):
  - Edit → opens edit dialog or navigates to detail
  - Delete → confirm dialog → `DELETE /api/claims/:id`
  - Assign → assign dialog → `PUT /api/claims/:id` with assignee
- Wrap actions in `<Can permission="...">` from `@org/auth`
- **Bulk selection**: checkbox column; select page / select all on page
- Bulk assign (Supervisor only) — optional stretch
- **Column visibility**: dropdown to show/hide columns; persist in localStorage
- Row click (not action button) → navigate to document workspace `/claims/[id]`
- Prefetch claim + document metadata on row hover (`prefetchQuery`)

## Files to Create / Modify

- `libs/ui/data-grid/src/lib/claims-grid-actions.tsx`
- `libs/ui/data-grid/src/lib/claims-grid-columns.tsx`
- `libs/ui/data-grid/src/lib/column-visibility.tsx`
- `libs/claims/src/lib/mutations/` — useDeleteClaim, useUpdateClaim, useAssignClaim
- Dialog components in `@org/claims` or `@org/design-system`

## Constraints

- Pessimistic updates for delete (wait for API success)
- Invalidate claims query cache after mutations
- Auditor: no action column or all disabled

## Testing

1. Supervisor sees Edit, Delete, Assign
2. Auditor sees grid without destructive actions
3. Delete removes row after confirm + API success
4. Row click navigates to `/claims/[id]`

## References

- @context/features/auth-rbac-spec.md
- @context/features/claims-grid-phase-2-spec.md
- @context/features/grid-to-workspace-spec.md
