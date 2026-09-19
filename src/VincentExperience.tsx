import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { VincentThreadAtlas } from './VincentThreadAtlas';

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
  { id: 'places', index: '05', title: 'Places', cue: 'A life in movement', tone: 155.6 },
  { id: 'letters', index: '06', title: 'Letters', cue: 'Voice behind the paint', tone: 185 },
  { id: 'vincent', index: '07', title: 'Vincent', cue: 'A room for listening', tone: 130.8 },
  { id: 'afterlight', index: '08', title: 'Afterlight', cue: 'What stays with you', tone: 138.6 },
] as const;

const placeStops = [
  { year: '1883–85', place: 'Nuenen', note: 'A darker earth-bound palette and sustained study of rural life.' },
  { year: '1886–88', place: 'Paris', note: 'Contact with Impressionist and Neo-Impressionist painting changes the color field.' },
  { year: '1888–89', place: 'Arles', note: 'Sunflowers, the Yellow House, night scenes, and an increasingly intense use of color.' },
  { year: '1889–90', place: 'Saint-Rémy', note: 'Cypresses, olive trees, fields, and the moving sky of The Starry Night.' },
  { year: '1890', place: 'Auvers-sur-Oise', note: 'A final, compressed period of sustained work in the landscape around Auvers.' },
] as const;

const letterNodes = [
  {
    id: 'color',
    label: 'COLOR',
    date: '31 Jul 1882',
    place: 'The Hague',
    to: 'Theo',
    source: 'https://vangoghletters.org/vg/letters/let252/letter.html',
    note: 'Van Gogh describes color as relational: primary and composite colors generating countless tonal variations.',
  },
  {
    id: 'harvest',
    label: 'HARVEST',
    date: '21 Jun 1888',
    place: 'Arles',
    to: 'Theo',
    source: 'https://vangoghletters.org/en/let629',
    note: 'A letter written during harvest time links the urgency of working to the abundance of what he sees around him.',
  },
  {
    id: 'present',
    label: 'PRESENT',
    date: '17 Jan 1889',
    place: 'Arles',
    to: 'Theo',
    source: 'https://vangoghletters.org/en/let736/letter.html',
    note: 'The correspondence turns insistently to the immediate present: work, money, uncertainty, and what can still be done now.',
  },
  {
    id: 'cypresses',
    label: 'CYPRESSES',
    date: '28 Sep 1889',
    place: 'Saint-Rémy',
    to: 'Theo',
    source: 'https://vangoghletters.org/vg/letters/let806/letter.html',
    note: 'Van Gogh lists Wheatfield and cypresses and a study of cypresses among the works being sent to Theo.',
  },
] as const;

const threadPaths = [
  {
    id: 'arles-night',
    title: 'Arles / Night / Interior',
    eyebrow: 'LIGHT → PLACE → LETTER',
    artworkIds: ['cafe', 'bedroom'],
    place: 'Arles',
    placeIndex: 2,
    year: '1888',
    themes: ['Night', 'Interior', 'Light'],
    letterId: 'harvest',
    connection: 'Two Arles interiors meet a letter from harvest season: light, work, heat, and the pressure of looking.',
  },
  {
    id: 'saint-remy-field',
    title: 'Saint-Rémy / Field / Cypress',
    eyebrow: 'SKY → FIELD → LETTER',
    artworkIds: ['starry', 'wheat', 'cypresses'],
    place: 'Saint-Rémy',
    placeIndex: 3,
    year: '1889',
    themes: ['Field', 'Cypress', 'Sky'],
    letterId: 'cypresses',
    connection: 'The paintings share Saint-Rémy; letter 806 explicitly names Wheatfield and cypresses and a study of cypresses.',
  },
] as const;

type ThreadPath = (typeof threadPaths)[number];

const atlasArtworkThemes: Record<string, string[]> = {
  starry: ['Night', 'Sky', 'Cypress'],
  cafe: ['Night', 'Light', 'Interior'],
  sunflowers: ['Yellow', 'Flowers', 'Color'],
  wheat: ['Field', 'Cypress', 'Sky', 'Yellow'],
  bedroom: ['Interior', 'Color'],
  cypresses: ['Cypress', 'Field', 'Sky'],
  irises: ['Flowers', 'Color'],
};

