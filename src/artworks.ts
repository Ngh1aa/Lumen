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
};

type ArtworkSeed = Omit<Artwork, 'artist' | 'medium' | 'origin' | 'classification' | 'movement' | 'era' | 'license'>;

const commons = (seed: ArtworkSeed): Artwork => ({
  ...seed,
  artist: 'Timeastor',
  medium: 'Digitally generated abstract artwork',
  origin: 'Wikimedia Commons',
  classification: 'Digital art',
  movement: 'Digital abstraction',
  era: '2000s',
  license: 'Public domain — dedicated by the creator',
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
];

export async function fetchPublicDomainArtworks(signal?: AbortSignal): Promise<Artwork[]> {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return publicDomainArtworks;
}
