import { useEffect } from 'react';
import { Artwork } from './artworks';

export function AboutView({
  onExplore,
  onColor,
  onMood,
  onExhibition,
}: {
  onExplore: () => void;
  onColor: () => void;
  onMood: () => void;
  onExhibition: () => void;
}) {
  return (
    <article className="about-view" aria-labelledby="about-title">
      <header className="about-hero">
        <p className="eyebrow">About / Method</p>
        <h1 id="about-title">A museum for<br /><em>weak intent.</em></h1>
        <p className="about-lede">
          LUMEN is an experimental digital museum for people who do not arrive with the name of an artist,
          a movement or an exact keyword. It treats discovery as a path through visible relationships.
        </p>
      </header>

      <section className="method-grid" aria-label="How LUMEN works">
        <article>
          <span>01 / Drift</span>
          <h2>Follow attention.</h2>
          <p>Spatial scale and editorial pacing help an object catch your eye before taxonomy asks you to name it.</p>
          <button onClick={onExplore}>Start drifting ↗</button>
        </article>
        <article>
          <span>02 / Color</span>
          <h2>Follow a wavelength.</h2>
          <p>Color is a navigation input with text labels and a two-color intersection, never the only carrier of meaning.</p>
          <button onClick={onColor}>Open Color ↗</button>
        </article>
        <article>
          <span>03 / Mood</span>
          <h2>Follow a feeling.</h2>
          <p>Mood paths are editorially assigned prototype metadata. They are invitations, not algorithmic claims about artworks.</p>
          <button onClick={onMood}>Choose a mood ↗</button>
        </article>
        <article>
          <span>04 / Atlas</span>
          <h2>Follow a reason.</h2>
          <p>Connections stay explainable: color, era, movement and theme each expose why another object appears nearby.</p>
        </article>
      </section>

      <section className="about-section about-section--split">
        <div>
          <p className="eyebrow">Curation model</p>
          <h2>Human voice first.<br /><em>Machine logic second.</em></h2>
        </div>
        <div className="about-copy">
          <p>
            The prototype uses manually authored mood labels, editorial notes and relationship explanations.
            Dominant color and metadata can be semi-automated later, but the experience keeps curatorial intent visible.
          </p>
          <p>
            Current prototype imagery is public-domain work hosted by Wikimedia Commons. The data layer is intentionally
            shaped so museum open-access sources such as The Met, Art Institute of Chicago, Rijksmuseum and Cleveland
            Museum of Art can replace or extend it without rewriting the interaction model.
          </p>
        </div>
      </section>

      <section className="about-section about-sources" aria-labelledby="sources-title">
        <div>
          <p className="eyebrow">Open access / credits</p>
          <h2 id="sources-title">The object keeps<br /><em>its source.</em></h2>
        </div>
        <div>
          <p>Every artwork detail links back to its source record and states the prototype license/provenance model.</p>
          <ul>
            <li><strong>Prototype media</strong><span>Wikimedia Commons / public-domain records</span></li>
            <li><strong>Expansion candidates</strong><span>The Met Open Access · AIC API · Rijksmuseum · Cleveland Museum of Art</span></li>
            <li><strong>Interaction research</strong><span>21st.dev pattern registry · museum collection interfaces · open-source references logged in project docs</span></li>
          </ul>
        </div>
      </section>

      <section className="about-section about-access" aria-labelledby="access-title">
        <div>
          <p className="eyebrow">Accessibility commitment</p>
          <h2 id="access-title">Wonder without<br /><em>locking anyone out.</em></h2>
        </div>
        <div>
          <p>
            Core navigation targets WCAG 2.2 AA. Motion-heavy surfaces have a reduced-motion path, Atlas has a semantic
            list equivalent, color choices have names, focus remains visible and touch controls remain usable on mobile.
          </p>
          <button className="text-link" onClick={onExhibition}>Enter the exhibition ↗</button>
        </div>
      </section>
    </article>
  );
}

export function QuickPreview({
  artwork,
  isSaved,
  onClose,
  onOpen,
  onSave,
}: {
  artwork?: Artwork;
  isSaved: boolean;
  onClose: () => void;
  onOpen: () => void;
  onSave: () => void;
}) {
  useEffect(() => {
    if (!artwork) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [artwork, onClose]);

  if (!artwork) return null;

  return (
    <div className="preview-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className="quick-preview" role="dialog" aria-modal="true" aria-labelledby="preview-title">
        <button className="preview-close" onClick={onClose} aria-label="Close quick preview">Close ×</button>
        <div className="preview-art">
          <img src={artwork.image} alt={artwork.alt} />
        </div>
        <div className="preview-copy">
          <p className="eyebrow">Quick preview / {artwork.date}</p>
          <h2 id="preview-title">{artwork.title}</h2>
          <p className="preview-artist">{artwork.artist}</p>
          <div className="preview-tags">
            <span>{artwork.movement}</span><span>{artwork.paletteName}</span><span>{artwork.mood}</span>
          </div>
          <p>{artwork.editorial}</p>
          <div className="preview-actions">
            <button onClick={onSave}>{isSaved ? 'Saved ✓' : 'Save +'}</button>
            <button onClick={onOpen}>Open full object ↗</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export function AccessibilityPanel({
  open,
  reducedMotion,
  highContrast,
  onClose,
  onMotionToggle,
  onContrastToggle,
}: {
  open: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
  onClose: () => void;
  onMotionToggle: () => void;
  onContrastToggle: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="settings-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.currentTarget === event.target) onClose();
    }}>
      <section className="access-panel" role="dialog" aria-modal="true" aria-labelledby="access-panel-title">
        <div className="access-panel-head">
          <div>
            <p className="eyebrow">Accessibility settings</p>
            <h2 id="access-panel-title">Adjust the room.</h2>
          </div>
          <button onClick={onClose} aria-label="Close accessibility settings">×</button>
        </div>
        <button className="setting-row" onClick={onMotionToggle} aria-pressed={reducedMotion}>
          <span><strong>Reduced motion</strong><small>Turns spatial drift into a stable reading path and shortens transitions.</small></span>
          <span>{reducedMotion ? 'On' : 'Auto'}</span>
        </button>
        <button className="setting-row" onClick={onContrastToggle} aria-pressed={highContrast}>
          <span><strong>Higher contrast</strong><small>Raises text, line and control contrast while preserving artwork color.</small></span>
          <span>{highContrast ? 'On' : 'Off'}</span>
        </button>
        <p className="access-panel-note">System prefers-reduced-motion is respected even when the manual setting is left on Auto.</p>
      </section>
    </div>
  );
}

export function OnboardingHint({
  open,
  onDismiss,
}: {
  open: boolean;
  onDismiss: () => void;
}) {
  if (!open) return null;
  return (
    <aside className="onboarding-hint" aria-label="First visit tip">
      <span>First visit</span>
      <p>Drift is for wandering. Use Grid whenever you want order, or open Accessibility to quiet the motion.</p>
      <button onClick={onDismiss}>Got it</button>
    </aside>
  );
}

export function NotFoundView({ onHome, onExplore }: { onHome: () => void; onExplore: () => void }) {
  return (
    <section className="not-found" aria-labelledby="not-found-title">
      <p className="eyebrow">404 / Lost thread</p>
      <h1 id="not-found-title">This path<br /><em>faded out.</em></h1>
      <p>The collection is still here. Return to the portal or let another object pull you back in.</p>
      <div>
        <button onClick={onHome}>Return to Portal</button>
        <button onClick={onExplore}>Start drifting ↗</button>
      </div>
    </section>
  );
}
