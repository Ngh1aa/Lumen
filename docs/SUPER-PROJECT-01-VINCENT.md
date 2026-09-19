# SUPER PROJECT 01 — LUMEN / VINCENT — The Painted Night

## North Star
Turn LUMEN from a strong digital-cultural prototype into a flagship mini-museum experience where a visitor explores Vincent van Gogh through light, color, brush rhythm, space, writing, and sound.

The experience must feel like entering rooms, not clicking through a website.

## Product thesis
Most museum sites assume the visitor already knows what to search for. LUMEN instead supports weak intent: a visitor can enter through sensation first, then discover context.

For SUPER PROJECT 01, Vincent van Gogh becomes the first deep-dive exhibition inside the broader LUMEN museum shell.

## Experience promise
- Visual first. Text supports looking; it never dominates the artwork.
- Multisensory but restrained. Motion, sound, light, and cursor response must each have a curatorial purpose.
- No scroll hijacking.
- No autoplay copyrighted music.
- Reduced-motion and sound-off are first-class paths.
- Artwork provenance stays visible.
- Mobile becomes a guided vertical museum route instead of imitating desktop spatial behavior.

## Exhibition title
**LUMEN / VINCENT — The Painted Night**

Tagline: **Enter through color. Stay for the weather inside the paint.**

## Narrative architecture

### 00 / Threshold — The Painted Night
Purpose: transition from the LUMEN shell into the exhibition.
- Full-screen Starry Night field.
- Oversized title appears as a physical layer in the room.
- Pointer becomes a soft local light, not a novelty cursor.
- One action: Enter the night.
- Sound mode can be enabled here; default is off.

### 01 / Blue — Night as a temperature
Works:
- The Starry Night
- Café Terrace at Night
Intent:
- Blue is treated as atmosphere, distance, and quiet energy.
- Visitor scrubs between two night works.
- The interface reveals date, place, and palette only after the eye has had time to settle.
Interaction:
- horizontal visual field on desktop;
- vertical pair on mobile.

### 02 / Yellow — Heat, field, sun
Works:
- Sunflowers
- Wheat Field with Cypresses
Intent:
- Yellow is not a brand accent. It becomes heat and forward motion.
Interaction:
- cursor/scroll proximity subtly increases luminance and grain;
- no flashing or aggressive saturation.

### 03 / Brush — The image as surface
Work:
- Wheat Field with Cypresses detail
Intent:
- move from composition to paint handling.
Interaction:
- magnifier / crop field;
- brush-rhythm bands;
- optional zoom;
- text labels describe rhythm, direction, density rather than pretending to be scholarly conservation analysis.

### 04 / The Room — Interior as portrait
Work:
- Bedroom in Arles
Intent:
- treat the room as a psychological and spatial object without diagnosing the artist.
Interaction:
- object hotspots become visual anchors;
- no game-like scavenger hunt;
- mobile uses ordered hotspots.

### 05 / Places — A life in movement
Intent:
- connect the paintings to geographic change without turning the experience into a travel map.
- use a compressed route: Nuenen → Paris → Arles → Saint-Rémy → Auvers-sur-Oise.
Interaction:
- abstract path map on desktop;
- ordered stop list on mobile;
- one selected place always has a readable chronology card.

### 06 / Letters — Voice without over-quoting
Intent:
- letters are represented through paraphrased themes and dates.
- avoid long copyrighted modern translations.
- key themes: work, color, weather, persistence, looking.
Interaction:
- a slow typographic corridor;
- visitor can switch “image first / context first”.

### 07 / Vincent — Music room
Reference:
- Don McLean, “Vincent” (1972)
Curatorial reason:
- McLean has explained that the song grew from looking at The Starry Night.
Implementation rule:
- no copied audio file;
- no reproduced lyrics;
- provide an official-source link;
- use an original browser-generated ambient soundscape as the in-experience sound layer.
Sound design:
- room-specific low-volume tones;
- fades between rooms;
- sound is opt-in;
- prefers-reduced-motion does not force sound off, but sound control is always visible.

### 08 / Afterlight — What stays with you
Works:
- Cypresses
- Irises
Intent:
- move from intensity to a calm exit.
Actions:
- Save this path
- Return to Drift
- Explore by Color
- Open artwork provenance

## Visual art direction
Three adjectives:
**Painterly · Nocturnal · Tactile**

