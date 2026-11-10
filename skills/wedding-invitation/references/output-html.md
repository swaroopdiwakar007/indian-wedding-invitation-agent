# HTML output

- Start from `templates/invite-base.html`. Keep it one file, under 400 KB.
- CSS variables on `:root` for ground, ink, accent, support. Dark values under `prefers-color-scheme: dark` only if the design survives it; otherwise set `color-scheme: light` explicitly.
- Layout: single column, max-width 480px centered, fluid down to 320px. Sections stack: invocation, names, date, events, venue, RSVP.
- Fonts: Google Fonts link with `display=swap` and a real fallback stack. Map scripts to fonts in `references/typography-scripts.md`.
- Ornaments: inline SVG, one motif family. No raster images except a supplied couple photo as a data URI under 150 KB.
- Motion: at most a gentle fade-in on load; wrap in `@media (prefers-reduced-motion: no-preference)`.
- Add `<meta name="viewport">`, `<html lang>`, and `lang` on every block in another language.
- Add the decision comment at the top of the first `<style>`.
- Add a "Add to calendar" link only when date, time and venue are all supplied (a data: URI .ics).
