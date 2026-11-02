# Website languages

English keeps the original URLs. Spanish, French, Arabic, Vietnamese and Indonesian use
`/es`, `/fr`, `/ar`, `/vi` and `/id`. The ten translated routes are explicitly listed in
`lib/i18n/routing.ts`; unlisted translations return 404. There is no browser-language
redirect, language cookie, middleware, client-side text replacement or runtime
translation service.

## Rendering and content

- `app/(english)` preserves all existing public and utility URLs. The route group
  does not appear in URLs. APIs remain in `app/api`, and OAuth discovery remains
  in `app/.well-known`.
- `app/(localized)/[locale]` statically generates the fifty published translations.
  Both root layouts use `components/RootShell.tsx`, setting `html lang` and `dir`
  before hydration. Arabic uses RTL, with isolated Latin contact details.
- `components/pages` contains the shared page layouts and English source copy.
  `data/siteData.ts` remains the source of company facts and shared content.
- `lib/i18n/messages/{es,fr,ar,vi,id}.json` contains local translation dictionaries.
  English text is the key. Preserve interpolation tokens such as `{v0}` and pass
  the corresponding values to `t`. Translate complete sentences where possible.
- Dictionaries stay on the server. Only the form and header keys listed in
  `lib/i18n/client-keys.json` are passed to interactive components.
- Sanity articles remain English, including the homepage article cards, which
  carry `lang="en" dir="ltr"`. No translated blog URLs or hreflang are emitted.
- The navigation language menu uses real links and preserves the current core
  page. On an English-only page it links to the selected language’s homepage.
  Campaign query parameters survive switching; a section anchor is preserved only
  when switching to the same core page. Clicking outside or pressing Escape closes
  the menu.

## SEO

Each shared page exports localized metadata. Canonicals are self-referencing.
`languageAlternates` supplies the same reciprocal six-language plus `x-default`
set for page metadata and sitemap entries. `x-default` points to English.
Only published pages appear in the sitemap. Translated product collection and
FAQ schema uses the visible translated copy; organization identity stays shared.
Translated sitemap dates use the later of the source content date and the
locale's translation launch date. Indonesian uses `2026-11-02`; the previous
translations retain `2026-11-01`. Continue maintaining dates when content changes.

When adding a route, add it to the route allowlist and localized page registry,
provide all five translations and SEO copy, and update sitemap content dates.
Do not advertise translations until they exist. Maintain the source-key inventory
in `lib/i18n/source-keys.json` when editing copy. Add new interactive keys to the
client allowlist.
Include complete templates for dynamic image alt text and accessibility labels,
not English sentences joined to translated product names. Shared components take
display-ready title props; they translate their own default titles only.

Keep email addresses, brand names, model names and trade abbreviations such as
FOB as identifiers. Use `TranslatedText` for complete sentences containing links,
emphasis or code; its named placeholders allow translators to move those elements
without raw HTML or sentence fragments. Numeric placeholders represent actual
counts or measurements, so review the surrounding grammar with their values.
The existing English search index includes common product terms in all six
languages and accepts accented and Arabic input; blog results remain English.

Search also covers localized shipping, MOQ, payment, contact and other support
keywords. `/search?lang=es&q=...` retains the English search UI while sending
product, FAQ and contact result links to Spanish; the same applies to the other
supported languages. Query forms and suggested searches preserve `lang`. Blog
links remain English, and search pages remain `noindex`.

Unknown URLs use Next.js's native `global-not-found` entry, which supplies its own
document for the two root layouts. This requires the framework's currently
experimental `globalNotFound` flag. Only that 404 entry uses request-time rendering
to determine the original URL's language; the 50 published translations keep
their existing static generation and `dynamicParams = false` guards. The global
404 has correct server-rendered language, recovery links, HTTP 404 and `noindex`,
without tracking scripts. A small `status` copy allowlist supplies the shared
404/error views without exposing full dictionaries. The global 404 receives only
that allowlist in each supported language, while normal pages receive one locale.
Known inquiry validation/rate-limit messages are translated from the existing API
response; unknown non-English errors keep the generic fallback.

Language links receive the current query and same-page anchor after hydration,
on focus/pointer interaction, and when the hash changes, so copied/new-tab links
preserve them. Before JavaScript runs, the static HTML still provides the base
language URL; request-specific query strings cannot be embedded in cached static
HTML without changing the rendering strategy.

## Factory address

The owner-confirmed English factory address and Chinese navigation address in
`data/siteData.ts` identify the same facility on County Road 193 in Yuanzhou,
Boluo, Huizhou, Guangdong, China. Use those facts across the site, structured
data, company documents and knowledge base. The DiDi search address is the
owner-provided Baisha Elementary School navigation destination.

Factory and DiDi address display strings are translated through the existing
server dictionaries. Contact pages also retain copyable English and Chinese
navigation text with explicit language and text direction. Postal schema and
outreach email footers retain the canonical English address. Do not translate
IDs, coordinates, map IDs, email addresses or phone numbers, or present a
translated address as a different country or office.

## Inquiry and measurement boundaries

