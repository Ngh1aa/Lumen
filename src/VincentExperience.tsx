import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

type VincentWork = {
  id: string;
  title: string;
  date: string;
  place: string;
  image: string;
  sourceUrl: string;
  alt: string;
  accent: string;
  note: string;
};

const commons = (name: string) =>
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(name);

const works: Record<string, VincentWork> = {
  starry: {
    id: 'starry',
    title: 'The Starry Night',
    date: '1889',
    place: 'Saint-Rémy-de-Provence',
    image: commons('TheStarryNightByVincentVanGogh.jpg'),
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:TheStarryNightByVincentVanGogh.jpg',
    alt: 'The Starry Night by Vincent van Gogh, a nocturnal landscape with a swirling blue sky above a village.',
    accent: '#315fad',
    note: 'Night is not empty here. It turns, gathers, and moves.',
  },
  cafe: {
    id: 'cafe',
    title: 'Café Terrace at Night',
    date: '1888',
    place: 'Arles',
    image: commons('Vincent van Gogh - Cafe Terrace at Night (1888).jpg'),
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Cafe_Terrace_at_Night_(1888).jpg',
    alt: 'Café Terrace at Night by Vincent van Gogh, with a yellow café glowing beneath a deep blue sky.',
    accent: '#e7b84b',
    note: 'A warm room of light opens inside a blue street.',
  },
  sunflowers: {
    id: 'sunflowers',
    title: 'Sunflowers',
    date: '1887',
    place: 'Paris',
    image: commons('Van Gogh, Sunflowers, 1887.jpg'),
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Van_Gogh,_Sunflowers,_1887.jpg',
    alt: 'Sunflowers by Vincent van Gogh, painted in layered yellow and ochre tones.',
    accent: '#d69a2d',
    note: 'Yellow shifts from petal to heat to matter.',
  },
  wheat: {
    id: 'wheat',
    title: 'Wheat Field with Cypresses',
    date: '1889',
    place: 'Saint-Rémy-de-Provence',
    image: commons('Wheat Field with Cypresses MET DT1567.jpg'),
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/436535',
    alt: 'Wheat Field with Cypresses by Vincent van Gogh, showing a golden field under moving clouds and dark cypress trees.',
    accent: '#d3a43f',
    note: 'The field bends, the clouds roll, and the dark cypress holds the scene upright.',
  },
  bedroom: {
    id: 'bedroom',
    title: 'Bedroom in Arles',
    date: '1888',
    place: 'Arles',
    image: commons("Vincent van Gogh - Van Gogh's Bedroom in Arles - Google Art Project.jpg"),
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Van_Gogh%27s_Bedroom_in_Arles_-_Google_Art_Project.jpg",
    alt: 'Bedroom in Arles by Vincent van Gogh, a spare room with a bed, chairs, pictures, and strongly colored walls.',
    accent: '#4d6da8',
    note: 'The room is simple, but every angle feels slightly awake.',
  },
  cypresses: {
    id: 'cypresses',
    title: 'Cypresses',
    date: '1889',
    place: 'Saint-Rémy-de-Provence',
    image: commons('Vincent van Gogh Cypresses 1889.jpg'),
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/437980',
    alt: 'Cypresses by Vincent van Gogh, with tall dark trees rising against a bright landscape and moving sky.',
    accent: '#314b39',
    note: 'A dark vertical note rises through a sunlit field.',
  },
  irises: {
    id: 'irises',
    title: 'Irises',
    date: '1890',
    place: 'Saint-Rémy-de-Provence',
    image: commons('Vincent van Gogh - Irises (1890).jpg'),
    sourceUrl: 'https://www.metmuseum.org/art/collection/search/436528',
    alt: 'Irises by Vincent van Gogh, a bouquet of violet-blue irises in a vase.',
    accent: '#6767a8',
    note: 'The exit is quieter: violet, green, and a softened field around them.',
  },
};

const rooms = [
  { id: 'threshold', index: '00', title: 'Threshold', cue: 'The Painted Night', tone: 146.8 },
  { id: 'blue', index: '01', title: 'Blue', cue: 'Night as a temperature', tone: 174.6 },
  { id: 'yellow', index: '02', title: 'Yellow', cue: 'Heat, field, sun', tone: 220 },
  { id: 'brush', index: '03', title: 'Brush', cue: 'The image as surface', tone: 196 },
  { id: 'room', index: '04', title: 'The Room', cue: 'Interior as portrait', tone: 164.8 },
  { id: 'letters', index: '05', title: 'Letters', cue: 'Voice behind the paint', tone: 185 },
  { id: 'vincent', index: '06', title: 'Vincent', cue: 'A room for listening', tone: 130.8 },
  { id: 'afterlight', index: '07', title: 'Afterlight', cue: 'What stays with you', tone: 155.6 },
] as const;

