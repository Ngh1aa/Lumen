import { useCallback, useEffect, useState } from 'react';

/**
 * LUMEN has no backend. Everything a visitor creates (saved works, sets, private notes, saved
 * VINCENT threads) lives in sessionStorage: it survives route changes and reloads in the same
 * tab and disappears when the tab closes. Display preferences (reduced motion, contrast,
 * onboarding) stay in localStorage because they describe the device, not the visit.
 */

export const SESSION_KEYS = {
  saved: 'lumen-saved',
  sets: 'lumen-sets',
  notes: 'lumen-notes',
  vincentThreads: 'lumen-vincent-threads',
  collectionQuery: 'lumen-collection-query',
} as const;

export function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* storage can be unavailable (private mode, quota); the in-memory state still works */
  }
}

function readJson<T>(key: string, fallback: T): T {
  const raw = readSession(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export type ArtworkSet = {
  id: string;
  name: string;
  artworkIds: string[];
  createdAt: number;
};

export const SET_NAME_MAX = 60;

export function validateSetName(name: string, sets: ArtworkSet[], ignoreId?: string): string | undefined {
  const trimmed = name.trim();
  if (!trimmed) return 'Give the set a name.';
  if (trimmed.length > SET_NAME_MAX) return 'Keep the name under ' + SET_NAME_MAX + ' characters.';
  if (sets.some((set) => set.id !== ignoreId && set.name.toLowerCase() === trimmed.toLowerCase())) {
    return 'A set with this name already exists.';
  }
  return undefined;
}

function makeId(name: string) {
  const slug = name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 32) || 'set';
  return slug + '-' + Math.random().toString(36).slice(2, 7);
}

function importSharedSaved(): string[] {
  const url = new URL(window.location.href);
  const shared = url.searchParams.get('saved')?.split(',').filter(Boolean) || [];
  if (shared.length) {
    url.searchParams.delete('saved');
    window.history.replaceState(window.history.state, '', url.toString());
  }
  return shared;
}

export type MuseumData = ReturnType<typeof useMuseumData>;

export function useMuseumData(validIds: string[]) {
  const [saved, setSaved] = useState<string[]>(() => {
    const stored = readJson<string[]>(SESSION_KEYS.saved, []);
    return Array.from(new Set([...stored, ...importSharedSaved()]));
  });
  const [sets, setSets] = useState<ArtworkSet[]>(() => readJson<ArtworkSet[]>(SESSION_KEYS.sets, []));
  const [notes, setNotes] = useState<Record<string, string>>(() => readJson<Record<string, string>>(SESSION_KEYS.notes, {}));
  const [version, setVersion] = useState(0);

  useEffect(() => { writeSession(SESSION_KEYS.saved, JSON.stringify(saved)); }, [saved]);
  useEffect(() => { writeSession(SESSION_KEYS.sets, JSON.stringify(sets)); }, [sets]);
  useEffect(() => { writeSession(SESSION_KEYS.notes, JSON.stringify(notes)); }, [notes]);

  const known = useCallback((id: string) => validIds.length === 0 || validIds.includes(id), [validIds]);

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);

  const save = useCallback((ids: string[]) => {
    setSaved((current) => Array.from(new Set([...current, ...ids.filter(known)])));
  }, [known]);

  /** Unsaving a work also removes it from every set, so sets never point at unsaved works. */
  const unsave = useCallback((id: string) => {
    setSaved((current) => current.filter((value) => value !== id));
    setSets((current) => current.map((set) => ({ ...set, artworkIds: set.artworkIds.filter((value) => value !== id) })));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    if (saved.includes(id)) unsave(id);
    else save([id]);
  }, [saved, save, unsave]);

  const createSet = useCallback((name: string, artworkIds: string[] = []) => {
    const set: ArtworkSet = { id: makeId(name), name: name.trim(), artworkIds: Array.from(new Set(artworkIds)), createdAt: Date.now() };
    setSets((current) => [...current, set]);
    if (artworkIds.length) save(artworkIds);
    return set;
  }, [save]);

  const renameSet = useCallback((id: string, name: string) => {
    setSets((current) => current.map((set) => (set.id === id ? { ...set, name: name.trim() } : set)));
  }, []);

  const deleteSet = useCallback((id: string) => {
    setSets((current) => current.filter((set) => set.id !== id));
  }, []);

  /** Adding to a set also saves the work. */
  const addToSet = useCallback((setId: string, artworkId: string) => {
    save([artworkId]);
    setSets((current) => current.map((set) => (
      set.id === setId && !set.artworkIds.includes(artworkId) ? { ...set, artworkIds: [...set.artworkIds, artworkId] } : set
    )));
  }, [save]);

  const removeFromSet = useCallback((setId: string, artworkId: string) => {
    setSets((current) => current.map((set) => (
      set.id === setId ? { ...set, artworkIds: set.artworkIds.filter((value) => value !== artworkId) } : set
    )));
  }, []);

  const setNote = useCallback((id: string, value: string) => {
    setNotes((current) => ({ ...current, [id]: value }));
  }, []);

  /** Clears every visitor-created record from this tab and bumps `version` so views remount. */
  const resetDemoData = useCallback(() => {
    try {
      Object.values(SESSION_KEYS).forEach((key) => window.sessionStorage.removeItem(key));
    } catch {
      /* ignore */
    }
    setSaved([]);
    setSets([]);
    setNotes({});
    setVersion((value) => value + 1);
  }, []);

  return {
    saved, sets, notes, version,
    isSaved, save, unsave, toggleSaved,
    createSet, renameSet, deleteSet, addToSet, removeFromSet,
    setNote, resetDemoData,
  };
}
