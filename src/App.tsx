import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Artwork, fetchPublicDomainArtworks } from './artworks';

type Route =
  | { view: 'portal' }
  | { view: 'drift' }
  | { view: 'detail'; id: string }
  | { view: 'atlas'; id: string };

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '');
  const parts = hash.split('/').filter(Boolean);
  if (parts[0] === 'drift') return { view: 'drift' };
  if (parts[0] === 'artwork' && parts[1]) return { view: 'detail', id: parts[1] };
  if (parts[0] === 'atlas' && parts[1]) return { view: 'atlas', id: parts[1] };
  return { view: 'portal' };
}

function routeHash(route: Route) {
  if (route.view === 'portal') return '#/';
  if (route.view === 'drift') return '#/drift';
  if (route.view === 'detail') return `#/artwork/${route.id}`;
  return `#/atlas/${route.id}`;
}

function artworkTransition(id: string): CSSProperties {
  return { viewTransitionName: `artwork-${id}` } as CSSProperties;
}

function useSystemReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [forcedReduced, setForcedReduced] = useState(() => localStorage.getItem('lumen-motion') === 'reduced');
  const [saved, setSaved] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('lumen-saved') || '[]') as string[]; }
    catch { return []; }
  });
  const systemReduced = useSystemReducedMotion();
  const reducedMotion = systemReduced || forcedReduced;
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchPublicDomainArtworks(controller.signal)
      .then(setArtworks)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const onHistory = () => setRoute(parseRoute());
    window.addEventListener('popstate', onHistory);
    window.addEventListener('hashchange', onHistory);
    return () => {
      window.removeEventListener('popstate', onHistory);
      window.removeEventListener('hashchange', onHistory);
    };
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
    localStorage.setItem('lumen-motion', forcedReduced ? 'reduced' : 'auto');
  }, [reducedMotion, forcedReduced]);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
  }, [route]);

  const active = useMemo(() => {
    if ('id' in route) return artworks.find((item) => item.id === route.id) || artworks[0];
    return artworks[0];
  }, [artworks, route]);

  const navigate = (next: Route) => {
    const update = () => {
      window.history.pushState({}, '', routeHash(next));
      setRoute(next);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    if (!reducedMotion && document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
  };

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
      localStorage.setItem('lumen-saved', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="app-shell" style={{ '--accent': active?.accent || '#c7674d' } as CSSProperties}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header
        route={route}
        active={active}
        savedCount={saved.length}
        reducedMotion={reducedMotion}
        onNavigate={navigate}
        onMotionToggle={() => setForcedReduced((value) => !value)}
      />

      <main id="main" ref={mainRef} tabIndex={-1}>
        {route.view === 'portal' && (
          <Portal artwork={active} loading={loading} onEnter={() => navigate({ view: 'drift' })} />
        )}
        {route.view === 'drift' && (
          <Drift
            artworks={artworks}
            loading={loading}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onOpenAtlas={(artwork) => navigate({ view: 'atlas', id: artwork.id })}
          />
        )}
        {route.view === 'detail' && active && (
          <Detail
            artwork={active}
            isSaved={saved.includes(active.id)}
            onBack={() => navigate({ view: 'drift' })}
            onAtlas={() => navigate({ view: 'atlas', id: active.id })}
            onSave={() => toggleSaved(active.id)}
          />
        )}
        {route.view === 'atlas' && active && (
          <Atlas
            artwork={active}
            related={artworks.filter((item) => item.id !== active.id).slice(0, 4)}
            onBack={() => navigate({ view: 'detail', id: active.id })}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
          />
        )}
      </main>

      <footer className="site-footer">
        <div><strong>LUMEN</strong><span>Digital Museum of Visual Culture</span></div>
        <p>Prototype collection data and public-domain imagery are loaded from the Art Institute of Chicago API.</p>
      </footer>
    </div>
  );
}

type HeaderProps = {
  route: Route;
  active?: Artwork;
  savedCount: number;
  reducedMotion: boolean;
  onNavigate: (route: Route) => void;
  onMotionToggle: () => void;
};

function Header({ route, active, savedCount, reducedMotion, onNavigate, onMotionToggle }: HeaderProps) {
  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => onNavigate({ view: 'portal' })} aria-label="LUMEN home">
        LU<span>•</span>MEN
      </button>
      <nav aria-label="Primary navigation">
        <button className={route.view === 'drift' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'drift' })}>Explore</button>
        <button
          className={route.view === 'atlas' ? 'is-active' : ''}
          onClick={() => onNavigate({ view: 'atlas', id: active?.id || '27992' })}
        >
          Atlas
        </button>
      </nav>
      <div className="header-tools">
        <span className="saved-count" aria-label={`${savedCount} saved artworks`}>{String(savedCount).padStart(2, '0')} saved</span>
        <button className="motion-toggle" onClick={onMotionToggle} aria-pressed={reducedMotion}>
          Motion {reducedMotion ? 'reduced' : 'on'}
        </button>
      </div>
    </header>
  );
}

