import { CSSProperties, KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { Artwork, relationsFor, thumb } from './artworks';
import { documentedThreadsFor, exhibitionsFor } from './exhibitions';
import { Link, useRouter } from './router';
import { MuseumData, SESSION_KEYS, readSession } from './store';
import { SetPicker } from './MuseumControls';

function artworkTransition(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
}

const MIN_ZOOM = 1.5;
const MAX_ZOOM = 4;

function ZoomViewport({ artwork, scale, onScale }: { artwork: Artwork; scale: number; onScale: (value: number) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const clamp = (x: number, y: number, s = scale) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x, y };
    const maxX = ((s - 1) * rect.width) / 2;
    const maxY = ((s - 1) * rect.height) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, x)), y: Math.max(-maxY, Math.min(maxY, y)) };
  };

  useEffect(() => { setOffset((current) => clamp(current.x, current.y)); }, [scale]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { viewportRef.current?.focus({ preventScroll: true }); }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setOffset(clamp(drag.current.ox + event.clientX - drag.current.x, drag.current.oy + event.clientY - drag.current.y));
  };
  const onPointerUp = () => { drag.current = null; };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = 60;
    const moves: Record<string, [number, number]> = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (moves[event.key]) {
      event.preventDefault();
      setOffset((current) => clamp(current.x + moves[event.key][0], current.y + moves[event.key][1]));
    }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); onScale(Math.min(MAX_ZOOM, scale + 0.5)); }
    if (event.key === '-') { event.preventDefault(); onScale(Math.max(MIN_ZOOM, scale - 0.5)); }
  };

  return (
    <div
      ref={viewportRef}
      className="zoom-viewport"
      tabIndex={0}
      role="group"
      aria-label={'Zoomed view of ' + artwork.title + '. Drag or use arrow keys to pan, plus and minus to zoom.'}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <img
        src={artwork.image}
        alt={artwork.alt}
        draggable={false}
        style={{ transform: 'translate(' + offset.x + 'px, ' + offset.y + 'px) scale(' + scale + ')' }}
      />
    </div>
  );
}

export function ArtworkNotFound({ id }: { id: string }) {
  return (
    <section className="not-found object-not-found" aria-labelledby="object-missing-title">
      <p className="eyebrow">Object not found</p>
      <h1 id="object-missing-title">No object<br /><em>at this number.</em></h1>
      <p>There is no work with the reference “{id}” in the collection. It may have been mistyped, or the link may be from an older version.</p>
      <div>
        <Link className="button-link" to={{ view: 'collection', query: '' }}>Browse collection</Link>
        <Link className="button-link" to={{ view: 'portal' }}>Return home</Link>
      </div>
    </section>
  );
}

