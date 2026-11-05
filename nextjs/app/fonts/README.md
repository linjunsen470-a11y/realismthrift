# Bundled fonts

`RootShell.tsx` uses `next/font/local` so builds do not depend on Google Fonts
responses. This avoids the extensionless URL parsing failure described in
[Next.js #99114](https://github.com/vercel/next.js/issues/99114), observed in
GitHub Actions run `42080612513` on 2026-11-06 (Singapore time).

Both normal-style variable fonts come from Google Fonts revision
[`24ddc1f324cac5d9f5aedca126d298f56e3f1640`](https://github.com/google/fonts/tree/24ddc1f324cac5d9f5aedca126d298f56e3f1640):

- `ofl/montserrat/Montserrat[wght].ttf`: weight range 700–900.
- `ofl/opensans/OpenSans[wdth,wght].ttf`: weight range 400–700, normal width 100.

The checked-in WOFF2 files retain the source character maps, including Latin
accents and Vietnamese. The original SIL OFL licenses are included alongside
them. Arabic continues to use the existing system-font fallback.

These are static assets, not a new build step or application dependency. For a
deliberate font update, download the two source files and licenses from a pinned
revision. Use FontTools `instantiateVariableFont` with `wght=(700,700,900)` for
Montserrat, and `wght=(400,400,700), wdth=100` for Open Sans; save with
`font.flavor = "woff2"`. Verify character maps, build, and browser rendering
before replacing these files. Retain the CSS variable names and `display: swap`.
