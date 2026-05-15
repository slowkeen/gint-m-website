# Design Standards

These defaults come from the current homepage and are the baseline for all new inner pages unless a page has an explicit exception.

## Layout

- Use `.page-shell` for the top-level content container on inner pages.
- `.page-shell` is the canonical homepage gutter container:
  `width: calc(100% - (var(--page-gutter) * 2));`
  `margin: 0 auto;`
- Do not add a second page-level horizontal padding wrapper around `.page-shell`.
- Do not add a local `max-width` to the main page shell unless that narrower layout is explicitly approved.

## Gutter Tokens

- Default: `--page-gutter: clamp(18px, 4vw, 56px);`
- Up to `1279px`: `--page-gutter: clamp(20px, 3vw, 32px);`
- Up to `767px`: `--page-gutter: 16px;`

## Typography

- Eyebrow / overline text: `font-size: var(--eyebrow-size);` with `letter-spacing: var(--eyebrow-tracking);`
- Main body copy: `font-size: var(--body-copy-size);` and `line-height: var(--body-copy-line);`
- Hero H1 scale: `clamp(40px, 5vw, 72px)` with tight tracking (`-0.04em`)
- Major section title scale: `clamp(30px, 3.8vw, 56px)`
- Secondary card / subsection title scale: `clamp(24px, 2vw, 32px)`

### Mobile Typography

- Mobile hero H1: `var(--type-mobile-hero-title-size)` = `clamp(34px, 11vw, 54px)`
- Mobile page / major section titles: `var(--type-mobile-page-title-size)` or `var(--type-mobile-section-title-size)` = `clamp(28px, 8vw, 38px)`
- Mobile card / secondary titles: `var(--type-mobile-card-title-size)` = `clamp(24px, 7vw, 30px)`
- Mobile compact titles: `var(--type-mobile-subtitle-size)` = `clamp(20px, 5.8vw, 24px)`
- Mobile lead copy: `var(--type-mobile-lead-size)` = `clamp(16px, 4.8vw, 18px)`
- Local page CSS must use these tokens in mobile breakpoints instead of hard-coded one-off title sizes.

## Working Rule

- Start from shared homepage tokens and title scales first.
- Add local page-specific sizes only when the shared system cannot express the layout cleanly.
