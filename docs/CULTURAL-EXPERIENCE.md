# Cultural Experience Milestone — LUMEN

## Scope

This milestone moves LUMEN from a visual product prototype toward a richer digital-cultural experience without turning the site into an effects reel.

Implemented experiences:

1. **Mood Discovery** — weak-intent exploration by feeling.
2. **Curated Journey** — a chapter-based exhibition called *Signals from a Quiet Machine*.
3. **Richer storytelling objects** — chapter rail, sticky progress, compare scene, interpretive quote, exit choices and object-continuity links back into the collection.

## Reference translation

### Codrops / Motion Primitives / Animata principles

- Use continuity and hierarchy rather than unrelated reveals.
- Keep transformations on opacity/transform where possible.
- No scroll hijacking.
- No decorative infinite animation.
- Reduced-motion keeps all content and navigation available.

### Museum / cultural-product principles

- Stable object detail remains the source-of-truth surface.
- Experimental discovery is additive, not a replacement for browse/search patterns.
- Curatorial language is clearly labeled as LUMEN prototype content.
- Relationship/mood semantics are not presented as source-archive scholarship.

## Mood Discovery

### Product role

User question:

> “I do not know what I am searching for. Can I begin with how I want the experience to feel?”

The interface exposes five prototype paths:

- Electric
- Dreamlike
- Quiet
- Restless
- Radiant

Each mood has:
- a visible text label;
- a short user-intent phrase;
- a conceptual sequence of three works;
- contextual accent color;
- a path into the curated exhibition.

Color is never the only information carrier.

## Curated Journey

### Exhibition

**Signals from a Quiet Machine**

A speculative digital exhibition built from public-domain abstract works and original LUMEN curatorial writing.

Chapters:

1. Signal
2. Friction
3. Interval
4. Contrast
5. Afterimage

### Composition families

- Opening chapter → editorial statement + full object field.
- Friction → offset media / asymmetrical balance.
- Interval → inverted ivory reading surface + quote.
- Contrast → two-object comparison axis.
- Afterimage → closing image + three explicit continuation paths.

### Storytelling mechanics

- Fixed chapter rail on wide screens.
- IntersectionObserver updates current chapter/progress.
- Chapter rail collapses on tablet/mobile.
- Compare chapter is visual, but every object remains a native button with an accessible name.
- Final chapter returns agency through Mood / Atlas / Object Detail.

## Motion contract

| Interaction | Job | Full motion | Reduced motion |
|---|---|---|---|
| Page navigation | Continuity | native View Transition | immediate route update |
| Mood selection | State / hierarchy | surface + accent transition | instant state update |
| Chapter progress | Orientation | short scale transition | no transition |
| Artwork hover | Feedback | small scale/saturation | effectively instant |
| Journey scrolling | Story progression | native document scroll only | same content, no extra motion |

No pinned scroll-jacking or forced scroll velocity is used.

## Evidence boundaries

- Mood paths are an **interaction-design hypothesis**, not museum-authored taxonomy.
- Exhibition text is **original prototype curatorial writing**.
- Artwork media remains public-domain source material documented in `THIRD_PARTY_NOTICES.md`.
- No claim is made that the experience improves engagement, learning or conversion without user testing.

## Vercel readiness

The app uses Vite and hash-based client routing, so Vercel can serve the built `dist` output without SPA rewrite configuration. Expected setup:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Node: 24 is used in repository CI

## QA gate

Required before merge:
- typecheck + production build;
- mood keyboard activation;
- axe serious/critical scan;
- curated journey chapter/exit flow;
- artwork rendering guard;
- 390px overflow check;
- rendered evidence at 1440 / 1024 / 768 / 390 for Mood;
- full Journey evidence at 1440 + 390;
- visual inspection of the comparison chapter.
