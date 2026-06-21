# Context

Files referenced by AI skills and the feature workflow. Root-level files load into AI context on startup (where configured).

| File | Purpose |
|------|---------|
| `project-overview.md` | Case study summary, tech stack, Nx layout |
| `coding-standards.md` | Conventions for TypeScript, Nx, React, data fetching |
| `ai-interaction.md` | Workflow and communication guidelines |
| `current-feature.md` | Active feature being worked on (`/feature` skill) |
| `features/` | Feature specs — start with `claims-portal-master-spec.md` |
| `research/` | Output from `/research` command (empty until used) |
| `fixes/` | Fix specs for bugs (empty until used) |

## Feature workflow

```text
/feature load foundation-phase-0-spec
/feature start
```

See `features/claims-portal-master-spec.md` for the full implementation order.
