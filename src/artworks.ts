export type Artwork = {
  id: string;
  title: string;
  artist: string;
  date: string;
  image: string;
  alt: string;
  medium: string;
  dimensions: string;
  origin: string;
  classification: string;
  accent: string;
  mood: string;
  sourceUrl: string;
};

const IIIF = 'https://www.artic.edu/iiif/2';

const accents = ['#c7674d', '#7185a4', '#d3a849', '#7d9274', '#9b6f82', '#a98f74', '#5f7382', '#b7673f'];
const moods = ['Still', 'Electric', 'Dreamlike', 'Tender', 'Unsettled', 'Radiant', 'Quiet', 'Restless'];

const fallback: Artwork[] = [
  {
    id: '27992',
    title: 'A Sunday on La Grande Jatte — 1884',
    artist: 'Georges Seurat',
    date: '1884–86',
    image: `${IIIF}/2d484387-2509-5e8e-2c43-22f9981972eb/full/843,/0/default.jpg`,
    alt: 'A Sunday on La Grande Jatte — 1884 by Georges Seurat',
    medium: 'Oil on canvas',
    dimensions: 'Large-scale painting',
    origin: 'France',
    classification: 'Painting',
    accent: accents[0],
    mood: moods[2],
    sourceUrl: 'https://www.artic.edu/artworks/27992',
  },
  {
    id: 'water-lilies-fallback',
    title: 'Pond with Water Lilies',
    artist: 'Claude Monet',
    date: 'c. 1920s',
    image: `${IIIF}/588a5ba9-6cb0-7c99-7024-b8919b0e85ed/full/843,/0/default.jpg`,
    alt: 'Pond with Water Lilies by Claude Monet',
    medium: 'Painting',
    dimensions: 'Collection image',
    origin: 'France',
    classification: 'Painting',
    accent: accents[3],
    mood: moods[0],
    sourceUrl: 'https://www.artic.edu/',
  },
];

type ApiArtwork = {
  id: number;
  title?: string;
  artist_display?: string;
  date_display?: string;
  image_id?: string | null;
  thumbnail?: { alt_text?: string | null } | null;
  medium_display?: string | null;
  dimensions?: string | null;
  place_of_origin?: string | null;
  classification_title?: string | null;
};

type ApiResponse = {
  data?: ApiArtwork[];
  config?: { iiif_url?: string };
};

function artistFromDisplay(value?: string) {
  if (!value) return 'Artist unknown';
  return value.split('\n')[0].trim() || 'Artist unknown';
}

export async function fetchPublicDomainArtworks(signal?: AbortSignal): Promise<Artwork[]> {
  const url = new URL('https://api.artic.edu/api/v1/artworks/search');
  url.searchParams.set('query[term][is_public_domain]', 'true');
  url.searchParams.set('limit', '14');
  url.searchParams.set(
    'fields',
    'id,title,artist_display,date_display,image_id,thumbnail,medium_display,dimensions,place_of_origin,classification_title',
  );

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`AIC API request failed: ${response.status}`);
    const payload = (await response.json()) as ApiResponse;
    const base = payload.config?.iiif_url || IIIF;
    const items = (payload.data || [])
      .filter((item) => item.image_id)
      .slice(0, 12)
      .map((item, index): Artwork => ({
        id: String(item.id),
        title: item.title?.trim() || 'Untitled',
        artist: artistFromDisplay(item.artist_display),
        date: item.date_display?.trim() || 'Date unknown',
        image: `${base}/${item.image_id}/full/843,/0/default.jpg`,
        alt: item.thumbnail?.alt_text?.trim() || `${item.title || 'Artwork'} — collection image`,
        medium: item.medium_display?.trim() || 'Medium not listed',
        dimensions: item.dimensions?.trim() || 'Dimensions not listed',
        origin: item.place_of_origin?.trim() || 'Origin not listed',
        classification: item.classification_title?.trim() || 'Artwork',
        accent: accents[index % accents.length],
        mood: moods[index % moods.length],
        sourceUrl: `https://www.artic.edu/artworks/${item.id}`,
      }));

    return items.length >= 4 ? items : fallback;
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error;
    return fallback;
  }
}
