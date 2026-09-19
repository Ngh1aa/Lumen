import { CSSProperties, useEffect, useRef, useState } from 'react';
import { Artwork } from './artworks';

type OpenArtwork = (artwork: Artwork) => void;
type MoodKey = 'Quiet' | 'Restless' | 'Tender' | 'Uncanny' | 'Monumental' | 'Luminous' | 'Melancholy' | 'Playful' | 'Ecstatic';

const moodPaths: Array<{
  key: MoodKey;
  prompt: string;
  statement: string;
  rationale: string;
  accent: string;
  picks: number[];
}> = [
  {
    key: 'Quiet',
    prompt: 'Stillness without emptiness.',
    statement: 'Nothing moves, yet everything is about to.',
    rationale: 'Chosen for low contrast, open intervals and a visual rhythm that rewards slower looking.',
    accent: '#b9b7d1',
    picks: [4, 9, 5, 7, 0, 12],
  },
  {
    key: 'Restless',
    prompt: 'Movement without destination.',
    statement: 'The image refuses a stable center.',
    rationale: 'Chosen for directional pressure and repeated forms that keep the eye circulating instead of settling.',
    accent: '#6477d0',
    picks: [2, 10, 0, 3, 11, 6],
  },
  {
    key: 'Tender',
    prompt: 'Softness with an edge.',
    statement: 'Gentleness arrives through interruption.',
    rationale: 'Chosen for muted warmth, layered transitions and details that feel close without becoming sentimental.',
    accent: '#a68c9a',
    picks: [7, 12, 4, 1, 5, 8],
  },
  {
    key: 'Uncanny',
    prompt: 'Almost familiar, never resolved.',
    statement: 'Recognition keeps slipping one step away.',
    rationale: 'Chosen for forms that hover between architecture, atmosphere and machine-like structure.',
    accent: '#8876a8',
    picks: [3, 11, 6, 2, 0, 10],
  },
  {
    key: 'Monumental',
    prompt: 'Weight, scale and pressure.',
    statement: 'A fragment behaves like a whole environment.',
    rationale: 'Chosen for density and compositional weight that make the frame feel too small for the structure it contains.',
    accent: '#7b6d9f',
    picks: [6, 2, 3, 10, 5, 9],
  },
  {
    key: 'Luminous',
    prompt: 'Light as material.',
    statement: 'Brightness becomes the event.',
    rationale: 'Chosen for fields where illumination appears to emerge from inside the image rather than fall across it.',
    accent: '#7f7be8',
    picks: [0, 1, 10, 8, 3, 11],
  },
  {
    key: 'Melancholy',
    prompt: 'Distance, memory, afterimage.',
    statement: 'The room feels present after everyone has left.',
    rationale: 'Chosen for cool palettes and receding structures that feel remembered rather than directly encountered.',
    accent: '#6779ba',
    picks: [5, 4, 7, 11, 0, 12],
  },
  {
    key: 'Playful',
    prompt: 'A visual rule, then a small refusal.',
    statement: 'One bright note changes the entire room.',
    rationale: 'Chosen for unexpected accents and compositional turns that break severity without becoming decorative.',
    accent: '#c6a64a',
    picks: [8, 1, 7, 9, 0, 12],
  },
  {
    key: 'Ecstatic',
    prompt: 'Flare, release, overload.',
    statement: 'The signal arrives all at once.',
    rationale: 'Chosen for brightness, saturation and expansion that push the image toward visual excess.',
    accent: '#d0a833',
    picks: [1, 0, 8, 10, 2, 11],
  },
];

function objectTransition(id: string): CSSProperties {
  return { viewTransitionName: 'artwork-' + id } as CSSProperties;
}

