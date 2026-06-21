# Current Feature: Foundation Phase 0 — Design System & Tokens

## Status

In Progress

## Goals

- [x] Add design tokens under `libs/design-system/src/tokens/` (colors, typography, spacing, radius, shadows)
- [x] Initialize shadcn/ui in `@org/design-system` (Button, Input, Dialog, Dropdown, Skeleton, Toast)
- [x] Theme support: light and dark via CSS variables / `@theme` in global styles
- [x] Export reusable primitives from `libs/design-system/src/index.ts`
- [x] Wire Tailwind CSS v4 in claims-portal and import design-system styles in root layout
- [x] Demo page renders Button and theme toggle; `pnpm nx build @org/design-system` passes

## Notes

- Tailwind v4 via `@tailwindcss/postcss` + `@theme inline` in design-system globals
- shadcn components in `libs/design-system/src/components/ui/`
- `components.json` at repo root for future shadcn CLI adds
- Client providers wrapped in `apps/claims-portal/src/app/providers.tsx`
- Spec: `context/features/foundation-phase-0-spec.md`

## History

<!-- Completed features — earliest to latest -->
