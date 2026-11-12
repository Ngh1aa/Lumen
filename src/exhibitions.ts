import { threadPaths, letterNodes } from './VincentExperience';

export type ExhibitionStop = {
  artworkId: string;
  /** Short room / chapter label shown above the stop. */
  label: string;
  text: string;
  question?: string;
};

export type Exhibition = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  /** VINCENT keeps its immersive room sequence as its overview page. */
  kind: 'immersive' | 'walk';
  accent: string;
  coverId: string;
  thesis: string;
  curatorNote: string;
  stops: ExhibitionStop[];
};

/*
 * Curatorial writing is original LUMEN prototype content. Pairings across artists are presented as
 * visual and editorial readings, never as historical influence.
 */
export const exhibitions: Exhibition[] = [
  {
    slug: 'vincent',
    number: '01',
    title: 'VINCENT',
    subtitle: 'The Painted Night',
    kind: 'immersive',
    accent: '#315fad',
    coverId: 'van-gogh-starry-night',
    thesis: 'Nine sensory rooms move from blue night to yellow heat, brush surface, place, letters and listening.',
    curatorNote: 'The walk-through follows the seven paintings in the order Van Gogh made them, from Paris in 1887 to Saint-Rémy in 1890.',
    stops: [
      { artworkId: 'van-gogh-sunflowers-1887', label: 'Paris', text: 'Before the south, a study of cut flowers. Yellow is already the subject, not the decoration: petal, seed head and shadow are built from one family of color.' },
      { artworkId: 'van-gogh-cafe-terrace', label: 'Arles / Night', text: 'Night painted without black. The terrace light is warm and artificial; the sky above is cool and full of stars. The picture holds both temperatures at once.', question: 'Where does the light in this street actually come from?' },
      { artworkId: 'van-gogh-bedroom', label: 'Arles / Interior', text: 'A room Van Gogh painted three times. This later version keeps the tilted floor and flat color, so an ordinary interior reads as a portrait of a state of mind.' },
      { artworkId: 'van-gogh-starry-night', label: 'Saint-Rémy / Sky', text: 'The village is small and still; the sky is the event. Brushstrokes curl into currents, and the dark cypress joins the ground to the night.', question: 'What is moving here, and what is holding still?' },
      { artworkId: 'van-gogh-wheat-field-cypresses', label: 'Saint-Rémy / Field', text: 'Letter 806 names “Wheatfield and cypresses” among works sent to Theo. Field, cloud and tree share one directional rhythm.' },
      { artworkId: 'van-gogh-cypresses', label: 'Saint-Rémy / Cypress', text: 'A vertical form that behaves like a flame. The same letter lists a study of cypresses, the motif Van Gogh returned to through 1889.' },
      { artworkId: 'van-gogh-irises', label: 'Afterlight', text: 'The exit is quieter: violet against pale ground, one of the last still lifes from Saint-Rémy. Intensity leaves slowly.', question: 'What color would you carry out of this room?' },
    ],
  },
  {
    slug: 'signals',
    number: '02',
    title: 'Signals from a Quiet Machine',
    subtitle: 'Repetition, networks, noise and pause',
    kind: 'walk',
    accent: '#7b78b9',
    coverId: 'abstract-0011',
    thesis: 'Six chapters about images that feel like information before they become pictures.',
    curatorNote: 'Every work here is a public-domain digital abstraction from 2009. The chapters read them as transmissions, not as illustrations of technology.',
    stops: [
      { artworkId: 'abstract-0002', label: 'Threshold', text: 'A machine that hums so softly you only notice when it stops. Repetition, glow and almost-geometry establish a room where information feels present but not yet readable.', question: 'What do you notice before you know what you are looking at?' },
      { artworkId: 'abstract-0017', label: 'Hum', text: 'Repetition is a kind of memory. Rhythm acts like a low frequency here: structural enough to orient you, quiet enough to stay beneath language.', question: 'When does repetition become atmosphere?' },
      { artworkId: 'abstract-0011', label: 'Circuit', text: 'Every line suggests somewhere else to go. Connections turn structure into navigation without claiming that two works mean the same thing.' },
      { artworkId: 'abstract-0006', label: 'Circuit / Echo', text: 'The same circuit theme in a muted register. Calm comes from repetition rather than emptiness; the diagram spreads sideways instead of upward.', question: 'Can a relationship be useful without being definitive?' },
      { artworkId: 'abstract-0004', label: 'Noise', text: 'Too much information becomes texture. When hierarchy collapses, data stops behaving like instruction and starts behaving like weather.' },
      { artworkId: 'abstract-0010', label: 'Noise / Density', text: 'A haze of violet structure between atmosphere and mechanism. The closer you read, the less certain its scale becomes.', question: 'How long do you keep looking when the image refuses a center?' },
      { artworkId: 'abstract-0007', label: 'Silence', text: 'Pause is not the absence of content. Low contrast changes the speed of looking; the work asks for attention that is less urgent and more precise.' },
      { artworkId: 'abstract-0008', label: 'Signal', text: 'A signal is complete only when someone receives it. Violet light presses through a dark field as if the image were a transmission arriving now.', question: 'What thread would you carry into the next room?' },
    ],
  },
  {
    slug: 'blue-and-yellow',
    number: '03',
    title: 'Between Blue and Yellow',
    subtitle: 'Color as a relationship, across 120 years',
    kind: 'walk',
    accent: '#d0a833',
    coverId: 'van-gogh-cafe-terrace',
    thesis: 'In 1882 Van Gogh wrote to Theo that colors work in relation to one another. This exhibition takes the idea literally and walks between two temperatures.',
    curatorNote: 'Paintings from 1887 to 1889 sit beside digital works from 2009. The pairings are visual readings by LUMEN; they do not claim influence or shared intent.',
    stops: [
      { artworkId: 'van-gogh-starry-night', label: 'Cold field', text: 'Start in the coldest blue. The sky is not one color but a current of cobalts and whites, and it sets the temperature for everything that follows.' },
      { artworkId: 'abstract-0004', label: 'Cold field / Echo', text: 'Voltage indigo, 120 years later. Here blue has no sky to describe, so it becomes pure direction: pressure arriving from outside the frame.' },
      { artworkId: 'van-gogh-cafe-terrace', label: 'Meeting point', text: 'The hinge of the exhibition. A yellow terrace opens inside a blue street, and each color makes the other more intense.', question: 'Which color do you see first, and does it change after a minute?' },
      { artworkId: 'abstract-0017', label: 'Warm field / Echo', text: 'Lamp yellow as a flare. The brightest region reads less like illumination than a sound held just above silence.' },
      { artworkId: 'van-gogh-sunflowers-1887', label: 'Warm field', text: 'Yellow as matter. Ochre, chrome and brown give one color enough range to carry a whole picture.' },
      { artworkId: 'van-gogh-wheat-field-cypresses', label: 'Both at once', text: 'A gold field under a blue-white sky, cut by dark green. The two temperatures stop competing and become a landscape.', question: 'Where in this painting do blue and yellow touch?' },
    ],
  },
  {
    slug: 'after-everyone-left',
    number: '04',
    title: 'Rooms After Everyone Left',
    subtitle: 'Quiet, interior and afterimage',
    kind: 'walk',
    accent: '#b9b7d1',
    coverId: 'van-gogh-bedroom',
    thesis: 'A slow exhibition about spaces that feel occupied by memory rather than people.',
    curatorNote: 'Built from the Quiet, Melancholy and Tender mood paths. Mood labels are LUMEN editorial metadata, not claims from the source archives.',
    stops: [
      { artworkId: 'van-gogh-bedroom', label: 'The room', text: 'An empty bedroom painted like a portrait. Two chairs, one bed, pictures on the wall: the room waits for someone who is not in the picture.' },
      { artworkId: 'abstract-0012', label: 'Distance', text: 'A cool field that holds its distance. The image feels remembered rather than seen.', question: 'What makes a space feel recently left?' },
      { artworkId: 'abstract-0007', label: 'Interval', text: 'Nothing announces itself, so attention begins to notice the intervals instead. Low contrast turns hesitation into structure.' },
      { artworkId: 'abstract-0001', label: 'Afterimage', text: 'Soft color interrupts a harder geometry. Tenderness arrives as an interruption, not a mood that fills the frame.' },
      { artworkId: 'van-gogh-irises', label: 'Exit', text: 'A crowded bouquet in a quiet room. The exhibition closes on something living, painted in the last months of Van Gogh’s time at Saint-Rémy.', question: 'What stays in the room after you leave it?' },
    ],
  },
];

