import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Artwork, fetchPublicDomainArtworks } from './artworks';
import { ChromaticView, GridView, SavedView } from './DiscoveryViews';
import { CuratedJourney, MoodView } from './CulturalExperience';
import {
  AboutView,
  AccessibilityPanel,
  NotFoundView,
  OnboardingHint,
  QuickPreview,
} from './ExperienceLayers';

type Route =
  | { view: 'portal' }
  | { view: 'drift' }
  | { view: 'grid' }
  | { view: 'chromatic' }
  | { view: 'mood' }
  | { view: 'journey' }
  | { view: 'saved' }
  | { view: 'about' }
  | { view: 'detail'; id: string }
  | { view: 'atlas'; id: string }
  | { view: 'notfound' };

function parseRoute(): Route {
  const hash = window.location.hash.replace(/^#/, '');
  const parts = hash.split('/').filter(Boolean);
  if (parts.length === 0) return { view: 'portal' };
  if (parts[0] === 'drift') return { view: 'drift' };
  if (parts[0] === 'grid') return { view: 'grid' };
  if (parts[0] === 'color' || parts[0] === 'chromatic') return { view: 'chromatic' };
  if (parts[0] === 'mood') return { view: 'mood' };
  if (parts[0] === 'journey' || parts[0] === 'exhibition') return { view: 'journey' };
  if (parts[0] === 'saved' || parts[0] === 'collection') return { view: 'saved' };
  if (parts[0] === 'about' || parts[0] === 'method') return { view: 'about' };
  if (parts[0] === 'artwork' && parts[1]) return { view: 'detail', id: parts[1] };
  if (parts[0] === 'atlas' && parts[1]) return { view: 'atlas', id: parts[1] };
  return { view: 'notfound' };
}

function routeHash(route: Route) {
  if (route.view === 'portal') return '#/';
  if (route.view === 'drift') return '#/drift';
  if (route.view === 'grid') return '#/grid';
  if (route.view === 'chromatic') return '#/color';
  if (route.view === 'mood') return '#/mood';
  if (route.view === 'journey') return '#/exhibition';
  if (route.view === 'saved') return '#/collection';
  if (route.view === 'about') return '#/about';
  if (route.view === 'detail') return '#/artwork/' + route.id;
  if (route.view === 'atlas') return '#/atlas/' + route.id;
  return '#/404';
}

function artworkTransition(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
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

function initialSaved() {
  let local: string[] = [];
  try {
    local = JSON.parse(localStorage.getItem('lumen-saved') || '[]') as string[];
  } catch {
    local = [];
  }
  const shared = new URL(window.location.href).searchParams.get('saved')?.split(',').filter(Boolean) || [];
  return Array.from(new Set([...local, ...shared]));
}

function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute());
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [forcedReduced, setForcedReduced] = useState(() => localStorage.getItem('lumen-motion') === 'reduced');
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('lumen-contrast') === 'high');
  const [saved, setSaved] = useState<string[]>(initialSaved);
  const [previewId, setPreviewId] = useState<string>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => localStorage.getItem('lumen-onboarded') !== 'yes');
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
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'default';
    localStorage.setItem('lumen-motion', forcedReduced ? 'reduced' : 'auto');
    localStorage.setItem('lumen-contrast', highContrast ? 'high' : 'default');
  }, [reducedMotion, forcedReduced, highContrast]);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    setPreviewId(undefined);
  }, [route]);

  const active = useMemo(() => {
    if ('id' in route) return artworks.find((item) => item.id === route.id) || artworks[0];
    return artworks[0];
  }, [artworks, route]);

  const previewArtwork = useMemo(
    () => artworks.find((item) => item.id === previewId),
    [artworks, previewId],
  );

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

  const updateSaved = (next: string[]) => {
    const unique = Array.from(new Set(next));
    localStorage.setItem('lumen-saved', JSON.stringify(unique));
    setSaved(unique);
  };

  const toggleSaved = (id: string) => {
    updateSaved(saved.includes(id) ? saved.filter((value) => value !== id) : [...saved, id]);
  };

  const saveJourney = (ids: string[]) => updateSaved([...saved, ...ids]);

  const dismissOnboarding = () => {
    localStorage.setItem('lumen-onboarded', 'yes');
    setShowOnboarding(false);
  };

  return (
    <div className="app-shell" style={{ '--accent': active?.accent || '#c7674d' } as CSSProperties}>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header
        route={route}
        active={active}
        savedCount={saved.length}
        onNavigate={navigate}
        onSettings={() => setSettingsOpen(true)}
      />
      <MobileDock route={route} savedCount={saved.length} onNavigate={navigate} />

      <main id="main" ref={mainRef} tabIndex={-1}>
        {route.view === 'portal' && (
          <Portal
            artworks={artworks}
            loading={loading}
            reducedMotion={reducedMotion}
            onEnter={() => navigate({ view: 'drift' })}
            onExhibition={() => navigate({ view: 'journey' })}
            onMood={() => navigate({ view: 'mood' })}
          />
        )}

        {route.view === 'drift' && (
          <Drift
            artworks={artworks}
            loading={loading}
            reducedMotion={reducedMotion}
            onPreview={(artwork) => setPreviewId(artwork.id)}
            onOpenAtlas={(artwork) => navigate({ view: 'atlas', id: artwork.id })}
            onGrid={() => navigate({ view: 'grid' })}
            onChromatic={() => navigate({ view: 'chromatic' })}
            onMood={() => navigate({ view: 'mood' })}
          />
        )}

        {route.view === 'grid' && (
          <GridView
            artworks={artworks}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onDrift={() => navigate({ view: 'drift' })}
            onGrid={() => navigate({ view: 'grid' })}
            onChromatic={() => navigate({ view: 'chromatic' })}
          />
        )}

        {route.view === 'chromatic' && (
          <ChromaticView
            artworks={artworks}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onDrift={() => navigate({ view: 'drift' })}
            onGrid={() => navigate({ view: 'grid' })}
            onChromatic={() => navigate({ view: 'chromatic' })}
          />
        )}

        {route.view === 'mood' && (
          <MoodView
            artworks={artworks}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onStory={() => navigate({ view: 'journey' })}
          />
        )}

        {route.view === 'journey' && (
          <CuratedJourney
            artworks={artworks}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onMood={() => navigate({ view: 'mood' })}
            onAtlas={(artwork) => navigate({ view: 'atlas', id: artwork.id })}
            onSaveJourney={saveJourney}
          />
        )}

        {route.view === 'saved' && (
          <SavedView
            artworks={artworks}
            savedIds={saved}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onRemove={toggleSaved}
            onExplore={() => navigate({ view: 'drift' })}
          />
        )}

        {route.view === 'about' && (
          <AboutView
            onExplore={() => navigate({ view: 'drift' })}
            onColor={() => navigate({ view: 'chromatic' })}
            onMood={() => navigate({ view: 'mood' })}
            onExhibition={() => navigate({ view: 'journey' })}
          />
        )}

        {route.view === 'detail' && active && (
          <Detail
            artwork={active}
            artworks={artworks}
            isSaved={saved.includes(active.id)}
            onBack={() => navigate({ view: 'drift' })}
            onAtlas={() => navigate({ view: 'atlas', id: active.id })}
            onSave={() => toggleSaved(active.id)}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
          />
        )}

        {route.view === 'atlas' && active && (
          <Atlas
            artwork={active}
            artworks={artworks}
            onBack={() => navigate({ view: 'detail', id: active.id })}
            onRecenter={(artwork) => navigate({ view: 'atlas', id: artwork.id })}
            onTrace={(ids) => updateSaved([...saved, ...ids])}
          />
        )}

        {route.view === 'notfound' && (
          <NotFoundView
            onHome={() => navigate({ view: 'portal' })}
            onExplore={() => navigate({ view: 'drift' })}
          />
        )}
      </main>

      <footer className="site-footer">
        <div><strong>LUMEN</strong><span>Digital Museum of Visual Culture</span></div>
        <p>Public-domain prototype media · explainable discovery paths · reduced-motion alternatives.</p>
      </footer>

      <QuickPreview
        artwork={previewArtwork}
        isSaved={Boolean(previewArtwork && saved.includes(previewArtwork.id))}
        onClose={() => setPreviewId(undefined)}
        onOpen={() => previewArtwork && navigate({ view: 'detail', id: previewArtwork.id })}
        onSave={() => previewArtwork && toggleSaved(previewArtwork.id)}
      />

      <AccessibilityPanel
        open={settingsOpen}
        reducedMotion={reducedMotion}
        highContrast={highContrast}
        onClose={() => setSettingsOpen(false)}
        onMotionToggle={() => setForcedReduced((value) => !value)}
        onContrastToggle={() => setHighContrast((value) => !value)}
      />

      <OnboardingHint
        open={route.view === 'drift' && showOnboarding}
        onDismiss={dismissOnboarding}
      />
    </div>
  );
}

