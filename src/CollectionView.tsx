import { CSSProperties, useEffect, useId, useMemo, useState } from 'react';
import { Artwork, isWarm, thumb } from './artworks';
import { Link, useRouter } from './router';
import { MuseumData, SESSION_KEYS, writeSession } from './store';

type SortKey = 'curated' | 'title' | 'date-asc' | 'date-desc' | 'artist';
type Palette = 'all' | 'cool' | 'warm';
type ViewMode = 'grid' | 'list';

type Filters = {
  q: string;
  artist: string;
  period: string;
  medium: string;
  theme: string;
  palette: Palette;
  sort: SortKey;
  view: ViewMode;
};

const DEFAULTS: Filters = { q: '', artist: '', period: '', medium: '', theme: '', palette: 'all', sort: 'curated', view: 'grid' };

const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: 'curated', label: 'Curated order' },
  { key: 'title', label: 'Title A to Z' },
  { key: 'date-asc', label: 'Oldest first' },
  { key: 'date-desc', label: 'Newest first' },
  { key: 'artist', label: 'Artist A to Z' },
];

export function periodOf(year: number) {
  if (year < 1900) return '19th century';
  if (year < 2000) return '20th century';
  return '21st century';
}

function parseFilters(query: string): Filters {
  const params = new URLSearchParams(query);
  const pick = <T extends string>(key: keyof Filters, allowed?: readonly T[]) => {
    const value = params.get(key) || '';
    if (allowed && !allowed.includes(value as T)) return DEFAULTS[key];
    return value || DEFAULTS[key];
  };
  return {
    q: pick('q'),
    artist: pick('artist'),
    period: pick('period'),
    medium: pick('medium'),
    theme: pick('theme'),
    palette: pick('palette', ['all', 'cool', 'warm'] as const) as Palette,
    sort: pick('sort', SORTS.map((sort) => sort.key)) as SortKey,
    view: pick('view', ['grid', 'list'] as const) as ViewMode,
  };
}

function serialize(filters: Filters) {
  const params = new URLSearchParams();
  (Object.keys(filters) as Array<keyof Filters>).forEach((key) => {
    if (filters[key] && filters[key] !== DEFAULTS[key]) params.set(key, filters[key]);
  });
  return params.toString();
}

