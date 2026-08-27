import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { AudioItem, AudioProgress, PlayerStatus } from "@/features/listen/listen.types";
import { listenStorage } from "@/features/listen/listen.storage";

export function useAudioPlayer(onProgress: (progress: AudioProgress) => void) {
  const [activeItem, setActiveItem] = useState<AudioItem | null>(null);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastPersistedRef = useRef(0);
  const activeItemRef = useRef<AudioItem | null>(null);
  const currentTimeRef = useRef(0);
  const durationRef = useRef(0);
  const completedRef = useRef(false);

  const persist = useCallback(async (completed = false) => {
    const item = activeItemRef.current;
    if (!item) return;
    const progress: AudioProgress = {
      audioId: item.id,
      currentTime: completed ? 0 : currentTimeRef.current,
      duration: durationRef.current || item.duration,
      completed,
      updatedAt: new Date().toISOString(),
    };
    await listenStorage.saveAudioProgress(progress);
    onProgress(progress);
    lastPersistedRef.current = currentTimeRef.current;
  }, [onProgress]);

  const stopCurrent = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    audioRef.current = null;
  }, []);

  const open = useCallback(async (item: AudioItem, saved?: AudioProgress) => {
    if (activeItemRef.current) await persist();
    stopCurrent();
    activeItemRef.current = item;
    completedRef.current = false;
    setActiveItem(item);
    setStatus(item.audioUrl ? "paused" : "idle");
    const start = saved && !saved.completed ? saved.currentTime : 0;
    currentTimeRef.current = start;
    durationRef.current = saved?.duration ?? item.duration ?? 0;
    setCurrentTime(start);
    setDuration(durationRef.current);
    lastPersistedRef.current = start;
  }, [persist, stopCurrent]);

  const play = useCallback(async () => {
    if (!activeItem?.audioUrl || Platform.OS !== "web" || typeof Audio === "undefined") {
      setStatus("error");
      return;
    }
    try {
      let audio = audioRef.current;
      if (!audio) {
        audio = new Audio(activeItem.audioUrl);
        audioRef.current = audio;
        audio.currentTime = currentTime;
        audio.ontimeupdate = () => {
          currentTimeRef.current = audio?.currentTime ?? 0;
          durationRef.current = audio?.duration || activeItem.duration || 0;
          setCurrentTime(currentTimeRef.current);
          setDuration(durationRef.current);
        };
        audio.onended = () => {
          setStatus("paused");
          completedRef.current = true;
          currentTimeRef.current = 0;
          setCurrentTime(0);
          persist(true).catch(() => undefined);
        };
        audio.onerror = () => setStatus("error");
      }
      setStatus("loading");
      completedRef.current = false;
      await audio.play();
      setStatus("playing");
    } catch {
      setStatus("error");
    }
  }, [activeItem, currentTime, persist]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setStatus("paused");
    persist().catch(() => undefined);
  }, [persist]);

  const seek = useCallback((next: number) => {
    const bounded = Math.max(0, Math.min(next, duration || activeItem?.duration || 0));
    if (audioRef.current) audioRef.current.currentTime = bounded;
    currentTimeRef.current = bounded;
    setCurrentTime(bounded);
  }, [activeItem?.duration, duration]);

  useEffect(() => {
    if (status !== "playing" || currentTime - lastPersistedRef.current < 4) return;
    persist().catch(() => undefined);
  }, [currentTime, persist, status]);

  useEffect(() => () => {
    if (activeItemRef.current) {
      listenStorage.saveAudioProgress({
        audioId: activeItemRef.current.id,
        currentTime: currentTimeRef.current,
        duration: durationRef.current || activeItemRef.current.duration,
        completed: completedRef.current,
        updatedAt: new Date().toISOString(),
      }).catch(() => undefined);
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute("src");
    }
  }, []);

  return { activeItem, currentTime, duration, open, pause, persist, play, seek, status };
}