function useAmbientSound(enabled: boolean, frequency: number) {
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (!enabled) {
      gainRef.current?.gain.setTargetAtTime(0, contextRef.current?.currentTime || 0, 0.3);
      return;
    }

    if (!contextRef.current) {
      const context = new AudioContext();
      const gain = context.createGain();
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      oscillator.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      gain.gain.value = 0;
      oscillator.connect(filter);
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      contextRef.current = context;
      gainRef.current = gain;
      oscillatorRef.current = oscillator;
    }

    const context = contextRef.current;
    if (context.state === 'suspended') void context.resume();
    oscillatorRef.current!.frequency.setTargetAtTime(frequency, context.currentTime, 0.5);
    gainRef.current!.gain.setTargetAtTime(0.025, context.currentTime, 0.8);
  }, [enabled, frequency]);

  useEffect(() => () => {
    oscillatorRef.current?.stop();
    void contextRef.current?.close();
  }, []);
}

export function VincentExperience({
  reducedMotion,
  onDrift,
  onColor,
}: {
  reducedMotion: boolean;
  onDrift: () => void;
  onColor: () => void;
}) {
  const [activeRoom, setActiveRoom] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const current = rooms[activeRoom];
  useAmbientSound(soundOn, current.tone);

  const rootStyle = useMemo(() => ({
    '--vincent-room': String(activeRoom),
    '--vincent-accent': activeRoom === 2 ? '#e7b84b' : activeRoom === 7 ? '#6767a8' : '#315fad',
  }) as CSSProperties, [activeRoom]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = rooms.findIndex((room) => room.id === visible.target.id);
        if (index >= 0) setActiveRoom(index);
      },
      { threshold: [0.35, 0.6] },
    );
    rooms.forEach((room) => {
      const node = document.getElementById(room.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  const goTo = (index: number) => {
    setActiveRoom(index);
    document.getElementById(rooms[index].id)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  return (
    <article className="vincent-experience" style={rootStyle} aria-labelledby="vincent-title">
      <div className="vincent-ambient" aria-hidden="true" />
      <nav className="vincent-rail" aria-label="Vincent exhibition rooms">
        <div className="vincent-rail-brand">
          <span>LUMEN / VINCENT</span>
          <small>The Painted Night</small>
        </div>
        <div className="vincent-room-links">
          {rooms.map((room, index) => (
            <button
              key={room.id}
              className={activeRoom === index ? 'is-active' : ''}
              aria-current={activeRoom === index ? 'step' : undefined}
              onClick={() => goTo(index)}
            >
              <span>{room.index}</span>
              <strong>{room.title}</strong>
            </button>
          ))}
        </div>
        <button
          className="vincent-sound"
          aria-pressed={soundOn}
          onClick={() => setSoundOn((value) => !value)}
        >
          <span aria-hidden="true">{soundOn ? '◉' : '○'}</span>
          Sound {soundOn ? 'on' : 'off'}
        </button>
      </nav>

      <section id="threshold" className="vincent-room vincent-threshold">
        <img src={works.starry.image} alt="" className="vincent-full-bleed" />
        <div className="vincent-night-wash" aria-hidden="true" />
        <div className="vincent-threshold-copy">
          <p>SUPER PROJECT 01 / LUMEN</p>
          <h1 id="vincent-title"><span>VINCENT</span><em>The Painted Night</em></h1>
          <p className="vincent-lede">Enter through color. Stay for the weather inside the paint.</p>
          <button onClick={() => goTo(1)}>Enter the night ↓</button>
        </div>
        <ArtworkCredit work={works.starry} />
      </section>

      <section id="blue" className="vincent-room vincent-blue" aria-labelledby="blue-title">
        <RoomHeading index="01" label="Blue" title="Night as a temperature." id="blue-title" />
        <div className="vincent-blue-field">
          <ArtworkFigure work={works.starry} className="is-wide" />
          <div className="vincent-color-note">
            <span>COBALT / ULTRAMARINE</span>
            <p>Blue becomes distance, weather, and the space between lights.</p>
          </div>
          <ArtworkFigure work={works.cafe} className="is-tall" />
        </div>
      </section>

      <section id="yellow" className="vincent-room vincent-yellow" aria-labelledby="yellow-title">
        <RoomHeading index="02" label="Yellow" title="Heat enters the room." id="yellow-title" />
        <div className="vincent-yellow-grid">
          <ArtworkFigure work={works.sunflowers} className="is-sunflowers" />
          <div className="vincent-yellow-copy">
            <span>YELLOW / OCHRE / WHEAT</span>
            <p>Here yellow is not an interface accent. It is petal, field, heat, and pressure.</p>
          </div>
          <ArtworkFigure work={works.wheat} className="is-wheat" />
        </div>
      </section>

      <section id="brush" className="vincent-room vincent-brush" aria-labelledby="brush-title">
        <RoomHeading index="03" label="Brush" title="The image becomes surface." id="brush-title" />
        <div className="vincent-brush-stage">
          <div className="vincent-brush-image">
            <img src={works.wheat.image} alt={works.wheat.alt} />
            <div className="vincent-lens" aria-hidden="true" />
          </div>
          <div className="vincent-rhythm">
            <p>Look at direction before subject.</p>
            <div><span>Sky</span><i style={{ '--rhythm': '86%' } as CSSProperties} /></div>
            <div><span>Field</span><i style={{ '--rhythm': '64%' } as CSSProperties} /></div>
            <div><span>Cypress</span><i style={{ '--rhythm': '92%' } as CSSProperties} /></div>
            <small>These rhythm labels are LUMEN visual-reading prompts, not conservation analysis.</small>
          </div>
        </div>
      </section>

      <section id="room" className="vincent-room vincent-room-interior" aria-labelledby="room-title">
        <RoomHeading index="04" label="The Room" title="An interior can hold a portrait." id="room-title" />
        <div className="vincent-bedroom-stage">
          <img src={works.bedroom.image} alt={works.bedroom.alt} />
          <span className="room-hotspot hotspot-bed">BED / WEIGHT</span>
          <span className="room-hotspot hotspot-chair">CHAIRS / WAITING</span>
          <span className="room-hotspot hotspot-wall">WALL / COLOR</span>
        </div>
        <p className="vincent-room-note">The room is presented as spatial evidence, not as a diagnosis of the artist.</p>
      </section>

      <section id="letters" className="vincent-room vincent-letters" aria-labelledby="letters-title">
        <RoomHeading index="05" label="Letters" title="A voice behind the paint." id="letters-title" />
        <div className="vincent-letter-corridor">
          <article><span>WORK</span><p>Painting as daily practice: returning, revising, trying again.</p></article>
          <article><span>COLOR</span><p>Color as relation — one tone changes what the next tone can become.</p></article>
          <article><span>WEATHER</span><p>Wind, heat, night, and fields are not backgrounds. They shape the act of looking.</p></article>
          <article><span>LOOKING</span><p>The exhibition paraphrases themes rather than reproducing long modern translations.</p></article>
        </div>
      </section>

      <section id="vincent" className="vincent-room vincent-music-room" aria-labelledby="music-title">
        <RoomHeading index="06" label="Vincent" title="A room for listening." id="music-title" />
        <div className="vincent-record">
          <div className="vincent-record-disc" aria-hidden="true"><span /></div>
          <div className="vincent-record-copy">
            <p className="eyebrow">Don McLean / 1972</p>
            <h2>Vincent</h2>
            <p>
              McLean has described writing the song while looking at <em>The Starry Night</em>.
              LUMEN does not reproduce the recording or lyrics; the exhibition sound layer is generated in-browser.
            </p>
            <div className="vincent-record-actions">
              <button onClick={() => setSoundOn((value) => !value)}>{soundOn ? 'Mute ambient room' : 'Hear ambient room'}</button>
              <a href="https://donmclean.com/story-behind-the-song-don-mcleans-vincent/" target="_blank" rel="noreferrer">Open official song story ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section id="afterlight" className="vincent-room vincent-afterlight" aria-labelledby="afterlight-title">
        <RoomHeading index="07" label="Afterlight" title="What stays with you?" id="afterlight-title" />
        <div className="vincent-afterlight-grid">
          <ArtworkFigure work={works.cypresses} />
          <div className="vincent-afterlight-copy">
            <p>The exhibition leaves intensity behind slowly.</p>
            <p>Dark verticals, softened violet, then an exit back into the wider LUMEN collection.</p>
            <div>
              <button onClick={onDrift}>Return to Drift ↗</button>
              <button onClick={onColor}>Explore by Color ↗</button>
            </div>
          </div>
          <ArtworkFigure work={works.irises} />
        </div>
        <div className="vincent-rights-note">
          <span>PROVENANCE</span>
          <p>Public-domain artwork reproductions are linked to their source records. Editorial readings and sensory labels are authored for this LUMEN prototype.</p>
        </div>
      </section>
    </article>
  );
}

function RoomHeading({ index, label, title, id }: { index: string; label: string; title: string; id: string }) {
  return (
    <header className="vincent-room-heading">
      <p><span>{index}</span>{label}</p>
      <h2 id={id}>{title}</h2>
    </header>
  );
}

function ArtworkFigure({ work, className = '' }: { work: VincentWork; className?: string }) {
  return (
    <figure className={'vincent-artwork ' + className}>
      <a href={work.sourceUrl} target="_blank" rel="noreferrer" aria-label={'Open source record for ' + work.title}>
        <img src={work.image} alt={work.alt} loading="lazy" />
      </a>
      <figcaption>
        <span>{work.title}</span>
        <span>{work.date} · {work.place}</span>
        <small>{work.note}</small>
      </figcaption>
    </figure>
  );
}

function ArtworkCredit({ work }: { work: VincentWork }) {
  return (
    <a className="vincent-credit" href={work.sourceUrl} target="_blank" rel="noreferrer">
      <strong>{work.title}</strong>
      <span>{work.date} · source / provenance ↗</span>
    </a>
  );
}
