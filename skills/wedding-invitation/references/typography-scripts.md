# Typography by script

| Script | Display | Text | lang |
|---|---|---|---|
| Latin | Cormorant Garamond, Playfair Display | Lora, Source Serif 4 | en |
| Devanagari (Hindi, Marathi) | Tiro Devanagari Hindi | Noto Serif Devanagari | hi, mr |
| Gurmukhi (Punjabi) | Tiro Gurmukhi | Noto Serif Gurmukhi | pa |
| Bengali | Tiro Bangla | Noto Serif Bengali | bn |
| Tamil | Tiro Tamil | Noto Serif Tamil | ta |
| Telugu | Tiro Telugu | Noto Serif Telugu | te |
| Kannada | Tiro Kannada | Noto Serif Kannada | kn |
| Malayalam | Noto Serif Malayalam | Noto Serif Malayalam | ml |
| Gujarati | Noto Serif Gujarati | Noto Serif Gujarati | gu |
| Urdu (Nastaliq) | Noto Nastaliq Urdu | Noto Nastaliq Urdu | ur, dir=rtl |

Rules:
- Increase line-height to at least 1.6 for Indic scripts; never use negative letter-spacing or `text-transform: uppercase` on them.
- Do not fake bold or italics on Indic scripts. Pick a real weight or none.
- Always list a Noto fallback and `serif`.
- Verify one rendered line per script before export.
