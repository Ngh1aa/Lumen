import { CSSProperties, useMemo, useState } from 'react';
import { Artwork } from './artworks';

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

function rgb(hex: string) {
  const value = hex.replace('#', '');
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function distance(a: string, b: string) {
  const aa = rgb(a);
  const bb = rgb(b);
  return Math.sqrt((aa.r - bb.r) ** 2 + (aa.g - bb.g) ** 2 + (aa.b - bb.b) ** 2);
}

function isWarm(accent: string) {
  const value = rgb(accent);
  return value.r > value.b * 1.08;
}

export function GridView({ artworks, onOpen, onDrift, onGrid, onChromatic }: CommonProps) {
  const [palette, setPalette] = useState<'all' | 'cool' | 'warm'>('all');
  const visible = useMemo(
    () => artworks.filter((artwork) => palette === 'all' || (palette === 'warm' ? isWarm(artwork.accent) : !isWarm(artwork.accent))),
    [artworks, palette],
  );

  return (
    <section className="collection-view" aria-labelledby="grid-title">
      <div className="collection-intro">
        <div>
          <p className="eyebrow">Explore / Grid</p>
          <h1 id="grid-title">Prefer order?<br /><em>Browse the collection.</em></h1>
        </div>
        <p>
          Grid is the predictable counterpart to Drift: original aspect ratios, stable scan order and direct access
          to every object. It is also the recovery path when spatial browsing feels too loose.
        </p>
      </div>

      <ModeSwitch active="grid" onDrift={onDrift} onGrid={onGrid} onChromatic={onChromatic} />

      <div className="grid-browser">
        <aside className="grid-filters" aria-label="Collection filters">
          <div>
            <span>Era</span>
            <button className="is-active">2000s <small>{artworks.length}</small></button>
          </div>
          <div>
            <span>Movement</span>
            <button className="is-active">Digital abstraction <small>{artworks.length}</small></button>
          </div>
          <div>
            <span>Medium</span>
            <button className="is-active">Generated image <small>{artworks.length}</small></button>
          </div>
          <div>
            <span>Palette</span>
            <button className={palette === 'all' ? 'is-active' : ''} onClick={() => setPalette('all')}>All <small>{artworks.length}</small></button>
            <button className={palette === 'cool' ? 'is-active' : ''} onClick={() => setPalette('cool')}>Cool <small>{artworks.filter((item) => !isWarm(item.accent)).length}</small></button>
            <button className={palette === 'warm' ? 'is-active' : ''} onClick={() => setPalette('warm')}>Warm <small>{artworks.filter((item) => isWarm(item.accent)).length}</small></button>
          </div>
        </aside>

        <div className="grid-gallery" aria-label="Artwork collection grid">
          {visible.map((artwork, index) => (
            <article className="grid-card" key={artwork.id}>
              <button onClick={() => onOpen(artwork)} aria-label={'Open ' + artwork.title}>
                <span className="grid-image grid-image--natural" style={{ '--card-accent': artwork.accent } as CSSProperties}>
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
                  <span>{artwork.paletteName}</span>
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>

      <section className="collection-editorial museum-reveal" aria-labelledby="collection-editorial-title">
        <div className="collection-editorial-copy">
          <p className="eyebrow">A slower index</p>
          <h2 id="collection-editorial-title">Order until<br /><em>curiosity interrupts.</em></h2>
          <p>
            The grid is not the destination. It is a calm place to compare scale, temperature and rhythm before one object
            pulls you back into a less predictable path.
          </p>
        </div>
        <div className="collection-triptych" aria-label="A small editorial selection">
          {visible.slice(0, 3).map((artwork, index) => (
            <button key={artwork.id} onClick={() => onOpen(artwork)} style={{ '--triptych-accent': artwork.accent } as CSSProperties}>
              <img src={artwork.image} alt={artwork.alt} loading="lazy" />
              <span><b>{String(index + 1).padStart(2, '0')}</b><strong>{artwork.title}</strong><small>{artwork.paletteName}</small></span>
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}

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
  const [collectionName, setCollectionName] = useState(() => localStorage.getItem('lumen-collection-name') || 'Your collection');
  const [viewMode, setViewMode] = useState<'grid' | 'thread'>('grid');
  const [notice, setNotice] = useState('');
  const [notes, setNotes] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('lumen-notes') || '{}') as Record<string, string>; }
    catch { return {}; }
  });

  const saveName = (value: string) => {
    setCollectionName(value);
    localStorage.setItem('lumen-collection-name', value);
  };

  const saveNote = (id: string, value: string) => {
    setNotes((current) => {
      const next = { ...current, [id]: value };
      localStorage.setItem('lumen-notes', JSON.stringify(next));
      return next;
    });
  };

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('saved', savedIds.join(','));
    url.hash = '/saved';
    try {
      await navigator.clipboard.writeText(url.toString());
      setNotice('Share link copied');
    } catch {
      setNotice('Copy unavailable in this browser');
    }
  };

  const exportImage = () => {
    const escape = (value: string) => value.replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character] || character));
    const rows = savedArtworks.map((artwork, index) =>
      '<text x="80" y="' + (250 + index * 48) + '" fill="#f3f0e8" font-family="Arial" font-size="22">' +
      String(index + 1).padStart(2, '0') + '  ' + escape(artwork.title) + ' — ' + escape(artwork.paletteName) + '</text>'
    ).join('');
    const height = Math.max(720, 330 + savedArtworks.length * 48);
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="' + height + '" viewBox="0 0 1200 ' + height + '">' +
      '<rect width="1200" height="' + height + '" fill="#090909"/>' +
      '<text x="80" y="90" fill="#f3f0e8" font-family="Georgia" font-size="58">LUMEN</text>' +
      '<text x="80" y="155" fill="#8f8d88" font-family="Arial" font-size="18">SAVED BY DRIFTING · ' + savedArtworks.length + ' WORKS</text>' +
      '<text x="80" y="205" fill="#f3f0e8" font-family="Georgia" font-size="34">' + escape(collectionName) + '</text>' +
      rows + '</svg>';
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'lumen-collection.svg';
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Collection image exported');
  };

  return (
    <section className="saved-view" aria-labelledby="saved-title">
      <div className="saved-head">
        <div>
          <p className="eyebrow">Personal collection</p>
          <h1 id="saved-title">Saved by<br /><em>drifting.</em></h1>
        </div>
        <p>{savedArtworks.length} {savedArtworks.length === 1 ? 'work' : 'works'} held in this browser.</p>
      </div>

      <div className="collection-tools">
        <label>
          <span>Collection name</span>
          <input value={collectionName} onChange={(event) => saveName(event.target.value)} aria-label="Collection name" />
        </label>
        <div className="collection-view-toggle" role="group" aria-label="Collection view">
          <button className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
          <button className={viewMode === 'thread' ? 'is-active' : ''} onClick={() => setViewMode('thread')}>Thread</button>
        </div>
        <button onClick={share} disabled={savedArtworks.length === 0}>Share as link</button>
        <button onClick={exportImage} disabled={savedArtworks.length === 0}>Export as image</button>
        <span role="status">{notice}</span>
      </div>

      {savedArtworks.length === 0 ? (
        <div className="saved-empty">
          <span>00 / saved</span>
          <h2>Nothing here<br /><em>yet.</em></h2>
          <p>Go drift; the first piece will find you. Saving creates a local collection without requiring an account.</p>
          <button onClick={onExplore}>Return to Drift <span aria-hidden="true">↗</span></button>
        </div>
      ) : (
        <div className={'saved-grid saved-grid--' + viewMode}>
          {savedArtworks.map((artwork, index) => (
            <article key={artwork.id} data-thread={artwork.theme}>
              <div className="saved-thread-label">{viewMode === 'thread' ? artwork.theme + ' thread' : ''}</div>
              <button className="saved-art" onClick={() => onOpen(artwork)}>
                <img src={artwork.image} alt={artwork.alt} loading={index > 3 ? 'lazy' : 'eager'} style={transitionStyle(artwork.id)} />
              </button>
              <div className="saved-meta">
                <div><span>{String(index + 1).padStart(2, '0')}</span><strong>{artwork.title}</strong></div>
                <button onClick={() => onRemove(artwork.id)}>Remove</button>
              </div>
              <label className="saved-note">
                <span>Private note</span>
                <textarea
                  value={notes[artwork.id] || ''}
                  onChange={(event) => saveNote(artwork.id, event.target.value)}
                  placeholder="Why did this stay with you?"
                />
              </label>
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