const atlasLetterThemes: Record<string, string[]> = {
  color: ['Color'],
  harvest: ['Field', 'Work', 'Yellow'],
  present: ['Work', 'Interior'],
  cypresses: ['Cypress', 'Field'],
};

function useAmbientSound(enabled: boolean, frequency: number) {
  const contextRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  useEffect(() => {
    if (!enabled) {
      gainRef.current?.gain.setTargetAtTime(0, contextRef.current?.currentTime || 0, 0.35);
      return;
    }

    if (!contextRef.current) {
      const context = new AudioContext();
      const gain = context.createGain();
      const filter = context.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 720;
      filter.Q.value = 0.7;
      gain.gain.value = 0;

      const ratios = [1, 1.5, 2];
      const oscillators = ratios.map((ratio, index) => {
        const oscillator = context.createOscillator();
        const voiceGain = context.createGain();
        oscillator.type = index === 0 ? 'sine' : 'triangle';
        voiceGain.gain.value = index === 0 ? 0.72 : index === 1 ? 0.18 : 0.1;
        oscillator.frequency.value = frequency * ratio;
        oscillator.connect(voiceGain);
        voiceGain.connect(filter);
        oscillator.start();
        return oscillator;
      });

      filter.connect(gain);
      gain.connect(context.destination);
      contextRef.current = context;
      gainRef.current = gain;
      oscillatorsRef.current = oscillators;
    }

    const context = contextRef.current;
    if (context.state === 'suspended') void context.resume();
    oscillatorsRef.current.forEach((oscillator, index) => {
      const ratio = [1, 1.5, 2][index];
      oscillator.frequency.setTargetAtTime(frequency * ratio, context.currentTime, 0.65);
    });
    gainRef.current!.gain.setTargetAtTime(0.018, context.currentTime, 1.1);
  }, [enabled, frequency]);

  useEffect(() => () => {
    oscillatorsRef.current.forEach((oscillator) => oscillator.stop());
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
  const [threadOpen, setThreadOpen] = useState(false);
  const [atlasOpen, setAtlasOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string>(threadPaths[0].id);
  const [focusPlace, setFocusPlace] = useState<string>();
  const [focusLetter, setFocusLetter] = useState<string>();
  const [savedThreads, setSavedThreads] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('lumen-vincent-threads') || '[]') as string[];
    } catch {
      return [];
    }
  });
  const current = rooms[activeRoom];
  useAmbientSound(soundOn, current.tone);

  const rootStyle = useMemo(() => ({
    '--vincent-room': String(activeRoom),
    '--vincent-accent': activeRoom === 2 ? '#e7b84b' : activeRoom === 8 ? '#6767a8' : '#315fad',
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

  const openThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setAtlasOpen(false);
    setThreadOpen(true);
  };

  const openAtlas = () => {
    setThreadOpen(false);
    setAtlasOpen(true);
  };

  const openThreadForWork = (workId: string) => {
    const thread = threadPaths.find((item) => item.artworkIds.some((id) => id === workId));
    if (thread) openThread(thread.id);
  };

  const saveThread = (threadId: string) => {
    const next = Array.from(new Set([...savedThreads, threadId]));
    localStorage.setItem('lumen-vincent-threads', JSON.stringify(next));
    setSavedThreads(next);
  };

  const jumpToPlace = (thread: ThreadPath) => {
    setFocusPlace(thread.place);
    setThreadOpen(false);
    goTo(5);
  };

  const jumpToLetter = (thread: ThreadPath) => {
    setFocusLetter(thread.letterId);
    setThreadOpen(false);
    goTo(6);
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
          className="vincent-atlas-trigger"
          aria-label="Open Vincent Thread Atlas"
          onClick={openAtlas}
        >
          <span aria-hidden="true">✦</span>
          Atlas
        </button>
        <button
          className="vincent-atlas-trigger"
          aria-label="Open Vincent thread atlas"
          onClick={() => setAtlasOpen(true)}
        >
          <span aria-hidden="true">⌘</span>
          Atlas
        </button>
        <button
          className="vincent-thread-trigger"
          aria-label="Open thread navigator"
          onClick={() => setThreadOpen(true)}
        >
          <span aria-hidden="true">↯</span>
          Threads {savedThreads.length ? '(' + savedThreads.length + ')' : ''}
        </button>
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
          <ArtworkFigure work={works.starry} className="is-wide" onFollow={() => openThreadForWork('starry')} />
          <div className="vincent-color-note">
            <span>COBALT / ULTRAMARINE</span>
            <p>Blue becomes distance, weather, and the space between lights.</p>
          </div>
          <ArtworkFigure work={works.cafe} className="is-tall" onFollow={() => openThreadForWork('cafe')} />
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
          <ArtworkFigure work={works.wheat} className="is-wheat" onFollow={() => openThreadForWork('wheat')} />
        </div>
      </section>

      <section id="brush" className="vincent-room vincent-brush" aria-labelledby="brush-title">
        <RoomHeading index="03" label="Brush" title="The image becomes surface." id="brush-title" />
        <div className="vincent-brush-stage">
          <DeepBrushViewer work={works.wheat} />
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
        <div className="vincent-room-note-wrap">
          <p className="vincent-room-note">The room is presented as spatial evidence, not as a diagnosis of the artist.</p>
          <button className="vincent-follow-thread" onClick={() => openThreadForWork('bedroom')}>Follow Arles thread ↯</button>
        </div>
      </section>

      <section id="places" className="vincent-room vincent-places" aria-labelledby="places-title">
        <RoomHeading index="05" label="Places" title="A life in movement." id="places-title" />
        <PlacesJourney focusPlace={focusPlace} />
      </section>

      <section id="letters" className="vincent-room vincent-letters" aria-labelledby="letters-title">
        <RoomHeading index="06" label="Letters" title="A voice becomes a network." id="letters-title" />
        <LetterNetwork focusLetter={focusLetter} />
      </section>

      <section id="vincent" className="vincent-room vincent-music-room" aria-labelledby="music-title">
        <RoomHeading index="07" label="Vincent" title="A room for listening." id="music-title" />
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
        <RoomHeading index="08" label="Afterlight" title="What stays with you?" id="afterlight-title" />
        <div className="vincent-afterlight-grid">
          <ArtworkFigure work={works.cypresses} onFollow={() => openThreadForWork('cypresses')} />
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

      <ThreadDrawer
        open={threadOpen}
        activeThreadId={activeThreadId}
        savedThreads={savedThreads}
        onClose={() => setThreadOpen(false)}
        onSelect={setActiveThreadId}
        onSave={saveThread}
        onPlace={jumpToPlace}
        onLetter={jumpToLetter}
        onAtlas={openAtlas}
      />

      <VincentThreadAtlas
        open={atlasOpen}
        reducedMotion={reducedMotion}
        artworks={Object.values(works).map((work) => ({
          id: work.id,
          title: work.title,
          date: work.date,
          place: work.place,
          image: work.image,
          sourceUrl: work.sourceUrl,
          note: work.note,
          themes: atlasArtworkThemes[work.id] || [],
        }))}
        letters={letterNodes.map((letter) => ({
          id: letter.id,
          label: letter.label,
          date: letter.date,
          place: letter.place,
          source: letter.source,
          note: letter.note,
          themes: atlasLetterThemes[letter.id] || [],
        }))}
        onClose={() => setAtlasOpen(false)}
      />
    </article>
  );
}


function DeepBrushViewer({ work }: { work: VincentWork }) {
  const [zoom, setZoom] = useState(1.7);
  const [origin, setOrigin] = useState({ x: 56, y: 44 });

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({
      x: Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100)),
    });
  };

  return (
    <div className="vincent-deepzoom">
      <div
        className="vincent-deepzoom-viewport"
        onPointerMove={move}
        aria-label="Interactive close view of Wheat Field with Cypresses"
      >
        <img
          src={work.image}
          alt={work.alt}
          style={{ transform: `scale(${zoom})`, transformOrigin: `${origin.x}% ${origin.y}%` }}
        />
        <div className="vincent-deepzoom-crosshair" aria-hidden="true" style={{ left: origin.x + '%', top: origin.y + '%' }} />
      </div>
      <div className="vincent-deepzoom-controls">
        <span>MACRO VIEW</span>
        <button onClick={() => setZoom((value) => Math.max(1, Number((value - 0.5).toFixed(1))))} aria-label="Zoom out brush detail">−</button>
        <input
          aria-label="Brush detail zoom"
          type="range"
          min="1"
          max="4"
          step="0.1"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
        <button onClick={() => setZoom((value) => Math.min(4, Number((value + 0.5).toFixed(1))))} aria-label="Zoom in brush detail">+</button>
        <output>{zoom.toFixed(1)}×</output>
      </div>
    </div>
  );
}

