import { CSSProperties, useEffect, useState } from 'react';
import { Artwork, thumb } from './artworks';
import { Exhibition, exhibitions } from './exhibitions';
import { Link, useRouter } from './router';
import { MuseumData } from './store';
import { SaveToggle } from './CollectionView';

function stopWorks(exhibition: Exhibition, artworks: Artwork[]) {
  return exhibition.stops.map((stop) => ({ stop, artwork: artworks.find((item) => item.id === stop.artworkId) }))
    .filter((entry): entry is { stop: Exhibition['stops'][number]; artwork: Artwork } => Boolean(entry.artwork));
}

function SaveExhibitionAsSet({ exhibition, artworks, data }: { exhibition: Exhibition; artworks: Artwork[]; data: MuseumData }) {
  const [createdId, setCreatedId] = useState<string>();
  const existing = data.sets.find((set) => set.id === createdId) || data.sets.find((set) => set.name === exhibition.title);
  const ids = stopWorks(exhibition, artworks).map((entry) => entry.artwork.id);
  return (
    <div className="exhibition-save">
      {existing ? (
        <p role="status">
          Saved as the set <Link to={{ view: 'saved', setId: existing.id }}>{existing.name}</Link> with {existing.artworkIds.length} works.
        </p>
      ) : (
        <>
          <button type="button" onClick={() => setCreatedId(data.createSet(exhibition.title, ids).id)}>Save as set</button>
          <p role="status" />
        </>
      )}
    </div>
  );
}

export function ExhibitionNotFound({ slug }: { slug: string }) {
  return (
    <section className="not-found" aria-labelledby="exhibition-missing-title">
      <p className="eyebrow">Exhibition not found</p>
      <h1 id="exhibition-missing-title">This room<br /><em>is closed.</em></h1>
      <p>There is no exhibition or stop at “{slug}”. The current exhibitions are listed on the exhibitions page.</p>
      <div>
        <Link className="button-link" to={{ view: 'exhibitions' }}>See exhibitions</Link>
        <Link className="button-link" to={{ view: 'collection', query: '' }}>Browse collection</Link>
      </div>
    </section>
  );
}

