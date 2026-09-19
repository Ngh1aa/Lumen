# Accessibility Evaluation — LUMEN

**Evaluation date:** 2026-09-19  
**Milestone:** Ten-screen cultural experience  
**Target:** WCAG 2.2 AA for core UI and critical flows  
**Status:** targeted verification in progress — **not a formal conformance claim**

## Scope

Representative primary routes:
- Portal
- Drift
- Grid
- Color
- Mood
- Artwork Detail
- Relationship Atlas
- Saved Collection
- Exhibition
- About / Method

Dynamic states sampled:
- Quick Preview dialog
- Accessibility Settings dialog
- first-visit onboarding
- saved empty/populated
- one/two-color selection
- Atlas relation filters
- artwork zoom
- 404 recovery

## Technologies

- React 19
- semantic HTML
- CSS
- SVG relationship lines
- browser View Transitions where available
- browser localStorage for prototype preferences/collection state

## Designed accessibility behaviors

### Keyboard
- global skip link;
- native buttons/links for interactive controls;
- Drift arrow-key traversal between artworks;
- Quick Preview and Accessibility Settings support Escape close;
- Grid/Color/Mood use keyboard-activatable buttons;
- Atlas has a text-list representation with explicit Recenter actions.

### Motion
- system `prefers-reduced-motion` is respected;
- manual reduced-motion control is available globally;
- ambient Drift loops stop under reduced motion;
- large spatial transformations are removed under reduced motion;
- navigation/content remain available without motion.

### Color / contrast
- Color mode uses text names in addition to swatches;
- selected states use border/text/state attributes, not hue alone;
- optional higher-contrast mode raises muted text/line/control contrast;
- current artwork accent is not used as the sole semantic channel.

### Mobile / reflow
- target touch controls are designed around >=44 px where practical;
- spatial Atlas is removed on narrow mobile and the semantic Connected Works list becomes primary;
- mode/filter rails can scroll horizontally rather than forcing page overflow.

### Artwork alternatives / provenance
- artwork images include descriptive alt text in content surfaces;
- decorative duplicate images can use empty alt where the adjacent control/text names the object;
- each artwork detail exposes source and license information.

## Automated evidence

GitHub Actions is configured to run:
1. TypeScript typecheck
2. production build
3. Chromium Playwright critical-flow tests
4. axe-core scans on representative dynamic routes
5. mobile horizontal-overflow checks
6. screenshot generation for representative viewport sizes

Axe serious/critical results are treated as **partial evidence only** and do not establish WCAG conformance.

## Manual checks required before release claim

- visible focus across all primary controls;
- logical focus order in Quick Preview and Accessibility Settings;
- keyboard-only completion of flagship flow;
- 200%/400% zoom and narrow reflow spot checks;
- actual rendered text/surface contrast review;
- reduced-motion behavior inspection;
- screen-reader naming/order spot checks;
- image-alt usefulness review;
- mobile touch and sticky-control collision review;
- representative rendered visual inspection at 1440 / 1024 / 768 / 390.

## Known limitations / non-claims

- This prototype has not undergone a formal WCAG-EM conformance evaluation.
- No assistive-technology user study is claimed.
- No disabled-user usability study is claimed.
- Curatorial mood/theme metadata is prototype-authored and is not source-archive scholarship.
- Runtime dependence on Wikimedia-hosted imagery can affect image availability independently of interface accessibility.

## Release gate

Do not describe LUMEN as “fully accessible” or “WCAG conformant” from the current test suite. Appropriate wording after automated + manual checks is:

> LUMEN targets WCAG 2.2 AA for its core interface and includes tested keyboard, reduced-motion, labelled-color and semantic Atlas fallbacks. The current review is a targeted prototype accessibility evaluation, not a formal conformance audit.
