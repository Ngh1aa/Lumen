import { FormEvent, ReactNode, useEffect, useId, useRef, useState } from 'react';
import { ArtworkSet, MuseumData, SET_NAME_MAX, validateSetName } from './store';

/** Confirmation sheet for irreversible actions: Cancel is focused first, Escape cancels. */
export function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const bodyId = useId();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCancel();
      }
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button'));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => {
      window.removeEventListener('keydown', onKey, true);
      if (previous && document.contains(previous)) previous.focus({ preventScroll: true });
    };
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <section ref={dialogRef} className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={bodyId}>
        <h2 id={titleId}>{title}</h2>
        <div id={bodyId} className="confirm-body">{children}</div>
        <div className="confirm-actions">
          <button ref={cancelRef} type="button" onClick={onCancel}>Cancel</button>
          <button type="button" className="is-danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}

/** Inline "new set" form shared by My collection and the set picker. */
export function NewSetForm({
  sets,
  onCreate,
  label = 'New set name',
  submitLabel = 'Create set',
  compact = false,
}: {
  sets: ArtworkSet[];
  onCreate: (name: string) => void;
  label?: string;
  submitLabel?: string;
  compact?: boolean;
}) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string>();
  const inputId = useId();
  const errorId = useId();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const problem = validateSetName(name, sets);
    if (problem) { setError(problem); return; }
    onCreate(name.trim());
    setName('');
    setError(undefined);
  };

  return (
    <form className={'new-set-form' + (compact ? ' new-set-form--compact' : '')} onSubmit={submit} noValidate>
      <label htmlFor={inputId}>{label}</label>
      <div>
        <input
          id={inputId}
          value={name}
          maxLength={SET_NAME_MAX}
          placeholder="e.g. Night colors"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => { setName(event.target.value); if (error) setError(undefined); }}
        />
        <button type="submit">{submitLabel}</button>
      </div>
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </form>
  );
}

/** Disclosure panel that adds one artwork to any number of sets, or to a new one. */
export function SetPicker({ artworkId, artworkTitle, data, align = 'end' }: {
  artworkId: string;
  artworkTitle: string;
  data: MuseumData;
  align?: 'start' | 'end';
}) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const inCount = data.sets.filter((set) => set.artworkIds.includes(artworkId)).length;

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); buttonRef.current?.focus(); }
    };
    const onPointer = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node) && !buttonRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  useEffect(() => { if (open) panelRef.current?.querySelector<HTMLElement>('input')?.focus(); }, [open]);

  const toggle = (set: ArtworkSet) => {
    if (set.artworkIds.includes(artworkId)) {
      data.removeFromSet(set.id, artworkId);
      setStatus('Removed from ' + set.name);
    } else {
      data.addToSet(set.id, artworkId);
      setStatus('Added to ' + set.name);
    }
  };

  return (
    <div className={'set-picker set-picker--' + align}>
      <button
        ref={buttonRef}
        type="button"
        className="set-picker-trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={(inCount ? 'In ' + inCount + (inCount === 1 ? ' set' : ' sets') : 'Add to set') + ': ' + artworkTitle}
        onClick={() => { setOpen((value) => !value); setStatus(''); }}
      >
        {inCount ? 'In ' + inCount + (inCount === 1 ? ' set' : ' sets') : 'Add to set'}
      </button>
      {open && (
        <div ref={panelRef} id={panelId} className="set-picker-panel" role="group" aria-label={'Sets for ' + artworkTitle}>
          <p className="set-picker-title">Sets</p>
          {data.sets.length === 0 ? (
            <p className="set-picker-empty">No sets yet. Name one below.</p>
          ) : (
            <ul>
              {data.sets.map((set) => (
                <li key={set.id}>
                  <label>
                    <input type="checkbox" checked={set.artworkIds.includes(artworkId)} onChange={() => toggle(set)} />
                    <span>{set.name}</span>
                    <small>{set.artworkIds.length}</small>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <NewSetForm
            compact
            sets={data.sets}
            label="New set"
            submitLabel="Create"
            onCreate={(name) => {
              const set = data.createSet(name, [artworkId]);
              setStatus('Created ' + set.name);
            }}
          />
          <p className="set-picker-status" role="status">{status}</p>
          <button type="button" className="set-picker-done" onClick={() => { setOpen(false); buttonRef.current?.focus(); }}>Done</button>
        </div>
      )}
    </div>
  );
}