export function ExhibitionOverview({ exhibition, artworks, data }: { exhibition: Exhibition; artworks: Artwork[]; data: MuseumData }) {
  const works = stopWorks(exhibition, artworks);
  const cover = artworks.find((item) => item.id === exhibition.coverId) || works[0]?.artwork;
  const artists = Array.from(new Set(works.map((entry) => entry.artwork.artist)));
  const years = works.map((entry) => entry.artwork.year);
  const span = Math.min(...years) === Math.max(...years) ? String(years[0]) : Math.min(...years) + '–' + Math.max(...years);

  return (
    <article className="exhibition-page" aria-labelledby="exhibition-title" style={{ '--accent': exhibition.accent } as CSSProperties}>
      <header className="exhibition-hero">
        <div className="exhibition-hero-copy">
          <p className="eyebrow">Exhibition {exhibition.number}</p>
          <h1 id="exhibition-title">{exhibition.title}</h1>
          <p className="exhibition-subtitle">{exhibition.subtitle}</p>
          <p className="exhibition-thesis">{exhibition.thesis}</p>
          <dl className="exhibition-facts">
            <div><dt>Stops</dt><dd>{String(works.length).padStart(2, '0')}</dd></div>
            <div><dt>Artists</dt><dd>{artists.join(', ')}</dd></div>
            <div><dt>Made</dt><dd>{span}</dd></div>
          </dl>
          <div className="exhibition-actions">
            <Link className="button-link button-link--primary" to={{ view: 'walk', slug: exhibition.slug, stop: 1 }}>Begin walk-through <span aria-hidden="true">↗</span></Link>
            <SaveExhibitionAsSet exhibition={exhibition} artworks={artworks} data={data} />
          </div>
        </div>
        {cover && (
          <Link className="exhibition-cover" to={{ view: 'walk', slug: exhibition.slug, stop: Math.max(1, works.findIndex((entry) => entry.artwork.id === cover.id) + 1) }} aria-label={'Go to the stop for ' + cover.title}>
            <img src={thumb(cover)} alt={cover.alt} />
          </Link>
        )}
      </header>

      <section className="exhibition-stops" aria-labelledby="stops-title">
        <div className="exhibition-stops-head">
          <h2 id="stops-title">In this exhibition</h2>
          <p>{exhibition.curatorNote}</p>
        </div>
        <ol>
          {works.map(({ stop, artwork }, index) => (
            <li key={stop.artworkId + index}>
              <Link to={{ view: 'walk', slug: exhibition.slug, stop: index + 1 }}>
                <span className="stop-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="stop-thumb"><img src={thumb(artwork, 330)} alt="" loading="lazy" /></span>
                <span className="stop-label">{stop.label}</span>
                <span className="stop-title"><strong>{artwork.title}</strong>{artwork.artist}, {artwork.date}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <OtherExhibitions current={exhibition.slug} />
    </article>
  );
}

function OtherExhibitions({ current }: { current: string }) {
  return (
    <nav className="exhibition-others" aria-label="Other exhibitions">
      <span>Also on view</span>
      {exhibitions.filter((item) => item.slug !== current).map((item) => (
        <Link key={item.slug} to={item.kind === 'immersive' ? { view: 'journey' } : { view: 'exhibition', slug: item.slug }}>
          <small>{item.number}</small>{item.title}
        </Link>
      ))}
    </nav>
  );
}

export function ExhibitionWalk({ exhibition, stopNumber, artworks, data }: {
  exhibition: Exhibition;
  stopNumber: number;
  artworks: Artwork[];
  data: MuseumData;
}) {
  const { navigate } = useRouter();
  const works = stopWorks(exhibition, artworks);
  const total = works.length;
  const entry = works[stopNumber - 1];
  const overview = exhibition.kind === 'immersive' ? { view: 'journey' as const } : { view: 'exhibition' as const, slug: exhibition.slug };
  const isLast = stopNumber === total;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [role="dialog"], [role="alertdialog"], .set-picker-panel')) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight' && stopNumber < total) navigate({ view: 'walk', slug: exhibition.slug, stop: stopNumber + 1 }, { replace: true });
      if (event.key === 'ArrowLeft' && stopNumber > 1) navigate({ view: 'walk', slug: exhibition.slug, stop: stopNumber - 1 }, { replace: true });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [exhibition.slug, navigate, stopNumber, total]);

  if (!entry) return <ExhibitionNotFound slug={exhibition.slug + '/' + stopNumber} />;
  const { stop, artwork } = entry;

  return (
    <article className="walk" aria-labelledby="walk-title" style={{ '--accent': exhibition.accent } as CSSProperties}>
      <header className="walk-bar">
        <Link to={overview} className="walk-exhibition">
          <span aria-hidden="true">←</span> {exhibition.title}
        </Link>
        <ol className="walk-progress" aria-label="Exhibition stops">
          {works.map((item, index) => (
            <li key={item.stop.artworkId + index}>
              <Link
                to={{ view: 'walk', slug: exhibition.slug, stop: index + 1 }}
                replace
                className={index + 1 === stopNumber ? 'is-current' : index + 1 < stopNumber ? 'is-past' : ''}
                aria-current={index + 1 === stopNumber ? 'step' : undefined}
                aria-label={'Stop ' + (index + 1) + ': ' + item.stop.label}
              >
                <span />
              </Link>
            </li>
          ))}
        </ol>
        <span className="walk-count">Stop {String(stopNumber).padStart(2, '0')} of {String(total).padStart(2, '0')}</span>
      </header>

      <div className="walk-stage">
        <Link to={{ view: 'detail', id: artwork.id }} className="walk-art" style={{ '--card-accent': artwork.accent } as CSSProperties} aria-label={'Open object page for ' + artwork.title}>
          <img key={artwork.id} src={artwork.image} alt={artwork.alt} />
        </Link>

        <div className="walk-copy">
          <p className="eyebrow">{stop.label}</p>
          <h1 id="walk-title">{artwork.title}</h1>
          <p className="walk-caption">{artwork.artist}, {artwork.date}. {artwork.medium}.</p>
          <p className="walk-text">{stop.text}</p>
          {stop.question && <blockquote className="walk-question">{stop.question}</blockquote>}
          <div className="walk-object-actions">
            <Link className="button-link" to={{ view: 'detail', id: artwork.id }}>View object</Link>
            <SaveToggle artwork={artwork} data={data} className="button-link save-toggle" />
          </div>

          <nav className="walk-pager" aria-label="Walk-through">
            {stopNumber > 1 ? (
              <Link to={{ view: 'walk', slug: exhibition.slug, stop: stopNumber - 1 }} replace rel="prev">← Previous stop</Link>
            ) : (
              <Link to={overview}>← Overview</Link>
            )}
            {!isLast && (
              <Link to={{ view: 'walk', slug: exhibition.slug, stop: stopNumber + 1 }} replace rel="next" className="is-primary">Next stop →</Link>
            )}
          </nav>
        </div>
      </div>

      {isLast && (
        <section className="walk-end" aria-labelledby="walk-end-title">
          <div>
            <p className="eyebrow">End of exhibition</p>
            <h2 id="walk-end-title">You walked {total} works.</h2>
          </div>
          <div className="walk-end-actions">
            <SaveExhibitionAsSet exhibition={exhibition} artworks={artworks} data={data} />
            <Link className="button-link" to={{ view: 'walk', slug: exhibition.slug, stop: 1 }} replace>Start again</Link>
            <Link className="button-link" to={{ view: 'exhibitions' }}>All exhibitions</Link>
          </div>
        </section>
      )}
    </article>
  );
}