### Palette
- Night Ink #07111F
- Gallery Black #090909
- Ultramarine #234B8F
- Cobalt #315FAD
- Wheat #E7B84B
- Ochre #B77A2D
- Faded Rose #C89B9E
- Canvas #F0E8D7

### Typography
- Existing editorial serif remains the exhibition voice.
- Existing neutral grotesk remains metadata/UI.
- Avoid decorative “Van Gogh handwriting” fonts.

### Material language
- film grain
- pigment-like gradients
- soft vignette
- canvas texture simulated with CSS
- directional brush masks
- light bloom only around artwork, never around controls

## 21st.dev usage
Use 21st.dev as a pattern reference, not a component dump.
Target pattern families:
- immersive image gallery
- shared-element / gallery transitions
- cursor spotlight
- shader-like living backgrounds
- kinetic but interruptible image movement
- spatial gallery references

No copied visual identity. No dependency is added unless it materially improves the experience.

## Canva usage
Canva is the visual laboratory, not production source-of-truth.
Deliverables to create there:
- exhibition poster
- room title studies
- texture boards
- motion storyboards
- palette boards
- social/portfolio hero assets
- optional 10–15 second teaser loop

Final interactive experience remains in React/Vite.

## Content and rights strategy
Primary production sources:
- The Met Open Access for clearly marked public-domain works and metadata.
- Wikimedia Commons files only when the file page clearly marks the reproduction public domain / CC0 / free of known restrictions.
- Van Gogh Museum used for research and context; do not assume all of its site imagery is unrestricted.
- Don McLean song: metadata + official-source outbound link only unless a future licensed embed is explicitly permitted.

## Interaction contract
Every effect must serve one of:
- ORIENT
- CONNECT
- REVEAL
- RESPOND
- IMMERSE

If an effect does not serve one of those roles, remove it.

## Accessibility contract
- sound defaults off;
- explicit sound state;
- reduced-motion alternative for every room;
- keyboard reachable chapter navigation;
- visible focus;
- semantic headings;
- images have meaningful alt text;
- no color-only instruction;
- no text below usable reading sizes;
- 44px touch targets on mobile;
- no flashing content;
- no scroll locking.

## Responsive contract
### 1440+
Spatial rooms; artwork may overlap the editorial grid.

### 1024
Keep room identity, reduce overlap and cursor dependence.

### 768
Stack spatial relationships into intentional pairs.

### 390
Single guided vertical route. Room rail becomes horizontal chapter navigation.

## Portfolio evidence
SUPER PROJECT 01 should eventually expose:
- research rationale
- IA
- room journey
- visual system
- sound system
- interaction decisions
- rights/provenance decisions
- accessibility trade-offs
- visual QA
- production implementation

## Milestone 1 — implemented in this branch
- Replace old generic exhibition route with Vincent experience.
- 8-room structure (expanded to 9 rooms in Milestones 2–4).
- public-domain artwork sourcing.
- original browser-generated ambient sound mode.
- responsive chapter rail.
- 21st.dev-inspired, dependency-light interaction primitives.
- Playwright smoke + visual evidence.
- keep the rest of the LUMEN museum shell intact.

## Milestones 2–4 — implemented in this branch
- interactive brush macro viewer with 1×–4× zoom, pointer-set focal origin and keyboard-operable controls;
- place/time journey across Nuenen, Paris, Arles, Saint-Rémy and Auvers-sur-Oise;
- letter network linked to the scholarly Vincent van Gogh Letters edition;
- layered browser-generated ambient sound instead of a single oscillator;
- new smoke and visual-evidence coverage for these interactions.

## Milestone 5 — implemented in this branch
- cultural Thread Navigator that joins artwork → place → letter instead of leaving rooms isolated;
- Arles thread: Café Terrace at Night + Bedroom in Arles → Arles → harvest-period correspondence;
- Saint-Rémy thread: The Starry Night + Wheat Field with Cypresses + Cypresses → Saint-Rémy → letter 806;
- thread-aware jumps focus the relevant place or letter when the visitor enters those rooms;
- “Save this thread” persists locally without requiring an account;
- artwork-level “Follow thread” affordances turn viewing into a non-linear discovery path;
- dedicated desktop/mobile visual evidence and Playwright coverage.

## Later milestones
1. true tiled deep zoom using a museum/IIIF source only if source stability is proven.
2. expand the thread system into artwork-date-place-letter filtering.
3. campaign assets and exhibition poster studies authored in Canva.
4. portfolio case study mode with decision evidence and visual QA.
5. optional WebGL shader only if performance budgets pass.
