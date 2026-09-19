# Design Reference Benchmark — LUMEN

**Updated:** 2026-09-19  
**Decision:** expand LUMEN into a ten-screen digital cultural experience without sacrificing orientation, credibility, accessibility or the existing cinematic identity.

## Project truth

- **Primary user:** culture/art explorer with weak or ambiguous intent.
- **Top task:** discover something meaningful without already knowing an artist, movement or exact keyword.
- **Portfolio task:** demonstrate visual craft, interaction judgment, explainable discovery, editorial storytelling, responsive strategy and accessibility ownership.
- **Brand constraints:** Cinematic · Intellectual · Experimental.
- **Content reality:** deterministic prototype media is public-domain Timeastor abstract work from Wikimedia Commons; mood/palette/theme writing is LUMEN-authored prototype metadata.
- **Hard guardrails:** no generic SaaS card system, no blanket glassmorphism, no scroll hijacking, no pointer-only critical behavior, no unverified source-code copying.

## Research questions

1. How can a museum interface support exploration when the visitor does not know what to search for?
2. How can color become a useful navigation input rather than decoration?
3. How can saved works become a personal path/collection rather than a bookmark counter?
4. How can an exhibition feel editorial and cinematic without hiding orientation?
5. Which contemporary interaction patterns can improve continuity and state feedback without importing another product's visual identity?

## Source mix

| Reference | Type | Page/state inspected | Job for LUMEN | Transferable principle | What not to copy |
|---|---|---|---|---|---|
| M+ | Production cultural institution | Institutional publishing / navigation | Distinct institutional identity | A cultural interface can use a recognizable modular visual grammar across varied content | M+ color-band identity or brand system |
| MoMA Collection | Production museum archive | Search/filter + collection-scale browsing | Precise-intent fallback | Stable taxonomy and direct object access remain necessary at scale | Dense grid as the entire experience |
| Rijksmuseum Collection Online / Rijksstudio concepts | Production museum platform | Collection exploration, Art Explorer, personal collections/comparison | Personal curation + exploratory browsing | Exploration and collection-building can coexist; saved objects support return visits and comparison | Rijksmuseum branding or literal Gallery of Honour metaphor |
| Google Arts & Culture — Explore | Production cultural platform | Explore by artist/movement/time/color | Color discovery | A visible visual property can become a first-class exploration input while labels/context remain available | Google platform identity, feature sprawl or taxonomy |
| Google Art Camera | Production cultural tool | High-resolution artwork inspection | Object inspection | Zoom can deepen looking when it resolves into clear provenance/context | Building the experience around one zoom gimmick |
| 21st.dev registry | Multi-author component/pattern registry | Morphing Cursor, Gallery Animation, Animated Collection, motion/navigation pattern catalogue | Interaction behavior research | State-responsive motion, continuity and compact disclosure patterns can be adapted locally | Marketplace visuals, demo media, or source without independent license verification |
| Codrops interaction demos | Open-source craft references | Image expansion / animated image-grid examples | Portal + spatial transitions | Shared-object continuity and image-led transitions can communicate where content came from | Demo composition/assets as final art direction |
| LUMEN current prototype | Existing product truth | Portal, Drift, Detail, Atlas, Mood, Journey | Preserve strengths | Artwork-as-light-source, asymmetrical editorial pacing, explainable relationship lines | Rebuilding working parts merely to resemble references |

## Reference synthesis

### IA / task truth
- Precise-intent users still need stable Grid/Detail surfaces and explicit metadata.
- Weak-intent users benefit from exploratory entrances such as color, mood and curated stories.
- Saving/collecting gives exploration an understandable product action and memory.
- Experimental modes require a visible recovery path rather than replacing familiar navigation.

### Visual craft
- The project should not use a universal museum-template hero.
- Artwork itself is the dominant media system.
- The interface should create continuity between discovery and detail rather than abrupt card → page cuts.
- Editorial composition changes by page role while nav/type/tokens/motion language preserve coherence.

### Motion
- Motion should explain object continuity, hierarchy, state or relationships.
- Spatial/immersive interactions require semantic fallbacks.
- Ambient Drift motion is optional, pauseable and removed under reduced-motion.
- 21st.dev is used as a pattern-discovery source only; no marketplace component source or demo media is copied in this implementation.

## Ten-screen page-role matrix

| Screen | User question on entry | Reference intelligence | LUMEN composition decision | Mobile transformation |
|---|---|---|---|---|
| 01 Portal | “How do I enter this?” | M+ distinctiveness + image continuity patterns | One artwork acts as the room's light source; three explicit doors: Drift, Exhibition, Mood | Static/slow hero, stacked entry controls, no motion dependency |
| 02 Drift | “Show me something interesting.” | 21st image/gallery behavior + Codrops spatial continuity | Uneven image field, quick preview, pause/speed, orientation label | Guided vertical field; reduced-motion becomes stable list |
| 03 Grid | “Give me control.” | MoMA/Rijksmuseum collection browsing | Stable scan order, preserved image ratios, compact filters | Filters become horizontal scroller; single-column reading |
| 04 Color | “What lives near this color?” | Google Arts & Culture color exploration | Named swatches, one/two-color intersection, ranked visual proximity | Horizontal swatches + compact result strip |
| 05 Mood | “Show me something that feels like this.” | Editorial curation | Nine manually authored mood paths with visible rationale | Two-column word cloud → single-column result sequence |
| 06 Artwork Detail | “What is this, and where can I go next?” | Museum object-detail / Art Camera patterns | Calm image/info hierarchy + editorial reading + technical provenance + three continuation threads | Image-first; tags wrap; thread rows stack |
| 07 Relationship Atlas | “Why is this related?” | Graph/network patterns + accessibility rules | Four explainable relation types with filters, recentering and trace-to-save | Graph removed; semantic connected-works list becomes primary |
| 08 Saved Collection | “What did I keep, and why?” | Rijksmuseum personal collection concepts | Name collection, private notes, Grid/Thread view, share/export | Single-column saved path with editable notes |
| 09 Exhibition | “Take me through a coherent story.” | Editorial storytelling + progress patterns | Six chapters with persistent rail, reflection question, object and recoverable exits | Rail collapses; vertical chapters retain clear order |
| 10 About / Method | “Can I trust how this works?” | Institutional transparency patterns | Explain manual/semi-automatic metadata, sources, licensing and accessibility commitment | Long-form reading page; no immersive motion |

