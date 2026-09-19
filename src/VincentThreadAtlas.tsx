import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

export type VincentAtlasArtwork = {
  id: string;
  title: string;
  date: string;
  place: string;
  image: string;
  sourceUrl: string;
  note: string;
  themes: string[];
};

export type VincentAtlasLetter = {
  id: string;
  label: string;
  date: string;
  place: string;
  source: string;
  note: string;
  themes: string[];
};

type Lens = 'time' | 'place' | 'theme';

type AtlasNode =
  | ({ kind: 'artwork' } & VincentAtlasArtwork)
  | ({ kind: 'letter' } & VincentAtlasLetter);

type Relation = {
  node: AtlasNode;
  reason: string;
  shared: string[];
};

const lensCopy: Record<Lens, { label: string; cue: string }> = {
  time: { label: 'TIME', cue: 'Works and letters that share a year.' },
  place: { label: 'PLACE', cue: 'Objects connected by where they were made or written.' },
  theme: { label: 'THEME', cue: 'A LUMEN editorial index across image and correspondence.' },
};

const normalizePlace = (place: string) => {
  if (place.toLowerCase().includes('saint-rémy')) return 'Saint-Rémy';
  return place;
};

const yearOf = (date: string) => date.match(/18\d{2}/)?.[0] || date;

const nodeTitle = (node: AtlasNode) => node.kind === 'artwork' ? node.title : node.label;

const relationFor = (origin: AtlasNode, candidate: AtlasNode, lens: Lens): Relation | null => {
  if (origin.id === candidate.id && origin.kind === candidate.kind) return null;

  if (lens === 'time') {
    const year = yearOf(origin.date);
    if (year !== yearOf(candidate.date)) return null;
    return { node: candidate, shared: [year], reason: `Both connect to ${year}.` };
  }

  if (lens === 'place') {
    const place = normalizePlace(origin.place);
    if (place !== normalizePlace(candidate.place)) return null;
    return { node: candidate, shared: [place], reason: `Both connect to ${place}.` };
  }

  const shared = origin.themes.filter((theme) => candidate.themes.includes(theme));
  if (!shared.length) return null;
  return {
    node: candidate,
    shared,
    reason: `Shared LUMEN index: ${shared.join(' / ')}.`,
  };
};

const ringPosition = (index: number, total: number, radius: number, offset = -90) => {
  const angle = (offset + (360 / Math.max(total, 1)) * index) * Math.PI / 180;
  return {
    x: 50 + Math.cos(angle) * radius,
    y: 50 + Math.sin(angle) * radius,
  };
};

