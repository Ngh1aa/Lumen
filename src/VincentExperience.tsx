import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Artwork } from './artworks';

type OpenArtwork = (artwork: Artwork) => void;

type Room = {
  id: string;
  number: string;
  label: string;
  title: string;
  intro: string;
  question: string;
  works: string[];
  mode: 'threshold' | 'yellow' | 'night' | 'motion' | 'bloom' | 'field';
};

const rooms: Room[] = [
  {
    id: 'blue-hour',
    number: '00',
    label: 'Blue Hour',
    title: 'Enter through blue.',
    intro: 'Before biography, there is atmosphere. Cobalt and ultramarine turn looking into a physical sense of distance, pressure and light.',
    question: 'What can a color carry before it becomes a symbol?',
    works: ['starry-night', 'self-portrait'],
    mode: 'threshold',
  },
  {
    id: 'yellow-house',
    number: '01',
    label: 'Yellow House',
    title: 'Brightness becomes a room.',
    intro: 'In Arles, yellow appears as flower, lamplight, wall and emotional temperature. Warmth can welcome, but it can also press forward.',
    question: 'When does brightness become emotional pressure?',
    works: ['sunflowers', 'cafe-terrace', 'oleanders', 'bedroom-arles'],
    mode: 'yellow',
  },
  {
    id: 'after-dark',
    number: '02',
    label: 'After Dark',
    title: 'Night is not black.',
    intro: 'Blue holds reflections, gaslight and stars at the same time. Darkness becomes an active field rather than an empty background.',
    question: 'How many kinds of light can exist inside one night?',
    works: ['starry-rhone', 'starry-night', 'cafe-terrace'],
    mode: 'night',
  },
  {
    id: 'moving-earth',
    number: '03',
    label: 'The Moving Earth',
    title: 'A still image can refuse to stay still.',
    intro: 'Direction, repetition and the pressure of the stroke make trees, flowers and even a face seem to vibrate inside their frame.',
    question: 'Can a still image feel physically unstable?',
    works: ['cypresses', 'irises', 'self-portrait'],
    mode: 'motion',
  },
  {
    id: 'bloom',
    number: '04',
    label: 'Bloom',
    title: 'Looking slows down.',
    intro: 'Growth arrives through branches, bouquets, translation and small gestures. This room gives the images more silence around them.',
    question: 'What changes when looking slows down?',
    works: ['almond-blossom', 'roses', 'irises', 'first-steps'],
    mode: 'bloom',
  },
  {
    id: 'field',
    number: '05',
    label: 'The Field',
    title: 'Leave with a color, not an ending.',
    intro: 'The final room avoids turning a life into a tragedy spectacle. Paths separate, weather gathers and the museum hands the next choice back to you.',
    question: 'Which color follows you out of the room?',
    works: ['wheatfield-crows', 'starry-night'],
    mode: 'field',
  },
];

function transition(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
}

function artById(artworks: Artwork[], id: string) {
  return artworks.find((artwork) => artwork.id === id);
}

function SoundtrackDock() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        className="vincent-sound-trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="vincent-soundtrack"
      >
        <span aria-hidden="true">◉</span>
        <span>Soundtrack</span>
        <small>Vincent · Don McLean</small>
      </button>

      {open ? (
        <aside id="vincent-soundtrack" className="vincent-sound-drawer" aria-label="Optional exhibition soundtrack">
          <div className="vincent-sound-head">
            <div>
              <span>Optional soundtrack</span>
              <strong>Vincent — Don McLean</strong>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close soundtrack">×</button>
          </div>
          <div className="vincent-sound-player">
            <iframe
              src="https://www.youtube-nocookie.com/embed/ciLNMesqPh0?rel=0"
              title="Vincent by Don McLean — official YouTube audio"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p>
            Playback is entirely optional and user-controlled. LUMEN embeds the official YouTube source and does not
            host audio or reproduce lyrics.
          </p>
        </aside>
      ) : null}
    </>
  );
}

function SensoryArtwork({
  artwork,
  index,
  onOpen,
  quiet = false,
}: {
  artwork: Artwork;
  index: number;
  onOpen: OpenArtwork;
  quiet?: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || !ref.current) return;
    ref.current.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width * 100).toFixed(1) + '%');
    ref.current.style.setProperty('--my', ((event.clientY - rect.top) / rect.height * 100).toFixed(1) + '%');
  };

  return (
    <button
      ref={ref}
      className={'vincent-artwork ' + (quiet ? 'vincent-artwork--quiet' : '')}
      onPointerMove={onPointerMove}
      onClick={() => onOpen(artwork)}
      aria-label={'Open ' + artwork.title}
      style={{ '--art-accent': artwork.accent } as CSSProperties}
    >
      <span className="vincent-artwork-frame">
        <img src={artwork.image} alt={artwork.alt} loading={index > 2 ? 'lazy' : 'eager'} style={transition(artwork.id)} />
        <i className="vincent-light-lens" aria-hidden="true" />
      </span>
      <span className="vincent-artwork-meta">
        <b>{String(index + 1).padStart(2, '0')}</b>
        <span><strong>{artwork.title}</strong><small>{artwork.date} · {artwork.paletteName}</small></span>
        <em>↗</em>
      </span>
    </button>
  );
}

