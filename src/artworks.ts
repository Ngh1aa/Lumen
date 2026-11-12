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
  movement: string;
  era: string;
  paletteName: string;
  theme: string;
  editorial: string;
  license: string;
  sourceUrl: string;
  /** Numeric year used for sorting and period filters. */
  year: number;
  /** Holding institution, only where the source record states it. */
  holding?: string;
};

type ArtworkSeed = Omit<Artwork, 'artist' | 'medium' | 'origin' | 'classification' | 'movement' | 'era' | 'license' | 'year'>;

const commons = (seed: ArtworkSeed): Artwork => ({
  ...seed,
  artist: 'Timeastor',
  medium: 'Digitally generated abstract artwork',
  origin: 'Wikimedia Commons',
  classification: 'Digital art',
  movement: 'Digital abstraction',
  era: '2000s',
  license: 'Public domain — dedicated by the creator',
  year: 2009,
});

const redirect = (file: string) =>
  'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(file) + '?width=1600';

const publicDomainArtworks: Artwork[] = [
  commons({
    id: 'abstract-0008',
    title: 'Aviren Daelu Weva',
    date: '20 Mar 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/06/Abstract_Artwork_0008.jpg',
    alt: 'Aviren Daelu Weva, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1200 × 667 px',
    accent: '#7b78b9',
    mood: 'Luminous',
    paletteName: 'Oxidized Blue',
    theme: 'Signal',
    editorial: 'Violet light presses through a dark field as if the image were receiving a transmission rather than depicting a place.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0008.jpg',
  }),
  commons({
    id: 'abstract-0017',
    title: 'Orinem Etë',
    date: '30 May 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/5/52/Abstract_Artwork_0017.jpg',
    alt: 'Orinem Etë, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1300 × 722 px',
    accent: '#d0a833',
    mood: 'Ecstatic',
    paletteName: 'Lamp Yellow',
    theme: 'Hum',
    editorial: 'Warmth gathers into a flare. The brightest region feels less like illumination than a sound held just above silence.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0017.jpg',
  }),
  commons({
    id: 'abstract-0004',
    title: 'Eylon Marir Kereth',
    date: '9 Mar 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Abstract_Artwork_0004.jpg',
    alt: 'Eylon Marir Kereth, a public-domain digital abstract artwork by Timeastor',
    dimensions: '667 × 1200 px',
    accent: '#5b6fc4',
    mood: 'Restless',
    paletteName: 'Voltage Indigo',
    theme: 'Noise',
    editorial: 'The eye searches for a stable center and never quite finds one. Direction keeps arriving from somewhere outside the frame.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0004.jpg',
  }),
  commons({
    id: 'abstract-0011',
    title: 'Aviren Daelin Weva',
    date: '26 Mar 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Abstract_Artwork_0011.jpg',
    alt: 'Aviren Daelin Weva, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1300 × 722 px',
    accent: '#6f77b5',
    mood: 'Uncanny',
    paletteName: 'Afterimage Violet',
    theme: 'Circuit',
    editorial: 'Repeated structures almost resolve into architecture, then pull away again. Familiarity is present, but never comfortable.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0011.jpg',
  }),
  commons({
    id: 'abstract-0007',
    title: 'Ontemen Aise Keo',
    date: '14 Mar 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Abstract_Artwork_0007.jpg',
    alt: 'Ontemen Aise Keo, a public-domain digital abstract artwork by Timeastor',
    dimensions: '667 × 1200 px',
    accent: '#b9b7d1',
    mood: 'Quiet',
    paletteName: 'Dust Lilac',
    theme: 'Silence',
    editorial: 'Low contrast turns hesitation into structure. Nothing announces itself, so attention begins to notice the intervals instead.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0007.jpg',
  }),
  commons({
    id: 'abstract-0012',
    title: 'Aviren Daeseth Weva',
    date: '28 Mar 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Abstract_Artwork_0012.jpg',
    alt: 'Aviren Daeseth Weva, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1300 × 722 px',
    accent: '#6779ba',
    mood: 'Melancholy',
    paletteName: 'Dusk Cobalt',
    theme: 'Silence',
    editorial: 'A cool field holds its distance. The image feels remembered rather than seen, like a room encountered after everyone has left.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0012.jpg',
  }),
  commons({
    id: 'abstract-0002',
    title: 'Lasethen Semo',
    date: '25 Feb 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Abstract_Artwork_0002.jpg',
    alt: 'Lasethen Semo, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1200 × 667 px',
    accent: '#7b6d9f',
    mood: 'Monumental',
    paletteName: 'Bruised Violet',
    theme: 'Threshold',
    editorial: 'Density gives the field weight. The composition feels larger than its frame, as if only a fragment of the structure is visible.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0002.jpg',
  }),
  commons({
    id: 'abstract-0001',
    title: 'Athelem Sa Yion',
    date: '4 Mar 2009',
    image: 'https://upload.wikimedia.org/wikipedia/commons/d/d1/Abstract_Artwork_0001.jpg',
    alt: 'Athelem Sa Yion, a public-domain digital abstract artwork by Timeastor',
    dimensions: '889 × 1600 px',
    accent: '#a68c9a',
    mood: 'Tender',
    paletteName: 'Faded Rose',
    theme: 'Afterimage',
    editorial: 'Soft color interrupts a harder geometry. The tension comes from how gently the image refuses to settle into one register.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0001.jpg',
  }),
  commons({
    id: 'abstract-0005',
    title: 'Retheiin Anevi',
    date: '10 Mar 2009',
    image: redirect('Abstract Artwork 0005.jpg'),
    alt: 'Retheiin Anevi, a public-domain digital abstract artwork by Timeastor',
    dimensions: '667 × 1200 px',
    accent: '#c6a64a',
    mood: 'Playful',
    paletteName: 'Archive Ochre',
    theme: 'Hum',
    editorial: 'Yellow appears like a notation in the margin: small, insistent and oddly cheerful against a field that wants to stay severe.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0005.jpg',
  }),
  commons({
    id: 'abstract-0006',
    title: 'Keaso Aroim Dev',
    date: '12 Mar 2009',
    image: redirect('Abstract Artwork 0006.jpg'),
    alt: 'Keaso Aroim Dev, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1200 × 667 px',
    accent: '#7d8970',
    mood: 'Quiet',
    paletteName: 'Mineral Green',
    theme: 'Circuit',
    editorial: 'Muted structure spreads laterally like an unfinished diagram. Its calm comes from repetition rather than emptiness.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0006.jpg',
  }),
  commons({
    id: 'abstract-0009',
    title: 'Aviren Daerim Weva',
    date: '22 Mar 2009',
    image: redirect('Abstract Artwork 0009.jpg'),
    alt: 'Aviren Daerim Weva, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1200 × 667 px',
    accent: '#6577a5',
    mood: 'Restless',
    paletteName: 'Cold Relay',
    theme: 'Signal',
    editorial: 'A horizontal current pulls the image forward. The surface reads like information moving too quickly to become language.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0009.jpg',
  }),
  commons({
    id: 'abstract-0010',
    title: 'Aviren Daewa Weron',
    date: '24 Mar 2009',
    image: redirect('Abstract Artwork 0010.jpg'),
    alt: 'Aviren Daewa Weron, a public-domain digital abstract artwork by Timeastor',
    dimensions: '1200 × 667 px',
    accent: '#8876a8',
    mood: 'Uncanny',
    paletteName: 'Static Mauve',
    theme: 'Noise',
    editorial: 'A haze of violet structure sits between atmosphere and mechanism. The more closely it is read, the less certain its scale becomes.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0010.jpg',
  }),
  commons({
    id: 'abstract-0015',
    title: 'Therinel Lelomi Ete',
    date: '3 Apr 2009',
    image: redirect('Abstract Artwork 0015.jpg'),
    alt: 'Therinel Lelomi Ete, a public-domain digital abstract artwork by Timeastor',
    dimensions: '722 × 1300 px',
    accent: '#9a6c83',
    mood: 'Tender',
    paletteName: 'Muted Carmine',
    theme: 'Afterimage',
    editorial: 'Vertical motion makes the composition feel almost bodily. Color stays restrained, allowing the rhythm to carry the emotional weight.',
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0015.jpg',
  }),
  ...vanGoghWorks(),
];

