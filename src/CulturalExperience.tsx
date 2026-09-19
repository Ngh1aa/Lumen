import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { Artwork } from './artworks';

type OpenArtwork = (artwork: Artwork) => void;

type MoodKey = 'Electric' | 'Dreamlike' | 'Quiet' | 'Restless' | 'Radiant';

const moodPaths: Array<{
  key: MoodKey;
  label: string;
  prompt: string;
  statement: string;
  accent: string;
  picks: number[];
}> = [
  {
    key: 'Electric',
    label: 'Electric',
    prompt: 'I want tension, pulse and charge.',
    statement: 'Edges sharpen. Color behaves like current.',
    accent: '#7f7be8',
    picks: [0, 2, 5],
  },
  {
    key: 'Dreamlike',
    label: 'Dreamlike',
    prompt: 'I want uncertainty and soft logic.',
    statement: 'Forms drift before they resolve into objects.',
    accent: '#9a86d9',
    picks: [3, 7, 0],
  },
  {
    key: 'Quiet',
    label: 'Quiet',
    prompt: 'I want space, pause and low contrast.',
    statement: 'Attention slows down enough to notice the interval.',
    accent: '#b9b7d1',
    picks: [4, 5, 7],
  },
  {
    key: 'Restless',
    label: 'Restless',
    prompt: 'I want movement without destination.',
    statement: 'The image refuses a stable center.',
    accent: '#6477d0',
    picks: [2, 0, 6],
  },
  {
    key: 'Radiant',
    label: 'Radiant',
    prompt: 'I want warmth, flare and release.',
    statement: 'Brightness becomes the event, not the background.',
    accent: '#d0a833',
    picks: [1, 7, 3],
  },
];

