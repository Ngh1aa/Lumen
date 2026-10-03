# LUMEN — Senior pass / 2026-09-21

Status: AGENT-SELECTED — Direction 1 — review required before merge.

## Direction research

### Direction 1 — Living Museum Publication — SELECTED
**Cinematic · Intellectual · Exploratory**

3-second feeling: an art publication has become a navigable room.
Hero moment: artwork remains the continuity object when entering VINCENT.
Color: museum black + archival ivory + wheat/cobalt state accents.
Type: editorial serif for exhibition voice; neutral grotesk for controls/metadata.
Signature: visible relationship rationale + editorial index marks.
Anti-AI rule: no glassmorphism, neon, generic bento, endless rounded cards or decorative motion loops.
Sources adapted: 21st.dev gallery/lightbox interaction principles; Animata image/text reveal behavior; Flux UI token/reduced-motion discipline. No source code copied.
Weakness: can become visually dense if metadata is not disciplined.

### Direction 2 — Chromatic Observatory
**Luminous · Spatial · Analytical**
Hero: collection reorganizes around color bands and visual distance.
Risk: could over-index on data-viz and weaken curatorial voice.

### Direction 3 — Archival Thread Room
**Tactile · Scholarly · Intimate**
Hero: letters, works and places form a quiet editorial thread.
Risk: less immediate visual impact for portfolio first impression.

## Completion criteria
1. Exhibition index offers at least three understandable entry intents rather than one hero CTA.
2. VINCENT explicitly explains why the exhibition/relationship model exists.
3. Structural improvement changes discovery/IA, not only surface styling.
4. Keyboard focus remains visible on new interactive controls.
5. Mobile turns the entry rail into a readable vertical sequence with >=44px targets.
6. Reduced-motion removes non-essential transition behavior.
7. No external component code is copied; provenance remains explicit.
8. Existing VINCENT route and Explore recovery remain intact.

## Decision ledger

| Decision | Alternative | Trade-off | Success signal |
|---|---|---|---|
| Add intent-based entry rail | one cinematic CTA | more UI before feature | users can choose story vs drift vs relation without knowing route names |
| Keep artwork as continuity object | full-page transition effect | less spectacular than global motion | route change remains understandable under motion and reduced motion |
| Add plain-language design rationale | hide method in About | more editorial text | reviewer can see product reasoning in the experience itself |
| Preserve stable Explore exit | immersive lock-in | slightly less theatrical | no dead-end; recovery is always explicit |
| Local CSS extension | new animation/UI dependency | fewer ready-made effects | smaller dependency surface and clearer provenance |
| Keep concept wings visibly unpublished | fabricate future exhibitions | less apparent catalogue breadth | truthfulness remains defensible in interview |

## Structural before → after

Before: exhibition index primarily presented a platform manifesto + VINCENT feature + future wings.
After: index begins with three user intents (curated story / serendipitous drift / relationship tracing), then explains the active exhibition's product hypothesis and recovery/accountability model before the platform universe.

## Verification plan

Required before READY:
- `npm run typecheck`
- `npm run build`
- `npm run test:e2e`
- rendered QA at 375 / 768 / 1440
- keyboard Tab / Shift+Tab / Enter / Escape where relevant
- console/runtime check
- reduced-motion check
- visual squint + AI-look review

Connector-only mutation cannot truthfully claim rendered/browser verification. Until CI/browser evidence exists, status remains NEEDS WORK / UNKNOWN for rendered gates.

## External research provenance

- 21st.dev: gallery accessibility/performance patterns and gallery interaction taxonomy; inspiration only.
- Animata: image reveal / text-hover interaction patterns; inspiration only. Site states MIT licensing, but no component source was copied in this pass.
- Flux UI: token-driven/reduced-motion component principles; inspiration only. No source copied.
