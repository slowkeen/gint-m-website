# AGENTS.md

## Purpose
Lean static marketing site for Gint-M.

## Core Files
- `index.html`: homepage sections, testimonial modals, contact modal.
- `awards.html`: awards archive grouped by year.
- `styles.css`: shared styles for both pages.
- `scripts/main.js`: sticky header, modal logic, contact-form helpers.
- `scripts/context-map.ps1`: quick anchor map.

## Fast Start
1. Run `powershell -ExecutionPolicy Bypass -File .\scripts\context-map.ps1`.
2. Jump to the target section, selector, or helper function.
3. Keep changes smaller, cleaner, and lighter than the current baseline.

## HTML Anchors
- `#top`
- `#company`
- `#projects`
- `#awards`
- `#news`
- `#testimonials`
- `#contact-cta`
- `.footer`

## JS Anchors
- `const stickyHeader`
- `const openModal`
- `const closeModal`
- `const syncContactFields`
- `const formatPhoneValue`

## CSS Anchors
- `.header`
- `.logos`
- `.projects`
- `.timeline`
- `.cards`
- `.testimonials`
- `.contact`
- `.modal`
- `.footer`

## Working Rules
- Prefer `rg -n` with ids, class names, and helper names.
- Treat `index.html`, `awards.html`, `styles.css`, and `scripts/main.js` as the main edit surface.
- Remove unused markup, styles, and assets instead of preserving legacy structure.
- Keep projects and trust metrics ahead of decorative behavior.