function objectTransition(id: string): CSSProperties {
  return { viewTransitionName: `artwork-${id}` } as CSSProperties;
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
  const [activeMood, setActiveMood] = useState<MoodKey>('Dreamlike');
  const config = moodPaths.find((mood) => mood.key === activeMood) || moodPaths[1];
  const picks = config.picks.map((index) => artworks[index]).filter(Boolean);

  return (
    <section
      className="mood-view"
      aria-labelledby="mood-title"
      style={{ '--mood-accent': config.accent } as CSSProperties}
    >
      <div className="mood-intro">
        <div>
          <p className="eyebrow">Discover / Mood</p>
          <h1 id="mood-title">Choose a feeling.<br /><em>Follow a path.</em></h1>
        </div>
        <p>
          Mood is a prototype discovery layer, not museum scholarship. It turns a vague intention
          into a visible path through the same collection.
        </p>
      </div>

      <div className="mood-selector" role="group" aria-label="Choose a mood path">
        {moodPaths.map((mood, index) => (
          <button
            key={mood.key}
            className={activeMood === mood.key ? 'is-active' : ''}
            aria-pressed={activeMood === mood.key}
            onClick={() => setActiveMood(mood.key)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{mood.label}</strong>
            <small>{mood.prompt}</small>
          </button>
        ))}
      </div>

      <div className="mood-stage">
        <div className="mood-statement">
          <span>Selected path / {config.label}</span>
          <h2>{config.statement}</h2>
          <p>
            Three objects are sequenced as a conceptual route. Text labels remain explicit so the
            experience never depends on color alone.
          </p>
          <button onClick={onStory}>Enter curated journey <span aria-hidden="true">↗</span></button>
        </div>

        <div className="mood-art-field">
          {picks.map((artwork, index) => (
            <article className={`mood-art mood-art--${index + 1}`} key={artwork.id}>
              <button onClick={() => onOpen(artwork)} aria-label={`Open ${artwork.title}`}>
                <span className="mood-image">
                  <img src={artwork.image} alt={artwork.alt} style={objectTransition(artwork.id)} />
                </span>
                <span className="mood-meta">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <span><strong>{artwork.title}</strong>{artwork.date}</span>
                </span>
              </button>
            </article>
          ))}
        </div>
      </div>

      <p className="mood-evidence-note">
        Prototype taxonomy: mood labels and sequences are an interaction-design hypothesis for weak-intent
        discovery. They are not authored by the source archive.
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
  imageIndex: number;
  altIndex?: number;
  mode: 'opening' | 'split' | 'quote' | 'compare' | 'closing';
};

const chapters: Chapter[] = [
  {
    id: 'signal',
    number: '01',
    kicker: 'Signal',
    title: 'Before an image becomes a thing, it is a pressure.',
    body: 'This opening chapter treats color as an event. The work is not decoded; it is encountered as density, direction and charge.',
    imageIndex: 0,
    mode: 'opening',
  },
  {
    id: 'friction',
    number: '02',
    kicker: 'Friction',
    title: 'A stable center is optional.',
    body: 'The eye keeps searching for hierarchy. LUMEN lets the composition resist that demand, then uses motion and scale to return orientation when needed.',
    imageIndex: 2,
    mode: 'split',
  },
  {
    id: 'interval',
    number: '03',
    kicker: 'Interval',
    title: 'Quiet is not the absence of information.',
    body: 'A pause can become structure. Negative space, restrained metadata and a slower reading rhythm create room for the object to remain unresolved.',
    imageIndex: 4,
    mode: 'quote',
  },
  {
    id: 'contrast',
    number: '04',
    kicker: 'Contrast',
    title: 'Two images can disagree and still belong to the same path.',
    body: 'Comparison is used as a storytelling device: not to declare equivalence, but to expose differences in temperature, density and visual tempo.',
    imageIndex: 1,
    altIndex: 6,
    mode: 'compare',
  },
  {
    id: 'afterimage',
    number: '05',
    kicker: 'Afterimage',
    title: 'Leave with a question, not a conclusion.',
    body: 'The journey closes by returning agency to the visitor: continue through mood, jump into the relationship Atlas, or inspect the object directly.',
    imageIndex: 7,
    mode: 'closing',
  },
];

export function CuratedJourney({
  artworks,
  onOpen,
  onMood,
  onAtlas,
}: {
  artworks: Artwork[];
  onOpen: OpenArtwork;
  onMood: () => void;
  onAtlas: (artwork: Artwork) => void;
}) {
  const [activeChapter, setActiveChapter] = useState('signal');
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

  return (
    <article className="journey" aria-labelledby="journey-title">
      <aside className="journey-rail" aria-label="Exhibition chapters">
        <div className="journey-rail-brand">LUMEN / Exhibition 01</div>
        <ol>
          {chapters.map((chapter, index) => (
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
        <div className="journey-progress" aria-label={`Chapter ${activeIndex + 1} of ${chapters.length}`}>
          <span style={{ transform: `scaleY(${(activeIndex + 1) / chapters.length})` }} />
        </div>
      </aside>

      <header className="journey-hero">
        <div className="journey-hero-copy">
          <p className="eyebrow">Curated Journey / Exhibition 01</p>
          <h1 id="journey-title">Signals from<br />a quiet <em>machine.</em></h1>
          <p>
            A speculative digital exhibition about pressure, interval and afterimage. Built from
            public-domain abstract works and LUMEN&apos;s own prototype curatorial layer.
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
              className={`journey-chapter journey-chapter--${chapter.mode}`}
              aria-labelledby={`${chapter.id}-title`}
            >
              <div className="chapter-label">
                <span>{chapter.number}</span>
                <span>{chapter.kicker}</span>
              </div>

              <div className="chapter-copy">
                <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                <p>{chapter.body}</p>
              </div>

              {chapter.mode === 'quote' ? (
                <div className="chapter-quote-block">
                  <blockquote>“The interval is where the image keeps changing after the screen stops.”</blockquote>
                  <span>LUMEN / prototype curatorial voice</span>
                </div>
              ) : null}

              {chapter.mode === 'compare' && secondary ? (
                <div className="chapter-compare">
                  <button onClick={() => onOpen(primary)}>
                    <img src={primary.image} alt={primary.alt} style={objectTransition(primary.id)} />
                    <span>{primary.title}</span>
                  </button>
                  <div className="compare-axis" aria-hidden="true"><span>density</span><i /><span>temperature</span></div>
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
                    <span>{primary.date} / {primary.mood}</span>
                  </span>
                </button>
              )}

              {chapter.mode === 'closing' ? (
                <div className="journey-exit">
                  <button onClick={onMood}>Explore by mood <span>↗</span></button>
                  <button onClick={() => onAtlas(primary)}>Open relationship Atlas <span>↗</span></button>
                  <button onClick={() => onOpen(primary)}>Inspect final object <span>↗</span></button>
                </div>
              ) : null}
            </section>
          );
        })}
      </div>

      <footer className="journey-credits">
        <span>Exhibition 01 / Signals from a Quiet Machine</span>
        <p>
          Curatorial writing is original prototype content for LUMEN. Artwork files remain public-domain
          media from Wikimedia Commons and retain their source links in object detail.
        </p>
      </footer>
    </article>
  );
}