export function VincentJourney({
  artworks,
  onOpen,
  onMood,
  onAtlas,
  onSaveJourney,
}: {
  artworks: Artwork[];
  onOpen: OpenArtwork;
  onMood: () => void;
  onAtlas: (artwork: Artwork) => void;
  onSaveJourney?: (ids: string[]) => void;
}) {
  const [activeRoom, setActiveRoom] = useState(rooms[0].id);
  const [warmth, setWarmth] = useState(68);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (active?.target.id) setActiveRoom(active.target.id);
      },
      { threshold: [0.32, 0.5, 0.7] },
    );

    rooms.forEach((room) => {
      const node = document.getElementById(room.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [artworks.length]);

  const activeIndex = Math.max(0, rooms.findIndex((room) => room.id === activeRoom));
  const journeyIds = useMemo(
    () => Array.from(new Set(rooms.flatMap((room) => room.works))).filter((id) => artworks.some((art) => art.id === id)),
    [artworks],
  );

  const hero = artById(artworks, 'starry-night');

  return (
    <article className="vincent-exhibition" aria-labelledby="vincent-title">
      <aside className="vincent-rail" aria-label="Vincent exhibition rooms">
        <span className="vincent-rail-brand">LUMEN / SUPER PROJECT 01</span>
        <ol>
          {rooms.map((room) => (
            <li key={room.id} className={activeRoom === room.id ? 'is-active' : ''}>
              <button onClick={() => document.getElementById(room.id)?.scrollIntoView({ block: 'start' })}>
                <span>{room.number}</span><strong>{room.label}</strong>
              </button>
            </li>
          ))}
        </ol>
        <div className="vincent-progress" role="progressbar" aria-label="Exhibition progress" aria-valuemin={1} aria-valuemax={rooms.length} aria-valuenow={activeIndex + 1}>
          <span style={{ transform: 'scaleY(' + ((activeIndex + 1) / rooms.length) + ')' }} />
        </div>
      </aside>

      <SoundtrackDock />

      <header className="vincent-hero">
        <div className="vincent-grain" aria-hidden="true" />
        <div className="vincent-hero-copy">
          <p className="eyebrow">Featured Exhibition / Vincent van Gogh</p>
          <h1 id="vincent-title"><span>VINCENT</span><em>A Life in Color</em></h1>
          <p>
            Six rooms about blue, yellow, night, movement, bloom and the field. This is a visual interpretation layer:
            source artworks keep their own provenance while LUMEN makes its editorial choices explicit.
          </p>
          <div className="vincent-hero-actions">
            <button onClick={() => document.getElementById('blue-hour')?.scrollIntoView({ block: 'start' })}>Enter exhibition ↓</button>
            <button onClick={onMood}>Explore by feeling ↗</button>
          </div>
        </div>
        {hero ? (
          <button className="vincent-hero-art" onClick={() => onOpen(hero)} aria-label="Open The Starry Night">
            <img src={hero.image} alt="" style={transition(hero.id)} />
            <span>The Starry Night · 1889</span>
          </button>
        ) : null}
        <span className="vincent-hero-index">1853—1890 / color as atmosphere / sound optional</span>
      </header>

      <div className="vincent-rooms">
        {rooms.map((room) => {
          const works = room.works.map((id) => artById(artworks, id)).filter((art): art is Artwork => Boolean(art));
          if (!works.length) return null;

          return (
            <section
              key={room.id}
              id={room.id}
              className={'vincent-room vincent-room--' + room.mode}
              style={room.mode === 'yellow' ? { '--warmth': warmth + '%' } as CSSProperties : undefined}
              aria-labelledby={room.id + '-title'}
            >
              <div className="vincent-room-intro">
                <div className="vincent-room-number">{room.number}</div>
                <div>
                  <p className="eyebrow">{room.label}</p>
                  <h2 id={room.id + '-title'}>{room.title}</h2>
                </div>
                <div className="vincent-room-copy">
                  <p>{room.intro}</p>
                  <blockquote>{room.question}</blockquote>
                </div>
              </div>

              {room.mode === 'yellow' ? (
                <div className="vincent-temperature">
                  <label htmlFor="vincent-temperature">Room temperature <span>{warmth}% warm</span></label>
                  <input
                    id="vincent-temperature"
                    type="range"
                    min="20"
                    max="100"
                    value={warmth}
                    onChange={(event) => setWarmth(Number(event.target.value))}
                  />
                  <p>The control changes LUMEN's room light only. Source artwork color remains untouched.</p>
                </div>
              ) : null}

              <div className={'vincent-room-gallery vincent-room-gallery--' + room.mode}>
                {works.map((artwork, index) => (
                  <SensoryArtwork
                    key={artwork.id}
                    artwork={artwork}
                    index={index}
                    onOpen={onOpen}
                    quiet={room.mode === 'bloom'}
                  />
                ))}
              </div>

              {room.mode === 'motion' ? (
                <p className="vincent-method-note">
                  Proximity light is a LUMEN interaction cue, not a reconstruction of paint or museum-authored analysis.
                  The paintings themselves are never filtered or recolored.
                </p>
              ) : null}

              {room.mode === 'field' ? (
                <div className="vincent-exit">
                  <button onClick={() => onSaveJourney?.(journeyIds)}>Save this exhibition <span>+</span></button>
                  <button onClick={onMood}>Follow a feeling <span>↗</span></button>
                  <button onClick={() => works[0] && onAtlas(works[0])}>Follow a relationship <span>↗</span></button>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <footer className="vincent-credits">
        <div>
          <span>Exhibition 01</span>
          <strong>VINCENT — A Life in Color</strong>
        </div>
        <p>
          Artwork records link to their public-domain source pages. Editorial labels, mood paths and sensory
          interactions are authored by LUMEN for this prototype. “Vincent” is embedded from the official Don McLean
          YouTube source; LUMEN does not redistribute audio or lyrics.
        </p>
      </footer>
    </article>
  );
}
