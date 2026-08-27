import { AudioContentType, AudioItem, ListenLibraryKey } from "@/features/listen/listen.types";

// Development-only metadata. No item is presented as released content and no
// audio URL is attached until the reviewed Plekai library is connected.
export const listenDevelopmentItems: AudioItem[] = [
  { id: "preview-life", slug: "holding-on-preview", type: "audio-practice", category: "about-life", title: "Holding On and Letting Go", description: "Library preview · reviewed audio coming later.", duration: 645, isPublished: false, isDevelopmentPlaceholder: true },
  { id: "preview-healing", slug: "quiet-grounding-preview", type: "sound-healing", category: "calm", title: "A Quiet Grounding Session", description: "Library preview · sound session being prepared.", duration: 480, isPublished: false, isDevelopmentPlaceholder: true },
  { id: "preview-science", slug: "grief-focus-preview", type: "science-insight", category: "grief", title: "Why grief can make it hard to concentrate", description: "Development metadata only · sources and reviewed audio pending.", duration: 300, isPublished: false, isDevelopmentPlaceholder: true, sources: [] },
  { id: "preview-nature", slug: "soft-rain-preview", type: "nature-sound", category: "rain", title: "Soft Rain", description: "Library preview · original Plekai recording being prepared.", duration: 1800, isPublished: false, isDevelopmentPlaceholder: true },
  { id: "preview-music", slug: "quiet-piano-preview", type: "music", category: "piano", title: "A Quiet Piano Moment", description: "Library preview · licensed original music pending.", duration: 420, isPublished: false, isDevelopmentPlaceholder: true },
];

const typeForLibrary: Record<ListenLibraryKey, AudioContentType> = {
  practices: "audio-practice",
  healing: "sound-healing",
  science: "science-insight",
  nature: "nature-sound",
  music: "music",
  voices: "community-voice",
};

export const audioRepository = {
  getAll: () => [...listenDevelopmentItems],
  getById: (id: string) => listenDevelopmentItems.find((item) => item.id === id),
  getByType: (type: AudioContentType) => listenDevelopmentItems.filter((item) => item.type === type),
  getByLibrary: (library: ListenLibraryKey) => listenDevelopmentItems.filter((item) => item.type === typeForLibrary[library]),
  getByCategory: (library: ListenLibraryKey, category: string) => listenDevelopmentItems.filter((item) => item.type === typeForLibrary[library] && item.category === category),
};
