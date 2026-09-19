# Design Direction — LUMEN

## Direction statement

LUMEN should feel like a museum publication that became spatial and interactive — not a SaaS product wearing an art theme.

### Three adjectives

**Cinematic · Intellectual · Experimental**

## Visual signature

1. **Artwork is the light source.** UI accent subtly derives from the currently focused artwork.
2. **Editorial pacing over card grids.** Use full-bleed fields, split columns, offset captions, archival labels and intentional negative space.
3. **Relationship lines as navigation.** Connections between artworks are visible and interactive rather than hidden in recommendation cards.
4. **Typography can become space.** Large serif/display type may crop, mask or frame imagery, but body reading remains calm.
5. **Motion expresses continuity.** Transitions show where content came from and where it went.

## Anti-template rules

- No default bento dashboard compositions.
- No global glassmorphism.
- No neon gradient blobs.
- No repetitive fade-up on every section.
- No rounded-card-everything.
- No fake metrics, testimonials or product-dashboard tropes.
- No custom cursor on general reading pages; contextual cursor only in immersive zones.
- No effect may obscure artwork, captions or navigation.

## Palette

Base:
- Museum Black — `#090909`
- Gallery Ivory — `#F3F0E8`
- Signal White — `#FCFCFA`
- Graphite — `#282828`
- Soft Line — `rgba(255,255,255,.16)` / dark equivalent

Accent:
- contextual, sampled/mapped from focused artwork;
- must pass text/UI contrast checks where used interactively.

## Typography

Direction:
- Display/editorial serif for exhibition voice.
- Neutral grotesk for UI, metadata and controls.
- Maximum two families in production.

Rules:
- Large display lines can crop across viewport edges.
- Metadata remains small but never below accessible reading thresholds.
- Long text stays within comfortable measure.
- Type animation is reserved for chapter/hero moments, not every heading.

## Layout system

Desktop:
- 12-column flexible editorial grid.
- generous outer gutters.
- image fields can break the grid intentionally.
- metadata anchors provide orientation.

Tablet:
- preserve editorial hierarchy but reduce overlapping layers.

Mobile:
- transform spatial canvases into guided vertical narratives;
- relationship Atlas gets an equivalent ordered relationship path;
- no desktop-only hover dependency.

## Signature interactions

### 1. Artwork Portal
Hero artwork expands from typography into the first exploration scene.

Purpose: **CONNECT**

### 2. Chromatic Explorer
Collection reorganizes along dominant-color bands.

Purpose: **REVEAL + ORIENT**

### 3. Relationship Atlas
A selected artwork exposes explainable links to artist, movement, era, mood and related works.

Purpose: **CONNECT + ORIENT**

### 4. Morph Gallery
User can switch Grid ↔ Immersive without losing the selected artwork or scroll context.

Purpose: **CONNECT**

### 5. Curated Journey progress
Chapter state is always visible and recoverable.

Purpose: **ORIENT + RESPOND**

## Motion system

Every animation must serve one of four roles:
- **ORIENT** — show where the user is.
- **CONNECT** — preserve object/state continuity.
- **REVEAL** — disclose hierarchy or hidden context.
- **RESPOND** — acknowledge user input.

Default interaction timings:
- micro state: 140–240ms
- content transition: 320–600ms
- signature transition: 650–1100ms only when user-controlled / interruptible

Avoid scroll hijacking. Respect `prefers-reduced-motion`.

## Image direction

- Prefer public-domain/open-access museum imagery or explicitly licensed sources.
- Do not use generic lifestyle stock.
- Preserve artwork aspect ratio unless crop is a deliberate editorial treatment with a full-view option.
- Captions and provenance belong near the artwork, not hidden behind hover only.

## Accessibility baseline

- WCAG 2.2 AA target for core UI.
- Full keyboard path for nav, filters, save, artwork selection.
- Visible focus.
- Reduced-motion variant for every signature interaction.
- Text alternative / caption strategy for artworks.
- Atlas / spatial views require a semantic list equivalent.
- Touch targets >= 44px on mobile.

## Initial screen family

1. Home / Portal
2. Explore — Drift
3. Explore — Grid
4. Explore — Atlas
5. Explore — Random
6. Discover by Color
7. Discover by Mood
8. Collections index
9. Collection detail
10. Artwork detail
11. Artwork zoom / inspect
12. Artists index
13. Artist profile
14. Exhibitions index
15. Curated Journey
16. Timeline
17. Search
18. Search results
19. Saved Collection
20. Visit
21. About
22. Motion / accessibility settings overlay

This list is a design inventory, not a promise to build every page before validating the flagship flow.
