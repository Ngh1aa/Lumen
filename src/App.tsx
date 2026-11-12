import { CSSProperties, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Artwork, collection, relationsFor } from './artworks';
import { ChromaticView } from './DiscoveryViews';
import { MoodView } from './CulturalExperience';
import { VincentExperience } from './VincentExperience';
import { ExhibitionIndex } from './ExhibitionIndex';
import {
  AboutView,
  AccessibilityPanel,
  NotFoundView,
  OnboardingHint,
  QuickPreview,
} from './ExperienceLayers';
import { Portal, Drift } from './PortalDrift';
import { CollectionView } from './CollectionView';
import { ArtworkDetail, ArtworkNotFound } from './ArtworkDetail';
import { ExhibitionNotFound, ExhibitionOverview, ExhibitionWalk } from './ExhibitionWalk';
import { MyCollection } from './MyCollection';
import { ConfirmDialog } from './MuseumControls';
import { exhibitions, findExhibition } from './exhibitions';
import { Link, NavigateOptions, pageKey, parseHash, Route, RouterContext, toHash } from './router';
import { readSession, SESSION_KEYS, useMuseumData } from './store';

function artworkTransition(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
}

function useSystemReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return reduced;
}

function readLocal(key: string) {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function writeLocal(key: string, value: string) {
  try { window.localStorage.setItem(key, value); } catch { /* ignore */ }
}

const artworkIds = collection.map((artwork) => artwork.id);

function titleFor(route: Route): string {
  const suffix = ' — LUMEN';
  switch (route.view) {
    case 'portal': return 'LUMEN — Digital Museum of Visual Culture';
    case 'drift': return 'Drift' + suffix;
    case 'chromatic': return 'Explore by color' + suffix;
    case 'mood': return 'Explore by mood' + suffix;
    case 'collection': return 'Collection' + suffix;
    case 'exhibitions': return 'Exhibitions' + suffix;
    case 'journey': return 'VINCENT: The Painted Night' + suffix;
    case 'exhibition': return (findExhibition(route.slug)?.title || 'Exhibition not found') + suffix;
    case 'walk': {
      const exhibition = findExhibition(route.slug);
      const stop = exhibition?.stops[route.stop - 1];
      const work = stop && collection.find((item) => item.id === stop.artworkId);
      return exhibition && work ? 'Stop ' + route.stop + ': ' + work.title + ' — ' + exhibition.title + suffix : 'Exhibition stop not found' + suffix;
    }
    case 'saved': return 'My collection' + suffix;
    case 'about': return 'About' + suffix;
    case 'detail': {
      const work = collection.find((item) => item.id === route.id);
      return (work ? work.title + ', ' + work.artist : 'Object not found') + suffix;
    }
    case 'atlas': return 'Relationship Atlas' + suffix;
    default: return 'Page not found' + suffix;
  }
}

let keySeed = 0;
const newHistoryKey = () => Date.now().toString(36) + '-' + (keySeed++).toString(36);

function App() {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));
  const artworks = collection;
  const data = useMuseumData(artworkIds);
  const [forcedReduced, setForcedReduced] = useState(() => readLocal('lumen-motion') === 'reduced');
  const [highContrast, setHighContrast] = useState(() => readLocal('lumen-contrast') === 'high');
  const [previewId, setPreviewId] = useState<string>();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(() => readLocal('lumen-onboarded') !== 'yes');
  const systemReduced = useSystemReducedMotion();
  const reducedMotion = systemReduced || forcedReduced;
  const mainRef = useRef<HTMLElement>(null);

  /* ---------- history: keys, scroll restoration, focus ---------- */
  const historyKey = useRef<string>('');
  const scrollPositions = useRef(new Map<string, number>());
  const pendingScroll = useRef<number | null>(null);
  const lastHash = useRef(window.location.hash);
  const previousPage = useRef<string | null>(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    const state = window.history.state as { lumenKey?: string } | null;
    historyKey.current = state?.lumenKey || newHistoryKey();
    if (!state?.lumenKey) window.history.replaceState({ ...(state || {}), lumenKey: historyKey.current }, '', window.location.href);

    const onPop = (event: PopStateEvent) => {
      if (window.location.hash === lastHash.current && event.type === 'hashchange') return;
      lastHash.current = window.location.hash;
      scrollPositions.current.set(historyKey.current, window.scrollY);
      const key = (event as PopStateEvent).state?.lumenKey as string | undefined;
      if (key) {
        historyKey.current = key;
        pendingScroll.current = scrollPositions.current.get(key) ?? 0;
      } else {
        historyKey.current = newHistoryKey();
        window.history.replaceState({ ...(window.history.state || {}), lumenKey: historyKey.current }, '', window.location.href);
        pendingScroll.current = 0;
      }
      setRoute(parseHash(window.location.hash));
    };
    window.addEventListener('popstate', onPop);
    window.addEventListener('hashchange', onPop as unknown as EventListener);
    return () => {
      window.removeEventListener('popstate', onPop);
      window.removeEventListener('hashchange', onPop as unknown as EventListener);
    };
  }, []);

  const navigate = useCallback((to: Route | string, options: NavigateOptions = {}) => {
    const hash = toHash(to);
    const next = parseHash(hash);
    const samePage = pageKey(next) === pageKey(parseHash(window.location.hash));
    const apply = () => {
      if (options.replace) {
        window.history.replaceState({ ...(window.history.state || {}), lumenKey: historyKey.current }, '', hash);
      } else {
        scrollPositions.current.set(historyKey.current, window.scrollY);
        historyKey.current = newHistoryKey();
        window.history.pushState({ lumenKey: historyKey.current }, '', hash);
      }
      lastHash.current = window.location.hash;
      if (!samePage) pendingScroll.current = 0;
      setRoute(next);
    };
    if (!samePage && !reducedMotion && document.startViewTransition) {
      document.startViewTransition(() => flushSync(apply));
    } else {
      apply();
    }
  }, [reducedMotion]);

  useLayoutEffect(() => {
    const key = pageKey(route);
    const isInitial = previousPage.current === null;
    // Any route event (including a same-hash popstate) dismisses the quick preview.
    setPreviewId(undefined);
    if (key !== previousPage.current) {
      previousPage.current = key;
      if (!isInitial) {
        const heading = mainRef.current?.querySelector<HTMLElement>('h1');
        const target = heading || mainRef.current;
        if (target) {
          if (heading && !heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      }
      const top = pendingScroll.current;
      if (top !== null) {
        window.scrollTo({ top, behavior: 'auto' });
        if (top > 0) {
          // Restored pages may still be laying out images: retry until the position sticks.
          let tries = 0;
          const retry = () => {
            if (Math.abs(window.scrollY - top) < 2 || tries++ > 20) return;
            window.scrollTo({ top, behavior: 'auto' });
            window.setTimeout(retry, 50);
          };
          window.setTimeout(retry, 50);
        }
      }
    }
    pendingScroll.current = null;
    document.title = titleFor(route);
  }, [route]);

  /* ---------- preferences ---------- */
  useEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
    document.documentElement.dataset.contrast = highContrast ? 'high' : 'default';
    writeLocal('lumen-motion', forcedReduced ? 'reduced' : 'auto');
    writeLocal('lumen-contrast', highContrast ? 'high' : 'default');
  }, [reducedMotion, forcedReduced, highContrast]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const active = useMemo(() => ('id' in route ? artworks.find((item) => item.id === route.id) : undefined), [artworks, route]);
  const accentArtwork = active || artworks[0];
  const previewArtwork = useMemo(() => artworks.find((item) => item.id === previewId), [artworks, previewId]);

  const dismissOnboarding = () => {
    writeLocal('lumen-onboarded', 'yes');
    setShowOnboarding(false);
  };

  const vincentThreadCount = (() => {
    try { return (JSON.parse(readSession(SESSION_KEYS.vincentThreads) || '[]') as string[]).length; } catch { return 0; }
  })();
  const noteCount = Object.values(data.notes).filter((note) => note.trim()).length;

  const confirmReset = () => {
    data.resetDemoData();
    setResetOpen(false);
    setToast('Demo data reset. Saved works, sets and notes were cleared from this tab.');
  };

  const routerValue = useMemo(() => ({ route, navigate }), [route, navigate]);

  const renderView = () => {
    switch (route.view) {
      case 'portal':
        return (
          <Portal
            artworks={artworks}
            loading={false}
            reducedMotion={reducedMotion}
            exhibitionCount={exhibitions.length}
            onEnter={() => navigate({ view: 'drift' })}
            onExhibition={() => navigate({ view: 'exhibitions' })}
            onMood={() => navigate({ view: 'mood' })}
            onCollection={() => navigate({ view: 'collection', query: '' })}
          />
        );
      case 'drift':
        return (
          <Drift
            artworks={artworks}
            loading={false}
            reducedMotion={reducedMotion}
            onPreview={(artwork) => setPreviewId(artwork.id)}
            onOpenAtlas={(artwork) => navigate({ view: 'atlas', id: artwork.id })}
            onGrid={() => navigate({ view: 'collection', query: '' })}
            onChromatic={() => navigate({ view: 'chromatic' })}
            onMood={() => navigate({ view: 'mood' })}
          />
        );
      case 'collection':
        return <CollectionView artworks={artworks} query={route.query} data={data} />;
      case 'chromatic':
        return (
          <ChromaticView
            artworks={artworks}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onDrift={() => navigate({ view: 'drift' })}
            onGrid={() => navigate({ view: 'collection', query: '' })}
            onChromatic={() => navigate({ view: 'chromatic' })}
          />
        );
      case 'mood':
        return (
          <MoodView
            artworks={artworks}
            onOpen={(artwork) => navigate({ view: 'detail', id: artwork.id })}
            onStory={() => navigate({ view: 'exhibitions' })}
          />
        );
      case 'exhibitions':
        return (
          <ExhibitionIndex
            reducedMotion={reducedMotion}
            artworks={artworks}
            onEnterVincent={() => navigate({ view: 'journey' })}
            onExplore={() => navigate({ view: 'collection', query: '' })}
          />
        );
      case 'journey':
        return (
          <VincentExperience
            reducedMotion={reducedMotion}
            onDrift={() => navigate({ view: 'drift' })}
            onColor={() => navigate({ view: 'chromatic' })}
            walkHref="#/exhibition/vincent/1"
          />
        );
      case 'exhibition': {
        const exhibition = findExhibition(route.slug);
        if (!exhibition) return <ExhibitionNotFound slug={route.slug} />;
        return <ExhibitionOverview exhibition={exhibition} artworks={artworks} data={data} />;
      }
      case 'walk': {
        const exhibition = findExhibition(route.slug);
        if (!exhibition) return <ExhibitionNotFound slug={route.slug} />;
        return <ExhibitionWalk exhibition={exhibition} stopNumber={route.stop} artworks={artworks} data={data} />;
      }
      case 'saved':
        return <MyCollection artworks={artworks} data={data} setId={route.setId} onResetRequest={() => setResetOpen(true)} />;
      case 'about':
        return (
          <AboutView
            onExplore={() => navigate({ view: 'drift' })}
            onColor={() => navigate({ view: 'chromatic' })}
            onMood={() => navigate({ view: 'mood' })}
            onExhibition={() => navigate({ view: 'exhibitions' })}
          />
        );
      case 'detail':
        return active ? <ArtworkDetail artwork={active} artworks={artworks} data={data} /> : <ArtworkNotFound id={route.id} />;
      case 'atlas':
        return active ? (
          <Atlas
            artwork={active}
            artworks={artworks}
            onBack={() => navigate({ view: 'detail', id: active.id })}
            onRecenter={(artwork) => navigate({ view: 'atlas', id: artwork.id })}
            onTrace={(ids) => data.save(ids)}
          />
        ) : <ArtworkNotFound id={route.id} />;
      default:
        return (
          <NotFoundView
            onHome={() => navigate({ view: 'portal' })}
            onExplore={() => navigate({ view: 'drift' })}
          />
        );
    }
  };

  return (
    <RouterContext.Provider value={routerValue}>
      <div className="app-shell" style={{ '--accent': accentArtwork?.accent || '#c7674d' } as CSSProperties}>
        <a className="skip-link" href="#main" onClick={(event) => { event.preventDefault(); mainRef.current?.focus(); }}>Skip to content</a>
        <Header route={route} savedCount={data.saved.length} onSettings={() => setSettingsOpen(true)} />
        <MobileDock route={route} savedCount={data.saved.length} />

        <main id="main" ref={mainRef} tabIndex={-1}>
          <div className="view-root" key={data.version}>{renderView()}</div>
        </main>

        <footer className="site-footer site-footer--museum">
          <div className="footer-brand"><strong>LUMEN</strong><span>Digital Museum of Visual Culture</span></div>
          <nav className="footer-nav" aria-label="Footer">
            <Link to={{ view: 'collection', query: '' }}>Collection</Link>
            <Link to={{ view: 'exhibitions' }}>Exhibitions</Link>
            <Link to={{ view: 'saved' }}>My collection</Link>
            <Link to={{ view: 'about' }}>About</Link>
          </nav>
          <div className="footer-session">
            <p>Saved works and sets stay in this browser tab and clear when it closes.</p>
            <button type="button" onClick={() => setResetOpen(true)}>Reset demo data</button>
          </div>
        </footer>

        <div className="app-toast" aria-live="polite">{toast && <p>{toast}</p>}</div>

        <QuickPreview
          artwork={previewArtwork}
          isSaved={Boolean(previewArtwork && data.isSaved(previewArtwork.id))}
          onClose={() => setPreviewId(undefined)}
          onOpen={() => previewArtwork && navigate({ view: 'detail', id: previewArtwork.id })}
          onSave={() => previewArtwork && data.toggleSaved(previewArtwork.id)}
        />

        <AccessibilityPanel
          open={settingsOpen}
          reducedMotion={reducedMotion}
          highContrast={highContrast}
          onClose={() => setSettingsOpen(false)}
          onMotionToggle={() => setForcedReduced((value) => !value)}
          onContrastToggle={() => setHighContrast((value) => !value)}
        />

        <ConfirmDialog
          open={resetOpen}
          title="Reset demo data?"
          confirmLabel="Reset demo data"
          onCancel={() => setResetOpen(false)}
          onConfirm={confirmReset}
        >
          <p>
            This clears {data.saved.length} saved {data.saved.length === 1 ? 'work' : 'works'}, {data.sets.length} {data.sets.length === 1 ? 'set' : 'sets'},
            {' '}{noteCount} {noteCount === 1 ? 'note' : 'notes'} and {vincentThreadCount} saved VINCENT {vincentThreadCount === 1 ? 'thread' : 'threads'} from this tab.
            Display settings are kept.
          </p>
        </ConfirmDialog>

        <OnboardingHint open={route.view === 'drift' && showOnboarding} onDismiss={dismissOnboarding} />
      </div>
    </RouterContext.Provider>
  );
}

