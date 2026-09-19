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

const commons = (
  id: string,
  title: string,
  date: string,
  image: string,
  dimensions: string,
  accent: string,
  mood: string,
  sourceUrl: string,
): Artwork => ({
  id,
  title,
  artist: 'Timeastor',
  date,
  image,
  alt: title + ', a public-domain digital abstract artwork by Timeastor',
  medium: 'Digitally generated abstract artwork',
  dimensions,
  origin: 'Wikimedia Commons',
  classification: 'Digital art',
  accent,
  mood,
  sourceUrl,
});

const publicDomainArtworks: Artwork[] = [
  commons(
    'abstract-0008',
    'Aviren Daelu Weva',
    '20 Mar 2009',
    'https://upload.wikimedia.org/wikipedia/commons/0/06/Abstract_Artwork_0008.jpg',
    '1200 × 667 px',
    '#7b78b9',
    'Electric',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0008.jpg',
  ),
  commons(
    'abstract-0017',
    'Orinem Etë',
    '30 May 2009',
    'https://upload.wikimedia.org/wikipedia/commons/5/52/Abstract_Artwork_0017.jpg',
    '1300 × 722 px',
    '#d0a833',
    'Radiant',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0017.jpg',
  ),
  commons(
    'abstract-0004',
    'Eylon Marir Kereth',
    '9 Mar 2009',
    'https://upload.wikimedia.org/wikipedia/commons/8/8c/Abstract_Artwork_0004.jpg',
    '667 × 1200 px',
    '#5b6fc4',
    'Restless',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0004.jpg',
  ),
  commons(
    'abstract-0011',
    'Aviren Daelin Weva',
    '26 Mar 2009',
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Abstract_Artwork_0011.jpg',
    '1300 × 722 px',
    '#6f77b5',
    'Dreamlike',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0011.jpg',
  ),
  commons(
    'abstract-0007',
    'Ontemen Aise Keo',
    '14 Mar 2009',
    'https://upload.wikimedia.org/wikipedia/commons/6/6b/Abstract_Artwork_0007.jpg',
    '667 × 1200 px',
    '#b9b7d1',
    'Quiet',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0007.jpg',
  ),
  commons(
    'abstract-0012',
    'Aviren Daeseth Weva',
    '28 Mar 2009',
    'https://upload.wikimedia.org/wikipedia/commons/a/ab/Abstract_Artwork_0012.jpg',
    '1300 × 722 px',
    '#6779ba',
    'Still',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0012.jpg',
  ),
  commons(
    'abstract-0002',
    'Lasethen Semo',
    '25 Feb 2009',
    'https://upload.wikimedia.org/wikipedia/commons/8/8a/Abstract_Artwork_0002.jpg',
    '1200 × 667 px',
    '#7b6d9f',
    'Unsettled',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0002.jpg',
  ),
  commons(
    'abstract-0001',
    'Athelem Sa Yion',
    '4 Mar 2009',
    'https://upload.wikimedia.org/wikipedia/commons/d/d1/Abstract_Artwork_0001.jpg',
    '889 × 1600 px',
    '#a68c9a',
    'Tender',
    'https://commons.wikimedia.org/wiki/File:Abstract_Artwork_0001.jpg',
  ),
];

export async function fetchPublicDomainArtworks(signal?: AbortSignal): Promise<Artwork[]> {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  return publicDomainArtworks;
}