function PlacesJourney({ focusPlace }: { focusPlace?: string }) {
  const [active, setActive] = useState(2);

  useEffect(() => {
    if (!focusPlace) return;
    const index = placeStops.findIndex((item) => item.place === focusPlace || item.place.startsWith(focusPlace));
    if (index >= 0) setActive(index);
  }, [focusPlace]);

  const stop = placeStops[active];

  return (
    <div className="vincent-place-journey">
      <div className="vincent-place-map" aria-hidden="true">
        <svg viewBox="0 0 1000 420" role="presentation">
          <path d="M70 295 C210 330, 250 105, 400 155 S570 340, 690 240 S820 90, 930 150" />
          {[[70,295],[260,160],[470,235],[700,230],[930,150]].map(([x,y], index) => (
            <circle key={index} cx={x} cy={y} r={active === index ? 12 : 6} className={active === index ? 'is-active' : ''} />
          ))}
        </svg>
        <div className="vincent-place-label is-nuenen">NUENEN</div>
        <div className="vincent-place-label is-paris">PARIS</div>
        <div className="vincent-place-label is-arles">ARLES</div>
        <div className="vincent-place-label is-remy">SAINT-RÉMY</div>
        <div className="vincent-place-label is-auvers">AUVERS</div>
      </div>
      <div className="vincent-place-stops" role="group" aria-label="Van Gogh places and periods">
        {placeStops.map((item, index) => (
          <button
            key={item.place}
            className={active === index ? 'is-active' : ''}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>{item.year}</span>
            <strong>{item.place}</strong>
          </button>
        ))}
      </div>
      <div className="vincent-place-reading" aria-live="polite">
        <span>{stop.year}</span>
        <h3>{stop.place}</h3>
        <p>{stop.note}</p>
        <small>Chronology condensed from Van Gogh Museum permanent-collection material.</small>
      </div>
    </div>
  );
}

