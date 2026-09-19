# LUMEN SUPER PROJECT 01 — VINCENT / A LIFE IN COLOR

## North star

Transform LUMEN from a general experimental museum prototype into a flagship **multisensory digital museum platform** with one deeply authored featured exhibition:

> **VINCENT — A Life in Color**

The project must still prove product architecture, collection discovery, accessibility, responsive systems and interaction design. The Van Gogh exhibition is the emotional and visual flagship, not the entire product.

## Product thesis

Most digital museum archives are optimized for known-item search. LUMEN is designed for **weak intent**: people who arrive curious but without a specific work, movement or query.

The permanent collection layer supports:
- Drift
- Grid
- Color
- Mood
- Artwork Detail
- Relationship Atlas
- Saved Collection

The flagship exhibition adds:
- authored narrative pacing
- visual atmosphere
- sensory interaction
- optional soundtrack
- spatial transitions
- room-specific color/motion behavior

## Super-project success criteria

1. The first 10 seconds must feel like entering a museum, not opening a SaaS site.
2. Artwork remains the dominant visual layer; UI recedes.
3. At least three materially different interaction systems are demonstrated:
   - spatial/kinetic discovery
   - color/mood exploration
   - curatorial exhibition storytelling
4. The exhibition works with sound off and reduced motion.
5. Music playback is user-initiated and uses an official licensed platform embed.
6. All artwork media has traceable provenance.
7. No lyrics are reproduced.
8. Mobile is redesigned, not merely collapsed.
9. Browser QA, accessibility checks and visual evidence are required before merge.

## Art direction

### Three words

**Cobalt · Tactile · Luminous**

### Visual signature

- Near-black gallery environment.
- Cobalt / ultramarine night fields.
- Sunflower and gaslight yellow as controlled high-energy accents.
- Raw-canvas / warm-paper surfaces for quiet passages.
- Large paintings with deliberately uneven spatial rhythm.
- Fine archival metadata contrasted with oversized editorial serif.
- Brushstroke-inspired movement without applying fake “Van Gogh filters” to UI.

### Composition families

#### A. Museum Threshold
Portal and exhibition opening.

- full-viewport darkness
- one dominant artwork
- oversized title fragments
- slow reveal
- minimal controls

#### B. Spatial Collection
Drift, Color, Mood, Atlas.

- scattered or kinetic image fields
- proximity reveal
- contextual labels
- relationship-driven continuation

#### C. Archival Object
Grid, Detail, Saved, About.

- stable reading order
- provenance
- technical metadata
- collection tools
- accessible fallback

## Featured exhibition

# VINCENT — A Life in Color

Six rooms. The sequence is emotional rather than biographical-only, but dates and places remain visible.

### 00 — BLUE HOUR / Threshold

Hero:
- The Starry Night
- Self-Portrait

Intent:
Enter through blue, not biography.

Interaction:
- artwork emerges from darkness
- cursor proximity lifts local luminance
- optional soundtrack invitation appears only after the visitor enters

Question:
**What can a color carry before it becomes a symbol?**

### 01 — YELLOW HOUSE / Arles

Works:
- Sunflowers
- Café Terrace at Night
- Oleanders
- Bedroom in Arles

Intent:
Yellow as warmth, hospitality, intensity and constructed interior space.

Interaction:
- warm/cool split field
- image stack expands on hover
- “temperature” control shifts UI illumination, not the artwork image itself

Question:
**When does brightness become emotional pressure?**

### 02 — AFTER DARK / Night

Works:
- Starry Night Over the Rhône
- The Starry Night
- Café Terrace at Night

Intent:
Night is not black. It is blue, reflection and artificial light.

Interaction:
- slow horizontal kinetic gallery
- mirrored reflection layer
- reduced-motion mode becomes a stable sequence

Question:
**How many kinds of light can exist inside one night?**

### 03 — THE MOVING EARTH / Saint-Rémy

Works:
- Cypresses
- Irises
- Self-Portrait

Intent:
Line and brush direction create motion without animation.

Interaction:
- pointer reveals directional stroke map overlays authored by LUMEN
- visual rhythm indicator
- no claim that overlays are museum scholarship

Question:
**Can a still image feel physically unstable?**

### 04 — BLOOM / Renewal

Works:
- Almond Blossom
- Roses
- Irises
- First Steps, after Millet

Intent:
Growth, translation, softness and restart.

Interaction:
- quiet gallery
- generous empty space
- progressive image reveal
- personal note/save action

Question:
**What changes when looking slows down?**

### 05 — THE FIELD / Auvers

Works:
- Wheatfield with Crows
- closing return to The Starry Night

Intent:
End without turning biography into tragedy spectacle.

