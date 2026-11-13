import { CSSProperties, FormEvent, useEffect, useId, useRef, useState } from 'react';
import { Artwork, thumb } from './artworks';
import { Link, useRouter } from './router';
import { ArtworkSet, MuseumData, SET_NAME_MAX, validateSetName } from './store';
import { ConfirmDialog, NewSetForm, SetPicker } from './MuseumControls';

function escapeXml(value: string) {
  return value.replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[character] || character));
}

function exportSvg(name: string, works: Artwork[]) {
  const rows = works.map((artwork, index) =>
    '<text x="80" y="' + (250 + index * 48) + '" fill="#f3f0e8" font-family="Arial" font-size="22">' +
    String(index + 1).padStart(2, '0') + '  ' + escapeXml(artwork.title) + ' — ' + escapeXml(artwork.artist) + '</text>',
  ).join('');
  const height = Math.max(720, 330 + works.length * 48);
  const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="' + height + '" viewBox="0 0 1200 ' + height + '">' +
    '<rect width="1200" height="' + height + '" fill="#090909"/>' +
    '<text x="80" y="90" fill="#f3f0e8" font-family="Georgia" font-size="58">LUMEN</text>' +
    '<text x="80" y="155" fill="#8f8d88" font-family="Arial" font-size="18">MY COLLECTION / ' + works.length + ' WORKS</text>' +
    '<text x="80" y="205" fill="#f3f0e8" font-family="Georgia" font-size="34">' + escapeXml(name) + '</text>' +
    rows + '</svg>';
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'lumen-collection.svg';
  anchor.click();
  URL.revokeObjectURL(url);
}

function RenameForm({ set, sets, onRename, onCancel }: { set: ArtworkSet; sets: ArtworkSet[]; onRename: (name: string) => void; onCancel: () => void }) {
  const [name, setName] = useState(set.name);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const errorId = useId();
  useEffect(() => { inputRef.current?.select(); }, []);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const problem = validateSetName(name, sets, set.id);
    if (problem) { setError(problem); return; }
    onRename(name.trim());
  };
  return (
    <form className="rename-form" onSubmit={submit} noValidate onKeyDown={(event) => { if (event.key === 'Escape') onCancel(); }}>
      <label htmlFor={inputId}>Set name</label>
      <div>
        <input
          ref={inputRef}
          id={inputId}
          value={name}
          maxLength={SET_NAME_MAX}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => { setName(event.target.value); setError(undefined); }}
        />
        <button type="submit">Save name</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </form>
  );
}

