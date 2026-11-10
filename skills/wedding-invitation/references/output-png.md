# PNG output

Render the finished HTML, never a separate design.

```
node skills/wedding-invitation/scripts/render-png.mjs output/<slug>/invite.html --size story
```

Sizes: `story` 1080x1920, `square` 1080x1080, `portrait` 1080x1350, `a5` 1240x1748 (print at 150 dpi). Device scale factor 2.

Needs `puppeteer-core` and Chrome (`CHROME_PATH` or a standard install). Without them, tell the person and give the HTML.

Check the PNG: names fully visible, no cut ornaments, text sharp, file under 5 MB for WhatsApp.
