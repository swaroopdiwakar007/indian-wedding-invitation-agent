# Setup

## 1. Requirements
- Node 18 or later
- Claude Code, Codex, Cursor or OpenCode
- For PNG: `npm i -g puppeteer-core` and Chrome or Chromium (set `CHROME_PATH` if it is not in a standard place)

## 2. Install the skill
```
node skills/wedding-invitation/scripts/install.mjs
```
This copies the skill to `~/.claude/skills/wedding-invitation` and `~/.agents/skills/wedding-invitation`.

As a Claude Code plugin from GitHub:
```
/plugin marketplace add <you>/indian-wedding-invitation-agent
/plugin install wedding-invitation@wedding-invitation
```

## 3. Make your first invitation
```
/invite
```
The agent asks once for tradition, names, events, languages and size. Briefs are saved in `briefs/` and stay local.

## 4. Check and export
```
node skills/wedding-invitation/scripts/lint-invite.mjs output/<slug>/invite.html
node skills/wedding-invitation/scripts/render-png.mjs output/<slug>/invite.html --size story
```

## Fonts
The HTML loads Google Fonts on first open. For an offline card, download the font files and embed them as base64 `@font-face`, keeping the file under 400 KB if possible.

## Troubleshooting
- `puppeteer-core is not installed`: run `npm i -g puppeteer-core`.
- `Chrome not found`: set `CHROME_PATH`.
- Broken Indic glyphs in PNG: the font did not load in time; re-run, or embed the font.
