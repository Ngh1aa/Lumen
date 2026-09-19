# THIRD_PARTY_NOTICES

This file tracks third-party code, patterns and assets that may be incorporated into LUMEN.

**Current state:** external component/code references remain research-only. No 21st.dev, Codrops, Motion Primitives, Animata or React Bits component source has been copied into this milestone.

## Candidate sources

### Codrops — ImageExpansionTypography
- Source: https://github.com/codrops/ImageExpansionTypography
- License: MIT
- Intended use: behavior reference for an expanding artwork/typography portal.
- Status: candidate / not yet copied.

### Codrops — ScrollAnimationsGrid
- Source: https://github.com/codrops/ScrollAnimationsGrid
- License: MIT
- Intended use: behavior reference for scroll-based collection transitions.
- Status: candidate / not yet copied.

### Motion Primitives
- Source: https://github.com/ibelick/motion-primitives
- License: MIT
- Intended use: transition and animated-group primitives.
- Status: candidate / not yet copied.

### Animata
- Source: https://github.com/codse/animata
- License: MIT
- Intended use: functional microinteraction patterns.
- Status: candidate / not yet copied.

### React Bits
- Source: https://github.com/DavidHDev/react-bits
- License: MIT + Commons Clause
- Intended use: isolated visual/motion primitives only.
- Restriction note: do not sell, sublicense or redistribute the component library/components themselves.
- Status: candidate / not yet copied.

### 21st.dev
- Source: https://21st.dev/
- Terms: https://docs.21st.dev/terms
- Intended use: pattern/composition research only unless the exact underlying component and its license are independently verified.
- Status: research only.

## Asset policy

Artwork/media licenses are tracked separately from component-code licenses. Demo images from component repositories are never assumed reusable.


### Wikimedia Commons — Timeastor abstract artworks
- Source collection pages: https://commons.wikimedia.org/
- Files used: Abstract Artwork 0001, 0002, 0004, 0005, 0006, 0007, 0008, 0009, 0010, 0011, 0012, 0015 and 0017.
- License status: each selected file page states that the copyright holder released the work into the public domain (PD-self).
- Intended use: deterministic prototype artwork imagery for visual QA and the LUMEN exploration experience. Palette names, mood labels, themes and editorial readings are LUMEN-authored prototype metadata and are not attributed to Wikimedia or the artist.
- Runtime behavior: images are referenced from Wikimedia's upload host; each object links to its source file page.
- Status: active runtime media source.


## Research-only pattern provenance — 2026-09-19

### 21st.dev pattern registry
- Pages/pattern families inspected: component registry; cursor/image gallery and animated collection pattern listings; motion/navigation editorial material.
- Design use: interaction-behavior research for quick preview, continuity, state-responsive motion and compact controls.
- Code/media status: **no marketplace source code or demo media copied**.
- License rule: exact upstream component must be independently verified before any future source reuse.

### Google Arts & Culture
- Pattern inspected: Explore by time/color and alternative cultural discovery entry points.
- Design use: evidence for treating color as a labelled discovery input alongside familiar navigation.
- Code/media status: research only; no assets or implementation copied.

### Rijksmuseum Collection Online / Rijksstudio concepts
- Pattern inspected: exploratory browsing, personal collections, comparison and Art Explorer concepts.
- Design use: evidence for Saved Collection as a user-owned path rather than a passive bookmark count.
- Code/media status: research only; no assets or implementation copied.

## Runtime source behavior

Some additional Wikimedia assets use Commons `Special:Redirect/file` URLs at runtime to request a practical display width. Each artwork object still preserves a direct source-page URL for provenance.


## Research-only pattern provenance — 2026-09-20 Museum Entry

### 21st.dev
- Sources inspected: current image-gallery, animated/card-stack and cursor/spotlight pattern collections; 21st.dev editorial guidance on spotlight/card pointer performance.
- Design use: shared-image continuity, controlled image-stack hierarchy and one container-level spotlight response for the Museum Entry current-exhibition field.
- Code/media status: **research only**. No 21st.dev marketplace source code, prompt output, demo media, iconography or palette is copied.
- Implementation: local React/CSS using existing LUMEN tokens and platform APIs; no new dependency introduced.
