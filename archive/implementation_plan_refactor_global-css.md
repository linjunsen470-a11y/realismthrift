# CSS Splitting and Component Reuse Plan

## Goal

The current `app/globals.css` file has exceeded 3,000 lines, acting as a monolithic stylesheet for the entire application. This plan outlines a strategy to break it down into modular CSS files and extract duplicated JSX patterns into reusable React components to improve maintainability and enforce design consistency.

## User Review Required

> [!IMPORTANT]
> **CSS Architecture Choice**: The plan proposes keeping the custom `rt-*` BEM-like classes but splitting them into multiple CSS files using standard CSS `@import` (since Tailwind v4 handles this automatically). This avoids the massive refactoring required to migrate entirely to CSS Modules (`.module.css`), while still providing modularity. Please confirm if this approach is preferred over migrating to CSS Modules.

## Open Questions

> [!WARNING]
> 1. Should we place the new modular CSS files in `app/styles/` or create a `styles/` folder at the root of the project?
> 2. Are you open to creating a `components/ui/` folder for the extracted micro-components (like `Button`, `SectionHeader`), or should we add them to the existing `components/CommonUI.tsx` file?

## Proposed Changes

---

### CSS Splitting

We will create a new directory (e.g., `app/styles/`) and split `globals.css` based on logical boundaries. `globals.css` will become a central entry point that simply imports these files.

#### [NEW] `app/styles/base.css`
Will contain theme variables (`@theme`), CSS resets (`@layer base`), global `body` and typography styles, and global animations/keyframes.

#### [NEW] `app/styles/utilities.css`
Will contain generic utility classes like `.rt-container`, `.rt-fade-in`, `.rt-fade-in-delayed`, `.ticker-text`.

#### [NEW] `app/styles/components.css`
Will contain styles for globally reused UI elements: Buttons (`.rt-btn-primary`, `.rt-btn-outline`), Badges (`.rt-section-badge`), Dividers (`.rt-section-divider`), and Headings (`.rt-section-title`, `.rt-subsection-heading`).

#### [NEW] `app/styles/layout.css`
Will contain the global layout components: Header (`.rt-topbar`, `.rt-mainnav`, `.rt-logo-bar`), Custom Scrollbar, and Footer (`.rt-footer`).

#### [NEW] `app/styles/pages/home.css`
Will contain Home page specific sections: Hero, Trust banner, Features, Partners, Home Order section.

#### [NEW] `app/styles/pages/blog.css`
Will contain Blog and News specific classes: `.rt-related-post-item`, Share buttons, Author Section fixes.

#### [NEW] `app/styles/pages/products.css`
Will contain classes related to product grids and cards (`.rt-products-grid`, `.rt-product-card`).

#### [NEW] `app/styles/pages/legal.css`
Will contain specific CSS rules currently residing under `/* Legal Page Refinements */`.

#### [MODIFY] `app/globals.css`
Will be reduced from 3000+ lines to ~15 lines, primarily consisting of:
```css
@import "tailwindcss";
@import "./styles/base.css";
@import "./styles/utilities.css";
@import "./styles/components.css";
@import "./styles/layout.css";
@import "./styles/pages/home.css";
@import "./styles/pages/blog.css";
@import "./styles/pages/products.css";
@import "./styles/pages/legal.css";
```

---

### Component Reuse

Currently, complex HTML structures with multiple `rt-*` classes are copy-pasted across pages. We will extract these into reusable React components.

#### [NEW] `components/ui/SectionHeader.tsx`
Will abstract the repeated pattern found across the site.
**Props**: `title`, `badge` (optional), `centered` (boolean), `light` (boolean), `description` (optional).
**Replaces**:
```tsx
<div className="rt-section-header center">
  <span className="rt-section-badge">...</span>
  <h2 className="rt-section-title">...</h2>
  <div className="rt-section-divider center" />
</div>
```

#### [NEW] `components/ui/SubSectionHeading.tsx`
Will abstract the shorter heading and divider pattern.
**Props**: `title`, `centered` (boolean).
**Replaces**:
```tsx
<div className="rt-subsection-heading">
  <h2>...</h2>
  <div className="rt-section-divider" />
</div>
```

#### [NEW] `components/ui/PageHero.tsx`
Will standardize the hero section used in internal pages (About Us, Contact Us, Blog, Product pages).
**Props**: `title`, `subtitle`, `backgroundImage`, `badge` (optional), `breadcrumbs` (optional).
**Replaces**: The duplicated `<section className="rt-page-hero">...<div className="rt-page-hero-overlay"/>...</section>` structure.

#### [NEW] `components/ui/Button.tsx`
Will wrap the link/button elements to standardize the use of `.rt-btn-primary` and `.rt-btn-outline`.
**Props**: `variant` ("primary" | "outline"), `href`, `children`, `className`.

## Verification Plan

### Automated Tests
- Run `npm run dev` or `pnpm run dev` (since the user enforces pnpm based on KI/logs) to verify the CSS compiles without errors via Tailwind v4.
- Check the console for any missing imports.

### Manual Verification
- Visual inspection of the Home page, About Us page, and Contact Us page to ensure styling remains 100% identical after the split.
- Ensure the newly created components (`SectionHeader`, `PageHero`) render perfectly on both mobile and desktop views, maintaining their responsive behavior.
