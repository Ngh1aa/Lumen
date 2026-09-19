# Design Reference Benchmark — LUMEN

## Decision problem

How can a digital museum feel visually distinctive and exploratory without sacrificing orientation, collection credibility, accessibility or practical information retrieval?

## Source mix

### Production / category reality

| Reference | Role inspected | Principle extracted | What not to copy | LUMEN adaptation |
|---|---|---|---|---|
| M+ | institutional web identity / modular culture publishing | digital presence can be a distinctive extension of institutional identity; modularity supports many content types | exact color-band identity and M+ brand grammar | build a unique spatial/editorial grammar where artwork color becomes contextual UI signal |
| MoMA Collection | search/filter + collection scale | stable search/filter taxonomy remains important for precise intent and large archives | dense collection grid as the whole product experience | preserve Grid/Search as reliable fallback while Drift/Atlas support weak-intent exploration |
| Rijksmuseum Collection Online | collection discovery + user-created sets + comparison | exploration can mix images, stories, search, zoom and personal collections | literal Gallery of Honour metaphor | use Saved Collections + compare/inspect detail as user-owned exploration memory |
| Google Arts & Culture | explore by artist/movement/time/color + experimental cultural tools | alternative entry points such as color/time can coexist with familiar taxonomies | broad platform-level visual identity / feature sprawl | make Color and Mood first-class but secondary discovery modes |
| Google Art Camera | high-resolution artwork inspection | deep zoom and narrative context strengthen artwork understanding | building the site around one zoom gimmick | artwork detail gets a dedicated inspect/zoom mode |

### Open-source implementation intelligence

| Reference | Job | Keep | Reject / guardrail |
|---|---|---|---|
| Codrops ImageExpansionTypography | Hero continuity | image expansion within typographic frame | exact composition, fonts, demo media |
| Codrops ScrollAnimationsGrid | Drift motion model | coordinated grid transforms + scroll-linked emphasis | scroll hijacking and animation on every tile |
| Motion Primitives | Transition architecture | shared/layout transition patterns | generic component-library look |
| Animata | Functional microinteraction | tabs/progress/overlay/state transitions | importing components unchanged |
| React Bits | Signature effect vocabulary | isolated text/image/cursor techniques | effect stacking, generic "creative dev" aesthetic |
| 21st.dev | Pattern discovery | composition/category exploration | marketplace media/code reuse without independent license verification |

## Reference synthesis

### IA / task truth
- Precise-intent users still need search, filters, artist/movement indices and stable detail pages.
- Weak-intent users benefit from exploratory entrances such as color, time, stories and curated themes.
- Saving/collecting gives exploration a meaningful end-state.

### Visual craft
- The project should not use a universal museum-template hero.
- Artwork itself is the dominant media system.
- The interface should create continuity between discovery and detail rather than abrupt card → page cuts.
- Editorial composition can change by page role while nav/type/tokens/motion language preserve coherence.

### Motion
- Motion should explain object continuity or content relationships.
- Spatial/immersive interactions need semantic fallbacks.
- One strong interaction family is more ownable than many unrelated effects.

## Page-role reference matrix

| Page role | User question | Primary reference job | LUMEN composition decision |
|---|---|---|---|
| Home / Portal | "What kind of place is this and where do I start?" | M+ distinctiveness + Codrops continuity | oversized editorial statement framing one artwork portal; minimal nav; no card grid |
| Explore / Drift | "Show me something worth following." | Google exploratory entry points + ScrollAnimationsGrid | spatial image field with persistent index/title/mode controls |
| Explore / Grid | "Let me browse predictably." | MoMA/Rijksmuseum practical collection browsing | stable semantic grid/list with filters; visually calmer than Drift |
| Atlas | "Why are these works related?" | Google cultural experiments | relationship graph with explainable link labels + list equivalent |
| Artwork detail | "What is this, and what should I notice?" | MoMA/Rijksmuseum/Art Camera | calm editorial detail + inspect/zoom + related-through paths |
| Curated Journey | "Tell me a story through the collection." | Google Arts & Culture themes | chapter-based editorial narrative with progress and selective reveals |
| Saved | "What did I keep, and how do I return?" | Rijksmuseum user collections | personal collection board/list; low-motion utility composition |

## Three design DNA commitments

1. **Artwork as light source:** contextual accent derives from the focused work rather than one fixed brand neon.
2. **Relationship navigation:** links are visible as labeled connections, not hidden behind "Recommended for you."
3. **Editorial → spatial continuity:** typography, image field and transitions preserve the identity of the selected object.

## Rejected patterns

- generic dark museum site with gold serif accents;
- full-site WebGL just because the subject is art;
- every screen as a floating rounded card;
- cursor-follow effects on long reading surfaces;
- universal copy-left/image-right hero;
- animation that requires pointer precision;
- award-style scroll spectacle without a stable browse/search mode.

## Evidence notes

- Production references are used for product/IA patterns, not as proof that their design is objectively "best."
- Open-source references are implementation candidates only; license/provenance remains mandatory before source reuse.
- No usability outcome is claimed from these references.
