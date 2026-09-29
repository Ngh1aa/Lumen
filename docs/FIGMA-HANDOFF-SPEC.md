# LUMEN — Figma System + Handoff Spec

**Status:** source-backed design/implementation contract. This repository currently proves the React/TypeScript implementation, IA, art direction, discovery modes, accessibility targets and browser QA. This file does **not** claim a public editable Figma file already exists.

## 00 — Cover / Prototype Guide

Frame LUMEN as an **experimental digital museum / visual-culture exploration product**, not a landing page.

Primary review task:
**choose discovery mode → find a meaningful artwork → inspect detail → follow a relationship → save → return via reduced-motion/keyboard path**.

Include:
- live prototype;
- source repository;
- case study;
- evidence state: `PLANNED_VALIDATION` until real sessions exist;
- implementation stack: React + TypeScript + Vite.

## 01 — Product Context

Show:
- weak-intent explorer problem;
- highest-value task: discover something meaningful without already knowing an exact artist/work;
- owner objective: make a large collection understandable and worth continuing through;
- hypothesis: relationship/visual-semantic discovery may support exploration better than search-only browsing;
- non-goal: prove engagement/retention without actual behavior data.

## 02 — Research / Assumptions

Separate:
- open-source/reference research;
- collection/artwork provenance;
- `DESK_EVIDENCE`;
- `HYPOTHESIS`;
- `PLANNED_VALIDATION` Round 01;
- `DIRECT_USER`, empty until sessions exist.

Do not fabricate museum visitor quotes, preference percentages or engagement metrics.

## 03 — User Flows

Map:
1. Portal → choose discovery mode.
2. Drift / Grid / Color / Mood → artwork.
3. Artwork Detail → Relationship Atlas → another artwork.
4. Artwork → Save → Saved Collection → return.
5. Exhibition Index → VINCENT exhibition → artwork/context.
6. Reduced-motion / keyboard route through equivalent content.
7. Empty collection / populated collection / 404 recovery.

Annotate orientation cues and fallback routes.

## 04 — Information Architecture

Show the platform as a system:
- Portal;
- Discovery modes: Drift / Grid / Color / Mood;
- Artwork Detail;
- Relationship Atlas;
- Saved Collection;
- Exhibition Index;
- Exhibition Detail / VINCENT;
- About / Method;
- Accessibility settings / special states.

Distinguish **content relationships** from **navigation relationships**.

## 05 — Wireframes

Use black/white/gray only. No artwork color grading or cinematic effects.

Include:
- portal choice architecture;
- each discovery-mode structure;
- artwork detail hierarchy;
- atlas relationship model;
- saved empty/populated states;
- exhibition index;
- mobile transformation;
- reduced-motion/semantic fallback.

The goal is to prove hierarchy and orientation independent of art direction.

## 06 — Explorations / Decisions

Document at least:
- search/grid archive vs cinematic single path vs parallel relationship-driven discovery;
- multiple discovery modes vs one canonical browse mode;
- graph/atlas relationship view vs flat “related works” list;
- cinematic motion vs accessible semantic fallback;
- account-heavy collection management vs lightweight saved collection;
- one-off exhibition vs repeatable exhibition platform/index.

Show ADOPT / ADAPT / REJECT reasoning for external inspiration where relevant.

## 07 — Design System

### Foundations
- gallery-black / archival-ivory surfaces;
- artwork-driven contextual accent rules;
- editorial serif × neutral grotesk typography;
- spacing/grid/rhythm;
- metadata hierarchy;
- focus tokens;
- image crop/provenance rules;
- motion durations/easing and reduced-motion equivalents.

### Components / patterns
- global navigation;
- discovery mode selector;
- artwork card/tile;
- artwork metadata block;
- relationship edge/node/list representation;
- quick preview;
- save control;
- saved collection item;
- exhibition index item;
- accessibility/settings control;
- empty state;
- error/404 state;
- loading/progressive media state if represented.

### States
`default · hover · focus · pressed · selected · saved · unsaved · loading · empty · populated · unavailable/error · reduced-motion` where applicable.

## 08 — Final Screens

Group by experience task, not screen count:
- enter/orient;
- discover;
- inspect;
- connect;
- save/return;
- enter curated exhibition;
- access equivalent experience with reduced motion/keyboard.

Show desktop/mobile where composition changes materially.

## 09 — Prototype

Prototype the Round 01 tasks and keep these paths intentional:
- weak-intent discovery;
- relationship continuation;
- save + return;
- empty/populated collection;
- keyboard path;
- reduced-motion path;
- recovery/404.

The prototype guide should tell a recruiter exactly what to try rather than leaving them to wander without context.

## 10 — Handoff / Specs

Document:
- route/hash behavior and route ownership;
- breakpoints / responsive composition changes;
- artwork image aspect/crop rules;
- metadata overflow/long-title behavior;
- provenance/source-link rules;
- relationship-data assumptions;
- saved-state persistence boundary;
- keyboard order and focus restoration after transitions;
- reduced-motion substitutions for every meaningful transition;
- motion duration/easing;
- media/performance expectations;
- semantic fallback for relationship/spatial visuals;
- platform extension rules for future exhibitions;
- production gaps: real collection CMS/metadata service, persistence/accounts if needed, analytics instrumentation and direct visitor research.

## Review gate

A reviewer-ready LUMEN Figma file should prove three things simultaneously:
1. **visual/art direction quality**;
2. **product/interaction logic** beyond a gallery of screens;
3. **implementation/accessibility handoff depth** that maps cleanly to the React/TypeScript prototype.

Do not publish a placeholder Figma URL. Add the portfolio link only when an editable file actually implements this structure to a reviewer-ready standard.
