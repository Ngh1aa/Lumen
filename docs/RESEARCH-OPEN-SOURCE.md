# Open-source reference research — LUMEN

## Goal

Use open-source work as implementation intelligence, not as a visual identity shortcut. Every adopted interaction must be re-authored around LUMEN's own content model, tokens, layout and UX purpose.

## Candidate source stack

| Source | Status | Verified license / terms | What to study or adapt | LUMEN use |
|---|---|---|---|---|
| Codrops — ImageExpansionTypography | ADAPT | MIT | expanding image inside typography | hero portal / exhibition entry |
| Codrops — ScrollAnimationsGrid | ADAPT | MIT | GSAP/ScrollTrigger image-grid motion | Drift / collection transitions |
| Motion Primitives | ADAPT | MIT | animated groups, shared transitions, in-view primitives | transition architecture |
| Animata | ADAPT | MIT | copy/paste React + Tailwind interaction patterns | functional microinteractions, tabs, progress, overlays |
| React Bits | ADAPT WITH NOTICE | MIT + Commons Clause | text, cursor, background and image interaction primitives | isolated signature effects only |
| 21st.dev marketplace | RESEARCH ONLY by default | Marketplace terms + per-author rights vary | composition and pattern discovery | inspiration only unless specific upstream component license is verified |
| Flux UI | RESEARCH / PROMPT SOURCE | verify per component before source reuse | motion prompts, component behavior framing | prompt structure + interaction requirements |
| React Three Fiber | OPTIONAL | MIT | spatial/3D rendering infrastructure | immersive gallery mode only |

## Verified primary references

- Codrops ImageExpansionTypography: https://github.com/codrops/ImageExpansionTypography
- Codrops ScrollAnimationsGrid: https://github.com/codrops/ScrollAnimationsGrid
- Motion Primitives: https://github.com/ibelick/motion-primitives
- Animata: https://github.com/codse/animata
- React Bits: https://github.com/DavidHDev/react-bits
- 21st terms: https://docs.21st.dev/terms

## Adoption rules

### ADOPT
Use implementation structure substantially when:
- license is compatible;
- pattern solves a real UX problem;
- dependencies and performance cost are acceptable;
- LUMEN styling/content/state model fully replace the demo framing.

### ADAPT
Preferred default. Extract the behavior model only:
- trigger;
- transition/state logic;
- easing/timing;
- input handling;
- accessibility/reduced-motion behavior.

Then rebuild it with LUMEN tokens, markup and information architecture.

### REJECT
Reject when:
- effect is decorative with no navigation/meaning benefit;
- interaction harms artwork legibility;
- it requires pointer-only behavior without alternative;
- it causes scroll hijacking;
- it substantially duplicates another motion pattern;
- license or provenance is unclear.

## Candidate interaction mapping

### Hero — Artwork Portal
Reference ingredients:
- Codrops ImageExpansionTypography
- Motion Primitives shared/layout transitions

LUMEN behavior:
- Artwork embedded in editorial headline expands into full-bleed collection entry.
- UX purpose: connect the landing statement to the first content object without a disconnected page cut.
- Reduced motion: crossfade + scale <= 1.02, no pinned scroll sequence.

### Drift — Curated image field
Reference ingredients:
- Codrops ScrollAnimationsGrid
- selected React Bits image/cursor primitives

LUMEN behavior:
- scrolling changes spatial emphasis while keeping current artwork title/index readable.
- UX purpose: serendipitous browsing with clear orientation.
- Guardrail: never animate every tile independently.

### Atlas — relationship exploration
Reference ingredients:
- custom SVG/Canvas first; R3F only if 2D cannot express the model.

LUMEN behavior:
- nodes represent artworks/artist/movement/mood relationships.
- UX purpose: make "why is this related?" inspectable.
- Guardrail: keyboard-accessible list equivalent must exist.

### Curated Journey
Reference ingredients:
- Motion Primitives / Animata for progress, chapter transitions, image reveals.

LUMEN behavior:
- long-form editorial exhibition with chapter progress and contextual metadata.
- UX purpose: structured storytelling, not scroll spectacle.

## License / provenance policy

1. Every copied or substantially adapted source gets an entry in `THIRD_PARTY_NOTICES.md`.
2. Preserve required copyright/license notices.
3. React Bits source may be used in an application but components themselves must not be sold/sublicensed/redistributed as a component library.
4. 21st.dev marketplace media/previews are not reusable design assets. Treat the marketplace as research unless an underlying component's upstream license is independently verified.
5. Do not copy demo artwork/images unless their asset license is separately compatible.


## 2026-09-19 research expansion — ten-screen milestone

This implementation round broadened reference research beyond open-source code candidates.

### 21st.dev — interaction pattern research

Inspected:
- registry/category model;
- Morphing Cursor listings;
- Gallery Animation patterns;
- Animated Collection patterns;
- motion/navigation editorial material.

Decision:
- extract **behavior vocabulary** only: state-responsive motion, compact disclosure, image continuity and collection interaction;
- do not copy marketplace styling, demo media or component source by default;
- no 21st.dev source code is committed in this milestone;
- future source reuse still requires exact upstream license verification.

### Google Arts & Culture

Inspected:
- cultural exploration patterns that include browsing by time and color.

Decision:
- validate Color as a legitimate alternative discovery input rather than a decorative palette;
- preserve text labels and stable object metadata;
- LUMEN adds a two-color intersection as its own prototype behavior.

### Rijksmuseum Collection Online / Rijksstudio concepts

Inspected:
- exploratory collection browsing;
- Art Explorer;
- user-created/personal collections;
- comparison-oriented collection behaviors.

Decision:
- Saved Collection becomes a personal exploration memory: collection naming, private notes, Grid/Thread views, share/export;
- no Rijksmuseum visual identity or source code is copied.

### Implementation conclusion

The milestone remains intentionally dependency-light. Existing React + TypeScript + CSS/SVG can express the selected behaviors, so no new animation/component package is added merely because a reference uses one.