function LetterNetwork({ focusLetter }: { focusLetter?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!focusLetter) return;
    const index = letterNodes.findIndex((item) => item.id === focusLetter);
    if (index >= 0) setActive(index);
  }, [focusLetter]);

  const letter = letterNodes[active];

  return (
    <div className="vincent-letter-network">
      <div className="vincent-letter-graph" aria-label="Selected letters connected to Theo van Gogh">
        <div className="letter-center"><span>TO</span><strong>THEO</strong></div>
        {letterNodes.map((node, index) => (
          <button
            key={node.id}
            className={'letter-node letter-node-' + index + (active === index ? ' is-active' : '')}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <span>{node.date}</span>
            <strong>{node.label}</strong>
          </button>
        ))}
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <line x1="50" y1="50" x2="18" y2="22" />
          <line x1="50" y1="50" x2="82" y2="27" />
          <line x1="50" y1="50" x2="52" y2="84" />
          <line x1="50" y1="50" x2="20" y2="78" />
        </svg>
      </div>
      <article className="vincent-letter-reading" aria-live="polite">
        <p className="eyebrow">{letter.date} / {letter.place} / to {letter.to}</p>
        <h3>{letter.label}</h3>
        <p>{letter.note}</p>
        <p className="vincent-paraphrase">LUMEN paraphrase — source wording is not reproduced here.</p>
        <a href={letter.source} target="_blank" rel="noreferrer">Open scholarly letter record ↗</a>
      </article>
    </div>
  );
}


