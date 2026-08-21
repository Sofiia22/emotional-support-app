import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AppCopy,
  Language,
  translations,
} from "@/shared/i18n/translations";
import { MoodCheckIn, upsertMoodCheckIn } from "@/shared/utils/wellbeing";

const STORAGE_KEY = "plekai.app-state.v1";

export type JournalEntry = {
  id: string;
  text: string;
  createdAt: string;
  updatedAt?: string;
};

export type DailyReminder = {
  enabled: boolean;
  hour: number;
  minute: number;
  notificationId?: string;
};

type UserProfile = {
  name: string;
  email: string;
};

type PersistedState = {
  language: Language;
  user: UserProfile | null;
  mood: number | null;
  moodHistory: MoodCheckIn[];
  journalEntries: JournalEntry[];
  breathingSessions: number;
  favoriteArticleIds: string[];
  reminder: DailyReminder;
  supportRegion: SupportRegion;
};

export type SupportRegion = "ukraine" | "usa" | "canada" | "europe" | "other";

type AppContextValue = PersistedState & {
  isReady: boolean;
  copy: AppCopy;
  setLanguage: (language: Language) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  setMood: (mood: number) => void;
  addJournalEntry: (text: string) => void;
  updateJournalEntry: (id: string, text: string) => void;
  deleteJournalEntry: (id: string) => void;
  toggleFavoriteArticle: (id: string) => void;
  setReminder: (reminder: DailyReminder) => void;
  setSupportRegion: (region: SupportRegion) => void;
  clearWellbeingData: () => void;
  completeBreathingSession: () => void;
};

const initialState: PersistedState = {
  language: "en",
  user: null,
  mood: null,
  moodHistory: [],
  journalEntries: [],
  breathingSessions: 0,
  favoriteArticleIds: [],
  reminder: { enabled: false, hour: 20, minute: 0 },
  supportRegion: "ukraine",
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initialState);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((storedValue) => {
        if (!storedValue || !isMounted) return;

        const stored = JSON.parse(storedValue) as Partial<PersistedState>;
        setState((current) => ({
          ...current,
          ...stored,
          journalEntries: stored.journalEntries ?? current.journalEntries,
          moodHistory: stored.moodHistory ?? current.moodHistory,
          favoriteArticleIds:
            stored.favoriteArticleIds ?? current.favoriteArticleIds,
          reminder: { ...current.reminder, ...stored.reminder },
        }));
      })
      .catch(() => {
        // The app remains fully usable with in-memory state if storage fails.
      })
      .finally(() => {
        if (isMounted) setIsReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isReady) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {
      // Avoid interrupting an emotional-support flow for a storage error.
    });
  }, [isReady, state]);

  const value = useMemo<AppContextValue>(
    () => ({
      ...state,
      isReady,
      copy: translations[state.language],
      setLanguage: (language) =>
        setState((current) => ({ ...current, language })),
      login: (email, name) =>
        setState((current) => ({
          ...current,
          user: {
            email: email.trim().toLowerCase(),
            name: name?.trim() || email.split("@")[0] || "Friend",
          },
        })),
      logout: () =>
        setState((current) => ({ ...current, user: null })),
      setMood: (mood) =>
        setState((current) => ({
          ...current,
          mood,
          moodHistory: upsertMoodCheckIn(current.moodHistory, mood),
        })),
      addJournalEntry: (text) =>
        setState((current) => ({
          ...current,
          journalEntries: [
            {
              id: `${Date.now()}`,
              text: text.trim(),
              createdAt: new Date().toISOString(),
            },
            ...current.journalEntries,
          ],
        })),
      updateJournalEntry: (id, text) =>
        setState((current) => ({
          ...current,
          journalEntries: current.journalEntries.map((item) =>
            item.id === id
              ? { ...item, text: text.trim(), updatedAt: new Date().toISOString() }
              : item,
          ),
        })),
      deleteJournalEntry: (id) =>
        setState((current) => ({
          ...current,
          journalEntries: current.journalEntries.filter((item) => item.id !== id),
        })),
      toggleFavoriteArticle: (id) =>
        setState((current) => ({
          ...current,
          favoriteArticleIds: current.favoriteArticleIds.includes(id)
            ? current.favoriteArticleIds.filter((item) => item !== id)
            : [...current.favoriteArticleIds, id],
        })),
      setReminder: (reminder) =>
        setState((current) => ({ ...current, reminder })),
      setSupportRegion: (supportRegion) =>
        setState((current) => ({ ...current, supportRegion })),
      clearWellbeingData: () =>
        setState((current) => ({
          ...current,
          mood: null,
          moodHistory: [],
          journalEntries: [],
          breathingSessions: 0,
          favoriteArticleIds: [],
        })),
      completeBreathingSession: () =>
        setState((current) => ({
          ...current,
          breathingSessions: current.breathingSessions + 1,
        })),
    }),
    [isReady, state],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }

  return context;
}
