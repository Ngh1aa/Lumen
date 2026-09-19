# Information Architecture & Flows — LUMEN

## Primary navigation

- Explore
- Collections
- Artists
- Exhibitions
- Search
- Saved

Secondary:
- Visit
- About
- Motion / accessibility preferences

## Sitemap

```text
LUMEN
├── Home
├── Explore
│   ├── Drift
│   ├── Grid
│   ├── Atlas
│   └── Random
├── Discover
│   ├── By Color
│   └── By Mood
├── Collections
│   ├── Index
│   └── Collection Detail
├── Artwork
│   ├── Artwork Detail
│   └── Zoom / Inspect
├── Artists
│   ├── Index
│   └── Artist Profile
├── Exhibitions
│   ├── Index
│   └── Curated Journey
├── Timeline
├── Search
├── Saved
├── Visit
└── About
```

## Flagship demo flow

```text
HOME
  ↓ Artwork Portal
EXPLORE / DRIFT
  ↓ select artwork
ARTWORK DETAIL
  ↓ "Related through color / mood / movement"
RELATIONSHIP ATLAS
  ↓ follow connection
RELATED ARTWORK
  ↓ save
SAVED COLLECTION
```

Why this flow:
- demonstrates visual craft immediately;
- exposes a real exploration model;
- proves state continuity and relationship reasoning;
- ends with an understandable product action rather than a purely cinematic outro.

## Alternate flow — weak intent

```text
HOME
  ↓ Explore by feeling
MOOD SELECTOR
  ↓ Quiet
CURATED RESULTS
  ↓ inspect
ARTWORK DETAIL
  ↓ continue to artist
ARTIST PROFILE
```

## Recovery / accessibility flow

```text
ANY IMMERSIVE VIEW
  ↓ "Switch to list/grid"
SEMANTIC GRID/LIST
  ↓ keyboard selection
ARTWORK DETAIL
  ↓ back / breadcrumb restores prior context
```

## Key product decisions

| Decision | Rationale | Trade-off |
|---|---|---|
| Exploration modes are explicit | Users understand that Drift/Grid/Atlas are different tools, not random visual changes | Adds a small mode-learning cost |
| Artwork Detail is stable/readable | Cinematic exploration should resolve into a calm information surface | Less visual spectacle on detail page |
| Atlas has a list equivalent | Spatial relationship views are not sufficient for keyboard/mobile/accessibility | Requires maintaining two representations of the same relationship model |
| Color/mood discovery is secondary to core nav | Experimental discovery is valuable but should not erase familiar access paths | Slightly less "radical" first impression |
