import { CSSProperties, useMemo, useState } from 'react';
import { Artwork } from './artworks';

function transitionStyle(id: string): CSSProperties {
  return { viewTransitionName: `artwork-${id}` } as CSSProperties;
}

type CommonProps = {
  artworks: Artwork[];
  onOpen: (artwork: Artwork) => void;
  onDrift: () => void;
  onGrid: () => void;
  onChromatic: () => void;
};

export function GridView({ artworks, onOpen, onDrift, onGrid, onChromatic }: CommonProps) {
  return (
    <section className="collection-view" aria-labelledby="grid-title">
      <div className="collection-intro">
        <div>
          <p className="eyebrow">Explore / Grid</p>
          <h1 id="grid-title">See the whole<br /><em>collection.</em></h1>
        </div>
        <p>
          Grid is the predictable counterpart to Drift: lower motion, stable scan order and direct access
          to every object.
        </p>
      </div>

      <ModeSwitch active="grid" onDrift={onDrift} onGrid={onGrid} onChromatic={onChromatic} />

      <div className="grid-gallery" aria-label="Artwork collection grid">
        {artworks.map((artwork, index) => (
          <article className="grid-card" key={artwork.id}>
            <button onClick={() => onOpen(artwork)} aria-label={`Open ${artwork.title}`}>
              <span className="grid-image" style={{ '--card-accent': artwork.accent } as CSSProperties}>
                <img
                  src={artwork.image}
                  alt={artwork.alt}
                  loading={index > 3 ? 'lazy' : 'eager'}
                  style={transitionStyle(artwork.id)}
                />
              </span>
              <span className="grid-card-meta">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span><strong>{artwork.title}</strong>{artwork.artist}</span>
                <span>{artwork.mood}</span>
              </span>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ChromaticView({ artworks, onOpen, onDrift, onGrid, onChromatic }: CommonProps) {
  const [selectedId, setSelectedId] = useState('');
  const active = useMemo(
    () => artworks.find((item) => item.id === selectedId) || artworks[0],
    [artworks, selectedId],
  );

  if (!active) {
    return <section className="chromatic-view"><p>Loading chromatic index…</p></section>;
  }

  return (
    <section
      className="chromatic-view"
      aria-labelledby="chromatic-title"
      style={{ '--chromatic': active.accent } as CSSProperties}
    >
      <div className="chromatic-intro">
        <p className="eyebrow">Discover / Color</p>
        <h1 id="chromatic-title">Browse the<br /><em>spectrum.</em></h1>
        <p>
          Color becomes a navigational object. Pick a swatch to shift focus without leaving the
          collection context.
        </p>
      </div>

      <ModeSwitch active="chromatic" onDrift={onDrift} onGrid={onGrid} onChromatic={onChromatic} />

      <div className="chromatic-rail" aria-label="Chromatic artwork index">
        {artworks.map((artwork, index) => {
          const selected = artwork.id === active.id;
          return (
            <button
              key={artwork.id}
              className={selected ? 'is-selected' : ''}
              aria-pressed={selected}
              onClick={() => setSelectedId(artwork.id)}
              style={{ '--swatch': artwork.accent } as CSSProperties}
            >
              <span className="swatch" aria-hidden="true" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{artwork.mood}</span>
            </button>
          );
        })}
      </div>

      <div className="chromatic-stage">
        <div className="chromatic-copy">
          <span className="chromatic-index">Selected / {active.id.replace('abstract-', '')}</span>
          <h2>{active.title}</h2>
          <p>{active.artist} · {active.date}</p>
          <p className="chromatic-note">
            The accent field follows the selected object; metadata remains stable so color never becomes
            the only carrier of meaning.
          </p>
          <button className="chromatic-open" onClick={() => onOpen(active)}>
            Open object <span aria-hidden="true">↗</span>
          </button>
        </div>

        <button className="chromatic-art" onClick={() => onOpen(active)} aria-label={`Open ${active.title}`}>
          <span style={{ '--card-accent': active.accent } as CSSProperties}>
            <img src={active.image} alt={active.alt} style={transitionStyle(active.id)} />
          </span>
        </button>
      </div>
    </section>
  );
}

export function SavedView({
  artworks,
  savedIds,
  onOpen,
  onRemove,
  onExplore,
}: {
  artworks: Artwork[];
  savedIds: string[];
  onOpen: (artwork: Artwork) => void;
  onRemove: (id: string) => void;
  onExplore: () => void;
}) {
  const savedArtworks = artworks.filter((artwork) => savedIds.includes(artwork.id));

  return (
    <section className="saved-view" aria-labelledby="saved-title">
      <div className="saved-head">
        <div>
          <p className="eyebrow">Personal collection</p>
          <h1 id="saved-title">Saved<br /><em>objects.</em></h1>
        </div>
        <p>{savedArtworks.length} {savedArtworks.length === 1 ? 'work' : 'works'} held in this browser.</p>
      </div>

      {savedArtworks.length === 0 ? (
        <div className="saved-empty">
          <span>00 / saved</span>
          <h2>Nothing held<br /><em>yet.</em></h2>
          <p>Save an object when something is worth returning to. Your collection stays local to this prototype.</p>
          <button onClick={onExplore}>Return to Drift <span aria-hidden="true">↗</span></button>
        </div>
      ) : (
        <div className="saved-grid">
          {savedArtworks.map((artwork, index) => (
            <article key={artwork.id}>
              <button className="saved-art" onClick={() => onOpen(artwork)}>
                <img src={artwork.image} alt={artwork.alt} loading={index > 3 ? 'lazy' : 'eager'} style={transitionStyle(artwork.id)} />
              </button>
              <div className="saved-meta">
                <div><span>{String(index + 1).padStart(2, '0')}</span><strong>{artwork.title}</strong></div>
                <button onClick={() => onRemove(artwork.id)}>Remove</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function ModeSwitch({
  active,
  onDrift,
  onGrid,
  onChromatic,
}: {
  active: 'drift' | 'grid' | 'chromatic';
  onDrift: () => void;
  onGrid: () => void;
  onChromatic: () => void;
}) {
  return (
    <div className="mode-strip discovery-mode-strip" role="group" aria-label="Explore mode">
      <span>Mode</span>
      <button className={active === 'drift' ? 'is-active' : ''} onClick={onDrift}>Drift</button>
      <button className={active === 'grid' ? 'is-active' : ''} onClick={onGrid}>Grid</button>
      <button className={active === 'chromatic' ? 'is-active' : ''} onClick={onChromatic}>Color</button>
    </div>
  );
}
