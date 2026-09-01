import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";

export type VoiceRecording = {
  id: string;
  createdAt: string;
  duration: number;
  title: string;
  mimeType: string;
  uri?: string;
};

const DATABASE_NAME = "plekai.voice-journal";
const DATABASE_VERSION = 1;
const METADATA_STORE = "recordings";
const AUDIO_STORE = "audio";
const NATIVE_METADATA_KEY = "plekai.voice-journal.recordings.v1";

type StoredAudio = {
  id: string;
  blob: Blob;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is unavailable"));
      return;
    }

    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION);

    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(METADATA_STORE)) {
        database.createObjectStore(METADATA_STORE, { keyPath: "id" });
      }
      if (!database.objectStoreNames.contains(AUDIO_STORE)) {
        database.createObjectStore(AUDIO_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Unable to open voice journal"));
  });
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Voice journal request failed"));
  });
}

function transactionDone(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error("Voice journal transaction failed"));
    transaction.onabort = () => reject(transaction.error ?? new Error("Voice journal transaction was cancelled"));
  });
}

export async function listVoiceRecordings(): Promise<VoiceRecording[]> {
  if (Platform.OS !== "web") {
    try {
      const stored = await AsyncStorage.getItem(NATIVE_METADATA_KEY);
      const recordings = stored ? JSON.parse(stored) as VoiceRecording[] : [];
      return recordings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    } catch {
      return [];
    }
  }
  const database = await openDatabase();
  try {
    const transaction = database.transaction(METADATA_STORE, "readonly");
    const recordings = await requestResult(
      transaction.objectStore(METADATA_STORE).getAll() as IDBRequest<VoiceRecording[]>,
    );
    return recordings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } finally {
    database.close();
  }
}

export async function getVoiceRecordingAudio(recording: VoiceRecording): Promise<Blob | string | null> {
  if (Platform.OS !== "web") {
    if (!recording.uri) return null;
    const file = new File(recording.uri);
    return file.exists ? recording.uri : null;
  }
  const database = await openDatabase();
  try {
    const transaction = database.transaction(AUDIO_STORE, "readonly");
    const stored = await requestResult(
      transaction.objectStore(AUDIO_STORE).get(recording.id) as IDBRequest<StoredAudio | undefined>,
    );
    return stored?.blob ?? null;
  } finally {
    database.close();
  }
}

export async function saveVoiceRecording(
  recording: VoiceRecording,
  audio: Blob | string,
): Promise<VoiceRecording> {
  if (Platform.OS !== "web") {
    if (typeof audio !== "string") throw new Error("A native recording URI is required");
    const directory = new Directory(Paths.document, "voice-journal");
    if (!directory.exists) directory.create({ idempotent: true, intermediates: true });
    const extension = audio.match(/\.[a-z0-9]+(?:\?|$)/i)?.[0]?.replace("?", "") || ".m4a";
    const destination = new File(directory, `${recording.id}${extension}`);
    const source = new File(audio);
    source.copy(destination);
    const persisted = { ...recording, uri: destination.uri };
    const current = await listVoiceRecordings();
    const next = [persisted, ...current.filter((item) => item.id !== recording.id)];
    await AsyncStorage.setItem(NATIVE_METADATA_KEY, JSON.stringify(next));
    return persisted;
  }
  if (typeof audio === "string") throw new Error("A web audio Blob is required");
  const database = await openDatabase();
  try {
    const transaction = database.transaction(
      [METADATA_STORE, AUDIO_STORE],
      "readwrite",
    );
    transaction.objectStore(METADATA_STORE).put(recording);
    transaction.objectStore(AUDIO_STORE).put({ id: recording.id, blob: audio });
    await transactionDone(transaction);
    return recording;
  } finally {
    database.close();
  }
}

export async function deleteVoiceRecording(id: string): Promise<void> {
  if (Platform.OS !== "web") {
    const current = await listVoiceRecordings();
    const target = current.find((item) => item.id === id);
    if (target?.uri) {
      const file = new File(target.uri);
      if (file.exists) file.delete();
    }
    await AsyncStorage.setItem(
      NATIVE_METADATA_KEY,
      JSON.stringify(current.filter((item) => item.id !== id)),
    );
    return;
  }
  const database = await openDatabase();
  try {
    const transaction = database.transaction(
      [METADATA_STORE, AUDIO_STORE],
      "readwrite",
    );
    transaction.objectStore(METADATA_STORE).delete(id);
    transaction.objectStore(AUDIO_STORE).delete(id);
    await transactionDone(transaction);
  } finally {
    database.close();
  }
}
