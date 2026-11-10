# AGENTS.md

Instructions for Codex, Cursor, OpenCode and other agents.

The skill is `skills/wedding-invitation/SKILL.md`. Follow its workflow and hard floor. Scripts are in `skills/wedding-invitation/scripts/` and run with plain Node 18+.

- Validate a brief: `node skills/wedding-invitation/scripts/validate-brief.mjs briefs/<slug>.json`
- Lint an invitation: `node skills/wedding-invitation/scripts/lint-invite.mjs output/<slug>/invite.html`
- Render PNG: `node skills/wedding-invitation/scripts/render-png.mjs output/<slug>/invite.html --size story`

Do not invent facts. Do not copy third-party designs. Do not commit briefs or output.
