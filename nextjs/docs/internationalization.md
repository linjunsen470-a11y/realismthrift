# Website languages

## Routes and rendering

English keeps its original URLs. Spanish, French, Arabic, Vietnamese and Indonesian
use `/es`, `/fr`, `/ar`, `/vi` and `/id`. Ten core pages per language produce 60
core URLs. Blog articles, search and operator/email-preference pages remain English.

- `lib/i18n/routing.ts`: supported languages, core paths, language links and hreflang.
  `translatedLocales` is derived from the language inventory.
- `app/(english)`: original public and utility routes. APIs remain in `app/api`.
- `app/(localized)/[locale]`: static translations with `dynamicParams = false`.
  The page registry maps the core paths to shared layouts in `components/pages`.
- `components/RootShell.tsx`: shared document, header, footer and measurement.
  HTML language/direction are set before hydration; Arabic uses RTL.
- `data/siteData.ts`: company facts and shared content.
- `lib/i18n/messages/{es,fr,ar,vi,id}.json`: five server dictionaries, each matching
  the 1,052 keys in `source-keys.json`. Only `client-keys.json` allowlisted copy is
  passed to interactive components.

There is no runtime translation API. On a new browser session, a top-level
document navigation from outside the site or the address bar to an unprefixed core
URL selects a language from a saved manual choice, weighted `Accept-Language`, the
Vercel `X-Vercel-IP-Country` header, then English. The country fallback uses the
Node/ICU likely language with French overrides for SN, ML, NE, CF, MG and BI.
Requests without Fetch Metadata, in-site navigation, prefetches, assets, APIs and
unknown routes are not redirected. A direct published `/es`, `/fr`, `/ar`, `/vi`
or `/id` URL is always respected. Opening `/blog` or `/search` first marks the
session as English; navigation from an English-only article also stays English.

The first eligible document sets an HTTP-only `rt_language_session` session cookie.
The language menu sets the `rt_language_preference` first-party cookie for 365 days
when JavaScript and cookies are available. Both use `SameSite=Lax`, `Path=/` and
`Secure` on HTTPS. Manual links still work without storage; a fresh outside entry
may be selected again if cookies are blocked. The ordinary language links preserve
the core page, campaign query and same-page anchor. On English-only pages they link
to the selected homepage and omit page-specific anchors. Query/hash are added after
hydration and refreshed on interaction; cached HTML contains the base language URL.

Personalized redirects and responses setting the session cookie are `no-store`;
the translated HTML remains static. `AUTO_LOCALE_DETECTION_ENABLED=false` disables
automatic selection on a new deployment without disabling manual links. With no
Vercel country header, country inference is skipped. No new IP/country log, GA4
field, or third-party geolocation request is introduced.

## Maintaining copy

Translate complete sentences and preserve interpolation tokens, brands, model
names, contact identifiers and trade terms such as FOB/MOQ. Use `TranslatedText`
for sentences containing links, emphasis or code. Display-ready component props
are already translated; shared components translate only their own defaults.
Keep numeric placeholders aligned with real measurements and counts.

When adding copy, update all five dictionaries and the source-key inventory.
Add interactive copy to the client allowlist. Remove unused keys from all six
inventory/dictionary files together. When adding a page, update the route allowlist,
localized registry and sitemap dates. Advertise only translations that exist.

Sanity article cards explicitly use `lang="en" dir="ltr"`. Search accepts common
product/support terms in all six languages. `/search?lang=id&q=...` keeps the
English search UI while returning translated core-page links. Blog links remain
English; search pages use noindex.

## SEO, preview and recovery pages

Pages have localized metadata, self-referencing production canonicals, reciprocal
six-language hreflang and English `x-default`. Open Graph uses the matching locale,
including `id_ID`. Sitemap translations use the later of source content date and
translation launch date: `2026-11-01` for es/fr/ar/vi and `2026-11-02` for id.
Do not refresh content dates for builds or style-only changes.

Product collection and FAQ JSON-LD share the visible translated copy. Organization
identity and canonical postal fields remain shared. Sales `availableLanguage`
lists only confirmed spoken languages; website translations do not promise
Indonesian-speaking staff. Follow Google's [localized page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions)
and [AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).
Google recommends avoiding automatic language redirects: because English and
`x-default` share unprefixed URLs, the entry redirect still carries an indexing
risk. Monitor Search Console after deployment and disable automatic selection if
the results deteriorate. The proxy does not special-case crawler user agents.

Preview builds send `X-Robots-Tag: noindex` when `VERCEL_ENV=preview`; production
builds do not receive that blanket header. Keep preview canonicals pointing at
production. The stable preview alias is `https://realismthrift-i18n-preview.vercel.app`.
After a preview deployment is ready, reassign that alias to the verified commit.
Merging to `main` triggers the production Git deployment; verify its SHA and state.

Unknown URLs use the native `global-not-found` entry with experimental
`globalNotFound`, request-time language selection, HTTP 404 and noindex, without
tracking. `StatusPageContext` supplies a small translated allowlist to recovery
views. Core pages remain static. API validation/rate-limit errors use known
translated messages; unknown errors use the generic localized fallback.

## Address and inquiry contracts

The factory is on County Road 193, Yuanzhou Town, Boluo County, Huizhou, Guangdong,
China. The DiDi destination is Baisha Elementary School. Display addresses are
translated; contact pages also retain the original copyable English and Chinese
navigation/search strings. Do not translate coordinates, map IDs or contact details.

Only form labels and display messages are localized. Field names, product/quantity
values, `/api/send`, submission IDs and Meta browser/server event IDs keep their
contracts. Source paths retain `/id/contact-us` or the actual localized page.
GA4 does not receive contact fields or country free text. Measurement, hashing,
email outbox/retries and utility-page exclusions are documented in
[meta-tracking.md](meta-tracking.md). Use the same GA4 property/Meta Pixel for all
languages and report by page path, rather than translating event names.

## Verification

Use pnpm: `pnpm lint`, `pnpm test:unit`, `pnpm build`, then production-mode
Playwright checks for `tests/i18n.spec.ts`, `tests/analytics.spec.ts` and
`tests/audit.spec.ts`. Tests intercept inquiry and advertising transports; do not
send synthetic inquiries or conversions to production. For local measurement
checks, build with `VERCEL_ENV=production` and test analytics IDs, then point
`PLAYWRIGHT_BASE_URL` at that server. Never commit these environment overrides.

On 2026-11-02, the multilingual audit covered 60 core pages. Fixed low text contrast,
accessible names omitting visible labels, form focus/borders and non-focusable
horizontal tables. Final axe-core 4.14.0 scans reported zero violations across
60 desktop and 60 mobile (320px) states; 24 table keyboard-scroll/focus checks,
including RTL, passed. The audit also passed 269 unit tests and 69 browser tests
(one desktop skip of a mobile-only check), changed-source ESLint and production
build/type checks. The table-focus change received a final scan and keyboard check.

These results are not WCAG certification or a guarantee of indexing, rankings or
AI citations. Image-background contrast and some accessible-name checks need human
review. The Maps iframe was mocked, and full screen-reader/native-speaker review,
field Core Web Vitals, Search Console inspection and live conversion receipt were
not tested. Some Sanity blog images timed out through the local image optimizer.