export function ArtworkDetail({ artwork, artworks, data }: { artwork: Artwork; artworks: Artwork[]; data: MuseumData }) {
  const { navigate } = useRouter();
  const [zoomed, setZoomed] = useState(false);
  const [scale, setScale] = useState(2);
  const index = artworks.findIndex((item) => item.id === artwork.id);
  const previous = artworks[(index - 1 + artworks.length) % artworks.length];
  const next = artworks[(index + 1) % artworks.length];
  const isSaved = data.isSaved(artwork.id);
  const threads = relationsFor(artwork, artworks, ['Color', 'Era', 'Mood']);
  const documented = documentedThreadsFor(artwork.id);
  const appearances = exhibitionsFor(artwork.id);
  const sameArtist = artworks.filter((item) => item.artist === artwork.artist && item.id !== artwork.id).slice(0, 4);
  const collectionQuery = readSession(SESSION_KEYS.collectionQuery) || '';

  useEffect(() => { setZoomed(false); setScale(2); }, [artwork.id]);

  return (
    <article className="detail" aria-labelledby="detail-title" style={{ '--accent': artwork.accent } as CSSProperties}>
      <div className="detail-toolbar">
        <Link to={{ view: 'collection', query: collectionQuery }} className="detail-back">← Collection</Link>
        <span>Object {String(index + 1).padStart(2, '0')} of {artworks.length}</span>
        <div>
          <button type="button" onClick={() => setZoomed((value) => !value)} aria-pressed={zoomed}>{zoomed ? 'Fit image' : 'Zoom image'}</button>
          <button type="button" onClick={() => data.toggleSaved(artwork.id)} aria-pressed={isSaved}>{isSaved ? 'Saved ✓' : 'Save +'}</button>
          <SetPicker artworkId={artwork.id} artworkTitle={artwork.title} data={data} />
        </div>
      </div>

      <div className={'detail-art-stage ' + (zoomed ? 'is-zoomed' : '')}>
        {zoomed ? (
          <>
            <ZoomViewport artwork={artwork} scale={scale} onScale={setScale} />
            <div className="zoom-controls" role="group" aria-label="Zoom controls">
              <button type="button" onClick={() => setScale((value) => Math.max(MIN_ZOOM, value - 0.5))} disabled={scale <= MIN_ZOOM} aria-label="Zoom out">−</button>
              <span aria-live="polite">{Math.round(scale * 100)}%</span>
              <button type="button" onClick={() => setScale((value) => Math.min(MAX_ZOOM, value + 0.5))} disabled={scale >= MAX_ZOOM} aria-label="Zoom in">+</button>
            </div>
          </>
        ) : (
          <button type="button" className="detail-art-frame" style={{ '--card-accent': artwork.accent } as CSSProperties} onClick={() => setZoomed(true)} aria-label={'Zoom into ' + artwork.title}>
            <img
              src={artwork.image}
              alt={artwork.alt}
              style={artworkTransition(artwork.id)}
              onError={(event) => { event.currentTarget.style.opacity = '0'; }}
            />
          </button>
        )}
        <div className="detail-counter">Object / {artwork.id}</div>
      </div>

      <div className="detail-heading">
        <div>
          <p className="eyebrow">{artwork.classification}</p>
          <h1 id="detail-title">{artwork.title}</h1>
          <p className="artist-line">
            <Link to={{ view: 'collection', query: 'artist=' + encodeURIComponent(artwork.artist) }}>{artwork.artist}</Link>
          </p>
          <div className="detail-tags">
            <span>{artwork.movement}</span>
            <span>{artwork.medium}</span>
            <span><i style={{ background: artwork.accent }} />{artwork.paletteName}</span>
            <span>{artwork.mood}</span>
          </div>
        </div>
        <dl>
          <div><dt>Date</dt><dd>{artwork.date}</dd></div>
          <div><dt>Medium</dt><dd>{artwork.medium}</dd></div>
          <div><dt>Dimensions</dt><dd>{artwork.dimensions}</dd></div>
          <div><dt>Place</dt><dd>{artwork.origin}</dd></div>
          {artwork.holding && <div><dt>Collection</dt><dd>{artwork.holding}</dd></div>}
          <div>
            <dt>Theme</dt>
            <dd><Link to={{ view: 'collection', query: 'theme=' + encodeURIComponent(artwork.theme) }}>{artwork.theme}</Link></dd>
          </div>
        </dl>
      </div>

      <section className="detail-story" aria-labelledby="notice-title">
        <div>
          <p className="eyebrow">Editorial reading</p>
          <h2 id="notice-title">Look once.<br /><em>Then look again.</em></h2>
        </div>
        <div className="detail-story-copy">
          <p>{artwork.editorial}</p>
          <p className="evidence-note">Mood, palette names, themes and relationship explanations are LUMEN editorial metadata, not museum-authored scholarship.</p>
          <button type="button" className="atlas-cta" onClick={() => navigate({ view: 'atlas', id: artwork.id })}>Show connections <span>↗</span></button>
        </div>
      </section>

      <section className="detail-specs" aria-label="Rights and source">
        <div><span>Licence</span><p>{artwork.license}</p></div>
        <div><span>Source record</span><p><a href={artwork.sourceUrl} target="_blank" rel="noreferrer">{new URL(artwork.sourceUrl).hostname.replace('www.', '')} ↗</a></p></div>
        <div>
          <span>Exhibitions</span>
          {appearances.length ? (
            <ul className="detail-appearances">
              {appearances.map(({ exhibition, index: stopIndex }) => (
                <li key={exhibition.slug}>
                  <Link to={{ view: 'walk', slug: exhibition.slug, stop: stopIndex + 1 }}>
                    {exhibition.title} <small>stop {stopIndex + 1}</small>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p>Not in a curated exhibition yet.</p>}
        </div>
      </section>

      {documented.length > 0 && (
        <section className="detail-documented" aria-labelledby="documented-title">
          <div>
            <p className="eyebrow">Documented thread</p>
            <h2 id="documented-title">Connected by<br /><em>the record.</em></h2>
          </div>
          {documented.map((thread) => (
            <div className="documented-thread" key={thread.id}>
              <h3>{thread.title}</h3>
              <p>{thread.connection}</p>
              <ul className="related-strip">
                {thread.artworkIds.filter((id) => id !== artwork.id).map((id) => {
                  const work = artworks.find((item) => item.id === id);
                  return work ? (
                    <li key={id}>
                      <Link to={{ view: 'detail', id }}>
                        <img src={thumb(work, 330)} alt="" loading="lazy" />
                        <span><strong>{work.title}</strong>{work.date}</span>
                      </Link>
                    </li>
                  ) : null;
                })}
              </ul>
              {thread.letter && (
                <a className="documented-letter" href={thread.letter.source} target="_blank" rel="noreferrer">
                  <span>Letter to Theo, {thread.letter.date}, {thread.letter.place}</span>
                  <strong>{thread.letter.note}</strong>
                  <small>Open the scholarly letter edition ↗</small>
                </a>
              )}
            </div>
          ))}
        </section>
      )}

      <section className="detail-threads" aria-labelledby="threads-title">
        <div>
          <p className="eyebrow">Related works</p>
          <h2 id="threads-title">If you like this,<br /><em>drift toward…</em></h2>
        </div>
        <div className="thread-list">
          {threads.map((thread) => (
            <button type="button" key={thread.type} onClick={() => navigate({ view: 'detail', id: thread.artwork.id })}>
              <span>{thread.type}</span>
              <strong>{thread.artwork.title}</strong>
              <small>{thread.explanation}</small>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
      </section>

      {sameArtist.length > 0 && (
        <section className="detail-more" aria-labelledby="more-title">
          <h2 id="more-title">More by {artwork.artist}</h2>
          <ul className="related-strip">
            {sameArtist.map((work) => (
              <li key={work.id}>
                <Link to={{ view: 'detail', id: work.id }}>
                  <img src={thumb(work, 330)} alt="" loading="lazy" />
                  <span><strong>{work.title}</strong>{work.date}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="detail-pager" aria-label="Previous and next object">
        <Link to={{ view: 'detail', id: previous.id }} rel="prev">
          <span>← Previous</span>
          <strong>{previous.title}</strong>
        </Link>
        <Link to={{ view: 'detail', id: next.id }} rel="next">
          <span>Next →</span>
          <strong>{next.title}</strong>
        </Link>
      </nav>
    </article>
  );
}