type HeaderProps = {
  route: Route;
  active?: Artwork;
  savedCount: number;
  onNavigate: (route: Route) => void;
  onSettings: () => void;
};

function Header({ route, active, savedCount, onNavigate, onSettings }: HeaderProps) {
  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => onNavigate({ view: 'portal' })} aria-label="LUMEN home">
        LU<span>•</span>MEN
      </button>
      <nav aria-label="Primary navigation">
        <button className={route.view === 'drift' || route.view === 'grid' || route.view === 'chromatic' || route.view === 'mood' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'drift' })}>Explore</button>
        <button className={route.view === 'journey' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'journey' })}>Exhibition</button>
        <button className={route.view === 'saved' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'saved' })}>Collection</button>
        <button
          className={route.view === 'atlas' ? 'is-active' : ''}
          onClick={() => onNavigate({ view: 'atlas', id: active?.id || 'abstract-0008' })}
        >
          Atlas
        </button>
        <button className={route.view === 'about' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'about' })}>About</button>
      </nav>
      <div className="header-tools">
        <button
          className="saved-count saved-button"
          aria-label={savedCount + ' saved artworks'}
          onClick={() => onNavigate({ view: 'saved' })}
        >
          {String(savedCount).padStart(2, '0')} saved
        </button>
        <button className="motion-toggle" onClick={onSettings} aria-label="Open accessibility settings">
          Access
        </button>
      </div>
    </header>
  );
}