/**
 * Vincent van Gogh works already used by the VINCENT exhibition. They are added to the open
 * collection so the collection, the exhibition walk-throughs and the artwork pages share one
 * record per object. Facts (date, medium, dimensions, holding institution) follow the
 * Wikimedia Commons file pages checked on 12 Nov 2026; mood, palette and theme stay LUMEN
 * editorial metadata. See THIRD_PARTY_NOTICES.md.
 */
function vanGoghWorks(): Artwork[] {
  const base = {
    artist: 'Vincent van Gogh',
    medium: 'Oil on canvas',
    classification: 'Painting',
    movement: 'Post-Impressionism',
  };
  return [
    {
      ...base,
      id: 'van-gogh-sunflowers-1887',
      title: 'Sunflowers',
      date: '1887',
      year: 1887,
      era: '1880s',
      origin: 'Paris, France',
      holding: 'The Metropolitan Museum of Art, New York',
      image: redirect('Van Gogh, Sunflowers, 1887.jpg'),
      alt: 'Sunflowers by Vincent van Gogh: two cut sunflower heads lying on a surface, painted in layered yellow and ochre.',
      dimensions: '43.2 × 61 cm',
      accent: '#d69a2d',
      mood: 'Ecstatic',
      paletteName: 'Chrome Ochre',
      theme: 'Flowers',
      editorial: 'Yellow shifts from petal to heat to matter. Cut flower heads become a study of how far one color can be pushed before it turns into texture.',
      license: 'Public domain — artwork out of copyright; Commons Public Domain Mark',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Van_Gogh,_Sunflowers,_1887.jpg',
    },
    {
      ...base,
      id: 'van-gogh-cafe-terrace',
      title: 'Café Terrace at Night',
      date: 'September 1888',
      year: 1888,
      era: '1880s',
      origin: 'Arles, France',
      holding: 'Kröller-Müller Museum, Otterlo',
      image: redirect('Vincent Willem van Gogh - Cafe Terrace at Night (Yorck).jpg'),
      alt: 'Café Terrace at Night by Vincent van Gogh, with a yellow café glowing beneath a deep blue starry sky.',
      dimensions: '81 × 65.5 cm',
      accent: '#e7b84b',
      mood: 'Luminous',
      paletteName: 'Terrace Yellow',
      theme: 'Night',
      editorial: 'A warm room of light opens inside a blue street. The night is painted without black, so the dark reads as color rather than absence.',
      license: 'Public domain — artwork out of copyright; Commons Public Domain Mark',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vincent_Willem_van_Gogh_-_Cafe_Terrace_at_Night_(Yorck).jpg',
    },
    {
      ...base,
      id: 'van-gogh-bedroom',
      title: 'Bedroom in Arles',
      date: 'September 1889 (third version)',
      year: 1889,
      era: '1880s',
      origin: 'Saint-Rémy-de-Provence, France',
      holding: "Musée d'Orsay, Paris",
      image: redirect("Vincent van Gogh - Van Gogh's Bedroom in Arles - Google Art Project.jpg"),
      alt: 'Bedroom in Arles by Vincent van Gogh, a spare room with a wooden bed, two chairs, framed pictures and blue walls.',
      dimensions: '57.5 × 74 cm',
      accent: '#4d6da8',
      mood: 'Quiet',
      paletteName: 'Bedroom Blue',
      theme: 'Interior',
      editorial: 'The room is simple, but every angle feels slightly awake. Flat color and tilted perspective make rest look like something that has to be constructed.',
      license: 'Public domain — artwork out of copyright; Commons Public Domain Mark',
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Van_Gogh%27s_Bedroom_in_Arles_-_Google_Art_Project.jpg",
    },
    {
      ...base,
      id: 'van-gogh-starry-night',
      title: 'The Starry Night',
      date: 'June 1889',
      year: 1889,
      era: '1880s',
      origin: 'Saint-Rémy-de-Provence, France',
      holding: 'The Museum of Modern Art, New York',
      image: redirect('TheStarryNightByVincentVanGogh.jpg'),
      alt: 'The Starry Night by Vincent van Gogh, a nocturnal landscape with a swirling blue sky above a village and a dark cypress.',
      dimensions: '73.7 × 92.1 cm',
      accent: '#315fad',
      mood: 'Restless',
      paletteName: 'Night Cobalt',
      theme: 'Night',
      editorial: 'Night is not empty here. It turns, gathers and moves, while the village below stays small and still under a sky that will not settle.',
      license: 'Public domain — artwork out of copyright; Commons Public Domain Mark',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:TheStarryNightByVincentVanGogh.jpg',
    },
    {
      ...base,
      id: 'van-gogh-wheat-field-cypresses',
      title: 'Wheat Field with Cypresses',
      date: '1889',
      year: 1889,
      era: '1880s',
      origin: 'Saint-Rémy-de-Provence, France',
      holding: 'The Metropolitan Museum of Art, New York',
      image: redirect('Wheat Field with Cypresses MET DT1567.jpg'),
      alt: 'Wheat Field with Cypresses by Vincent van Gogh, showing a golden field under rolling clouds and dark cypress trees.',
      dimensions: '73.2 × 93.4 cm',
      accent: '#d3a43f',
      mood: 'Monumental',
      paletteName: 'Harvest Gold',
      theme: 'Field',
      editorial: 'The field bends, the clouds roll, and the dark cypress holds the scene upright. Every surface carries the same directional brush rhythm.',
      license: 'Public domain — CC0 open-access image (The Met)',
      sourceUrl: 'https://www.metmuseum.org/art/collection/search/436535',
    },
    {
      ...base,
      id: 'van-gogh-cypresses',
      title: 'Cypresses',
      date: 'June 1889',
      year: 1889,
      era: '1880s',
      origin: 'Saint-Rémy-de-Provence, France',
      holding: 'The Metropolitan Museum of Art, New York',
      image: redirect('Vincent van Gogh Cypresses 1889.jpg'),
      alt: 'Cypresses by Vincent van Gogh, with tall dark trees rising like flames against a bright landscape and moving sky.',
      dimensions: '93.4 × 74 cm',
      accent: '#314b39',
      mood: 'Restless',
      paletteName: 'Cypress Green',
      theme: 'Cypress',
      editorial: 'A dark vertical note rises through a sunlit field. The trees are built from curling strokes, so stillness and motion occupy the same shape.',
      license: 'Public domain — CC0 open-access image (The Met)',
      sourceUrl: 'https://www.metmuseum.org/art/collection/search/437980',
    },
    {
      ...base,
      id: 'van-gogh-irises',
      title: 'Irises',
      date: 'May 1890',
      year: 1890,
      era: '1890s',
      origin: 'Saint-Rémy-de-Provence, France',
      holding: 'The Metropolitan Museum of Art, New York',
      image: redirect('Vincent van Gogh - Irises (1890).jpg'),
      alt: 'Irises by Vincent van Gogh, a bouquet of violet-blue irises in a vase against a pale background.',
      dimensions: '73.7 × 92.1 cm',
      accent: '#6767a8',
      mood: 'Tender',
      paletteName: 'Iris Violet',
      theme: 'Flowers',
      editorial: 'The exit is quieter: violet, green and a softened field around them. The bouquet is crowded, yet the painting breathes.',
      license: 'Public domain — artwork out of copyright; Commons Public Domain Mark',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Vincent_van_Gogh_-_Irises_(1890).jpg',
    },
  ];
}

