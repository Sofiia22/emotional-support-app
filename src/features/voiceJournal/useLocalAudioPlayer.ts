import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";

export function useLocalAudioPlayer() {
  const player = useAudioPlayer(null, { updateInterval: 250 });
  const status = useAudioPlayerStatus(player);
  const sourceRef = useRef<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    if (!status.didJustFinish) return;
    player.seekTo(0).catch(() => undefined);
    setActiveKey(null);
  }, [player, status.didJustFinish]);

  const stop = useCallback(async () => {
    player.pause();
    await player.seekTo(0).catch(() => undefined);
    player.replace(null);
    sourceRef.current = null;
    setActiveKey(null);
  }, [player]);

  const toggle = useCallback(async (key: string, source: string) => {
    if (activeKey === key && sourceRef.current === source) {
      if (status.playing) {
        player.pause();
      } else {
        if (status.duration > 0 && status.currentTime >= status.duration - 0.1) {
          await player.seekTo(0);
        }
        player.play();
      }
      return;
    }

    player.pause();
    player.replace(source);
    sourceRef.current = source;
    setActiveKey(key);
    player.play();
  }, [activeKey, player, status.currentTime, status.duration, status.playing]);

  return {
    activeKey,
    currentTime: status.currentTime || 0,
    duration: status.duration || 0,
    isPlaying: status.playing,
    stop,
    toggle,
  };
}