function MobileDock({
  route,
  savedCount,
  onNavigate,
}: {
  route: Route;
  savedCount: number;
  onNavigate: (route: Route) => void;
}) {
  const activeExplore = route.view === 'drift' || route.view === 'grid' || route.view === 'chromatic' || route.view === 'mood';
  return (
    <nav className="mobile-dock" aria-label="Mobile navigation">
      <button className={activeExplore ? 'is-active' : ''} onClick={() => onNavigate({ view: 'drift' })}><span>Explore</span></button>
      <button className={route.view === 'journey' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'journey' })}><span>Story</span></button>
      <button className={route.view === 'saved' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'saved' })}><span>Saved</span><small>{String(savedCount).padStart(2, '0')}</small></button>
      <button className={route.view === 'about' ? 'is-active' : ''} onClick={() => onNavigate({ view: 'about' })}><span>About</span></button>
    </nav>
  );
}

function Portal({
  artworks,
  loading,
  reducedMotion,
  onEnter,
  onExhibition,
  onMood,
}: {
  artworks: Artwork[];
  loading: boolean;
  reducedMotion: boolean;
  onEnter: () => void;
  onExhibition: () => void;
  onMood: () => void;
}) {
  const [index, setIndex] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);
  const enteredRef = useRef(false);
  const artwork = artworks[index] || artworks[0];

  useEffect(() => {
    if (reducedMotion || artworks.length < 2) return;
    const interval = window.setInterval(() => setIndex((value) => (value + 1) % Math.min(artworks.length, 6)), 6500);
    return () => window.clearInterval(interval);
  }, [artworks.length, reducedMotion]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !enteredRef.current) {
        event.preventDefault();
        enteredRef.current = true;
        onEnter();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEnter]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!frameRef.current || reducedMotion) return;
    const rect = frameRef.current.getBoundingClientRect();
    frameRef.current.style.setProperty('--px', String((event.clientX - rect.left) / rect.width - 0.5));
    frameRef.current.style.setProperty('--py', String((event.clientY - rect.top) / rect.height - 0.5));
  };

  const onWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) > 55 && !enteredRef.current) {
      enteredRef.current = true;
      onEnter();
    }
  };

  return (
    <section className="portal portal--expanded" aria-labelledby="portal-title" onWheel={onWheel}>
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
            key={artwork.id}
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

      <div className="portal-bottom portal-bottom--expanded">
        <p>Follow a color, a feeling, or a thread between works. There is no wrong way in.</p>
        <div className="portal-entries">
          <button className="enter-button" onClick={onEnter}><span>Start drifting</span><span aria-hidden="true">↗</span></button>
          <button onClick={onExhibition}>Enter the exhibition <span aria-hidden="true">↗</span></button>
          <button onClick={onMood}>Pick a mood <span aria-hidden="true">↗</span></button>
        </div>
      </div>

      <div className="portal-index portal-index--stats" aria-hidden="true">
        {artworks.length || '—'} works · 9 mood paths · 6 exhibition chapters · Space / scroll to drift
      </div>
    </section>
  );
}

