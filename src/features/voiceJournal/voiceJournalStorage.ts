export type VoiceRecording = {
  id: string;
  createdAt: string;
  duration: number;
  title: string;
  mimeType: string;
};

const DATABASE_NAME = "plekai.voice-journal";
const DATABASE_VERSION = 1;
const METADATA_STORE = "recordings";
const AUDIO_STORE = "audio";

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

export async function getVoiceRecordingAudio(id: string): Promise<Blob | null> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(AUDIO_STORE, "readonly");
    const stored = await requestResult(
      transaction.objectStore(AUDIO_STORE).get(id) as IDBRequest<StoredAudio | undefined>,
    );
    return stored?.blob ?? null;
  } finally {
    database.close();
  }
}

export async function saveVoiceRecording(
  recording: VoiceRecording,
  blob: Blob,
): Promise<void> {
  const database = await openDatabase();
  try {
    const transaction = database.transaction(
      [METADATA_STORE, AUDIO_STORE],
      "readwrite",
    );
    transaction.objectStore(METADATA_STORE).put(recording);
    transaction.objectStore(AUDIO_STORE).put({ id: recording.id, blob });
    await transactionDone(transaction);
  } finally {
    database.close();
  }
}

export async function deleteVoiceRecording(id: string): Promise<void> {
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
