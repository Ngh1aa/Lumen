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

## Ten-screen milestone family

This milestone intentionally implements ten primary screens rather than the broader exploratory inventory.

1. **Portal** — full-screen artwork field + oversized editorial entry statement.
2. **Drift** — spatial/uneven image field with controllable ambient motion and quick preview.
3. **Grid** — lower-motion controlled collection browser with compact filters.
4. **Color** — named one/two-swatch discovery with ranked visual proximity.
5. **Mood** — editorial word cloud + six-work paths with visible rationale.
6. **Artwork Detail** — calm image/provenance surface, zoom, editorial reading and continuation threads.
7. **Relationship Atlas** — explainable relationship map with filters/recenter + semantic list equivalent.
8. **Saved Collection** — utility composition for naming, notes, Grid/Thread, share/export.
9. **Exhibition: Signals from a Quiet Machine** — six-chapter vertical editorial narrative with persistent progress.
10. **About / Method** — text-led transparency page for method, sources, provenance and accessibility.

### Overlay / state family

- Quick Preview
- first-visit onboarding
- Accessibility Settings: reduced motion + higher contrast
- Drift pause / Slow / Normal / Fast
- Grid palette filters
- Color one/two-selection states
- Collection empty / populated / thread
- Artwork zoom / fit
- Atlas relation filters / trace
- 404 Lost Thread

### Composition diversity

The ten screens use three primary composition families rather than a universal shell:

- **Immersive discovery:** Portal, Drift, Color, Mood, Atlas.
- **Controlled utility/object:** Grid, Artwork Detail, Saved Collection.
- **Editorial narrative/trust:** Exhibition, About / Method.

Navigation, typography, index labels, rule lines, artwork-driven accent and motion language create coherence across those families.

### Mobile transformation contract

- Drift becomes a guided vertical field; reduced motion makes it fully stable.
- Atlas graph is removed at narrow widths; Connected Works list becomes primary.
- Color palette becomes a horizontally scrollable labelled rail.
- Mood cloud becomes a compact two-column selector and single-column result path.
- Saved Thread view collapses to a readable vertical sequence.
- Exhibition remains ordered vertical reading; no scroll hijacking.
- Primary touch controls target 44px or larger where layout permits.

### Future inventory

Search, Artists, Timeline, Collections Index and Visit remain possible future routes, but they are **not part of this milestone**. Add them only if research or portfolio narrative proves a concrete need.