export function findExhibition(slug: string | undefined) {
  return exhibitions.find((exhibition) => exhibition.slug === slug);
}

export function exhibitionsFor(artworkId: string) {
  return exhibitions.flatMap((exhibition) => exhibition.stops
    .map((stop, index) => ({ exhibition, stop, index }))
    .filter((entry) => entry.stop.artworkId === artworkId));
}

/* VINCENT documented threads, mapped onto collection ids. */
const vincentToCollection: Record<string, string> = {
  starry: 'van-gogh-starry-night',
  cafe: 'van-gogh-cafe-terrace',
  sunflowers: 'van-gogh-sunflowers-1887',
  wheat: 'van-gogh-wheat-field-cypresses',
  bedroom: 'van-gogh-bedroom',
  cypresses: 'van-gogh-cypresses',
  irises: 'van-gogh-irises',
};

export type DocumentedThread = {
  id: string;
  title: string;
  connection: string;
  artworkIds: string[];
  letter?: { label: string; date: string; place: string; source: string; note: string };
};

export function documentedThreadsFor(artworkId: string): DocumentedThread[] {
  return threadPaths
    .map((thread) => ({
      id: thread.id,
      title: thread.title,
      connection: thread.connection,
      artworkIds: thread.artworkIds.map((id) => vincentToCollection[id]).filter(Boolean),
      letter: letterNodes.find((letter) => letter.id === thread.letterId),
    }))
    .filter((thread) => thread.artworkIds.includes(artworkId));
}
