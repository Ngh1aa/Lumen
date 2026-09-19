# Verification Plan — LUMEN

## Scope

Applies once implementation begins on the visual foundation branch or successor implementation branch.

## Critical journey

```text
Home → Artwork Portal → Drift → Artwork Detail → Atlas → Related Artwork → Save
```

## Risk priorities

| Risk | Priority | Verification |
|---|---:|---|
| signature motion causes disorientation / blocks content | P1 | keyboard + reduced-motion + interruptibility review |
| desktop spatial layout collapses on mobile | P1 | 390 / 768 / 1440 + pressure widths |
| artwork/media crops damage the focal content | P1 | per-asset crop inspection |
| contrast changes when contextual accent changes | P1 | computed/rendered contrast scan + visual review |
| Atlas is pointer-only | P1 | keyboard path + semantic list equivalent |
| experimental effects cause poor performance | P1 | Lighthouse/resource review after implementation |
| visual system becomes generic / effect soup | P1 | side-by-side top-of-page visual critique |

## Responsive matrix

- 390px mobile
- 768px tablet
- 1024px intermediate
- 1440px desktop
- pressure widths around any composition breakpoint discovered during implementation

## Accessibility evidence

Automated:
- axe baseline
- Lighthouse accessibility as supporting evidence only

Manual:
- visible focus
- logical focus order
- all primary actions reachable
- no keyboard trap
- reduced-motion behavior
- semantic alternative for Atlas/spatial views
- image/caption/alt strategy

## Visual QA

Capture and inspect:
1. Home / Portal
2. Drift
3. Artwork Detail
4. Atlas
5. one mobile journey
6. reduced-motion variant of a signature transition

Review:
- 5-second hierarchy
- page-role distinctness
- type rhythm
- alignment
- artwork crop/quality
- contextual color legibility
- motion purpose
- generic/template signals

## Completion rule

No merge to `main` based only on build success. Relevant rendered visual, responsive and accessibility evidence must exist.