function Drift({
  artworks,
  loading,
  reducedMotion,
  onPreview,
  onOpenAtlas,
  onGrid,
  onChromatic,
  onMood,
}: {
  artworks: Artwork[];
  loading: boolean;
  reducedMotion: boolean;
  onPreview: (artwork: Artwork) => void;
  onOpenAtlas: (artwork: Artwork) => void;
  onGrid: () => void;
  onChromatic: () => void;
  onMood: () => void;
}) {
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const fieldRef = useRef<HTMLDivElement>(null);

  const onGridKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    const buttons = Array.from(fieldRef.current?.querySelectorAll<HTMLButtonElement>('.drift-art') || []);
    const activeIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);
    if (activeIndex < 0) return;
    event.preventDefault();
    const step = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 1;
    buttons[(activeIndex + step + buttons.length) % buttons.length]?.focus();
  };

  return (
    <section className={'drift-section ' + (paused ? 'is-paused ' : '') + (reducedMotion ? 'is-reduced' : '')} aria-labelledby="drift-title" data-speed={speed}>
      <div className="drift-intro">
        <div>
          <p className="eyebrow">Explore / Drift</p>
          <h1 id="drift-title">Follow what catches<br /><em>your eye.</em></h1>
        </div>
        <p className="drift-copy">
          A spatial discovery mode for weak intent. Hover reveals context; click opens a quick preview; Grid remains one tap away whenever you want control.
        </p>
      </div>

      <div className="drift-zone" aria-live="polite">
        <span>You are drifting through</span>
        <strong>Cool tones · 2000s · Digital abstraction</strong>
      </div>

      <div
        className={'drift-grid ' + (reducedMotion ? 'drift-grid--reduced' : '')}
        ref={fieldRef}
        onKeyDown={onGridKeyDown}
      >
        {(loading && artworks.length === 0 ? Array.from({ length: 6 }) : artworks).map((item, index) => {
          if (typeof item === 'undefined') return null;
          if (loading && artworks.length === 0) {
            return <div key={index} className={'drift-card skeleton-card drift-card--' + (index % 5)} aria-hidden="true"><div /></div>;
          }
          const artwork = item as Artwork;
          return (
            <article className={'drift-card drift-card--' + (index % 5)} key={artwork.id}>
              <button className="drift-art" onClick={() => onPreview(artwork)} aria-label={'Quick preview ' + artwork.title + ' by ' + artwork.artist}>
                <span className="drift-image-wrap" style={{ '--card-accent': artwork.accent } as CSSProperties}>
                  <img
                    src={artwork.image}
                    alt={artwork.alt}
                    loading={index > 2 ? 'lazy' : 'eager'}
                    style={artworkTransition(artwork.id)}
                    onError={(event) => { event.currentTarget.style.opacity = '0'; }}
                  />
                  <span className="drift-enter">Quick preview ↗</span>
                </span>
                <span className="drift-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{artwork.title}</strong>{artwork.artist}</span>
                  <span>{artwork.paletteName}</span>
                </span>
              </button>
            </article>
          );
        })}
      </div>

      <div className="mode-strip drift-control-bar" role="group" aria-label="Drift controls">
        <span>Mode</span>
        <button className="is-active">Drift</button>
        <button onClick={onGrid}>Grid</button>
        <button onClick={onChromatic}>Color</button>
        <button onClick={onMood}>Mood</button>
        <button onClick={() => artworks[0] && onOpenAtlas(artworks[0])}>Atlas</button>
        <span className="drift-divider" aria-hidden="true" />
        <button onClick={() => setPaused((value) => !value)} aria-pressed={paused}>{paused ? 'Resume' : 'Pause drift'}</button>
        <button className={speed === 'slow' ? 'is-active' : ''} onClick={() => setSpeed('slow')}>Slow</button>
        <button className={speed === 'normal' ? 'is-active' : ''} onClick={() => setSpeed('normal')}>Normal</button>
        <button className={speed === 'fast' ? 'is-active' : ''} onClick={() => setSpeed('fast')}>Fast</button>
        <span className="mode-note">{loading ? 'Loading open collection…' : artworks.length + ' public-domain works loaded'}</span>
      </div>
    </section>
  );
}

