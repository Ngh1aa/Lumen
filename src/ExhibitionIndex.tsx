import { CSSProperties, type PointerEvent } from 'react';

const commons = (name: string) =>
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(name);

const vincentFrames = [
  {
    title: 'The Starry Night',
    year: '1889',
    image: commons('TheStarryNightByVincentVanGogh.jpg'),
  },
  {
    title: 'Café Terrace at Night',
    year: '1888',
    image: commons('Vincent van Gogh - Cafe Terrace at Night (1888).jpg'),
  },
  {
    title: 'Wheat Field with Cypresses',
    year: '1889',
    image: commons('Wheat Field with Cypresses MET DT1567.jpg'),
  },
];

export function ExhibitionIndex({
  reducedMotion,
  onEnterVincent,
  onExplore,
}: {
  reducedMotion: boolean;
  onEnterVincent: () => void;
  onExplore: () => void;
}) {
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--museum-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
    event.currentTarget.style.setProperty('--museum-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  const onMediaPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    event.currentTarget.style.setProperty('--media-x', `${x * 100}%`);
    event.currentTarget.style.setProperty('--media-y', `${y * 100}%`);
    event.currentTarget.style.setProperty('--media-nx', String(x - 0.5));
    event.currentTarget.style.setProperty('--media-ny', String(y - 0.5));
  };

  return (
    <section className="museum-index" aria-labelledby="museum-index-title">
      <div className="museum-index-grid" aria-hidden="true" />
      <header className="museum-index-hero">
        <div className="museum-index-meta">
          <span>LUMEN / EXHIBITIONS</span>
          <span>Digital Museum of Visual Culture</span>
          <span>01 published / archive growing</span>
        </div>
        <h1 id="museum-index-title">
          A museum is not<br />
          <em>a folder.</em>
        </h1>
        <div className="museum-index-intro">
          <p>
            LUMEN commissions focused digital exhibitions that connect artwork, place,
            writing, sound and visual relationships without pretending every connection is fact.
          </p>
          <p>
            Each exhibition gets its own interaction grammar. The platform stays consistent;
            the room changes with the story.
          </p>
        </div>
      </header>

      <article
        className="museum-feature"
        onPointerMove={onPointerMove}
        data-motion={reducedMotion ? 'reduced' : 'full'}
      >
        <div className="museum-feature-marker">
          <span>01</span>
          <strong>NOW SHOWING</strong>
        </div>

        <button
          className="museum-feature-media"
          type="button"
          onClick={onEnterVincent}
          onPointerMove={onMediaPointerMove}
          aria-label="Enter VINCENT — The Painted Night"
        >
          <div className="museum-feature-strip">
            {vincentFrames.map((frame, index) => (
              <figure
                key={frame.title}
                data-frame={String(index + 1).padStart(2, '0')}
                style={{ '--museum-frame': index } as CSSProperties}
              >
                <img
                  src={frame.image}
                  alt=""
                  style={index === 0 ? ({ viewTransitionName: 'vincent-hero-art' } as CSSProperties) : undefined}
                />
                <figcaption>
                  <span>{frame.year}</span>
                  <strong>{frame.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="museum-feature-light" aria-hidden="true" />
          <span className="museum-feature-cursor" aria-hidden="true">
            <b>ENTER</b>
            <small>01</small>
          </span>
        </button>

        <div className="museum-feature-copy">
          <div>
            <p>SUPER PROJECT 01 / VINCENT VAN GOGH</p>
            <h2 style={{ viewTransitionName: 'vincent-title' } as CSSProperties}>VINCENT<br /><em>The Painted Night</em></h2>
          </div>
          <p className="museum-feature-description">
            Nine sensory rooms move from blue night to yellow heat, brush surface, place,
            letters and listening. A verified Thread Atlas lets visitors follow time, place
            and editorial themes without inventing historical links.
          </p>
          <dl className="museum-feature-facts">
            <div><dt>Rooms</dt><dd>09</dd></div>
            <div><dt>Modes</dt><dd>Sound / letters / threads</dd></div>
            <div><dt>Sources</dt><dd>Public-domain art + scholarly letters</dd></div>
          </dl>
          <button className="museum-enter" type="button" onClick={onEnterVincent}>
            <span>Enter exhibition</span><span aria-hidden="true">↗</span>
          </button>
        </div>
      </article>

      <section className="museum-platform" aria-labelledby="museum-platform-title">
        <div>
          <p>PLATFORM / METHOD</p>
          <h2 id="museum-platform-title">One museum.<br /><em>Different grammars.</em></h2>
        </div>
        <div className="museum-platform-principles">
          <article>
            <span>01 / ARTWORK</span>
            <h3>Media leads.</h3>
            <p>Interface recedes until context, provenance or action is needed.</p>
          </article>
          <article>
            <span>02 / RELATION</span>
            <h3>Connections explain themselves.</h3>
            <p>Every thread states why objects are connected and where interpretation begins.</p>
          </article>
          <article>
            <span>03 / MOTION</span>
            <h3>Movement has a job.</h3>
            <p>Motion orients, connects, reveals or responds; reduced motion keeps every task intact.</p>
          </article>
        </div>
      </section>

      <section className="museum-wings museum-reveal" aria-labelledby="museum-wings-title">
        <header>
          <p>MUSEUM UNIVERSE / FOUR WINGS</p>
          <h2 id="museum-wings-title">One museum.<br /><em>Four ways to sense.</em></h2>
          <p>
            LUMEN grows as a family of rooms, not a family of templates. Each wing keeps the same curatorial ethics
            while changing the interaction metaphor around its medium.
          </p>
        </header>
        <div className="museum-wing-grid">
          <button type="button" className="museum-wing museum-wing--live" onClick={onExplore}>
            <span>01 / LIVE</span><strong>CANVAS</strong><small>Painting · drift through color</small><i aria-hidden="true">↗</i>
          </button>
          <article className="museum-wing">
            <span>02 / CONCEPT</span><strong>RESONANCE</strong><small>Music · move through time</small><i aria-hidden="true">~</i>
          </article>
          <article className="museum-wing">
            <span>03 / CONCEPT</span><strong>FRAME</strong><small>Cinema · scrub through light</small><i aria-hidden="true">▱</i>
          </article>
          <article className="museum-wing">
            <span>04 / CONCEPT</span><strong>THRESHOLD</strong><small>Space · move through scale</small><i aria-hidden="true">□</i>
          </article>
        </div>
      </section>

      <section className="museum-next" aria-labelledby="museum-next-title">
        <div className="museum-next-index">02</div>
        <div>
          <p>ARCHIVE STATUS / UNPUBLISHED</p>
          <h2 id="museum-next-title">The next room has not been invented yet.</h2>
        </div>
        <p>
          LUMEN will only publish another exhibition when the subject has a real curatorial
          thesis, sourceable media and an interaction model worth defending.
        </p>
        <button type="button" onClick={onExplore}>Explore the open collection ↗</button>
      </section>
    </section>
  );
}
