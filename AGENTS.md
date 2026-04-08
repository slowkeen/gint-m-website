# AGENTS.md

## Purpose
This repo is a single-page marketing site for Gint-M.
The main context cost comes from three monoliths:
- `index.html`
- `styles.css`
- `scripts/main.js`

Do not read those files top-to-bottom unless the task truly spans the whole page.

## Fast Start
1. Read `client-revisions.md` first.
2. Run `powershell -ExecutionPolicy Bypass -File .\scripts\context-map.ps1`.
3. Jump to the exact HTML section, JS block, or CSS selector you need.
4. Ignore `backups/` and server log artifacts.

## Project Layout
- `index.html`: all page sections and modal markup.
- `styles.css`: all visual styles, including repeated selector groups and responsive overrides.
- `scripts/main.js`: all interactive behavior inside one IIFE.
- `client-revisions.md`: the authoritative brief and client feedback summary.
- `scripts/context-map.ps1`: quick line map for the repo.

## HTML Section Anchors
Use section ids instead of scrolling the whole file:
- `#top`
- `#company`
- `#services`
- `#projects`
- `#testimonials`
- `#awards`
- `#contact-cta`
- `#directions`
- `#news`
- `.site-footer`

## JS Anchors
Jump by landmark constants:
- `const statCounters`: counters
- `const testimonialsSlider`: testimonial slider logic
- `const companyLogosSlider`: company logos slider logic
- `const applyClasses`: reveal helpers
- `const updateStickyHeader`: sticky header behavior
- `const formatPhoneValue`: contact form formatting
- `const openModal`: modal lifecycle

## CSS Anchors
Search selectors instead of scrolling:
- `.hero-top`
- `.company-logos`
- `.projects-shell`
- `.testimonials-nav-button`
- `.awards-shell`
- `.contact-cta-shell`
- `.directions-shell`
- `.news-shell`
- `.site-footer`

Note: `styles.css` contains repeated selector groups and breakpoint overrides. Expect multiple hits for the same selector.

## Brief Constraints
From `client-revisions.md`, keep these constraints in mind:
- The site should feel lighter, stricter, and cleaner.
- The main emphasis should be projects and trust metrics.
- The first screen should explain the company fast.
- Large decorative motion should be minimized.
- Client logos should not become the main moving story element.

## Working Rules
- Use `rg -n` with ids, selectors, and landmark constants before opening file slices.
- Prefer opening narrow ranges around a matched anchor.
- If a task is local to one section, do not inspect unrelated sections.
- Treat `client-revisions.md` as product truth when design choices conflict.