function Detail({
  artwork,
  artworks,
  isSaved,
  onBack,
  onAtlas,
  onSave,
  onOpen,
}: {
  artwork: Artwork;
  artworks: Artwork[];
  isSaved: boolean;
  onBack: () => void;
  onAtlas: () => void;
  onSave: () => void;
  onOpen: (artwork: Artwork) => void;
}) {
  const [zoomed, setZoomed] = useState(false);
  const others = artworks.filter((item) => item.id !== artwork.id);
  const colorRelated = [...others].sort((a, b) => Math.abs(parseInt(a.accent.slice(1), 16) - parseInt(artwork.accent.slice(1), 16)) - Math.abs(parseInt(b.accent.slice(1), 16) - parseInt(artwork.accent.slice(1), 16)))[0];
  const eraRelated = others.find((item) => item.era === artwork.era) || others[1];
  const moodRelated = others.find((item) => item.mood === artwork.mood) || others[2];
  const threads = [
    { label: 'Color', note: 'A neighboring dominant hue with a different visual temperature.', artwork: colorRelated },
    { label: 'Era', note: 'Another work from the same 2000s digital-making context.', artwork: eraRelated },
    { label: 'Mood', note: 'A second object carrying the same editorial mood path.', artwork: moodRelated },
  ].filter((item) => item.artwork);

  return (
    <article className="detail" aria-labelledby="detail-title">
      <div className="detail-toolbar">
        <button onClick={onBack}>← Drift</button>
        <span>{artwork.classification}</span>
        <div>
          <button onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>{zoomed ? 'Fit image' : 'Zoom image'}</button>
          <button onClick={onSave} aria-pressed={isSaved}>{isSaved ? 'Saved ✓' : 'Save +'}</button>
        </div>
      </div>

      <div className={'detail-art-stage ' + (zoomed ? 'is-zoomed' : '')}>
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
          <div className="detail-tags">
            <span>{artwork.movement}</span>
            <span>{artwork.medium}</span>
            <span><i style={{ background: artwork.accent }} />{artwork.paletteName}</span>
            <span>{artwork.mood}</span>
          </div>
        </div>
        <dl>
          <div><dt>Date</dt><dd>{artwork.date}</dd></div>
          <div><dt>Origin</dt><dd>{artwork.origin}</dd></div>
          <div><dt>Theme</dt><dd>{artwork.theme}</dd></div>
        </dl>
      </div>

      <section className="detail-story" aria-labelledby="notice-title">
        <div>
          <p className="eyebrow">Editorial reading</p>
          <h2 id="notice-title">Look once.<br /><em>Then look again.</em></h2>
        </div>
        <div className="detail-story-copy">
          <p>
            {artwork.editorial} LUMEN treats this note as a prompt for attention rather than a definitive interpretation.
            The source object remains intact while color, mood and thematic metadata offer optional ways to continue.
          </p>
          <p className="evidence-note">Mood, palette names, themes and relationship explanations are LUMEN prototype metadata, not museum-authored scholarship.</p>
          <button className="atlas-cta" onClick={onAtlas}>Show connections <span>↗</span></button>
        </div>
      </section>

      <section className="detail-specs" aria-label="Artwork technical details">
        <div><span>Dimensions</span><p>{artwork.dimensions}</p></div>
        <div><span>License</span><p>{artwork.license}</p></div>
        <div><span>Source</span><p><a href={artwork.sourceUrl} target="_blank" rel="noreferrer">Wikimedia Commons ↗</a></p></div>
      </section>

      <section className="detail-threads" aria-labelledby="threads-title">
        <div>
          <p className="eyebrow">Threads</p>
          <h2 id="threads-title">If you like this,<br /><em>drift toward…</em></h2>
        </div>
        <div className="thread-list">
          {threads.map((thread) => (
            <button key={thread.label} onClick={() => thread.artwork && onOpen(thread.artwork)}>
              <span>{thread.label}</span>
              <strong>{thread.artwork?.title}</strong>
              <small>{thread.note}</small>
              <i>↗</i>
            </button>
          ))}
        </div>
      </section>
    </article>
  );
}

type RelationType = 'Color' | 'Era' | 'Movement' | 'Theme';

