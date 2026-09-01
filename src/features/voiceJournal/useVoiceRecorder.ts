import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export type RecorderState = "idle" | "paused" | "preview" | "recording";

export type RecordingPreview = {
  blob?: Blob;
  duration: number;
  mimeType: string;
  uri: string;
  url: string;
};

type RecorderProblem = "permission" | "recording" | null;

const recordingOptions = {
  ...RecordingPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
};

export function useVoiceRecorder() {
  const audioRecorder = useAudioRecorder(recordingOptions);
  const recorderStatus = useAudioRecorderState(audioRecorder, 250);
  const [state, setState] = useState<RecorderState>("idle");
  const [preview, setPreview] = useState<RecordingPreview | null>(null);
  const [problem, setProblem] = useState<RecorderProblem>(null);
  const elapsedRef = useRef(0);
  const previewUriRef = useRef<string | null>(null);

  const releasePreview = useCallback(() => {
    if (Platform.OS === "web" && previewUriRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUriRef.current);
    }
    previewUriRef.current = null;
  }, []);

  const discard = useCallback(async () => {
    if (state === "recording" || state === "paused") {
      try {
        await audioRecorder.stop();
      } catch {
        // The recorder can already be released after an OS interruption.
      }
    }
    releasePreview();
    elapsedRef.current = 0;
    setPreview(null);
    setProblem(null);
    setState("idle");
  }, [audioRecorder, releasePreview, state]);

  const start = useCallback(async () => {
    setProblem(null);
    releasePreview();
    setPreview(null);
    elapsedRef.current = 0;

    try {
      const permission = await requestRecordingPermissionsAsync();
      if (!permission.granted) {
        setProblem("permission");
        setState("idle");
        return;
      }

      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setState("recording");
    } catch {
      setProblem("recording");
      setState("idle");
    }
  }, [audioRecorder, releasePreview]);

  const pause = useCallback(() => {
    if (state !== "recording") return;
    audioRecorder.pause();
    elapsedRef.current = Math.max(
      elapsedRef.current,
      Math.round(recorderStatus.durationMillis / 1000),
    );
    setState("paused");
  }, [audioRecorder, recorderStatus.durationMillis, state]);

  const resume = useCallback(() => {
    if (state !== "paused") return;
    audioRecorder.record();
    setState("recording");
  }, [audioRecorder, state]);

  const stop = useCallback(async () => {
    if (state !== "recording" && state !== "paused") return;
    const duration = Math.max(
      Math.round(recorderStatus.durationMillis / 1000),
      elapsedRef.current,
      1,
    );

    try {
      await audioRecorder.stop();
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      const uri = audioRecorder.uri;
      if (!uri) throw new Error("Recording URI is unavailable");

      let blob: Blob | undefined;
      let mimeType = "audio/mp4";
      if (Platform.OS === "web") {
        const response = await fetch(uri);
        blob = await response.blob();
        mimeType = blob.type || "audio/webm";
      }

      previewUriRef.current = uri;
      setPreview({ blob, duration, mimeType, uri, url: uri });
      setState("preview");
    } catch {
      setProblem("recording");
      setState("idle");
    }
  }, [audioRecorder, recorderStatus.durationMillis, state]);

  useEffect(() => () => {
    releasePreview();
    if (audioRecorder.isRecording) audioRecorder.stop().catch(() => undefined);
  }, [audioRecorder, releasePreview]);

  const liveElapsed = Math.max(
    elapsedRef.current,
    Math.round(recorderStatus.durationMillis / 1000),
  );

  return {
    discard,
    elapsed: state === "preview" ? preview?.duration ?? 0 : liveElapsed,
    isSupported: true,
    pause,
    preview,
    problem,
    resume,
    start,
    state,
    stop,
  };
}
