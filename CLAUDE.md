# CLAUDE.md

This repo is an agent skill that designs Indian wedding invitations. The skill lives in `skills/wedding-invitation/`. Start at its `SKILL.md`.

## Rules for working in this repo
- Never invent a couple's names, dates, venues, muhurat, or scripture, in code, tests or docs. Examples use obviously fictional data.
- Never reference, copy, trace or imitate a specific third-party template, brand or artist's design. Inspiration comes from traditions and art forms.
- Never commit real briefs or generated output. They are gitignored.
- Keep theme files under 8 KB. A build reads exactly one theme.
- Scripts use Node built-ins only, except `render-png.mjs` which needs `puppeteer-core`.
- Run `npm test` before finishing a change.

## Commands
`/invite`, `/audit`, `/export`, `/add-theme`. See `.claude/commands/`.