function Atlas({
  artwork,
  artworks,
  onBack,
  onRecenter,
  onTrace,
}: {
  artwork: Artwork;
  artworks: Artwork[];
  onBack: () => void;
  onRecenter: (artwork: Artwork) => void;
  onTrace: (ids: string[]) => void;
}) {
  const [filters, setFilters] = useState<Record<RelationType, boolean>>({
    Color: true,
    Era: true,
    Movement: true,
    Theme: true,
  });
  const [notice, setNotice] = useState('');

  const candidates = artworks.filter((item) => item.id !== artwork.id);
  const nearestColor = [...candidates].sort(
    (a, b) => Math.abs(parseInt(a.accent.slice(1), 16) - parseInt(artwork.accent.slice(1), 16)) -
      Math.abs(parseInt(b.accent.slice(1), 16) - parseInt(artwork.accent.slice(1), 16)),
  )[0];
  const sameEra = candidates.find((item) => item.era === artwork.era && item.id !== nearestColor?.id) || candidates[1];
  const sameMovement = candidates.find((item) => item.movement === artwork.movement && item.id !== nearestColor?.id && item.id !== sameEra?.id) || candidates[2];
  const sameTheme = candidates.find((item) => item.theme === artwork.theme && ![nearestColor?.id, sameEra?.id, sameMovement?.id].includes(item.id)) || candidates[3];

  const nodes: Array<{ type: RelationType; artwork?: Artwork; explanation: string }> = [
    { type: 'Color', artwork: nearestColor, explanation: 'Both sit close in the current prototype dominant-color map.' },
    { type: 'Era', artwork: sameEra, explanation: 'Both were created in the same 2000s digital-making context.' },
    { type: 'Movement', artwork: sameMovement, explanation: 'Both are grouped here under digital abstraction.' },
    { type: 'Theme', artwork: sameTheme, explanation: 'Both carry the same LUMEN editorial theme or its closest available echo.' },
  ].filter((node) => node.artwork);

  const visible = nodes.filter((node) => filters[node.type]);
  const trace = () => {
    onTrace([artwork.id, ...visible.map((node) => node.artwork!.id)]);
    setNotice('Path saved to your collection');
  };

  return (
    <section className="atlas atlas--expanded" aria-labelledby="atlas-title">
      <div className="atlas-head">
        <button onClick={onBack}>← Object</button>
        <div><p className="eyebrow">Relationship Atlas</p><h1 id="atlas-title">Follow the<br /><em>reason.</em></h1></div>
        <p>Toggle a relationship type, then recenter the map on any connected work. Every line states why it exists.</p>
      </div>

      <div className="atlas-filter-bar" role="group" aria-label="Relationship filters">
        {(Object.keys(filters) as RelationType[]).map((type) => (
          <button
            key={type}
            className={filters[type] ? 'is-active' : ''}
            aria-pressed={filters[type]}
            onClick={() => setFilters((current) => ({ ...current, [type]: !current[type] }))}
          >
            {type}
          </button>
        ))}
        <button className="trace-button" onClick={trace}>Trace this path +</button>
        <span role="status">{notice}</span>
      </div>

      <div className="atlas-canvas atlas-canvas--typed" aria-label="Interactive relationship map">
        <svg className="atlas-lines" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
          {visible.map((node, index) => {
            const paths = [
              'M500 310 C420 235 300 170 175 120',
              'M500 310 C585 230 705 170 835 120',
              'M500 310 C420 385 300 450 175 510',
              'M500 310 C585 390 705 455 835 510',
            ];
            return <path key={node.type} d={paths[index] || paths[0]} className={'relation-line relation-line--' + node.type.toLowerCase()} />;
          })}
        </svg>

        <button className="atlas-center" onClick={onBack}>
          <span className="atlas-center-image" style={{ '--card-accent': artwork.accent } as CSSProperties}>
            <img src={artwork.image} alt="" style={artworkTransition(artwork.id)} />
          </span>
          <span>{artwork.title}</span>
        </button>

        {visible.map((node, index) => (
          <button
            key={node.type}
            className={'atlas-node atlas-node--' + (index + 1) + ' atlas-node--typed'}
            onClick={() => node.artwork && onRecenter(node.artwork)}
          >
            <span>{node.type}</span>
            <strong>{node.artwork?.title}</strong>
            <small>{node.explanation}</small>
          </button>
        ))}
      </div>

      <div className="atlas-list">
        <p className="eyebrow">Connected works / text equivalent</p>
        <ol>
          {visible.map((node) => (
            <li key={node.type}>
              <span>{node.type}</span>
              <div><strong>{node.artwork?.title}</strong><small>{node.explanation}</small></div>
              <button onClick={() => node.artwork && onRecenter(node.artwork)}>Recenter ↗</button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default App;