function Portal({ artwork, loading, onEnter }: { artwork?: Artwork; loading: boolean; onEnter: () => void }) {
  const frameRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    frameRef.current.style.setProperty('--px', String((event.clientX - rect.left) / rect.width - 0.5));
    frameRef.current.style.setProperty('--py', String((event.clientY - rect.top) / rect.height - 0.5));
  };

  return (
    <section className="portal" aria-labelledby="portal-title">
      <div className="portal-grid" aria-hidden="true" />
      <p className="portal-kicker">Digital museum / visual culture / 2026</p>
      <h1 id="portal-title" className="portal-title">
        <span>DON'T SEARCH</span>
        <span>FOR <em>ART.</em></span>
        <span>DRIFT INTO IT.</span>
      </h1>
      <div className="portal-frame" ref={frameRef} onPointerMove={onPointerMove}>
        {artwork ? (
          <img
            src={artwork.image}
            alt=""
            style={artworkTransition(artwork.id)}
            onError={(event) => { event.currentTarget.style.opacity = '0'; }}
          />
        ) : (
          <div className="artwork-skeleton" />
        )}
        <div className="portal-frame-meta">
          <span>{loading ? 'Loading collection…' : artwork?.title}</span>
          <span>{artwork?.date}</span>
        </div>
      </div>
      <div className="portal-bottom">
        <p>Explore a collection through visible relationships — mood, color, era, artist and material — without losing the familiar path back to the artwork itself.</p>
        <button className="enter-button" onClick={onEnter}>
          <span>Enter collection</span><span aria-hidden="true">↗</span>
        </button>
      </div>
      <div className="portal-index" aria-hidden="true">001 / VISUAL CULTURE</div>
    </section>
  );
}

