# Information Architecture & Flows — LUMEN

**Updated:** 2026-09-19

## Experience model

LUMEN is intentionally scoped to **10 primary screens** plus overlays and special states. The goal is enough product/UX depth for a portfolio case without diluting the visual signature across dozens of shallow routes.

## Primary navigation

- Explore
- Exhibition
- Collection
- Atlas
- About

Explore contains explicit mode switching:
- Drift
- Grid
- Color
- Mood

Global utilities:
- Saved count
- Accessibility settings
- Skip to content

## Ten-screen sitemap

```text
LUMEN
├── 01 Portal                    #/
├── Explore
│   ├── 02 Drift                 #/drift
│   ├── 03 Grid                  #/grid
│   ├── 04 Color                 #/color
│   └── 05 Mood                  #/mood
├── 06 Artwork Detail            #/artwork/:id
├── 07 Relationship Atlas        #/atlas/:id
├── 08 Saved Collection          #/collection
├── 09 Exhibition                #/exhibition
│   └── Signals from a Quiet Machine
└── 10 About / Method            #/about
```

Aliases retained for compatibility:
- `#/chromatic` → Color
- `#/journey` → Exhibition
- `#/saved` → Saved Collection
- `#/method` → About / Method

Unknown hashes resolve to the LUMEN 404 recovery state.

## Overlays and special states

- Quick Preview
- Accessibility Settings
  - Reduced motion
  - Higher contrast
- First-visit onboarding hint
- Drift pause / speed state
- Grid filter states
- Color one-selection / two-selection state
- Saved empty / populated states
- Artwork zoom / fit state
- Atlas relationship filters
- 404 / Lost thread

## Flagship flow

```text
PORTAL
  ↓ Start drifting
DRIFT
  ↓ click artwork
QUICK PREVIEW
  ↓ Open full object
ARTWORK DETAIL
  ↓ Show connections
RELATIONSHIP ATLAS
  ↓ recenter / trace path
RELATED ARTWORK
  ↓ Save
SAVED COLLECTION
```

Why this flow:
- makes the art direction legible immediately;
- demonstrates weak-intent discovery rather than a static gallery;
- adds a low-cost preview before committing to a full detail page;
- makes “why is this related?” inspectable;
- ends with a meaningful personal action.

## Alternate flow — color

```text
PORTAL / DRIFT
  ↓ Color
COLOR
  ↓ choose Oxidized Blue
RANKED CHROMATIC MATCHES
  ↓ optionally choose second swatch
TWO-COLOR INTERSECTION
  ↓ Open object
ARTWORK DETAIL
```

Rules:
- max two selected swatches;
- each swatch has a text name;
- selected state is not communicated by hue alone;
- ranking is prototype color-distance logic, not a museum-authored claim.

## Alternate flow — mood

```text
PORTAL
  ↓ Pick a mood
MOOD
  ↓ Quiet
6-WORK EDITORIAL PATH
  ↓ inspect rationale / object
ARTWORK DETAIL
  ↓ follow Mood thread
RELATED ARTWORK
```

Mood paths:
Quiet · Restless · Tender · Uncanny · Monumental · Luminous · Melancholy · Playful · Ecstatic

Mood metadata is manually authored prototype curation, not algorithmic emotion detection.

## Exhibition flow

```text
PORTAL / DETAIL
  ↓ Enter exhibition
SIGNALS FROM A QUIET MACHINE
  00 Threshold
  01 Hum
  02 Circuit
  03 Noise
  04 Silence
  05 Signal
  ↓
Save this journey
OR Explore by mood
OR Continue drifting from final signal
```

Every chapter includes:
- chapter label and progress;
- 2–4 visual objects where appropriate;
- original curatorial text;
- a reflective question;
- direct object inspection.

No scroll hijacking. Chapter navigation remains user-controlled.

## Saved Collection flow

```text
SAVE OBJECT / TRACE ATLAS / SAVE JOURNEY
  ↓
COLLECTION
  ├── rename collection
  ├── Grid view
  ├── Thread view
  ├── private note per work
  ├── Share as link
  └── Export as image
```

Prototype persistence:
- saved IDs: browser `localStorage`;
- collection name: browser `localStorage`;
- private notes: browser `localStorage`;
- shared link: URL query with saved IDs.

No account/auth claim is made.

## Recovery / accessibility flow

```text
ANY IMMERSIVE VIEW
  ↓ familiar route or Access
GRID / SEMANTIC LIST / REDUCED MOTION
  ↓ keyboard selection
ARTWORK DETAIL
  ↓ back / explicit navigation
PREVIOUS DISCOVERY FAMILY
```

Specific fallbacks:
- Drift reduced-motion → stable grid/list behavior;
- Atlas mobile → Connected Works text equivalent;
- Color → named swatches + text state;
- Quick Preview / Access dialogs → Escape close;
- mobile navigation → persistent four-item bottom dock;
- 404 → Portal or Drift recovery.

## Page-role composition families

### A. Immersive discovery
Portal · Drift · Color · Mood · Atlas

Characteristics:
- artwork is the visual anchor;
- contextual accent follows focused object;
- spatial composition and motion may assist discovery;
- explicit orientation and recovery controls remain visible.

### B. Controlled utility / object
Grid · Artwork Detail · Saved Collection

Characteristics:
- lower motion;
- stronger scan order;
- predictable metadata and actions;
- task completion takes priority over spectacle.

### C. Editorial narrative / trust
Exhibition · About / Method

Characteristics:
- long-form reading rhythm;
- chapter/section structure;
- typography becomes the primary spatial device;
- provenance and method remain explicit.

## Key product decisions

| Decision | Rationale | Trade-off |
|---|---|---|
| Ten primary screens | Enough depth to demonstrate the full discovery loop without documentation/page-count inflation | Some archive utilities such as artist/search indices are deferred |
| Quick Preview between Drift and Detail | Preserves exploratory momentum and reduces route churn | Adds one interaction state to learn |
| Grid remains explicit | Experimental discovery must not trap users who prefer predictable scanning | Slightly less radical than an all-spatial archive |
| Two-color selection only | Expressive enough to demonstrate chromatic intersection without turning Color into a query builder | More complex color mixing is deferred |
| Mood is editorial, not algorithmic | Keeps voice accountable and avoids false inference claims | Requires authored taxonomy |
| Atlas links explain themselves | Makes recommendation logic inspectable | Relationship metadata must be maintained |
| Atlas has semantic list equivalent | Spatial graph alone is insufficient for keyboard/mobile/accessibility | Two synchronized representations |
| Saved Collection stores local notes | Adds ownership and reflection without fake account infrastructure | Data does not sync across devices |
| Exhibition keeps progress + exits | Storytelling should not become a scroll trap | Slightly more visible UI during cinematic moments |
| Accessibility is a global utility | Motion/contrast preferences affect multiple immersive surfaces | Requires cross-screen state ownership |

## Deferred, not forgotten

The broader design inventory may later include Search, Artists, Timeline, Collections Index and Visit. They are **not part of this ten-screen milestone** and should only be added if research or portfolio storytelling shows a concrete need.
