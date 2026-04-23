# Audit Fixes Summary

This file records the remediation work completed after the April 22, 2026 code audit.

## Completed Fixes

### High

- `High-01`: Removed the build-blocking `useSearchParams()` dependency from the global header path and restored stable `next build`
- `High-02`: Hardened `app/api/send/route.ts` with:
  - server-side field validation
  - email and WhatsApp format checks
  - input normalization and length limits
  - HTML escaping for outbound email content
  - honeypot bot detection
  - IP-based rate limiting
  - sanitized error responses

### Medium

- Added `metadataBase` in the root layout so Open Graph and Twitter image URLs resolve correctly
- Replaced the default Resend onboarding sender with environment-driven sender configuration:
  - `CONTACT_FROM_EMAIL`
- Cleaned visible text corruption and inconsistent symbols on key frontend pages and shared UI components

### Additional Improvement

- Implemented first-pass Sanity Visual Editing for blog content:
  - Draft Mode enable/disable API routes
  - `next-sanity` live fetch layer
  - conditional `VisualEditing` / `SanityLive` mounting in draft mode
  - Studio Presentation Tool setup
  - blog document location resolution for preview

## Current Validation Status

Validated successfully:

- `cd nextjs && npm run lint`
- `cd nextjs && npm run build`
- `cd sanity/studio-realismthrift && npm run build`

## Remaining Non-Audit Follow-up

These are implementation follow-ups, not unresolved audit blockers:

- configure real production values for:
  - `SANITY_API_READ_TOKEN`
  - `NEXT_PUBLIC_SANITY_STUDIO_URL`
  - `SANITY_STUDIO_PREVIEW_ORIGIN`
  - `CONTACT_FROM_EMAIL`
- add frontend origins to Sanity CORS settings
- migrate more static marketing content into Sanity if homepage/About/FAQ Visual Editing is needed

## Source of Truth Guidance

To avoid reintroducing contradictions:

- keep shared business stats centralized in `nextjs/data/siteData.ts`
- keep blog preview infrastructure in `nextjs/lib/sanity/*`
- keep Studio preview/document mapping in `sanity/studio-realismthrift/presentation/*`
