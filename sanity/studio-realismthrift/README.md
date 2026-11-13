# RealismThrift Sanity Studio

This directory contains the Sanity Studio used to manage RealismThrift blog content.

## Project

- Project ID: `unxd1ije`
- Dataset: `production`
- Studio title: `RealismThrift`

## Managed Content

The Studio manages:

- Blog posts.
- Authors.
- Categories.
- Cover images and body images.
- Portable Text article body.
- Tables in blog content.
- SEO fields, including meta title, meta description, and OG image.

## Commands

Use `pnpm` only.

```powershell
pnpm install --frozen-lockfile
pnpm dev
pnpm build
```

After editing a Studio schema or a storefront GROQ query, run `pnpm typegen`
from this directory. Review and commit [schema.json](schema.json) and the
[generated storefront types](../../nextjs/types/sanity.types.ts) with the source
change. To publish the Studio, run `pnpm deploy`.

## Preview

Sanity Presentation previews the local storefront at `http://localhost:3000` by default. Set `SANITY_STUDIO_PREVIEW_ORIGIN` to `https://www.realismthrift.com` for the production site. The allowed origins are listed in [sanity.config.ts](sanity.config.ts).

## Content Notes

Blog content should be written in English for overseas used goods wholesale buyers. Keep the tone practical and specific:

- Explain sourcing limits honestly.
- Define A-grade as sellable used quality, not new condition.
- Use concrete image alt text.
- Keep SEO titles and descriptions unique.
- Avoid unsupported superlatives or perfect-quality promises.