export function MoodView({
  artworks,
  onOpen,
  onStory,
}: {
  artworks: Artwork[];
  onOpen: OpenArtwork;
  onStory: () => void;
}) {
  const [activeMood, setActiveMood] = useState<MoodKey>('Quiet');
  const config = moodPaths.find((mood) => mood.key === activeMood) || moodPaths[0];
  const picks = config.picks.map((index) => artworks[index]).filter(Boolean).slice(0, 6);

  return (
    <section
      className="mood-view"
      aria-labelledby="mood-title"
      style={{ '--mood-accent': config.accent } as CSSProperties}
    >
      <div className="mood-intro">
        <div>
          <p className="eyebrow">Discover / Mood</p>
          <h1 id="mood-title">Start with<br /><em>a feeling.</em></h1>
        </div>
        <p>
          Mood is an editorial discovery layer for weak intent. Each path is manually authored for this prototype,
          with a visible reason for why an object was included.
        </p>
      </div>

      <div className="mood-cloud" role="group" aria-label="Choose a mood path">
        {moodPaths.map((mood, index) => (
          <button
            key={mood.key}
            className={activeMood === mood.key ? 'is-active' : ''}
            aria-pressed={activeMood === mood.key}
            onClick={() => setActiveMood(mood.key)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{mood.key}</strong>
            <small>{mood.prompt}</small>
          </button>
        ))}
      </div>

      <div className="mood-stage mood-stage--expanded">
        <div className="mood-statement">
          <span>Selected path / {config.key}</span>
          <h2>{config.statement}</h2>
          <p>{config.rationale}</p>
          <button onClick={onStory}>Enter curated exhibition <span aria-hidden="true">↗</span></button>
        </div>

        <div className="mood-results" aria-label={config.key + ' artwork path'}>
          {picks.map((artwork, index) => (
            <article className="mood-result" key={artwork.id}>
              <button onClick={() => onOpen(artwork)} aria-label={'Open ' + artwork.title}>
                <span className="mood-result-image">
                  <img src={artwork.image} alt={artwork.alt} style={objectTransition(artwork.id)} />
                </span>
                <span className="mood-result-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{artwork.title}</strong>{artwork.paletteName} · {artwork.theme}</span>
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>

      <p className="mood-evidence-note">
        Editorial prototype taxonomy: mood labels, sequences and explanations are authored by LUMEN for interaction
        testing. They are not claims from the source archive.
      </p>
    </section>
  );
}

type Chapter = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  body: string;
  question: string;
  imageIndex: number;
  altIndex?: number;
  mode: 'opening' | 'split' | 'network' | 'compare' | 'quiet' | 'closing';
};

const chapters: Chapter[] = [
  {
    id: 'threshold',
    number: '00',
    kicker: 'Threshold',
    title: 'A machine that hums so softly you only notice when it stops.',
    body: 'The exhibition begins before the mechanism is explained. Repetition, glow and almost-geometry establish a room where information feels present but not yet readable.',
    question: 'What do you notice before you know what you are looking at?',
    imageIndex: 6,
    mode: 'opening',
  },
  {
    id: 'hum',
    number: '01',
    kicker: 'Hum',
    title: 'Repetition is a kind of memory.',
    body: 'A recurring form can feel mechanical without becoming cold. Here rhythm acts like a low frequency: structural enough to orient you, quiet enough to stay beneath language.',
    question: 'When does repetition become atmosphere?',
    imageIndex: 1,
    mode: 'split',
  },
  {
    id: 'circuit',
    number: '02',
    kicker: 'Circuit',
    title: 'Every line suggests somewhere else to go.',
    body: 'Connections turn structure into navigation. A path can carry color, rhythm or visual pressure without claiming that two works mean the same thing.',
    question: 'Can a relationship be useful without being definitive?',
    imageIndex: 3,
    altIndex: 9,
    mode: 'network',
  },
  {
    id: 'noise',
    number: '03',
    kicker: 'Noise',
    title: 'Too much information becomes texture.',
    body: 'When hierarchy collapses, data stops behaving like instruction and starts behaving like weather. The eye scans, doubles back and invents temporary order.',
    question: 'How long do you keep looking when the image refuses a center?',
    imageIndex: 2,
    altIndex: 11,
    mode: 'compare',
  },
  {
    id: 'silence',
    number: '04',
    kicker: 'Silence',
    title: 'Pause is not the absence of content.',
    body: 'Low contrast and open intervals change the speed of looking. Nothing is removed; the work simply asks for attention that is less urgent and more precise.',
    question: 'What appears only after you stop trying to find it?',
    imageIndex: 4,
    mode: 'quiet',
  },
  {
    id: 'signal',
    number: '05',
    kicker: 'Signal',
    title: 'A signal is complete only when someone receives it.',
    body: 'The final chapter gives the path back to you. Save the journey, follow a relationship, choose a mood or drift outward from the final object.',
    question: 'What thread would you carry into the next room?',
    imageIndex: 0,
    mode: 'closing',
  },
];

export function CuratedJourney({
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
  const [activeChapter, setActiveChapter] = useState('threshold');
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveChapter(visible.target.id);
      },
      { threshold: [0.35, 0.55, 0.75] },
    );

    chapters.forEach((chapter) => {
      const element = document.getElementById(chapter.id);
      if (element) observerRef.current?.observe(element);
    });

    return () => observerRef.current?.disconnect();
  }, [artworks]);

  const activeIndex = Math.max(0, chapters.findIndex((chapter) => chapter.id === activeChapter));
  const journeyIds = chapters.map((chapter) => artworks[chapter.imageIndex]?.id).filter((id): id is string => Boolean(id));

  return (
    <article className="journey" aria-labelledby="journey-title">
      <aside className="journey-rail" aria-label="Exhibition chapters">
        <div className="journey-rail-brand">LUMEN / Exhibition 01</div>
        <ol>
          {chapters.map((chapter) => (
            <li key={chapter.id} className={chapter.id === activeChapter ? 'is-active' : ''}>
              <button
                type="button"
                onClick={() => document.getElementById(chapter.id)?.scrollIntoView({ block: 'start' })}
              >
                <span>{chapter.number}</span>
                <strong>{chapter.kicker}</strong>
              </button>
            </li>
          ))}
        </ol>
        <div
          className="journey-progress"
          role="progressbar"
          aria-label="Exhibition chapter progress"
          aria-valuemin={1}
          aria-valuemax={chapters.length}
          aria-valuenow={activeIndex + 1}
        >
          <span style={{ transform: 'scaleY(' + ((activeIndex + 1) / chapters.length) + ')' }} />
        </div>
      </aside>

      <header className="journey-hero">
        <div className="journey-hero-copy">
          <p className="eyebrow">Curated Journey / Exhibition 01</p>
          <h1 id="journey-title">Signals from<br />a quiet <em>machine.</em></h1>
          <p>
            Six chapters about repetition, networks, overload, pause and reception. Curatorial writing is original
            LUMEN prototype content; source artworks keep their own provenance.
          </p>
        </div>
        {artworks[3] && (
          <button className="journey-hero-art" onClick={() => onOpen(artworks[3])}>
            <img src={artworks[3].image} alt={artworks[3].alt} style={objectTransition(artworks[3].id)} />
            <span>{artworks[3].title} ↗</span>
          </button>
        )}
        <div className="journey-scroll-cue" aria-hidden="true">Scroll to enter ↓</div>
      </header>

      <div className="journey-body">
        {chapters.map((chapter) => {
          const primary = artworks[chapter.imageIndex];
          const secondary = chapter.altIndex !== undefined ? artworks[chapter.altIndex] : undefined;
          if (!primary) return null;

          return (
            <section
              key={chapter.id}
              id={chapter.id}
              className={'journey-chapter journey-chapter--' + chapter.mode}
              aria-labelledby={chapter.id + '-title'}
            >
              <div className="chapter-label">
                <span>{chapter.number}</span>
                <span>{chapter.kicker}</span>
              </div>

              <div className="chapter-copy">
                <h2 id={chapter.id + '-title'}>{chapter.title}</h2>
                <p>{chapter.body}</p>
                <blockquote className="chapter-question">“{chapter.question}”</blockquote>
              </div>

              {(chapter.mode === 'compare' || chapter.mode === 'network') && secondary ? (
                <div className="chapter-compare">
                  <button onClick={() => onOpen(primary)}>
                    <img src={primary.image} alt={primary.alt} style={objectTransition(primary.id)} />
                    <span>{primary.title}</span>
                  </button>
                  <div className="compare-axis" aria-hidden="true">
                    <span>{chapter.mode === 'network' ? 'thread' : 'density'}</span><i /><span>{chapter.mode === 'network' ? 'echo' : 'temperature'}</span>
                  </div>
                  <button onClick={() => onOpen(secondary)}>
                    <img src={secondary.image} alt={secondary.alt} style={objectTransition(secondary.id)} />
                    <span>{secondary.title}</span>
                  </button>
                </div>
              ) : (
                <button className="chapter-art" onClick={() => onOpen(primary)}>
                  <span className="chapter-art-frame" style={{ '--chapter-accent': primary.accent } as CSSProperties}>
                    <img src={primary.image} alt={primary.alt} style={objectTransition(primary.id)} />
                  </span>
                  <span className="chapter-art-caption">
                    <span>{primary.title}</span>
                    <span>{primary.date} / {primary.paletteName}</span>
                  </span>
                </button>
              )}

              {chapter.mode === 'closing' ? (
                <div className="journey-exit">
                  <button onClick={() => onSaveJourney?.(journeyIds)}>Save this journey <span>+</span></button>
                  <button onClick={onMood}>Explore by mood <span>↗</span></button>
                  <button onClick={() => onAtlas(primary)}>Continue drifting from here <span>↗</span></button>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <footer className="journey-credits">
        <span>Exhibition 01 / Signals from a Quiet Machine</span>
        <p>
          Curatorial writing is original prototype content for LUMEN. Artwork files remain public-domain media
          from Wikimedia Commons and retain their source links in object detail.
        </p>
      </footer>
    </article>
  );
}