const exploreViews: Route['view'][] = ['drift', 'chromatic', 'mood', 'atlas'];
const exhibitionViews: Route['view'][] = ['exhibitions', 'journey', 'exhibition', 'walk'];

function navState(route: Route, section: 'collection' | 'explore' | 'exhibitions' | 'saved' | 'about') {
  const on = section === 'collection' ? route.view === 'collection' || route.view === 'detail'
    : section === 'explore' ? exploreViews.includes(route.view)
      : section === 'exhibitions' ? exhibitionViews.includes(route.view)
        : section === 'saved' ? route.view === 'saved'
          : route.view === 'about';
  return {
    className: on ? 'is-active' : '',
    'aria-current': on ? ('page' as const) : undefined,
  };
}

function Header({ route, savedCount, onSettings }: { route: Route; savedCount: number; onSettings: () => void }) {
  return (
    <header className="site-header">
      <Link to={{ view: 'portal' }} className="wordmark">
        <span aria-hidden="true">LU<span>•</span>MEN</span><span className="sr-only">LUMEN home</span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link to={{ view: 'collection', query: '' }} {...navState(route, 'collection')}>Collection</Link>
        <Link to={{ view: 'drift' }} {...navState(route, 'explore')}>Explore</Link>
        <Link to={{ view: 'exhibitions' }} {...navState(route, 'exhibitions')}>Exhibitions</Link>
        <Link to={{ view: 'about' }} {...navState(route, 'about')}>About</Link>
      </nav>
      <div className="header-tools">
        <Link
          to={{ view: 'saved' }}
          className={'saved-count saved-button ' + navState(route, 'saved').className}
          aria-current={navState(route, 'saved')['aria-current']}
        >
          My collection <b>{String(savedCount).padStart(2, '0')}</b><span className="sr-only"> saved</span>
        </Link>
        <button type="button" className="motion-toggle" onClick={onSettings} aria-label="Access: open accessibility settings">
          Access
        </button>
      </div>
    </header>
  );
}