export function VincentThreadAtlas({
  open,
  reducedMotion,
  artworks,
  letters,
  onClose,
}: {
  open: boolean;
  reducedMotion: boolean;
  artworks: VincentAtlasArtwork[];
  letters: VincentAtlasLetter[];
  onClose: () => void;
}) {
  const allNodes = useMemo<AtlasNode[]>(
    () => [
      ...artworks.map((artwork) => ({ ...artwork, kind: 'artwork' as const })),
      ...letters.map((letter) => ({ ...letter, kind: 'letter' as const })),
    ],
    [artworks, letters],
  );
  const [lens, setLens] = useState<Lens>('place');
  const [selectedKey, setSelectedKey] = useState('artwork:starry');
  const closeRef = useRef<HTMLButtonElement>(null);

  const selected = useMemo(
    () => allNodes.find((node) => `${node.kind}:${node.id}` === selectedKey) || allNodes[0],
    [allNodes, selectedKey],
  );

  const relations = useMemo(
    () => allNodes
      .map((node) => relationFor(selected, node, lens))
      .filter((relation): relation is Relation => Boolean(relation)),
    [allNodes, lens, selected],
  );

  const unrelated = useMemo(
    () => allNodes.filter((node) =>
      node.id !== selected.id || node.kind !== selected.kind
        ? !relations.some((relation) => relation.node.id === node.id && relation.node.kind === node.kind)
        : false,
    ),
    [allNodes, relations, selected],
  );

  const graphNodes = useMemo(() => {
    const positioned: Array<{ node: AtlasNode; x: number; y: number; relation?: Relation; dim: boolean }> = [
      { node: selected, x: 50, y: 50, dim: false },
    ];

    relations.forEach((relation, index) => {
      const position = ringPosition(index, relations.length, 31);
      positioned.push({ node: relation.node, ...position, relation, dim: false });
    });

    unrelated.forEach((node, index) => {
      const position = ringPosition(index, unrelated.length, 45, -72);
      positioned.push({ node, ...position, dim: true });
    });

    return positioned;
  }, [relations, selected, unrelated]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, open]);

  if (!open || !selected) return null;

  const selectedSource = selected.kind === 'artwork' ? selected.sourceUrl : selected.source;
  const selectedDisplay = nodeTitle(selected);
  const relationLabel = lensCopy[lens];

  return (
    <div className="vincent-atlas-layer">
      <div className="vincent-atlas-scrim" aria-hidden="true" />
      <section
        className="vincent-atlas"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vincent-atlas-title"
        data-motion={reducedMotion ? 'reduced' : 'full'}
      >
        <header className="vincent-atlas-header">
          <div>
            <p>SUPER PROJECT 01 / CULTURAL THREAD SYSTEM</p>
            <h2 id="vincent-atlas-title">Thread <em>Atlas</em></h2>
          </div>
          <div className="vincent-atlas-header-actions">
            <span>{allNodes.length} objects / 3 lenses</span>
            <button ref={closeRef} onClick={onClose} aria-label="Close Vincent Thread Atlas">×</button>
          </div>
        </header>

        <div className="vincent-atlas-lenses" role="group" aria-label="Thread Atlas relationship lens">
          <div className="vincent-atlas-lens-core" aria-hidden="true">
            <span>LENS</span>
            <strong>{lens.toUpperCase()}</strong>
          </div>
          {(Object.keys(lensCopy) as Lens[]).map((item, index) => (
            <button
              key={item}
              className={lens === item ? 'is-active' : ''}
              aria-pressed={lens === item}
              onClick={() => setLens(item)}
              style={{ '--lens-index': index } as CSSProperties}
            >
              <span>0{index + 1}</span>
              <strong>{lensCopy[item].label}</strong>
            </button>
          ))}
        </div>

        <div className="vincent-atlas-layout">
          <div className="vincent-atlas-canvas" aria-label="Visual relationship constellation">
            <svg className="vincent-atlas-lines" viewBox="0 0 100 100" aria-hidden="true">
              {graphNodes.filter((item) => item.relation).map((item) => (
                <line
                  key={`${item.node.kind}-${item.node.id}`}
                  x1="50"
                  y1="50"
                  x2={item.x}
                  y2={item.y}
                />
              ))}
              <circle cx="50" cy="50" r="31" className="vincent-atlas-orbit" />
              <circle cx="50" cy="50" r="45" className="vincent-atlas-orbit is-outer" />
            </svg>

            {graphNodes.map((item) => {
              const key = `${item.node.kind}:${item.node.id}`;
              const active = key === selectedKey;
              return (
                <button
                  key={key}
                  className={[
                    'vincent-atlas-node',
                    'is-' + item.node.kind,
                    active ? 'is-selected' : '',
                    item.dim ? 'is-dim' : '',
                  ].filter(Boolean).join(' ')}
                  aria-pressed={active}
                  aria-label={`Focus ${item.node.kind} ${nodeTitle(item.node)}`}
                  onClick={() => setSelectedKey(key)}
                  style={{ '--node-x': item.x + '%', '--node-y': item.y + '%' } as CSSProperties}
                >
                  {item.node.kind === 'artwork' ? (
                    <>
                      <img src={item.node.image} alt="" />
                      <span>{item.node.date}</span>
                      <strong>{item.node.title}</strong>
                    </>
                  ) : (
                    <>
                      <span>{item.node.date}</span>
                      <strong>{item.node.label}</strong>
                      <small>LETTER</small>
                    </>
                  )}
                </button>
              );
            })}

            <div className="vincent-atlas-canvas-label" aria-hidden="true">
              <span>{relationLabel.label}</span>
              <p>{relationLabel.cue}</p>
            </div>
          </div>

          <aside className="vincent-atlas-reading" aria-live="polite">
            <p className="vincent-atlas-kicker">{selected.kind.toUpperCase()} / {selected.date}</p>
            {selected.kind === 'artwork' && <img src={selected.image} alt="" />}
            <h3>{selectedDisplay}</h3>
            <p className="vincent-atlas-meta">{selected.place}</p>
            <p className="vincent-atlas-note">{selected.note}</p>
            <a href={selectedSource} target="_blank" rel="noreferrer">
              Open {selected.kind === 'artwork' ? 'provenance' : 'scholarly letter'} ↗
            </a>
            {lens === 'theme' && (
              <p className="vincent-atlas-method">
                THEME is a LUMEN-authored editorial index for this prototype, not museum taxonomy.
              </p>
            )}
          </aside>
        </div>

        <section className="vincent-atlas-semantic" aria-labelledby="vincent-atlas-relations">
          <header>
            <span>RELATION PATH</span>
            <h3 id="vincent-atlas-relations">{selectedDisplay} through {relationLabel.label.toLowerCase()}</h3>
            <p>{relations.length ? relationLabel.cue : 'No direct connections under this lens. Choose another object or lens.'}</p>
          </header>
          <ol>
            {relations.map((relation, index) => {
              const key = `${relation.node.kind}:${relation.node.id}`;
              return (
                <li key={key}>
                  <span>0{index + 1}</span>
                  <button onClick={() => setSelectedKey(key)}>
                    <strong>{nodeTitle(relation.node)}</strong>
                    <small>{relation.node.date} · {relation.node.place}</small>
                  </button>
                  <p>{relation.reason}</p>
                </li>
              );
            })}
          </ol>
        </section>
      </section>
    </div>
  );
}
