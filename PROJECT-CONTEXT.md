# PROJECT-CONTEXT — LUMEN

## Project identity

- **Project name:** LUMEN
- **Project type:** Multisensory digital museum platform / visual-culture exploration experience
- **Repository:** https://github.com/Ngh1aa/Lumen
- **Current stage:** Super Project 01 / VINCENT implementation → browser/accessibility/visual QA
- **Portfolio role:** First super-project / visual flagship showing product architecture, multisensory interaction, spatial exploration, editorial storytelling, provenance discipline and design-to-code quality.

## Project goal

- **Primary goal:** Create a portfolio-grade miniature digital museum where browsing feels like entering rooms and following color, mood and visual relationships rather than querying a static archive.
- **Flagship exhibition:** **VINCENT — A Life in Color**, a six-room Van Gogh experience with optional user-controlled soundtrack.
- **Success looks like:** A distinctive responsive prototype with strong visual identity, purposeful motion, meaningful discovery mechanics, accessible fallbacks, and enough product/UX depth to defend in a senior-level case study.
- **Primary users:** Curious culture/art explorers, students, visitors who want to discover rather than search precisely.
- **Secondary audience:** Design/product recruiters reviewing the case as evidence of visual craft + interaction design + systems thinking.

## UX / product problem frame

- **Priority user / role:** Explorer with weak or ambiguous intent ("show me something interesting").
- **Highest-value user task:** Discover meaningful artworks and relationships without already knowing an artist, movement or exact keyword.
- **Observed friction / unmet need:** Conventional archives optimize for search/filter taxonomies; exploratory browsing often becomes flat grids or long lists.
- **Owner objective:** Make a large collection understandable, memorable and worth returning to while preserving curatorial credibility.
- **Primary behavior:** Explore → orient → follow a relationship → inspect an artwork → continue via color/mood/era/artist connections.
- **User value:** Faster sense-making, serendipity, stronger contextual understanding.
- **Critical journey:** Home → choose exploration mode → discover artwork → inspect detail → follow relationship → save/continue.
- **Recovery paths:** Grid fallback, search, breadcrumb/back trail, reduced-motion mode, keyboard navigation.
- **Evidence that could change design:** Real museum taxonomy, actual collection metadata, visitor research, performance constraints on low-end mobile.

## Product hypothesis

**ASSUMED / to validate:** If discovery is organized around visual and semantic relationships (mood, color, movement, era, artist) instead of only folders/search, users with weak intent can explore with less cognitive friction and stronger curiosity.

## Success signals

These are **PLANNED signals**, not measured outcomes.

- Entry-to-first-artwork interaction rate.
- Number of relationship hops per session.
- Return to exploration after opening an artwork.
- Saved collection actions.
- Task success for "find something that feels X" in moderated testing.
- Motion/accessibility usability under keyboard and reduced-motion settings.

## Source of truth

- **Project context:** `PROJECT-CONTEXT.md`
- **Research:** `docs/RESEARCH-OPEN-SOURCE.md`
- **Design direction:** `docs/DESIGN-DIRECTION.md`
- **IA / flows:** `docs/IA-AND-FLOWS.md`
- **Third-party provenance:** `THIRD_PARTY_NOTICES.md`
- **Super-project plan:** `docs/VINCENT-SUPERPROJECT-PLAN.md`
- **Implementation source:** `src/App.tsx`, `src/DiscoveryViews.tsx`, `src/CulturalExperience.tsx`, `src/VincentExperience.tsx`, `src/ExperienceLayers.tsx`, `src/styles.css`, `src/experience.css`, `src/vincent.css`.
- **Workflow source:** Ngh1aa/uiux-ai-workspace — AGENTS.md, UIUX Factory and relevant skills_UIUX.

## Technology — locked for this milestone

- **Frontend:** React + TypeScript + Vite
- **Styling:** CSS variables + layered project CSS (`styles.css` base, `experience.css` platform layer, `vincent.css` flagship exhibition layer)
- **Motion:** platform View Transitions + CSS transforms/opacity; no new animation dependency for this milestone
- **Spatial layer:** 2D CSS/SVG for the current milestone; no WebGL dependency
- **Deployment:** GitHub Pages primary; Vercel config retained for compatibility

## Constraints

### Must

- Feel cinematic, intellectual and experimental.
- Have at least one interaction that expresses content relationships, not decoration.
- Preserve a usable non-animated reading/navigation path.
- Support keyboard focus and `prefers-reduced-motion`.
- Use real or credible art metadata instead of lorem ipsum.
- Maintain a clear provenance ledger for copied/adapted open-source code.

### Must not

- Become a neon/cyberpunk AI landing page.
- Become a component showcase.
- Use endless rounded cards / bento grids as the default composition.
- Copy 21st.dev demos/media or any source whose reuse terms have not been verified.
- Present planned metrics or hypothetical user validation as measured outcomes.

## Art-direction north star

**Cobalt · Tactile · Luminous**

Visual signature:
- Gallery-black / raw-canvas base.
- Cobalt/ultramarine night fields with controlled sunflower-yellow light.
- Artwork-driven contextual accent color.
- Editorial serif × neutral grotesk typography.
- Large image fields, asymmetrical editorial pacing, contextual metadata.
- Motion used to orient, connect, reveal or respond.

## Definition of Done — Super Project 01 / VINCENT

The milestone is complete only when:

1. The 10 primary routes are implemented: Portal, Drift, Grid, Color, Mood, Artwork Detail, Relationship Atlas, Saved Collection, Exhibition, About / Method.
2. Quick Preview, onboarding, accessibility settings, empty/populated collection states and 404 are implemented.
3. VINCENT is implemented as a six-room featured exhibition with optional user-initiated official soundtrack embed.
4. 21st.dev and other external sources remain pattern/research inputs unless exact source licensing is independently verified.
5. Public-domain artwork provenance is recorded and each object links back to its source.
6. No song lyrics or hosted audio are included.
7. Build/type checks pass.
8. Playwright covers flagship, alternate, recovery, keyboard, soundtrack and mobile-overflow paths.
9. Automated axe checks are treated as partial evidence, not WCAG conformance proof.
10. Rendered evidence exists at 1440 / 1024 / 768 / 390 and receives manual visual inspection.
11. Reduced-motion and semantic Atlas fallback work without removing content/functionality.
12. No merge to `main` until the relevant implementation + browser + accessibility + visual gates are green or explicitly documented as blocked.
