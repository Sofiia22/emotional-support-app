import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";

import { AudioProgress, CommunityVoiceDraft, SavedAudio } from "@/features/listen/listen.types";

const PROGRESS_KEY = "plekai.listen.progress.v1";
const SAVED_KEY = "plekai.listen.saved.v1";
const DRAFTS_KEY = "plekai.listen.community-drafts.v1";

async function readList<T>(key: string): Promise<T[]> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? (JSON.parse(value) as T[]) : [];
  } catch {
    return [];
  }
}

async function writeList<T>(key: string, values: T[]) {
  await AsyncStorage.setItem(key, JSON.stringify(values));
}

export const listenStorage = {
  getAllAudioProgress: () => readList<AudioProgress>(PROGRESS_KEY),
  getAudioProgress: async (audioId: string) =>
    (await readList<AudioProgress>(PROGRESS_KEY)).find((item) => item.audioId === audioId),
  saveAudioProgress: async (progress: AudioProgress) => {
    const current = await readList<AudioProgress>(PROGRESS_KEY);
    await writeList(PROGRESS_KEY, [progress, ...current.filter((item) => item.audioId !== progress.audioId)]);
  },
  getSaved: () => readList<SavedAudio>(SAVED_KEY),
  saveForLater: async (audioId: string) => {
    const current = await readList<SavedAudio>(SAVED_KEY);
    if (current.some((item) => item.audioId === audioId)) return current;
    const next = [{ audioId, savedAt: new Date().toISOString() }, ...current];
    await writeList(SAVED_KEY, next);
    return next;
  },
  removeFromSaved: async (audioId: string) => {
    const next = (await readList<SavedAudio>(SAVED_KEY)).filter((item) => item.audioId !== audioId);
    await writeList(SAVED_KEY, next);
    return next;
  },
  getDrafts: () => readList<CommunityVoiceDraft>(DRAFTS_KEY),
  saveDraft: async (draft: CommunityVoiceDraft) => {
    const current = await readList<CommunityVoiceDraft>(DRAFTS_KEY);
    const next = [draft, ...current.filter((item) => item.id !== draft.id)];
    await writeList(DRAFTS_KEY, next);
    return next;
  },
};

const DRAFT_AUDIO_DB = "plekai.listen.community-audio";
const DRAFT_AUDIO_STORE = "draft-audio";

function openDraftDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("IndexedDB unavailable"));
    const request = indexedDB.open(DRAFT_AUDIO_DB, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(DRAFT_AUDIO_STORE)) {
        request.result.createObjectStore(DRAFT_AUDIO_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCommunityDraftAudio(id: string, audio: Blob | string) {
  if (Platform.OS !== "web") {
    if (typeof audio !== "string") throw new Error("A native recording URI is required");
    const directory = new Directory(Paths.document, "community-voice-drafts");
    if (!directory.exists) directory.create({ idempotent: true, intermediates: true });
    const extension = audio.match(/\.[a-z0-9]+(?:\?|$)/i)?.[0]?.replace("?", "") || ".m4a";
    const destination = new File(directory, `${id}${extension}`);
    if (destination.exists) destination.delete();
    const source = new File(audio);
    source.copy(destination);
    return destination.uri;
  }
  if (typeof audio === "string") throw new Error("A web audio Blob is required");
  const database = await openDraftDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const transaction = database.transaction(DRAFT_AUDIO_STORE, "readwrite");
      transaction.objectStore(DRAFT_AUDIO_STORE).put({ id, blob: audio });
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
  return undefined;
}