Interaction:
- full-width field
- paths separate and recombine
- user chooses: continue drifting / save journey / replay exhibition silently

Question:
**Which color follows you out of the room?**

## Soundtrack layer

### Music

**“Vincent” — Don McLean**

Rules:
- user-initiated only
- no autoplay with sound
- no hosted MP3
- no lyric reproduction
- official YouTube embed only
- clearly credited
- soundtrack must be optional
- exhibition must remain complete with sound off
- opening the player never blocks navigation

Implementation:
- fixed “Soundtrack” control
- opens a compact drawer
- official YouTube privacy-enhanced embed
- text-only attribution and reason for inclusion
- Escape closes the drawer

## 21st.dev pattern research

21st.dev is used for **behavior research**, not visual copying.

Relevant pattern families:
- Immersive Scroll Gallery
- Kinetic Scroll Gallery
- Image Reveal
- Shared Element Gallery
- Interactive Image Gallery
- Image Showcase / fanned stack

LUMEN adaptation:
- remove generic cards
- rebuild motion using project tokens
- keep native React/CSS where possible
- only introduce a dependency when the behavior cannot be reproduced cleanly
- retain reduced-motion equivalent

References:
- https://21st.dev/community/components/explore/image-gallery-component
- https://21st.dev/community/components/explore/gallery-component

## Canva production brief

Canva is treated as an **art-direction and media lab**, not the production frontend.

Assets to create:
1. Exhibition key visual — VINCENT / A LIFE IN COLOR.
2. Six room title cards.
3. Grain / canvas texture set.
4. Cobalt-to-black ambient loop.
5. Sunflower-yellow light leak loop.
6. Social / case-study cover.
7. Mobile exhibition poster.
8. Portfolio thumbnail.

Constraints:
- no AI-generated fake Van Gogh paintings
- no modifications that imply original artworks were painted differently
- decorative textures remain clearly separate from source artwork
- export WebP/AVIF where practical
- motion loops under 6–8 seconds and visually seamless

Until final Canva assets exist, the code uses CSS-generated texture/light fields so implementation is not blocked.

## Content provenance

Primary research:
- Van Gogh Museum permanent collection texts and timeline
- The Metropolitan Museum of Art Open Access
- Wikimedia Commons source records
- Don McLean official site
- official Don McLean YouTube channel

Artwork policy:
- prefer public-domain artworks
- link every object to its source
- never imply LUMEN-authored mood/editorial metadata is museum scholarship

Music policy:
- embed, do not redistribute
- no lyrics beyond title
- attribution stays visible

## Responsive strategy

### 1440+
Full spatial composition, sticky soundtrack, asymmetric rooms.

### 1024
Preserve room identity; reduce overlap and parallax amplitude.

### 768
One dominant artwork at a time; horizontal rails become snap galleries.

### 390
Editorial sequence:
- title
- artwork
- short interpretation
- action
No hover dependency. Atlas switches to semantic list.

## Motion contract

Motion is allowed only when it communicates:
- entering a room
- proximity to an object
- continuity between object and detail
- progression through a story
- relationship between works

Never use motion merely because a component can animate.

Reduced motion:
- remove ambient drifting
- disable perspective/parallax
- keep fades under ~150 ms or use instant state changes
- preserve every action and every artwork

## Accessibility

Target: WCAG 2.2 AA for core UI, without claiming formal conformance until manual evaluation is complete.

Required:
- visible focus
- keyboard navigation
- text alternatives
- labeled color choices
- non-audio equivalent for soundtrack experience
- no autoplay audio
- motion setting
- contrast setting
- semantic exhibition chapter navigation
- mobile touch targets

## Delivery stages

### Stage 1 — Content + art direction
- replace generic abstract collection with Van Gogh public-domain set
- update content taxonomy
- lock exhibition narrative
- lock provenance

### Stage 2 — Exhibition implementation
- VINCENT six-room experience
- soundtrack drawer
- room progress
- sensory interactions
- save/continue actions

### Stage 3 — Platform integration
- Portal becomes exhibition threshold
- Grid filters reflect Van Gogh collection
- Color/Mood tuned to paintings
- Detail/Atlas copy updated

### Stage 4 — Visual polish
- texture/light system
- mobile art direction
- interaction repair
- no component-library look

### Stage 5 — QA
- typecheck/build
- Playwright flagship/recovery/mobile
- axe serious/critical sampling
- screenshot evidence 1440/1024/768/390
- manual visual critique
- GitHub Pages deploy verification

## Release gate

Do not merge until:
- build passes
- browser tests pass
- no serious/critical sampled axe violations
- public-domain provenance ledger updated
- soundtrack remains optional/user-controlled
- representative screenshots manually inspected
- GitHub Pages artifact verification passes