function MobileDock({ route, savedCount }: { route: Route; savedCount: number }) {
  return (
    <nav className="mobile-dock mobile-dock--five" aria-label="Mobile navigation">
      <Link to={{ view: 'collection', query: '' }} {...navState(route, 'collection')}><span>Collection</span></Link>
      <Link to={{ view: 'drift' }} {...navState(route, 'explore')}><span>Explore</span></Link>
      <Link to={{ view: 'exhibitions' }} {...navState(route, 'exhibitions')}><span>Shows</span></Link>
      <Link to={{ view: 'saved' }} {...navState(route, 'saved')}>
        <span>Saved</span><small>{String(savedCount).padStart(2, '0')}<span className="sr-only"> works</span></small>
      </Link>
      <Link to={{ view: 'about' }} {...navState(route, 'about')}><span>About</span></Link>
    </nav>
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

  const nodes = relationsFor(artwork, artworks, ['Color', 'Era', 'Movement', 'Theme']);
  const visible = nodes.filter((node) => filters[node.type as RelationType]);
  const trace = () => {
    onTrace([artwork.id, ...visible.map((node) => node.artwork.id)]);
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
            onClick={() => onRecenter(node.artwork)}
          >
            <span>{node.type}</span>
            <strong>{node.artwork.title}</strong>
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
              <div><strong>{node.artwork.title}</strong><small>{node.explanation}</small></div>
              <button onClick={() => onRecenter(node.artwork)}>Recenter ↗</button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default App;
