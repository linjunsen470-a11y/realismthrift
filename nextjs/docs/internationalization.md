# Website languages

English keeps the original URLs. Spanish, French, Arabic and Vietnamese use
`/es`, `/fr`, `/ar` and `/vi`. The ten translated routes are explicitly listed in
`lib/i18n/routing.ts`; unlisted translations return 404. There is no browser-language
redirect, language cookie, middleware, client-side text replacement or runtime
translation service.

## Rendering and content

- `app/(english)` preserves all existing public and utility URLs. The route group
  does not appear in URLs. APIs remain in `app/api`, and OAuth discovery remains
  in `app/.well-known`.
- `app/(localized)/[locale]` statically generates the forty published translations.
  Both root layouts use `components/RootShell.tsx`, setting `html lang` and `dir`
  before hydration. Arabic uses RTL, with isolated Latin contact details.
- `components/pages` contains the shared page layouts and English source copy.
  `data/siteData.ts` remains the source of company facts and shared content.
- `lib/i18n/messages/{es,fr,ar,vi}.json` contains local translation dictionaries.
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
`languageAlternates` supplies the same reciprocal five-language plus `x-default`
set for page metadata and sitemap entries. `x-default` points to English.
Only published pages appear in the sitemap. Translated product collection and
FAQ schema uses the visible translated copy; organization identity stays shared.
Translated sitemap dates use the later of the source content date and the
translation launch date. Continue maintaining dates when content changes.

When adding a route, add it to the route allowlist and localized page registry,
provide all four translations and SEO copy, and update sitemap content dates.
Do not advertise translations until they exist. Maintain the source-key inventory
in `lib/i18n/source-keys.json` when editing copy. Add new interactive keys to the
client allowlist.
Include complete templates for dynamic image alt text and accessibility labels,
not English sentences joined to translated product names. Shared components take
display-ready title props; they translate their own default titles only.

## Inquiry and measurement boundaries

Only form labels and display messages are localized. Field names, product and
quantity option values, `/api/send`, submission IDs, `event_id` deduplication,
fbclid capture and measurement payloads keep their existing contracts. The
localized source pathname is sent through the existing sourcePath field.
No contact fields or country free text are added to GA4. No database, email
outbox, scheduled retry, CAPI hashing, authentication or unsubscribe behavior
is changed. Utility pages stay English and retain their existing noindex and
measurement exclusions.

## Local checks

Use pnpm: `pnpm lint`, `pnpm test:unit`, `pnpm build` and
`pnpm exec playwright test tests/i18n.spec.ts` (plus existing regressions).
The Playwright inquiry tests intercept submission and analytics transports;
they never create live inquiries, send emails or record advertising conversions.
For production-server measurement tests, build with `VERCEL_ENV=production` and
test analytics IDs, then use `PLAYWRIGHT_BASE_URL` for that local server. These
environment overrides must not be committed to environment files.

After moving routes, stale `.next/dev/types` from an earlier dev session may
refer to the old filesystem paths. Stop that dev session and regenerate the
generated types before checking the build; no source files need changing.