export function MyCollection({ artworks, data, setId }: {
  artworks: Artwork[];
  data: MuseumData;
  setId?: string;
}) {
  const { navigate } = useRouter();
  const savedArtworks = data.saved.map((id) => artworks.find((artwork) => artwork.id === id)).filter((artwork): artwork is Artwork => Boolean(artwork));
  const activeSet = setId ? data.sets.find((set) => set.id === setId) : undefined;
  const [viewMode, setViewMode] = useState<'grid' | 'thread'>('grid');
  const [renaming, setRenaming] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [notice, setNotice] = useState('');
  const panelHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { setRenaming(false); setConfirmDelete(false); }, [setId]);

  const share = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('saved', data.saved.join(','));
    url.hash = '/my-collection';
    try {
      await navigator.clipboard.writeText(url.toString());
      setNotice('Share link copied.');
    } catch {
      setNotice('Copy is unavailable in this browser.');
    }
  };

  const setWorks = activeSet
    ? activeSet.artworkIds.map((id) => artworks.find((artwork) => artwork.id === id)).filter((artwork): artwork is Artwork => Boolean(artwork))
    : [];
  const addable = activeSet ? savedArtworks.filter((artwork) => !activeSet.artworkIds.includes(artwork.id)) : [];

  const sidebar = (
    <aside className="my-sets" aria-label="Your sets">
      <h2 className="my-sets-title">Sets</h2>
      <ul>
        <li>
          <Link to={{ view: 'saved' }} aria-current={!setId ? 'page' : undefined} className={!setId ? 'is-active' : ''}>
            <span>All saved</span><small>{savedArtworks.length}</small>
          </Link>
        </li>
        {data.sets.map((set) => (
          <li key={set.id}>
            <Link to={{ view: 'saved', setId: set.id }} aria-current={set.id === setId ? 'page' : undefined} className={set.id === setId ? 'is-active' : ''}>
              <span>{set.name}</span><small>{set.artworkIds.length}</small>
            </Link>
          </li>
        ))}
      </ul>
      <NewSetForm
        sets={data.sets}
        onCreate={(name) => {
          const set = data.createSet(name);
          setNotice('Set “' + set.name + '” created.');
          navigate({ view: 'saved', setId: set.id });
        }}
      />
    </aside>
  );

  let panel;
  if (setId && !activeSet) {
    panel = (
      <div className="saved-empty">
        <span>Set not found</span>
        <h2 ref={panelHeadingRef}>This set no longer<br /><em>exists.</em></h2>
        <p>It may have been deleted, or the link was made on another visit. Your saved works are still here.</p>
        <Link className="button-link" to={{ view: 'saved' }}>Show all saved</Link>
      </div>
    );
  } else if (activeSet) {
    panel = (
      <>
        <div className="my-panel-head">
          {renaming ? (
            <RenameForm
              set={activeSet}
              sets={data.sets}
              onCancel={() => setRenaming(false)}
              onRename={(name) => { data.renameSet(activeSet.id, name); setRenaming(false); setNotice('Set renamed to “' + name + '”.'); }}
            />
          ) : (
            <div>
              <p className="eyebrow">Set</p>
              <h2 ref={panelHeadingRef} className="my-panel-title">{activeSet.name}</h2>
              <p className="my-panel-count">{setWorks.length} {setWorks.length === 1 ? 'work' : 'works'}</p>
            </div>
          )}
          {!renaming && (
            <div className="my-panel-actions">
              <button type="button" onClick={() => setRenaming(true)}>Rename set</button>
              <button type="button" onClick={() => exportSvg(activeSet.name, setWorks)} disabled={setWorks.length === 0}>Export as image</button>
              <button type="button" className="is-danger" onClick={() => setConfirmDelete(true)}>Delete set</button>
            </div>
          )}
        </div>
        <p className="my-notice" role="status">{notice}</p>

        {setWorks.length === 0 ? (
          <div className="saved-empty saved-empty--set">
            <span>00 / in this set</span>
            <h3>This set is <em>empty.</em></h3>
            <p>{savedArtworks.length ? 'Add works you have already saved, or keep browsing.' : 'Save works from the collection, then add them here.'}</p>
            <Link className="button-link" to={{ view: 'collection', query: '' }}>Browse collection</Link>
          </div>
        ) : (
          <ul className="saved-grid saved-grid--grid my-grid" aria-label={'Works in ' + activeSet.name}>
            {setWorks.map((artwork, index) => (
              <li key={artwork.id}>
                <SavedCard artwork={artwork} index={index}>
                  <button type="button" onClick={() => { data.removeFromSet(activeSet.id, artwork.id); setNotice(artwork.title + ' removed from ' + activeSet.name + '.'); }}>
                    Remove from set
                  </button>
                </SavedCard>
              </li>
            ))}
          </ul>
        )}

        {addable.length > 0 && (
          <section className="my-addable" aria-labelledby="addable-title">
            <h3 id="addable-title">Add from saved</h3>
            <ul>
              {addable.map((artwork) => (
                <li key={artwork.id}>
                  <img src={thumb(artwork, 330)} alt="" loading="lazy" />
                  <span><strong>{artwork.title}</strong>{artwork.artist}</span>
                  <button type="button" aria-label={'Add ' + artwork.title + ' to ' + activeSet.name} onClick={() => { data.addToSet(activeSet.id, artwork.id); setNotice(artwork.title + ' added to ' + activeSet.name + '.'); }}>
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ConfirmDialog
          open={confirmDelete}
          title={'Delete set “' + activeSet.name + '”?'}
          confirmLabel="Delete set"
          onCancel={() => setConfirmDelete(false)}
          onConfirm={() => {
            const name = activeSet.name;
            data.deleteSet(activeSet.id);
            setConfirmDelete(false);
            setNotice('Set “' + name + '” deleted. Its works are still saved.');
            navigate({ view: 'saved' }, { replace: true });
          }}
        >
          <p>The set and its order are removed. The {setWorks.length} {setWorks.length === 1 ? 'work stays' : 'works stay'} in All saved.</p>
        </ConfirmDialog>
      </>
    );
  } else {
    panel = (
      <>
        <div className="my-panel-head">
          <div>
            <p className="eyebrow">All saved</p>
            <h2 ref={panelHeadingRef} className="my-panel-title">Everything you kept</h2>
            <p className="my-panel-count">{savedArtworks.length} {savedArtworks.length === 1 ? 'work' : 'works'}</p>
          </div>
          <div className="my-panel-actions">
            <div className="collection-view-toggle" role="group" aria-label="Collection view">
              <button type="button" aria-pressed={viewMode === 'grid'} className={viewMode === 'grid' ? 'is-active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
              <button type="button" aria-pressed={viewMode === 'thread'} className={viewMode === 'thread' ? 'is-active' : ''} onClick={() => setViewMode('thread')}>Thread</button>
            </div>
            <button type="button" onClick={share} disabled={savedArtworks.length === 0}>Share as link</button>
            <button type="button" onClick={() => { exportSvg('All saved', savedArtworks); setNotice('Collection image exported.'); }} disabled={savedArtworks.length === 0}>Export as image</button>
          </div>
        </div>
        <p className="my-notice" role="status">{notice}</p>

        {savedArtworks.length === 0 ? (
          <div className="saved-empty">
            <span>00 / saved</span>
            <h2>Nothing here<br /><em>yet.</em></h2>
            <p>Save a work from the collection, an exhibition or a drift, and it waits here for the rest of this visit.</p>
            <div className="saved-empty-actions">
              <Link className="button-link" to={{ view: 'collection', query: '' }}>Browse collection</Link>
              <Link className="button-link" to={{ view: 'drift' }}>Start drifting</Link>
            </div>
          </div>
        ) : (
          <ul className={'saved-grid saved-grid--' + viewMode + ' my-grid'} aria-label="Saved works">
            {savedArtworks.map((artwork, index) => (
              <li key={artwork.id} data-thread={artwork.theme}>
                {viewMode === 'thread' && <div className="saved-thread-label">{artwork.theme} thread</div>}
                <SavedCard artwork={artwork} index={index}>
                  <SetPicker artworkId={artwork.id} artworkTitle={artwork.title} data={data} align="start" />
                  <button type="button" aria-label={'Remove ' + artwork.title + ' from saved'} onClick={() => { data.unsave(artwork.id); setNotice(artwork.title + ' removed from saved.'); }}>Remove</button>
                </SavedCard>
                <label className="saved-note">
                  <span>Private note</span>
                  <textarea
                    value={data.notes[artwork.id] || ''}
                    onChange={(event) => data.setNote(artwork.id, event.target.value)}
                    placeholder="Why did this stay with you?"
                  />
                </label>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <section className="saved-view my-collection" aria-labelledby="saved-title">
      <div className="saved-head">
        <div>
          <p className="eyebrow">My collection</p>
          <h1 id="saved-title">Saved by<br /><em>drifting.</em></h1>
        </div>
        <p>
          {savedArtworks.length} saved {savedArtworks.length === 1 ? 'work' : 'works'} in {data.sets.length} {data.sets.length === 1 ? 'set' : 'sets'}.
          No account needed. Copy a share link to keep your saved works beyond this visit.
        </p>
      </div>
      <div className="my-layout">
        {sidebar}
        <div className="my-panel">{panel}</div>
      </div>
    </section>
  );
}

function SavedCard({ artwork, index, children }: { artwork: Artwork; index: number; children: React.ReactNode }) {
  return (
    <article className="saved-card">
      <Link className="saved-art" to={{ view: 'detail', id: artwork.id }} style={{ '--card-accent': artwork.accent } as CSSProperties}>
        <img src={thumb(artwork)} alt={artwork.alt} loading={index > 3 ? 'lazy' : 'eager'} />
      </Link>
      <div className="saved-meta">
        <div><span>{String(index + 1).padStart(2, '0')}</span><strong>{artwork.title}</strong><small>{artwork.artist}</small></div>
        <div className="saved-card-actions">{children}</div>
      </div>
    </article>
  );
}