## Final design DNA

### Layout grammar
- Editorial desktop logic with materially different composition families: immersive field, controlled collection utility, calm object/reading page and vertical exhibition narrative.
- Large image fields and asymmetrical pacing are preferred over repeated cards.
- Metadata, rules and index labels provide orientation.
- Stable Grid/Detail/About surfaces counterbalance immersive Portal/Drift/Atlas/Exhibition.

### Typography
- Display/editorial serif for curatorial voice.
- Neutral grotesk for controls, metadata and technical text.
- Large display type may crop only when meaning remains intact.

### Color
- Warm near-black base and archival ivory foreground.
- Current artwork supplies contextual accent.
- Accent is wayfinding/state, not decorative fill.
- Color controls always have text labels.

### Motion jobs
- **ORIENT:** chapter progress, selected mode, Atlas recenter.
- **CONNECT:** artwork continuity from preview → detail → Atlas.
- **REVEAL:** quick preview and accessibility settings.
- **RESPOND:** selected swatch/mood/filter/save states.
- **DELIGHT:** subtle ambient Drift only after usability; pause/reduced-motion removes it.

### Signature test
If the LUMEN wordmark disappears, the experience should still be recognizable through **artwork-as-light-source + editorial index typography + explainable relationship lines + slow spatial continuity**.

## Rejected patterns

- One universal hero shell across all screens.
- Copying 21st.dev component visuals/media.
- Full-site custom cursor.
- Endless rounded cards or bento grids.
- Decorative parallax with no orientation value.
- Algorithmic “AI mood detection” claims unsupported by the prototype.
- Color-only selection states.
- Graph-only Atlas with no semantic equivalent.
- Scroll hijacking in the exhibition.

## Implementation handoff

The implementation uses the existing React + TypeScript + Vite architecture and adds no animation-library dependency. Platform/CSS behavior is preferred unless a future interaction demonstrably requires a library.

QA gate:
- type/build;
- Playwright critical-flow tests;
- axe serious/critical scan as **partial evidence only**;
- keyboard checks;
- mobile overflow checks;
- rendered screenshots at 1440 / 1024 / 768 / 390;
- manual rendered inspection before calling the UI visually verified.


## Milestone 6 reference benchmark — VINCENT Thread Atlas

### Decision problem
Turn the current two curated Vincent threads into an explorable cultural knowledge surface without making the exhibition feel like analytics software.

### References inspected
| Reference | Type | State inspected | Transferable principle | Reject |
|---|---|---|---|---|
| 21st.dev React Graph Library collection | Pattern registry | network / graph component catalogue | nodes + edges can expose changing relationships without changing the underlying objects | dashboard chrome, chart-first composition, copied source/media |
| 21st.dev Radial Menu | Community interaction component | circular selection with keyboard support | a compact radial selector can make a spatial mode switch feel intentional | literal floating action-menu styling, dependency stack solely for motion |
| 21st.dev Gallery collections | Pattern registry | immersive / circular / interactive galleries | artwork should remain the dominant visual object while controls stay peripheral | WebGL/3D merely for spectacle |
| Existing LUMEN Thread Navigator | Product truth | artwork → place → letter drawer | provenance-aware chains are already understandable and should become Atlas data | replacing the readable chain with graph-only navigation |

### Extracted design DNA
- **Graph is a lens, not the content.** Artwork remains visually dominant.
- **Three lenses only:** TIME / PLACE / THEME. More dimensions would turn the room into a filtering tool.
- **Spatial continuity:** selecting a lens rearranges emphasis/lines, not the entire product shell.
- **Readable equivalence:** every graph relationship must also exist in a semantic list.
- **Mobile transformation:** no compressed node map. Mobile becomes an ordered “constellation path” with the same selected lens.
- **No new animation dependency:** SVG + React state + CSS are sufficient for this milestone.
- **Reduced motion:** line/node state changes become instant; no orbiting or continuous motion.

### Do not copy
- 21st.dev demo palettes, iconography, animation timing, or component source.
- generic neon-network visual language.
- draggable infinite canvases that harm orientation.
- graph labels that require hover to understand.

### Acceptance handoff
The Thread Atlas may be implemented only if:
- artwork nodes remain the strongest visual anchors;
- the active relationship type is always explicit in text;
- keyboard users can select every lens and every node;
- mobile has a non-graph primary presentation;
- provenance/source actions remain available;
- browser + axe + rendered visual evidence are collected.
