import { CSSProperties, useMemo, useState } from 'react';
import { Artwork, colorDistance as distance } from './artworks';

function transitionStyle(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
}

type CommonProps = {
  artworks: Artwork[];
  onOpen: (artwork: Artwork) => void;
  onDrift: () => void;
  onGrid: () => void;
  onChromatic: () => void;
};

export function ChromaticView({ artworks, onOpen, onDrift, onGrid, onChromatic }: CommonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selected = selectedIds.map((id) => artworks.find((item) => item.id === id)).filter((item): item is Artwork => Boolean(item));
  const primary = selected[0] || artworks[0];
  const secondary = selected[1];

  const ranked = useMemo(() => {
    if (!primary) return artworks;
    return [...artworks].sort((a, b) => {
      const aScore = secondary ? (distance(a.accent, primary.accent) + distance(a.accent, secondary.accent)) / 2 : distance(a.accent, primary.accent);
      const bScore = secondary ? (distance(b.accent, primary.accent) + distance(b.accent, secondary.accent)) / 2 : distance(b.accent, primary.accent);
      return aScore - bScore;
    });
  }, [artworks, primary, secondary]);

  if (!primary) {
    return <section className="chromatic-view"><p>Loading chromatic index…</p></section>;
  }

  const toggleColor = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((value) => value !== id);
      if (current.length < 2) return [...current, id];
      return [current[1], id];
    });
  };

  return (
    <section
      className="chromatic-view"
      aria-labelledby="chromatic-title"
      style={{ '--chromatic': primary.accent, '--chromatic-2': secondary?.accent || primary.accent } as CSSProperties}
    >
      <div className="chromatic-intro">
        <div>
          <p className="eyebrow">Discover / Color</p>
          <h1 id="chromatic-title">Start with<br /><em>a color.</em></h1>
        </div>
        <p>
          Choose one color to find nearby visual temperatures, or select two to surface works that sit between them.
          Every swatch has a text label, so the interaction never relies on color alone.
        </p>
      </div>

      <ModeSwitch active="chromatic" onDrift={onDrift} onGrid={onGrid} onChromatic={onChromatic} />

      <div className="chromatic-rail chromatic-rail--scroll" aria-label="Chromatic artwork index">
        {artworks.map((artwork, index) => {
          const selectedColor = selectedIds.includes(artwork.id);
          return (
            <button
              key={artwork.id}
              className={selectedColor ? 'is-selected' : ''}
              aria-pressed={selectedColor}
              onClick={() => toggleColor(artwork.id)}
              style={{ '--swatch': artwork.accent } as CSSProperties}
            >
              <span className="swatch" aria-hidden="true" />
              <span>{String(index + 1).padStart(2, '0')}</span>
              <span>{artwork.paletteName}</span>
            </button>
          );
        })}
      </div>

      <div className="color-selection-note" role="status">
        {secondary
          ? 'Intersection: ' + primary.paletteName + ' × ' + secondary.paletteName
          : 'Selected: ' + primary.paletteName + ' · choose one more color for an intersection'}
      </div>

      <div className="chromatic-stage">
        <div className="chromatic-copy">
          <span className="chromatic-index">Closest match / {primary.id.replace('abstract-', '')}</span>
          <h2>{primary.title}</h2>
          <p>{primary.artist} · {primary.date}</p>
          <p className="chromatic-note">
            {secondary
              ? 'Works below are ranked by their average distance from both selected prototype swatches.'
              : 'Works below are ranked by visual proximity to this prototype dominant-color swatch.'}
          </p>
          <button className="chromatic-open" onClick={() => onOpen(primary)}>
            Open object <span aria-hidden="true">↗</span>
          </button>
        </div>

        <button className="chromatic-art" onClick={() => onOpen(primary)} aria-label={'Open ' + primary.title}>
          <span style={{ '--card-accent': primary.accent } as CSSProperties}>
            <img src={primary.image} alt={primary.alt} style={transitionStyle(primary.id)} />
          </span>
        </button>
      </div>

      <div className="chromatic-ranked" aria-label="Closest chromatic matches">
        {ranked.slice(0, 6).map((artwork, index) => (
          <button key={artwork.id} onClick={() => onOpen(artwork)}>
            <img src={artwork.image} alt="" />
            <span><b>{String(index + 1).padStart(2, '0')}</b><strong>{artwork.title}</strong><small>{artwork.paletteName}</small></span>
          </button>
        ))}
      </div>

      <section className="chromatic-essay museum-reveal" aria-labelledby="chromatic-essay-title">
        <div className="chromatic-spectrum" aria-hidden="true">
          {ranked.slice(0, 8).map((artwork) => <i key={artwork.id} style={{ background: artwork.accent }} />)}
        </div>
        <div>
          <p className="eyebrow">Color is not a filter</p>
          <h2 id="chromatic-essay-title">It is a way<br /><em>to move.</em></h2>
        </div>
        <p>
          LUMEN keeps color relational: each choice changes the field around it instead of collapsing the collection into
          a rigid category. The swatches remain named so the path also makes sense without color perception.
        </p>
      </section>
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
      <button className={active === 'grid' ? 'is-active' : ''} onClick={onGrid}>Collection</button>
      <button className={active === 'chromatic' ? 'is-active' : ''} onClick={onChromatic}>Color</button>
    </div>
  );
}
