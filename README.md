# LUMEN

**Digital Museum of Visual Culture** — an experimental UI/UX project exploring art through space, motion and meaningful relationships.

> Don't search for art. Drift into it.

## Direction

**Cinematic · Intellectual · Experimental**

LUMEN explores a different archive model: users can move through artworks by color, mood, era, movement, artist and visible relationships instead of relying only on search + category grids.

## Current status

**Museum platform expansion / Exhibition Index in review**

The implemented experience includes Artwork Portal → Drift / Grid / Color / Mood → Artwork Detail → Relationship Atlas, Saved Collection, and **SUPER PROJECT 01 — VINCENT / The Painted Night**. The current milestone adds a platform-level **Museum Entry / Exhibition Index** so LUMEN can hold multiple authored exhibitions without collapsing the museum and a single show into the same navigation level.

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