Only form labels and display messages are localized. Field names, product and
quantity option values, `/api/send`, submission IDs, `event_id` deduplication,
fbclid capture and measurement payloads keep their existing contracts. The
localized source pathname is sent through the existing sourcePath field.
No contact fields or country free text are added to GA4. No database, email
outbox, scheduled retry, CAPI hashing, authentication or unsubscribe behavior
is changed. Utility pages stay English and retain their existing noindex and
measurement exclusions.

Indonesian pages use `lang="id"`, Open Graph `id_ID`, localized metadata and
the shared structured-data builders. The website language inventory includes
Indonesian; sales contact `availableLanguage` stays limited to the team's confirmed
spoken languages. A translated website does not promise Indonesian-speaking sales staff.
Use `/id/contact-us` or another `/id` page as the destination for Indonesian creatives.
The existing GA4 property and Meta Pixel cover these paths. Report by `/id/` page
paths rather than creating a separate property, pixel or translated event names.
UTM labels and real fbclid survive language switching; GA4 event URLs still omit
query strings. The inquiry's product and quantity values remain in the original
backend vocabulary, and browser/server Meta Lead events share one event ID.

## Local checks

Use pnpm: `pnpm lint`, `pnpm test:unit`, `pnpm build` and
`pnpm exec playwright test tests/i18n.spec.ts` (plus existing regressions).
The Playwright inquiry tests intercept submission and analytics transports;
they never create live inquiries, send emails or record advertising conversions.
For production-server measurement tests, build with `VERCEL_ENV=production` and
test analytics IDs, then use `PLAYWRIGHT_BASE_URL` for that local server. These
environment overrides must not be committed to environment files.

Indonesian verification on 2026-11-02: all 269 unit tests passed; 36 multilingual
and 18 analytics browser checks passed across desktop and mobile Chromium.
The multilingual checks cover all 60 core URLs, Indonesian attribution and inquiry
success/failure, localized 404s and 320px layouts. TypeScript, ESLint for changed
files, and the standard Turbopack production build passed. Desktop homepage and
mobile form previews were checked with no browser runtime errors. The Windows
sandbox required running the production build/server and browser checks outside
the sandbox; no project build settings were changed. Production was not deployed.
Some existing Sanity blog image requests timed out through the local image
optimizer during browser checks; these checks do not establish CDN availability
or production GA4/Meta receipt. The Indonesian pages reuse the existing images.

Follow-up copy audit on 2026-11-02: corrected Indonesian weight/area separators,
town/city address wording, readable DiDi display text and resale terminology.
Added the shared area, wholesale badge and generic WhatsApp message keys to all
five dictionaries (1,056 keys each), connected the remaining prefilled WhatsApp
links, and added Indonesian about/factory and price search terms. The 21 existing
i18n/search unit tests, TypeScript and ESLint for changed source files passed.
Browser checks and production builds above predate these copy corrections and
were not rerun for this follow-up. Production remains undeployed.

### SEO/AEO and accessibility audit, 2026-11-02

Checked all 60 core URLs in English, Spanish, French, Arabic, Vietnamese and
Indonesian. The initial preview scan found low-contrast text and accessible names
that omitted visible button/menu labels. Corrected shared logo/footer/date text,
product notes and grade labels, sidebar headings, language and inquiry labels.
Strengthened input borders, placeholders and keyboard focus. Mobile scans also
found non-focusable horizontal specification tables; all four table layouts now
have localized region names, keyboard focus and visible outlines. Decorative FAQ
arrows are hidden from assistive technology.

Final local production build: all 60 pages return 200, have one H1, correct
document language/direction, self canonicals, reciprocal six-language alternates
and x-default, localized title/description/OG locale, valid JSON-LD, no duplicate
IDs or missing local anchors. Product CollectionPage URLs/languages match their
pages. FAQ schema and visible questions/answers use the same translated arrays.
Robots/sitemap and localized noindex 404 behavior are covered by existing checks.
No special AI-only schema or files were added: follow Google's
[AI features guidance](https://developers.google.com/search/docs/appearance/ai-features)
and [localized page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

Validation: axe-core 4.14.0 WCAG 2 A/AA, WCAG 2.1 A/AA and best-practice scans
reported zero violations on 60 desktop and 60 mobile (320px) page states. All
24 table keyboard-scroll/focus checks passed, including RTL. All 269 unit tests,
69 browser regressions (one desktop-only skip of the mobile-menu test), changed
source ESLint and the final TypeScript/production build passed. Browser regressions
preceded the final table-focus change; the 120-state scan and 24 keyboard checks
were run again after that change. Inquiry and analytics transports were intercepted.

Preview deployments now send `X-Robots-Tag: noindex` using VERCEL_ENV=preview;
production builds do not receive this blanket header. Canonicals continue to point
to production. Production release remains separate from preview updates.

Limits: automated scans are not WCAG certification or a guarantee of rankings,
indexing or AI citations. Axe leaves image-background contrast and some language
name checks for human review. The Google Maps iframe was replaced with a local
placeholder during scans, so its embedded UI was not audited. No full screen-reader
or native-speaker linguistic review, production field Core Web Vitals, Search
Console indexing inspection or live advertising-conversion verification was done.

After moving routes, stale `.next/dev/types` from an earlier dev session may
refer to the old filesystem paths. Stop that dev session and regenerate the
generated types before checking the build; no source files need changing.
