# Foundation Phase 0 — Design System & Tokens

## Overview

Phase 0 of the claims portal. Establish design tokens, shadcn/ui base components, and light/dark theme before any feature screens.

## Requirements

- Add design tokens under `libs/design-system/src/tokens/`:
  - Colors (semantic: primary, secondary, muted, destructive, success, warning)
  - Typography (font families, sizes, weights, line heights)
  - Spacing scale
  - Border radius
  - Shadows
- Initialize shadcn/ui in `@org/design-system` (Button, Input, Dialog, Dropdown, Skeleton, Toast)
- Theme support: light and dark via CSS variables / `@theme` in global styles
- Export reusable primitives from `libs/design-system/src/index.ts`
- Ensure `apps/claims-portal` imports design-system styles in root layout

## Files to Create / Modify

- `libs/design-system/src/tokens/` — token files
- `libs/design-system/src/components/` — shadcn wrappers
- `libs/design-system/src/index.ts` — public exports
- `apps/claims-portal/src/app/global.css` — Tailwind v4 `@theme` + token wiring
- `apps/claims-portal/src/app/layout.tsx` — import global styles

## Constraints

- Tailwind CSS v4: configure via CSS `@theme`, not `tailwind.config.js`
- No domain logic in design-system; UI primitives only
- Strict TypeScript; no `any`

## Testing

1. `pnpm nx build @org/design-system` passes
2. `pnpm nx dev @org/claims-portal` — verify theme toggle (if added) and base Button renders

## References

- @.cursor/rules/project.mdc
- @context/features/layout-shell-spec.md
- @context/features/claims-portal-master-spec.md
