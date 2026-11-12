import { CSSProperties, useEffect, useRef } from 'react';
import { useState } from 'react';
import { Artwork } from './artworks';

function artworkTransition(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
}

export function Portal({
  artworks,
  loading,
  reducedMotion,
  onEnter,
  onExhibition,
  onMood,
  onCollection,
  exhibitionCount,
}: {
  artworks: Artwork[];
  loading: boolean;
  reducedMotion: boolean;
  onEnter: () => void;
  onExhibition: () => void;
  onMood: () => void;
  onCollection: () => void;
  exhibitionCount: number;
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
      const target = event.target as HTMLElement | null;
      // Space on a focused control must activate that control, not hijack navigation.
      if (target?.closest('button, a, input, textarea, select, [role="dialog"], [role="alertdialog"]')) return;
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
          <button onClick={onExhibition}>Browse exhibitions <span aria-hidden="true">↗</span></button>
          <button onClick={onMood}>Pick a mood <span aria-hidden="true">↗</span></button>
          <button onClick={onCollection}>Browse collection <span aria-hidden="true">↗</span></button>
        </div>
      </div>

      <div className="portal-index portal-index--stats" aria-hidden="true">
        {artworks.length || '—'} works · 9 mood paths · {exhibitionCount} exhibitions · Space / scroll to drift
      </div>
    </section>
  );
}

export function Drift({
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
    <section className={'drift-section ' + (reducedMotion ? 'is-reduced' : '')} aria-labelledby="drift-title">
      <div className="drift-atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <div className="drift-intro">
        <div>
          <p className="eyebrow">Explore / Drift</p>
          <h1 id="drift-title">Follow what catches<br /><em>your eye.</em></h1>
        </div>
        <div className="drift-copy">
          <p>Move by attention, not taxonomy. The room is deliberately small: eight works, enough space to wander, no dashboard between you and the art.</p>
          <button className="drift-index-link" onClick={onGrid}>Need order? Open the collection <span aria-hidden="true">↗</span></button>
        </div>
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
        {(loading && artworks.length === 0 ? Array.from({ length: 6 }) : artworks.slice(0, 8)).map((item, index) => {
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

      <div className="drift-compass" aria-label="Continue exploring">
        <div>
          <span>Change the lens</span>
          <p>Keep the room quiet. Switch only when another way of looking becomes useful.</p>
        </div>
        <div className="drift-compass-actions">
          <button onClick={onChromatic}>Follow color <span aria-hidden="true">↗</span></button>
          <button onClick={onMood}>Follow feeling <span aria-hidden="true">↗</span></button>
          <button onClick={() => artworks[0] && onOpenAtlas(artworks[0])}>Follow a thread <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </section>
  );
}
