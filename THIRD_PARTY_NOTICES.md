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
- **Correction (2026-11-12):** VINCENT previously loaded `File:Vincent_van_Gogh_-_Cafe_Terrace_at_Night_(1888).jpg`, which is the Dallas Museum of Art reed-pen *drawing* of the subject, while its alt text and wall text describe the yellow-and-blue oil painting. All uses now point at the Kröller-Müller oil painting file above. This is a replacement image; it is public domain and logged here.
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


### Wikimedia Commons / museum open access — Vincent van Gogh paintings (logged 2026-11-12)

These seven paintings were already shown in the VINCENT exhibition. From this change on they are also records in the open Collection, the artwork pages and the exhibition walk-throughs. Apart from the Café Terrace correction below, no new image files were introduced. Licence status was checked on each Commons file page on 2026-11-12.

| Work | Commons file | Holding institution (per file page) | Licence on file page |
|---|---|---|---|
| Sunflowers, 1887 | `File:Van_Gogh,_Sunflowers,_1887.jpg` | The Metropolitan Museum of Art, New York (49.41) | Public domain (artist died 1890); Public Domain Mark 1.0 |
| Café Terrace at Night, September 1888 | `File:Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_(Yorck).jpg` | Kröller-Müller Museum, Otterlo (KM 108.565) | Public domain (PD-Art, Yorck Project); Public Domain Mark 1.0 |
| Bedroom in Arles, 1889 (third version) | `File:Vincent_van_Gogh_-_Van_Gogh's_Bedroom_in_Arles_-_Google_Art_Project.jpg` | Musée d'Orsay, Paris | Public domain (PD-Art, PD-old-100); Public Domain Mark 1.0 |
| The Starry Night, 1889 | `File:TheStarryNightByVincentVanGogh.jpg` | The Museum of Modern Art, New York | Public domain (artist died 1890); Public Domain Mark 1.0 |
| Wheat Field with Cypresses, 1889 | `File:Wheat_Field_with_Cypresses_MET_DT1567.jpg` | The Metropolitan Museum of Art (1993.132) | CC0 1.0 (Met Open Access) |
| Cypresses, 1889 | `File:Vincent_van_Gogh_Cypresses_1889.jpg` | The Metropolitan Museum of Art | CC0 1.0 (Met Open Access) |
| Irises, 1890 | `File:Vincent_van_Gogh_-_Irises_(1890).jpg` | The Metropolitan Museum of Art (58.187) | Public domain (PD-Art, PD-old-100); Public Domain Mark 1.0 |

- **Correction (2026-11-12):** VINCENT previously loaded `File:Vincent_van_Gogh_-_Cafe_Terrace_at_Night_(1888).jpg`, which is the Dallas Museum of Art reed-pen *drawing* of the subject, while its alt text and wall text describe the yellow-and-blue oil painting. All uses now point at the Kröller-Müller oil painting file above. This is a replacement image; it is public domain and logged here.
- Runtime behavior: images are requested through `Special:Redirect/file/<name>?width=1600`, which serves a Wikimedia-generated rendition of the same file.
- Mood labels, palette names, themes, exhibition groupings and pairings with the Timeastor works are LUMEN-authored editorial metadata. They do not claim influence or museum endorsement.
- The Starry Night file page's structured data lists CC BY-SA 4.0 while its licensing section states the Public Domain Mark; the painting itself is out of copyright and the reproduction is a faithful 2D copy (PD-Art), so LUMEN treats it as public domain and links to the file page.
