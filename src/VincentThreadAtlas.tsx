import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

export type VincentAtlasArtwork = {
  id: string;
  title: string;
  date: string;
  place: string;
  image: string;
  sourceUrl: string;
  note: string;
  themes: readonly string[];
};

export type VincentAtlasLetter = {
  id: string;
  label: string;
  date: string;
  place: string;
  source: string;
  note: string;
  themes: readonly string[];
};

export type VincentAtlasThread = {
  id: string;
  title: string;
  eyebrow: string;
  artworkIds: readonly string[];
  place: string;
  year: string;
  themes: readonly string[];
  letterId: string;
  connection: string;
};

type FilterKey = 'time' | 'place' | 'theme';

type FilterState = {
  time: string;
  place: string;
  theme: string;
};

const ALL = 'All';

const unique = (values: string[]) => Array.from(new Set(values));

export function VincentThreadAtlas({
  open,
  reducedMotion,
  artworks,
  letters,
  threads,
  savedThreadIds,
  onClose,
  onSaveThread,
  onTraceThread,
}: {
  open: boolean;
  reducedMotion: boolean;
  artworks: VincentAtlasArtwork[];
  letters: VincentAtlasLetter[];
  threads: VincentAtlasThread[];
  savedThreadIds: string[];
  onClose: () => void;
  onSaveThread: (threadId: string) => void;
  onTraceThread: (threadId: string) => void;
}) {
  const [filters, setFilters] = useState<FilterState>({ time: ALL, place: ALL, theme: ALL });
  const closeRef = useRef<HTMLButtonElement>(null);

  const filterOptions = useMemo(() => ({
    time: [ALL, ...unique(threads.map((thread) => thread.year))],
    place: [ALL, ...unique(threads.map((thread) => thread.place))],
    theme: [ALL, ...unique(threads.flatMap((thread) => [...thread.themes]))],
  }), [threads]);

  const visibleThreads = useMemo(
    () => threads.filter((thread) =>
      (filters.time === ALL || thread.year === filters.time)
      && (filters.place === ALL || thread.place === filters.place)
      && (filters.theme === ALL || thread.themes.includes(filters.theme))),
    [filters, threads],
  );

  const activeFilterCount = Object.values(filters).filter((value) => value !== ALL).length;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, open]);

  if (!open) return null;

  const setFilter = (key: FilterKey, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => setFilters({ time: ALL, place: ALL, theme: ALL });

  const moveSpotlight = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--atlas-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--atlas-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <div className="vincent-atlas-layer">
      <div className="vincent-atlas-scrim" aria-hidden="true" />
      <section
        className="vincent-atlas"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vincent-atlas-title"
        data-motion={reducedMotion ? 'reduced' : 'full'}
      >
        <header className="vincent-atlas-header">
          <div>
            <p>SUPER PROJECT 01 / CULTURAL THREAD SYSTEM</p>
            <h2 id="vincent-atlas-title">Thread <em>Atlas</em></h2>
          </div>
          <div className="vincent-atlas-header-actions">
            <span>{threads.length} verified threads / {artworks.length + letters.length} source objects</span>
            <button ref={closeRef} onClick={onClose} aria-label="Close Vincent Thread Atlas">×</button>
          </div>
        </header>

        <div className="vincent-atlas-intro">
          <div>
            <span>CONNECT / ORIENT</span>
            <h3>Follow what can be <em>verified</em>, not what merely looks related.</h3>
          </div>
          <p>
            Time, place and theme narrow two authored cultural threads. The filters only reveal
            relationships already documented in the exhibition; they never generate new historical claims.
          </p>
        </div>

        <div className="vincent-atlas-filter-deck" aria-label="Filter verified cultural threads">
          {([
            ['time', 'Time'],
            ['place', 'Place'],
            ['theme', 'Theme'],
          ] as Array<[FilterKey, string]>).map(([key, label]) => (
            <div className="vincent-atlas-filter" key={key}>
              <span>{label}</span>
              <div role="group" aria-label={label + ' filter'}>
                {filterOptions[key].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={filters[key] === option ? 'is-active' : ''}
                    aria-pressed={filters[key] === option}
                    onClick={() => setFilter(key, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="vincent-atlas-filter-summary" aria-live="polite">
            <span>{String(visibleThreads.length).padStart(2, '0')} / {String(threads.length).padStart(2, '0')}</span>
            <p>{activeFilterCount ? activeFilterCount + ' active filter' + (activeFilterCount > 1 ? 's' : '') : 'All verified threads visible'}</p>
            {activeFilterCount > 0 && <button type="button" onClick={resetFilters}>Reset</button>}
          </div>
        </div>

        <div className="vincent-atlas-field">
          {visibleThreads.length ? visibleThreads.map((thread, index) => {
            const threadArtworks = thread.artworkIds
              .map((id) => artworks.find((artwork) => artwork.id === id))
              .filter((artwork): artwork is VincentAtlasArtwork => Boolean(artwork));
            const letter = letters.find((item) => item.id === thread.letterId);
            const saved = savedThreadIds.includes(thread.id);

            return (
              <article
                className="vincent-atlas-thread"
                key={thread.id}
                onPointerMove={moveSpotlight}
                style={{ '--atlas-index': index } as CSSProperties}
              >
                <div className="vincent-atlas-thread-index">
                  <span>0{index + 1}</span>
                  <small>{thread.eyebrow}</small>
                </div>

                <div className="vincent-atlas-thread-media" aria-label={thread.title + ' artworks'}>
                  {threadArtworks.map((artwork) => (
                    <figure key={artwork.id}>
                      <img src={artwork.image} alt="" />
                      <figcaption>
                        <span>{artwork.date}</span>
                        <strong>{artwork.title}</strong>
                      </figcaption>
                    </figure>
                  ))}
                </div>

                <div className="vincent-atlas-thread-copy">
                  <p>{thread.year} / {thread.place}</p>
                  <h3>{thread.title}</h3>
                  <div className="vincent-atlas-thread-themes">
                    {thread.themes.map((theme) => <span key={theme}>{theme}</span>)}
                  </div>
                  <p className="vincent-atlas-thread-connection">{thread.connection}</p>
                  {letter && (
                    <a href={letter.source} target="_blank" rel="noreferrer" className="vincent-atlas-letter-link">
                      <span>LETTER / {letter.date}</span>
                      <strong>{letter.label}</strong>
                      <small>{letter.note}</small>
                    </a>
                  )}
                </div>

                <div className="vincent-atlas-thread-actions">
                  <button
                    type="button"
                    className="vincent-atlas-trace"
                    onClick={() => onTraceThread(thread.id)}
                  >
                    Trace thread ↗
                  </button>
                  <button
                    type="button"
                    className="vincent-atlas-save"
                    disabled={saved}
                    aria-label={saved ? 'Saved ' + thread.title : 'Save + ' + thread.title}
                    onClick={() => onSaveThread(thread.id)}
                  >
                    {saved ? 'Saved' : 'Save +'}
                  </button>
                </div>
              </article>
            );
          }) : (
            <div className="vincent-atlas-empty" role="status">
              <span>NO VERIFIED THREAD</span>
              <h3>No connection matches this combination.</h3>
              <p>
                LUMEN does not invent a bridge to keep the canvas full. Change a filter to return to
                a documented path.
              </p>
              <button type="button" onClick={resetFilters}>Show verified threads</button>
            </div>
          )}
        </div>

        <footer className="vincent-atlas-method">
          <div>
            <span>METHOD</span>
            <strong>Evidence before spectacle.</strong>
          </div>
          <p>
            Place and time derive from the artwork/letter records used in this prototype. Theme labels are
            a LUMEN-authored editorial index and are shown as interpretation, not museum taxonomy.
          </p>
        </footer>
      </section>
    </div>
  );
}
