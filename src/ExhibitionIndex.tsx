import { CSSProperties, PointerEvent } from 'react';

type ExhibitionIndexProps = {
  reducedMotion: boolean;
  onEnterVincent: () => void;
  onDrift: () => void;
  onColor: () => void;
  onMood: () => void;
};

const commons = (name: string) =>
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(name);

const currentMedia = [
  {
    title: 'The Starry Night',
    date: '1889',
    image: commons('TheStarryNightByVincentVanGogh.jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:TheStarryNightByVincentVanGogh.jpg',
  },
  {
    title: 'Café Terrace at Night',
    date: '1888',
    image: commons('Van Gogh - Terrace of a Café at Night (Place du Forum) 1888.jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Terrace_of_a_Caf%C3%A9_at_Night_(Place_du_Forum)_1888.jpg',
  },
  {
    title: 'Wheat Field with Cypresses',
    date: '1889',
    image: commons('Wheat Field with Cypresses MET DT1567.jpg'),
    source: 'https://www.metmuseum.org/art/collection/search/436535',
  },
] as const;

export function ExhibitionIndex({
  reducedMotion,
  onEnterVincent,
  onDrift,
  onColor,
  onMood,
}: ExhibitionIndexProps) {
  const moveSpotlight = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--foyer-x',
      ((event.clientX - rect.left) / rect.width) * 100 + '%',
    );
    event.currentTarget.style.setProperty(
      '--foyer-y',
      ((event.clientY - rect.top) / rect.height) * 100 + '%',
    );
  };

  return (
    <article className="exhibition-index" aria-labelledby="exhibition-index-title">
      <section className="exhibition-foyer-intro">
        <p className="eyebrow">LUMEN / Exhibition programme</p>
        <div className="exhibition-foyer-title">
          <h1 id="exhibition-index-title">
            A museum is more<br />
            than <em>one room.</em>
          </h1>
          <p>
            LUMEN holds authored exhibitions beside open discovery. Enter the current show for a guided
            cultural journey, or leave the programme wall and drift through the wider visual archive.
          </p>
        </div>
        <div className="exhibition-foyer-rule" aria-hidden="true">
          <span>PROGRAMME / 01</span>
          <span>Digital Museum of Visual Culture</span>
          <span>Open-ended discovery + authored rooms</span>
        </div>
      </section>

      <section
        className="current-exhibition"
        aria-labelledby="current-exhibition-title"
        onPointerMove={moveSpotlight}
        style={{ '--foyer-x': '63%', '--foyer-y': '38%' } as CSSProperties}
      >
        <div className="current-exhibition-index" aria-hidden="true">01</div>

        <div className="current-exhibition-copy">
          <p className="current-exhibition-status"><span /> Now showing / Super Project 01</p>
          <h2 id="current-exhibition-title">
            VINCENT
            <span>The Painted Night</span>
          </h2>
          <p className="current-exhibition-lede">
            Nine sensory rooms move through blue, yellow, brush, place, letters and listening — then open
            into cultural threads that connect artwork, geography and correspondence without pretending
            interpretation is fact.
          </p>
          <div className="current-exhibition-actions">
            <button className="current-exhibition-enter" onClick={onEnterVincent}>
              <span>Enter Exhibition 01</span>
              <span aria-hidden="true">↗</span>
            </button>
            <p>Vincent van Gogh · 1880s–1890 · public-domain artwork reproductions with source links.</p>
          </div>
        </div>

        <div className="current-exhibition-media" aria-label="Selected works from VINCENT">
          {currentMedia.map((work, index) => (
            <figure key={work.title} className={'current-exhibition-work current-exhibition-work--' + (index + 1)}>
              <a href={work.source} target="_blank" rel="noreferrer" aria-label={'Open source for ' + work.title}>
                <img src={work.image} alt="" />
                <figcaption>
                  <span>0{index + 1} / {work.date}</span>
                  <strong>{work.title}</strong>
                </figcaption>
              </a>
            </figure>
          ))}
        </div>
      </section>

      <section className="exhibition-ledger" aria-labelledby="exhibition-ledger-title">
        <div className="exhibition-ledger-heading">
          <p className="eyebrow">Programme ledger</p>
          <h2 id="exhibition-ledger-title">What kind of<br /><em>room is this?</em></h2>
        </div>
        <dl>
          <div>
            <dt>01 / Status</dt>
            <dd><strong>Now showing</strong><span>VINCENT — The Painted Night</span></dd>
          </div>
          <div>
            <dt>02 / Format</dt>
            <dd><strong>Guided + explorable</strong><span>9 sensory rooms · Thread Navigator · Thread Atlas</span></dd>
          </div>
          <div>
            <dt>03 / Evidence</dt>
            <dd><strong>Provenance stays visible</strong><span>Artwork and letter records link back to source material.</span></dd>
          </div>
          <div>
            <dt>04 / Access</dt>
            <dd><strong>Motion is optional</strong><span>Keyboard paths, touch layouts and reduced-motion alternatives remain complete.</span></dd>
          </div>
        </dl>
      </section>

      <section className="exhibition-discovery" aria-labelledby="exhibition-discovery-title">
        <div>
          <p className="eyebrow">Leave the programme wall</p>
          <h2 id="exhibition-discovery-title">Not ready for<br /><em>a guided story?</em></h2>
          <p>
            The exhibition programme is only one doorway. The same museum can be entered through visual
            chance, dominant color or an editorial feeling.
          </p>
        </div>
        <div className="exhibition-discovery-paths">
          <button onClick={onDrift}>
            <span>01</span>
            <strong>Drift the archive</strong>
            <small>Weak intent / spatial discovery</small>
            <i aria-hidden="true">↗</i>
          </button>
          <button onClick={onColor}>
            <span>02</span>
            <strong>Follow a color</strong>
            <small>Named chromatic relationships</small>
            <i aria-hidden="true">↗</i>
          </button>
          <button onClick={onMood}>
            <span>03</span>
            <strong>Start with a feeling</strong>
            <small>Authored mood paths with rationale</small>
            <i aria-hidden="true">↗</i>
          </button>
        </div>
      </section>

      <section className="exhibition-capacity" aria-labelledby="exhibition-capacity-title">
        <div>
          <p className="eyebrow">Platform, not placeholder</p>
          <h2 id="exhibition-capacity-title">One published show.<br /><em>A system built to grow.</em></h2>
        </div>
        <div className="exhibition-capacity-ledger">
          <div><span>01</span><strong>VINCENT</strong><small>Published / current</small></div>
          <div><span>02+</span><strong>Future programme capacity</strong><small>No invented title, date or artist until research and rights exist.</small></div>
        </div>
      </section>
    </article>
  );
}