function ThreadAtlas({
  open,
  reducedMotion,
  savedThreads,
  onClose,
  onOpenThread,
  onSave,
}: {
  open: boolean;
  reducedMotion: boolean;
  savedThreads: string[];
  onClose: () => void;
  onOpenThread: (id: string) => void;
  onSave: (id: string) => void;
}) {
  const [timeFilter, setTimeFilter] = useState('All');
  const [placeFilter, setPlaceFilter] = useState('All');
  const [themeFilter, setThemeFilter] = useState('All');
  const stageRef = useRef<HTMLDivElement | null>(null);

  const filtered = threadPaths.filter((thread) =>
    (timeFilter === 'All' || thread.year === timeFilter) &&
    (placeFilter === 'All' || thread.place === placeFilter) &&
    (themeFilter === 'All' || thread.themes.includes(themeFilter as never))
  );

  const updateSpotlight = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || !stageRef.current || !window.matchMedia('(pointer:fine)').matches) return;
    const rect = stageRef.current.getBoundingClientRect();
    stageRef.current.style.setProperty('--atlas-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
    stageRef.current.style.setProperty('--atlas-y', ((event.clientY - rect.top) / rect.height * 100) + '%');
  };

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, onClose]);

  if (!open) return null;

  const themes = Array.from(new Set(threadPaths.flatMap((thread) => [...thread.themes])));

  return (
    <section className="vincent-atlas-layer" role="dialog" aria-modal="true" aria-labelledby="vincent-atlas-title">
      <header className="vincent-atlas-header">
        <div>
          <p>VINCENT / KNOWLEDGE MODE</p>
          <h2 id="vincent-atlas-title">Thread Atlas</h2>
          <span>Filter by time, place, or theme. Follow only connections with explicit provenance.</span>
        </div>
        <button onClick={onClose} aria-label="Close Vincent thread atlas">×</button>
      </header>

      <div className="vincent-atlas-filters">
        <AtlasFilter label="Time" value={timeFilter} options={['All', '1888', '1889']} onChange={setTimeFilter} />
        <AtlasFilter label="Place" value={placeFilter} options={['All', 'Arles', 'Saint-Rémy']} onChange={setPlaceFilter} />
        <AtlasFilter label="Theme" value={themeFilter} options={['All', ...themes]} onChange={setThemeFilter} />
      </div>

      <div
        ref={stageRef}
        className="vincent-atlas-stage"
        onPointerMove={updateSpotlight}
        data-empty={filtered.length === 0 ? 'true' : 'false'}
      >
        <div className="vincent-atlas-spotlight" aria-hidden="true" />
        <div className="vincent-atlas-axis axis-time" aria-hidden="true">TIME</div>
        <div className="vincent-atlas-axis axis-place" aria-hidden="true">PLACE</div>
        <div className="vincent-atlas-axis axis-theme" aria-hidden="true">THEME</div>

        {filtered.length === 0 && (
          <div className="vincent-atlas-empty" role="status">
            <span>NO VERIFIED THREAD</span>
            <h3>No connection matches all three filters.</h3>
            <p>Try widening one dimension rather than inventing a relationship.</p>
          </div>
        )}

        <div className="vincent-atlas-network">
          {filtered.map((thread, index) => {
            const letter = letterNodes.find((item) => item.id === thread.letterId)!;
            const selectedWorks = thread.artworkIds.map((id) => works[id]).filter(Boolean);
            return (
              <article
                key={thread.id}
                className={'vincent-atlas-thread atlas-thread-' + index}
                style={{ '--thread-accent': selectedWorks[0]?.accent || '#315fad' } as CSSProperties}
              >
                <button className="vincent-atlas-thread-core" onClick={() => onOpenThread(thread.id)}>
                  <span>{thread.year} · {thread.place}</span>
                  <strong>{thread.title}</strong>
                  <small>{thread.eyebrow}</small>
                </button>
                <div className="vincent-atlas-thread-art" aria-label={'Artworks in ' + thread.title}>
                  {selectedWorks.map((work) => (
                    <a key={work.id} href={work.sourceUrl} target="_blank" rel="noreferrer">
                      <img src={work.image} alt="" />
                      <span>{work.title}</span>
                    </a>
                  ))}
                </div>
                <div className="vincent-atlas-thread-meta">
                  <span>{thread.themes.join(' / ')}</span>
                  <span>{letter.date} · {letter.label}</span>
                </div>
                <div className="vincent-atlas-thread-actions">
                  <button onClick={() => onOpenThread(thread.id)}>Trace thread →</button>
                  <button
                    disabled={savedThreads.includes(thread.id)}
                    onClick={() => onSave(thread.id)}
                  >
                    {savedThreads.includes(thread.id) ? 'Saved ✓' : 'Save +'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <footer className="vincent-atlas-footer">
        <span>VERIFIED RELATIONSHIPS ONLY</span>
        <p>Atlas filters never manufacture missing links. Empty combinations remain visibly empty.</p>
      </footer>
    </section>
  );
}

function AtlasFilter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="vincent-atlas-filter">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={value === option}
            className={value === option ? 'is-active' : ''}
            onClick={() => onChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ThreadDrawer({
  open,
  activeThreadId,
  savedThreads,
  onClose,
  onSelect,
  onSave,
  onPlace,
  onLetter,
  onAtlas,
}: {
  open: boolean;
  activeThreadId: string;
  savedThreads: string[];
  onClose: () => void;
  onSelect: (id: string) => void;
  onSave: (id: string) => void;
  onPlace: (thread: ThreadPath) => void;
  onLetter: (thread: ThreadPath) => void;
  onAtlas: () => void;
}) {
  const thread = threadPaths.find((item) => item.id === activeThreadId) || threadPaths[0];
  const letter = letterNodes.find((item) => item.id === thread.letterId) || letterNodes[0];
  const selectedWorks = thread.artworkIds.map((id) => works[id]).filter(Boolean);
  const isSaved = savedThreads.includes(thread.id);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="vincent-thread-layer" role="presentation">
      <button className="vincent-thread-backdrop" aria-label="Close thread navigator" onClick={onClose} />
      <aside className="vincent-thread-drawer" role="dialog" aria-modal="true" aria-labelledby="thread-title">
        <header className="vincent-thread-header">
          <div>
            <span>THREAD NAVIGATOR</span>
            <h2 id="thread-title">{thread.title}</h2>
          </div>
          <button className="vincent-thread-close" onClick={onClose} aria-label="Close thread navigator">×</button>
        </header>

        <div className="vincent-thread-tabs" role="group" aria-label="Curated Vincent threads">
          {threadPaths.map((item) => (
            <button
              key={item.id}
              aria-pressed={item.id === thread.id}
              className={item.id === thread.id ? 'is-active' : ''}
              onClick={() => onSelect(item.id)}
            >
              <span>{item.eyebrow}</span>
              <strong>{item.title}</strong>
            </button>
          ))}
        </div>

        <p className="vincent-thread-connection">{thread.connection}</p>

        <div className="vincent-thread-chain" aria-label="Artwork place and letter connection">
          <section>
            <span>01 / ARTWORK</span>
            <div className="vincent-thread-artworks">
              {selectedWorks.map((work) => (
                <a key={work.id} href={work.sourceUrl} target="_blank" rel="noreferrer">
                  <img src={work.image} alt="" />
                  <strong>{work.title}</strong>
                  <small>{work.date}</small>
                </a>
              ))}
            </div>
          </section>

          <section className="vincent-thread-link-card">
            <span>02 / PLACE</span>
            <h3>{thread.place}</h3>
            <button onClick={() => onPlace(thread)}>Enter place room →</button>
          </section>

          <section className="vincent-thread-link-card">
            <span>03 / LETTER</span>
            <h3>{letter.label}</h3>
            <p>{letter.date} · {letter.place}</p>
            <button onClick={() => onLetter(thread)}>Enter letter room →</button>
          </section>
        </div>

        <footer className="vincent-thread-footer">
          <div>
            <button
              className={isSaved ? 'is-saved' : ''}
              onClick={() => onSave(thread.id)}
              disabled={isSaved}
            >
              {isSaved ? 'Thread saved ✓' : 'Save this thread +'}
            </button>
            <button className="vincent-thread-atlas-link" onClick={onAtlas}>Open full Atlas ✦</button>
          </div>
          <span role="status">{isSaved ? 'Saved to this browser.' : 'Keep a path through the exhibition.'}</span>
        </footer>
      </aside>
    </div>
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

function ArtworkFigure({ work, className = '', onFollow }: { work: VincentWork; className?: string; onFollow?: () => void }) {
  return (
    <figure className={'vincent-artwork ' + className}>
      <a href={work.sourceUrl} target="_blank" rel="noreferrer" aria-label={'Open source record for ' + work.title}>
        <img src={work.image} alt={work.alt} loading="lazy" />
      </a>
      <figcaption>
        <span>{work.title}</span>
        <span>{work.date} · {work.place}</span>
        <small>{work.note}</small>
        {onFollow && <button className="vincent-follow-thread" onClick={onFollow}>Follow thread ↯</button>}
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