function countBy(artworks: Artwork[], key: (artwork: Artwork) => string) {
  const counts = new Map<string, number>();
  artworks.forEach((artwork) => counts.set(key(artwork), (counts.get(key(artwork)) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
}

export function CollectionView({ artworks, query, data }: { artworks: Artwork[]; query: string; data: MuseumData }) {
  const { navigate } = useRouter();
  const filters = useMemo(() => parseFilters(query), [query]);
  const [searchDraft, setSearchDraft] = useState(filters.q);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchId = useId();
  const filterPanelId = useId();

  useEffect(() => { setSearchDraft(filters.q); }, [filters.q]);
  useEffect(() => { writeSession(SESSION_KEYS.collectionQuery, query); }, [query]);

  const update = (patch: Partial<Filters>) => {
    const next = serialize({ ...filters, ...patch });
    navigate({ view: 'collection', query: next }, { replace: true });
  };

  // Debounced search keeps typing responsive and writes one history entry (replace) per pause.
  useEffect(() => {
    if (searchDraft === filters.q) return;
    const timer = window.setTimeout(() => update({ q: searchDraft }), 220);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDraft]);

  const periodRanges = useMemo(() => {
    const ranges = new Map<string, number[]>();
    artworks.forEach((artwork) => ranges.set(periodOf(artwork.year), [...(ranges.get(periodOf(artwork.year)) || []), artwork.year]));
    return Array.from(ranges.entries()).map(([period, years]) => {
      const min = Math.min(...years);
      const max = Math.max(...years);
      return { period, label: period + ' (' + (min === max ? min : min + '–' + max) + ')', count: years.length };
    });
  }, [artworks]);

  const options = useMemo(() => ({
    artist: countBy(artworks, (artwork) => artwork.artist),
    medium: countBy(artworks, (artwork) => artwork.medium),
    theme: countBy(artworks, (artwork) => artwork.theme),
  }), [artworks]);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const filtered = artworks.filter((artwork) => {
      if (filters.artist && artwork.artist !== filters.artist) return false;
      if (filters.period && periodOf(artwork.year) !== filters.period) return false;
      if (filters.medium && artwork.medium !== filters.medium) return false;
      if (filters.theme && artwork.theme !== filters.theme) return false;
      if (filters.palette !== 'all' && (filters.palette === 'warm') !== isWarm(artwork.accent)) return false;
      if (q) {
        const haystack = [artwork.title, artwork.artist, artwork.theme, artwork.mood, artwork.paletteName, artwork.medium, artwork.origin, artwork.date]
          .join(' ').toLowerCase();
        if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
      }
      return true;
    });
    const sorted = [...filtered];
    if (filters.sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (filters.sort === 'date-asc') sorted.sort((a, b) => a.year - b.year || a.title.localeCompare(b.title));
    if (filters.sort === 'date-desc') sorted.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
    if (filters.sort === 'artist') sorted.sort((a, b) => a.artist.localeCompare(b.artist) || a.title.localeCompare(b.title));
    return sorted;
  }, [artworks, filters]);

  const activeCount = [filters.q, filters.artist, filters.period, filters.medium, filters.theme].filter(Boolean).length
    + (filters.palette !== 'all' ? 1 : 0);
  const reset = () => {
    setSearchDraft('');
    navigate({ view: 'collection', query: serialize({ ...DEFAULTS, sort: filters.sort, view: filters.view }) }, { replace: true });
  };

  const warmCount = artworks.filter((artwork) => isWarm(artwork.accent)).length;

  return (
    <section className="collection-view collection-page" aria-labelledby="collection-title">
      <div className="collection-intro">
        <div>
          <p className="eyebrow">The collection</p>
          <h1 id="collection-title">Prefer order?<br /><em>Browse the collection.</em></h1>
        </div>
        <p>
          {artworks.length} public-domain works by {options.artist.length} artists, from Paris in 1887 to digital abstraction in 2009.
          Every object keeps its source record.
        </p>
      </div>

      <div className="collection-toolbar">
        <div className="collection-search">
          <label htmlFor={searchId}>Search the collection</label>
          <input
            id={searchId}
            type="search"
            value={searchDraft}
            placeholder="Title, artist, color, mood"
            onChange={(event) => setSearchDraft(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') update({ q: searchDraft }); }}
          />
        </div>
        <div className="collection-select collection-sort">
          <label htmlFor={searchId + 'sort'}>Sort</label>
          <select id={searchId + 'sort'} value={filters.sort} onChange={(event) => update({ sort: event.target.value as SortKey })}>
            {SORTS.map((sort) => <option key={sort.key} value={sort.key}>{sort.label}</option>)}
          </select>
        </div>
        <div className="collection-view-toggle collection-layout-toggle" role="group" aria-label="Result layout">
          <button type="button" aria-pressed={filters.view === 'grid'} className={filters.view === 'grid' ? 'is-active' : ''} onClick={() => update({ view: 'grid' })}>Grid</button>
          <button type="button" aria-pressed={filters.view === 'list'} className={filters.view === 'list' ? 'is-active' : ''} onClick={() => update({ view: 'list' })}>List</button>
        </div>
        <button
          type="button"
          className="collection-filters-toggle"
          aria-expanded={filtersOpen}
          aria-controls={filterPanelId}
          onClick={() => setFiltersOpen((value) => !value)}
        >
          Filters{activeCount ? ' (' + activeCount + ')' : ''}
        </button>
      </div>

      <div className="collection-browser">
        <aside id={filterPanelId} className={'collection-filters' + (filtersOpen ? ' is-open' : '')} aria-label="Collection filters">
          <div className="collection-select">
            <label htmlFor={searchId + 'artist'}>Artist</label>
            <select id={searchId + 'artist'} value={filters.artist} onChange={(event) => update({ artist: event.target.value })}>
              <option value="">All artists</option>
              {options.artist.map(([value, count]) => <option key={value} value={value}>{value} ({count})</option>)}
            </select>
          </div>
          <div className="collection-select">
            <label htmlFor={searchId + 'period'}>Period</label>
            <select id={searchId + 'period'} value={filters.period} onChange={(event) => update({ period: event.target.value })}>
              <option value="">All periods</option>
              {periodRanges.map((range) => <option key={range.period} value={range.period}>{range.label}</option>)}
            </select>
          </div>
          <div className="collection-select">
            <label htmlFor={searchId + 'medium'}>Medium</label>
            <select id={searchId + 'medium'} value={filters.medium} onChange={(event) => update({ medium: event.target.value })}>
              <option value="">All media</option>
              {options.medium.map(([value, count]) => <option key={value} value={value}>{value} ({count})</option>)}
            </select>
          </div>
          <div className="collection-select">
            <label htmlFor={searchId + 'theme'}>Theme</label>
            <select id={searchId + 'theme'} value={filters.theme} onChange={(event) => update({ theme: event.target.value })}>
              <option value="">All themes</option>
              {options.theme.map(([value, count]) => <option key={value} value={value}>{value} ({count})</option>)}
            </select>
          </div>
          <div className="collection-palette" role="group" aria-label="Palette temperature">
            <span>Palette</span>
            <button type="button" aria-pressed={filters.palette === 'all'} className={filters.palette === 'all' ? 'is-active' : ''} onClick={() => update({ palette: 'all' })}>All <small>{artworks.length}</small></button>
            <button type="button" aria-pressed={filters.palette === 'cool'} className={filters.palette === 'cool' ? 'is-active' : ''} onClick={() => update({ palette: 'cool' })}>Cool <small>{artworks.length - warmCount}</small></button>
            <button type="button" aria-pressed={filters.palette === 'warm'} className={filters.palette === 'warm' ? 'is-active' : ''} onClick={() => update({ palette: 'warm' })}>Warm <small>{warmCount}</small></button>
          </div>
          <button type="button" className="collection-reset" onClick={reset} disabled={activeCount === 0}>Reset filters</button>
        </aside>

        <div className="collection-results">
          <p className="collection-count" role="status" aria-live="polite">
            {results.length === artworks.length ? 'Showing all ' + artworks.length + ' works' : 'Showing ' + results.length + ' of ' + artworks.length + ' works'}
          </p>

          {results.length === 0 ? (
            <div className="collection-empty">
              <h2>No works match.</h2>
              <p>Nothing in the collection fits {activeCount > 1 ? 'all ' + activeCount + ' filters' : 'this filter'}. Loosen one, or start again.</p>
              <button type="button" onClick={reset}>Reset filters</button>
            </div>
          ) : filters.view === 'grid' ? (
            <ul className="grid-gallery collection-grid" aria-label="Collection results">
              {results.map((artwork, index) => (
                <li className="grid-card" key={artwork.id}>
                  <Link to={{ view: 'detail', id: artwork.id }} className="grid-card-link">
                    <span className="grid-image grid-image--natural" style={{ '--card-accent': artwork.accent } as CSSProperties}>
                      <img src={thumb(artwork)} alt={artwork.alt} loading={index > 5 ? 'lazy' : 'eager'} />
                    </span>
                    <span className="grid-card-meta">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span><strong>{artwork.title}</strong>{artwork.artist}</span>
                      <span>{artwork.date}</span>
                    </span>
                  </Link>
                  <SaveToggle artwork={artwork} data={data} />
                </li>
              ))}
            </ul>
          ) : (
            <ol className="collection-list" aria-label="Collection results">
              {results.map((artwork) => (
                <li key={artwork.id}>
                  <Link to={{ view: 'detail', id: artwork.id }} className="collection-list-link">
                    <span className="collection-list-thumb" style={{ '--card-accent': artwork.accent } as CSSProperties}>
                      <img src={thumb(artwork, 330)} alt="" loading="lazy" />
                    </span>
                    <span className="collection-list-title"><strong>{artwork.title}</strong>{artwork.artist}</span>
                    <span className="collection-list-cell">{artwork.date}</span>
                    <span className="collection-list-cell">{artwork.medium}</span>
                    <span className="collection-list-cell">{artwork.theme}</span>
                  </Link>
                  <SaveToggle artwork={artwork} data={data} />
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <nav className="collection-elsewhere" aria-label="Other ways in">
        <span>Other ways in</span>
        <Link to={{ view: 'drift' }}>Drift</Link>
        <Link to={{ view: 'chromatic' }}>Color</Link>
        <Link to={{ view: 'mood' }}>Mood</Link>
        <Link to={{ view: 'exhibitions' }}>Exhibitions</Link>
      </nav>
    </section>
  );
}

export function SaveToggle({ artwork, data, className = 'save-toggle' }: { artwork: Artwork; data: MuseumData; className?: string }) {
  const saved = data.isSaved(artwork.id);
  return (
    <button
      type="button"
      className={className + (saved ? ' is-saved' : '')}
      aria-pressed={saved}
      onClick={() => data.toggleSaved(artwork.id)}
    >
      {saved ? 'Saved ✓' : 'Save +'}<span className="sr-only"> {artwork.title}</span>
    </button>
  );
}
