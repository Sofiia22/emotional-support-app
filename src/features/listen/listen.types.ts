export type AudioContentType =
  | "audio-practice"
  | "sound-healing"
  | "science-insight"
  | "nature-sound"
  | "music"
  | "community-voice";

export type AudioItem = {
  id: string;
  slug: string;
  type: AudioContentType;
  title: string;
  description?: string;
  category?: string;
  duration?: number;
  imageUrl?: string;
  audioUrl?: string;
  author?: string;
  publishedAt?: string;
  isPublished?: boolean;
  isDevelopmentPlaceholder?: boolean;
  sources?: { title: string; publisher?: string; url?: string }[];
};

export type AudioProgress = {
  audioId: string;
  currentTime: number;
  duration?: number;
  completed: boolean;
  updatedAt: string;
};

export type SavedAudio = { audioId: string; savedAt: string };

export type CommunityVoiceCategory = "story" | "advice" | "faith" | "hope";

export type CommunityVoiceDraft = {
  id: string;
  title: string;
  description: string;
  category: CommunityVoiceCategory;
  localAudioId?: string;
  localAudioUri?: string;
  createdAt: string;
  updatedAt: string;
};

export type CommunityVoiceSubmission = CommunityVoiceDraft & {
  userId?: string;
  audioUrl?: string;
  status: "draft" | "pending" | "approved" | "rejected";
};

export type ListenLibraryKey =
  | "practices"
  | "healing"
  | "science"
  | "nature"
  | "music"
  | "voices";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "error";