function Drift({
  artworks,
  loading,
  onOpen,
  onOpenAtlas,
}: {
  artworks: Artwork[];
  loading: boolean;
  onOpen: (artwork: Artwork) => void;
  onOpenAtlas: (artwork: Artwork) => void;
}) {
  return (
    <section className="drift-section" aria-labelledby="drift-title">
      <div className="drift-intro">
        <div>
          <p className="eyebrow">Explore / Drift</p>
          <h1 id="drift-title">Follow what catches<br /><em>your eye.</em></h1>
        </div>
        <p className="drift-copy">This mode favors weak intent and serendipity. The stable Grid/Search model remains the fallback; here, hierarchy shifts with visual emphasis.</p>
      </div>

      <div className="mode-strip" role="group" aria-label="Explore mode">
        <span>Mode</span>
        <button className="is-active">Drift</button>
        <button onClick={() => artworks[0] && onOpenAtlas(artworks[0])}>Atlas</button>
        <span className="mode-note">{loading ? 'Loading open collection…' : `${artworks.length} public-domain works loaded`}</span>
      </div>

      <div className="drift-grid">
        {(loading && artworks.length === 0 ? Array.from({ length: 6 }) : artworks).map((item, index) => {
          if (typeof item === 'undefined') return null;
          if (loading && artworks.length === 0) {
            return <div key={index} className={`drift-card skeleton-card drift-card--${index % 5}`} aria-hidden="true"><div /></div>;
          }
          const artwork = item as Artwork;
          return (
            <article className={`drift-card drift-card--${index % 5}`} key={artwork.id}>
              <button className="drift-art" onClick={() => onOpen(artwork)} aria-label={`Open ${artwork.title} by ${artwork.artist}`}>
                <span className="drift-image-wrap" style={{ '--card-accent': artwork.accent } as CSSProperties}>
                  <img
                    src={artwork.image}
                    alt={artwork.alt}
                    loading={index > 2 ? 'lazy' : 'eager'}
                    style={artworkTransition(artwork.id)}
                    onError={(event) => { event.currentTarget.style.opacity = '0'; }}
                  />
                  <span className="drift-enter">View work ↗</span>
                </span>
                <span className="drift-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{artwork.title}</strong>{artwork.artist}</span>
                  <span>{artwork.mood}</span>
                </span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Detail({
  artwork,
  isSaved,
  onBack,
  onAtlas,
  onSave,
}: {
  artwork: Artwork;
  isSaved: boolean;
  onBack: () => void;
  onAtlas: () => void;
  onSave: () => void;
}) {
  return (
    <article className="detail" aria-labelledby="detail-title">
      <div className="detail-toolbar">
        <button onClick={onBack}>← Drift</button>
        <span>{artwork.classification}</span>
        <button onClick={onSave} aria-pressed={isSaved}>{isSaved ? 'Saved ✓' : 'Save +'}</button>
      </div>

      <div className="detail-art-stage">
        <div className="detail-art-frame" style={{ '--card-accent': artwork.accent } as CSSProperties}>
          <img
            src={artwork.image}
            alt={artwork.alt}
            style={artworkTransition(artwork.id)}
            onError={(event) => { event.currentTarget.style.opacity = '0'; }}
          />
        </div>
        <div className="detail-counter">Object / {artwork.id}</div>
      </div>

      <div className="detail-heading">
        <div>
          <p className="eyebrow">Collection object</p>
          <h1 id="detail-title">{artwork.title}</h1>
          <p className="artist-line">{artwork.artist}</p>
        </div>
        <dl>
          <div><dt>Date</dt><dd>{artwork.date}</dd></div>
          <div><dt>Origin</dt><dd>{artwork.origin}</dd></div>
          <div><dt>Medium</dt><dd>{artwork.medium}</dd></div>
        </dl>
      </div>

      <section className="detail-story" aria-labelledby="notice-title">
        <div>
          <p className="eyebrow">Look closer</p>
          <h2 id="notice-title">The object stays calm.<br /><em>The context moves.</em></h2>
        </div>
        <div className="detail-story-copy">
          <p>Instead of burying discovery below a generic “related works” carousel, LUMEN exposes the relationship model as part of navigation. The Atlas is a prototype layer for testing how visible connections affect exploration.</p>
          <p className="evidence-note">Relationship labels in this prototype are conceptual navigation cues, not museum-authored scholarly claims.</p>
          <button className="atlas-cta" onClick={onAtlas}>Open relationship Atlas <span>↗</span></button>
        </div>
      </section>

      <section className="detail-specs" aria-label="Artwork details">
        <div><span>Dimensions</span><p>{artwork.dimensions}</p></div>
        <div><span>Mood path</span><p>{artwork.mood}</p></div>
        <div><span>Source</span><p><a href={artwork.sourceUrl} target="_blank" rel="noreferrer">Art Institute of Chicago ↗</a></p></div>
      </section>
    </article>
  );
}

function Atlas({
  artwork,
  related,
  onBack,
  onOpen,
}: {
  artwork: Artwork;
  related: Artwork[];
  onBack: () => void;
  onOpen: (artwork: Artwork) => void;
}) {
  type AtlasNode = { key: string; label: string; meta: string; artwork?: Artwork };
  const nodes: AtlasNode[] = [
    { key: 'artist', label: artwork.artist, meta: 'Artist' },
    { key: 'mood', label: artwork.mood, meta: 'Mood path' },
    { key: 'origin', label: artwork.origin, meta: 'Origin' },
    ...related.slice(0, 2).map((item, index) => ({ key: item.id, label: item.title, meta: index === 0 ? 'Visual contrast' : 'Curatorial path', artwork: item })),
  ];

  return (
    <section className="atlas" aria-labelledby="atlas-title">
      <div className="atlas-head">
        <button onClick={onBack}>← Object</button>
        <div><p className="eyebrow">Relationship Atlas</p><h1 id="atlas-title">Why this work<br /><em>leads elsewhere.</em></h1></div>
        <p>Prototype relationship model. Connections reveal navigational logic; they do not imply scholarly attribution.</p>
      </div>

      <div className="atlas-canvas" aria-hidden="true">
        <svg className="atlas-lines" viewBox="0 0 1000 620" preserveAspectRatio="none">
          <path d="M500 310 C430 250 315 190 205 130" />
          <path d="M500 310 C570 250 690 180 810 135" />
          <path d="M500 310 C430 365 300 430 170 500" />
          <path d="M500 310 C575 375 700 440 830 500" />
          <path d="M500 310 C500 220 500 120 500 58" />
        </svg>

        <button className="atlas-center" onClick={onBack}>
          <span className="atlas-center-image" style={{ '--card-accent': artwork.accent } as CSSProperties}>
            <img src={artwork.image} alt="" style={artworkTransition(artwork.id)} />
          </span>
          <span>{artwork.title}</span>
        </button>

        {nodes.map((node, index) => (
          <button
            key={node.key}
            className={`atlas-node atlas-node--${index + 1}`}
            onClick={() => node.artwork && onOpen(node.artwork)}
            disabled={!node.artwork}
          >
            <span>{node.meta}</span>
            <strong>{node.label}</strong>
          </button>
        ))}
      </div>

      <div className="atlas-list">
        <p className="eyebrow">Accessible relationship path</p>
        <ol>
          {nodes.map((node) => (
            <li key={node.key}>
              <span>{node.meta}</span>
              {node.artwork ? <button onClick={() => onOpen(node.artwork!)}>{node.label} ↗</button> : <strong>{node.label}</strong>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default App;
