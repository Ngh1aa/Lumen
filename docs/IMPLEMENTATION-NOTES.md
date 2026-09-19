# LUMEN — Core Experience Implementation Notes

## Implemented milestone

```text
Home / Artwork Portal
→ Drift
→ Artwork Detail
→ Relationship Atlas
```

## How reference research was translated

### Codrops — ImageExpansionTypography
- Kept: the principle of an image acting as part of a typographic composition and then becoming the next content object.
- Changed: no Codrops source code or demo composition is copied. LUMEN uses the browser View Transitions API plus its own editorial layout.
- UX purpose: preserve object continuity from portal → collection → detail.

### Codrops — ScrollAnimationsGrid
- Kept: irregular image rhythm and non-uniform grid emphasis.
- Changed: no scroll hijacking, no GSAP dependency, no animation on every tile.
- UX purpose: make Drift feel exploratory without removing orientation.

### Motion Primitives
- Kept: shared-object transition thinking and reduced-motion discipline.
- Changed: implemented natively rather than importing the library.
- UX purpose: transition architecture stays small and project-specific.

### Animata
- Kept: functional state/microinteraction mindset.
- Changed: LUMEN buttons/mode controls are original project components.

### M+, MoMA, Rijksmuseum, Google Arts & Culture
- M+: informs the idea that a museum's digital presence can have its own strong visual grammar.
- MoMA/Rijksmuseum: inform stable object-detail and collection-reading surfaces.
- Google Arts & Culture: informs alternative exploration by color/mood/time rather than search alone.
- None are treated as proof of conversion or usability outcomes.

## Collection data

The prototype queries the Art Institute of Chicago public API for artworks explicitly filtered to public-domain records and renders images through its IIIF endpoint. A small public-domain fallback is included for API failure.

## Accessibility / resilience

- Skip link and visible focus.
- Keyboard-operable navigation and artwork cards.
- `prefers-reduced-motion` support plus an explicit motion toggle.
- Atlas is visual on desktop and becomes a semantic ordered relationship list on smaller screens.
- Relationship labels are explicitly marked as prototype navigation concepts rather than museum scholarship.

## Deliberate non-goals for this milestone

- no full search;
- no saved-collection screen;
- no 3D/R3F layer;
- no WebGL shader;
- no universal component-library import.

These remain candidates only if the core interaction survives visual/browser QA.
