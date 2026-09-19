# LUMEN

**Digital Museum of Visual Culture** — an experimental UI/UX project exploring art through space, motion and meaningful relationships.

> Don't search for art. Drift into it.

## Direction

**Cinematic · Intellectual · Experimental**

LUMEN explores a different archive model: users can move through artworks by color, mood, era, movement, artist and visible relationships instead of relying only on search + category grids.

## Current status

**Cultural experience complete / Vercel-ready**

The implemented experience now includes Artwork Portal → Drift / Grid / Color / Mood → Artwork Detail → Relationship Atlas, Saved Collection, and the curated exhibition journey **Signals from a Quiet Machine**. CI, browser QA and rendered visual evidence cover the flagship flows.

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

The project is configured for **Vercel**.

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Client navigation uses hash routes, so no SPA rewrite rule is required.
