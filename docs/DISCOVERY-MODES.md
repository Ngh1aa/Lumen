# LUMEN — Discovery Modes Milestone

## Why this milestone exists

The first shipped slice proves the core relationship journey:

```text
Portal → Drift → Artwork Detail → Relationship Atlas
```

The next milestone broadens exploration without turning LUMEN into a feature catalog.

Two tensions drive the work:

1. **Experimental discovery vs. predictable browsing.**
2. **Visual richness vs. recoverable state.**

## Scope

### 1. Grid
A stable, low-motion collection view for users with stronger intent.

Purpose:
- provide the familiar fallback promised by the product thesis;
- make all works scannable at once;
- preserve direct path to Artwork Detail.

### 2. Chromatic Explorer
A visual-first way to browse the same collection through color families.

Purpose:
- make color a navigational object rather than a decorative theme;
- create a signature interaction distinct from Drift and Atlas;
- test whether a visual attribute can support weak-intent discovery.

### 3. Saved Collection
A utility surface that gives exploration an end-state.

Purpose:
- preserve user selections across the prototype;
- demonstrate empty/populated states;
- prove that the visual system can support a calmer utility page.

## Interaction principles

- No new dependency solely for animation.
- Reuse the existing object-continuity navigation model.
- Motion may **orient, connect, reveal or respond** only.
- Grid is intentionally calmer than Drift.
- Chromatic Explorer may be more expressive, but must preserve labels, keyboard access and reduced-motion behavior.
- Saved remains low-motion and utility-first.

## Composition families

### Grid
```text
TITLE / result count / mode controls
────────────────────────────────────
[ artwork ] [ artwork ] [ artwork ]
metadata    metadata    metadata
```

### Chromatic Explorer
```text
CHROMATIC INDEX
VIOLET ─ BLUE ─ CYAN ─ GREEN ─ WARM

       [artwork]
  [artwork]        [artwork]

selected color family → visible set
```

Desktop uses a field composition.
Mobile collapses to a vertical sequence grouped by color family.

### Saved
```text
SAVED / count

if empty:
  one strong empty-state statement + return to Explore

if populated:
  semantic collection grid with remove/save state
```

## QA additions

- routes render at 1440 / 768 / 390;
- Grid has no horizontal overflow;
- Chromatic filters remain keyboard-usable;
- Saved empty and populated states are both exercised;
- image guard still covers every rendered artwork;
- no serious/critical axe violations on the new route family.
