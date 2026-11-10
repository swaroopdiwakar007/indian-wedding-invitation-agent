# Architecture

```
brief.json  ->  direction (1 theme)  ->  HTML (single file)  ->  lint  ->  PNG
```

- The HTML is the source of truth. PNG is always rendered from it.
- The skill is instruction-first: `SKILL.md` holds the workflow and Floor; `references/` holds what the agent reads on demand.
- Scripts are small and dependency-free so they run in any agent harness.
- A build reads one theme only, to keep context small and designs distinct.