export const collection: Artwork[] = publicDomainArtworks;

export function findArtwork(id: string | undefined) {
  return id ? publicDomainArtworks.find((artwork) => artwork.id === id) : undefined;
}

export async function fetchPublicDomainArtworks(signal?: AbortSignal): Promise<Artwork[]> {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return publicDomainArtworks;
}

/* ---------- shared relationship helpers ---------- */

function rgb(hex: string) {
  const value = hex.replace('#', '');
  return { r: parseInt(value.slice(0, 2), 16), g: parseInt(value.slice(2, 4), 16), b: parseInt(value.slice(4, 6), 16) };
}

export function colorDistance(a: string, b: string) {
  const aa = rgb(a);
  const bb = rgb(b);
  return Math.sqrt((aa.r - bb.r) ** 2 + (aa.g - bb.g) ** 2 + (aa.b - bb.b) ** 2);
}

export function isWarm(accent: string) {
  const value = rgb(accent);
  return value.r > value.b * 1.08;
}

export type Relation = {
  type: 'Color' | 'Era' | 'Movement' | 'Theme' | 'Mood';
  artwork: Artwork;
  explanation: string;
};

/**
 * Explainable relationships. Each relation is picked from a distinct object where possible, and
 * the explanation only claims what the metadata actually shares.
 */
