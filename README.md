# LUMEN

**Digital Museum of Visual Culture** — an experimental UI/UX project exploring art through space, motion and meaningful relationships.

> Don't search for art. Drift into it.

## Direction

**Cinematic · Intellectual · Experimental**

LUMEN explores a different archive model: users can move through artworks by color, mood, era, movement, artist and visible relationships instead of relying only on search + category grids.

## Current status

**Multi-view museum prototype.** Everything works except a backend.

LUMEN now behaves like a museum website with deep-linkable views. The original experience (Portal, Drift, Color, Mood, Atlas and the VINCENT exhibition) is the featured front of house.

| View | Route | What it does |
|---|---|---|
| Home | `#/` | The Portal. Drift, exhibitions, mood and collection entry points. |
| Collection | `#/collection` (legacy `#/grid`) | All 20 works. Search, filters (artist, period, medium, theme, palette), sort, grid or list, result count, empty state, reset. Filter state lives in the URL, e.g. `#/collection?artist=Vincent+van+Gogh&view=list`. |
| Artwork | `#/artwork/:id` | Zoomable image (drag, arrow keys, + and −), metadata, editorial reading, licence and source, exhibitions it appears in, documented VINCENT threads and letters, related works, more by the artist, previous and next, Save and Add to set. Unknown ids show a not-found state. |
| Explore | `#/drift`, `#/color`, `#/mood`, `#/atlas/:id` | The original discovery modes. |
| Exhibitions | `#/exhibitions` | Four curated exhibitions. |
| Exhibition | `#/exhibition/:slug`, walk-through `#/exhibition/:slug/:stop` | Overview with stop list, then a stop-by-stop walk (links, arrow keys, progress bar), Save as set at the end. `#/exhibition/vincent` stays the immersive nine-room experience. |
| My collection | `#/my-collection`, `#/my-collection/:setId` (legacy `#/saved`) | Saved works with notes, thread view, share and export. Create, rename and delete named sets, add and remove works. |
| About | `#/about` | Method, sources and accessibility. |

Navigation uses real links, so browser back and forward work. On every page change, focus moves to the page heading and scroll goes to the top, or back to where you were on Back. Changing filters or stops replaces the history entry instead of adding one.

### Data rule: no backend, sessionStorage only

Saved works, sets, private notes and saved VINCENT threads are kept in **sessionStorage** (`lumen-saved`, `lumen-sets`, `lumen-notes`, `lumen-vincent-threads`). They survive route changes and reloads in the same tab and are cleared when the tab closes. **Reset demo data** (footer, and the My collection sidebar) clears them after a confirmation. Display preferences (reduced motion, contrast, onboarding) stay in localStorage because they belong to the device, not the visit.

### Running tests locally

`npm run test:e2e` builds nothing itself; run `npm run build` first. If port 4173 is taken, set `PW_PORT` (e.g. `PW_PORT=4391 npm run test:e2e`).

## Project docs

- [Project context](PROJECT-CONTEXT.md)
- [Open-source reference research](docs/RESEARCH-OPEN-SOURCE.md)
- [Design direction](docs/DESIGN-DIRECTION.md)
- [IA & flows](docs/IA-AND-FLOWS.md)
- [Third-party notices](THIRD_PARTY_NOTICES.md)
- [Agent/project contract](AGENTS.md)

## UIUX workflow

This project uses the UIUX Factory + relevant `skills_UIUX` from:
https://github.com/Ngh1aa/uiux-ai-workspace

Workflow:

```text
Research
→ Product / UX framing
→ IA & flows
→ Art direction
→ Motion & component sourcing
→ Design system
→ Composition
→ Implementation
→ Browser / accessibility / performance QA
→ Visual critique
→ Root-cause repair
→ PR / merge
```

## Open-source stance

Open-source projects are implementation references, not a replacement for original art direction. Any copied or substantially adapted code must be license-checked and recorded in `THIRD_PARTY_NOTICES.md`.


## Deployment

Primary static hosting: **GitHub Pages**  
Live URL: https://ngh1aa.github.io/Lumen/

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Deployment workflow: `.github/workflows/pages.yml`
- Client navigation uses hash routes, so GitHub Pages does not need an SPA fallback rewrite.
- The existing Vercel configuration is kept for compatibility with the current Vercel deployment.
