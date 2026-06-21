# AI Interaction Guidelines

## Communication

- Be concise and direct
- Explain non-obvious decisions briefly
- Ask before large refactors or architectural changes
- Don't add features not in the current feature spec or `project.mdc`
- Never delete files without clarification

## Workflow

Use the `/feature` skill for each case-study phase:

1. **Load** — `/feature load <spec-name>` (e.g. `foundation-phase-0-spec`)
2. **Start** — `/feature start` (creates branch, sets status In Progress)
3. **Implement** — goals in `context/current-feature.md`
4. **Test** — `pnpm nx affected -t lint test build`; verify in browser
5. **Review** — `/feature review`
6. **Complete** — `/feature complete` (only when asked)

Do NOT commit without permission. Fix build failures before committing.

## Branching

- Branch per feature: `feature/<name>` derived from spec
- Delete branch after merge when prompted

## Commits

- Ask before committing
- Conventional commits: `feat:`, `fix:`, `chore:`, etc.
- One focused change per commit

## When Stuck

- Stop after 2–3 failed attempts and explain the blocker
- Ask if requirements are unclear

## Code Changes

- Minimal diff for the task
- Match existing Nx lib patterns and `@org/*` imports
- No scope creep beyond current feature goals

## Code Review Focus

- Security: RBAC on API + UI
- Performance: grid virtualization, document memory bounds
- Logic: pagination, job state, partial failures
- Patterns: correct lib boundaries per `project.mdc`