export function relationsFor(artwork: Artwork, artworks: Artwork[], types: Relation['type'][]): Relation[] {
  const candidates = artworks.filter((item) => item.id !== artwork.id);
  const used = new Set<string>();
  const pick = (match: (item: Artwork) => boolean, ranked: Artwork[] = candidates) =>
    ranked.find((item) => !used.has(item.id) && match(item));

  const result: Relation[] = [];
  for (const type of types) {
    let found: Artwork | undefined;
    let explanation = '';
    if (type === 'Color') {
      const ranked = [...candidates].sort((a, b) => colorDistance(a.accent, artwork.accent) - colorDistance(b.accent, artwork.accent));
      found = pick(() => true, ranked);
      if (found) explanation = 'A neighboring dominant hue: ' + found.paletteName + ' sits close to ' + artwork.paletteName + '.';
    } else if (type === 'Era') {
      found = pick((item) => item.era === artwork.era && item.artist !== artwork.artist) || pick((item) => item.era === artwork.era);
      if (found) explanation = 'Both were made in the ' + artwork.era + '.';
    } else if (type === 'Movement') {
      found = pick((item) => item.movement === artwork.movement);
      if (found) explanation = 'Both are grouped here under ' + artwork.movement.toLowerCase() + '.';
    } else if (type === 'Theme') {
      found = pick((item) => item.theme === artwork.theme);
      if (found) explanation = 'Both carry the LUMEN editorial theme “' + artwork.theme + '”.';
    } else if (type === 'Mood') {
      found = pick((item) => item.mood === artwork.mood && item.artist !== artwork.artist) || pick((item) => item.mood === artwork.mood);
      if (found) explanation = 'Both sit on the ' + artwork.mood.toLowerCase() + ' mood path.';
    }
    if (!found) {
      const ranked = [...candidates].sort((a, b) => colorDistance(a.accent, artwork.accent) - colorDistance(b.accent, artwork.accent));
      found = pick(() => true, ranked);
      if (found) explanation = 'No exact ' + type.toLowerCase() + ' match yet; this is the closest color echo.';
    }
    if (found) {
      used.add(found.id);
      result.push({ type, artwork: found, explanation });
    }
  }
  return result;
}

/**
 * Smaller Wikimedia rendition of the same file for grids, lists and strips. Uses Wikimedia's
 * standard thumbnail buckets (330 / 960) so the renditions are cached upstream.
 */
export function thumb(artwork: Artwork, size: 330 | 960 = 960) {
  const match = artwork.image.match(/Special:Redirect\/file\/([^?]+)/);
  let file = match ? decodeURIComponent(match[1]) : '';
  if (!file) {
    const upload = artwork.image.match(/upload\.wikimedia\.org\/wikipedia\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^?]+)/);
    if (!upload) return artwork.image;
    file = decodeURIComponent(upload[1]);
  }
  return 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + encodeURIComponent(file) + '?width=' + size;
}
