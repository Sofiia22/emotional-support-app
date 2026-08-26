import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

export type RecorderState = "idle" | "paused" | "preview" | "recording";

export type RecordingPreview = {
  blob: Blob;
  duration: number;
  mimeType: string;
  url: string;
};

type RecorderProblem = "permission" | "recording" | null;

const MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/webm",
  "audio/ogg;codecs=opus",
];

function preferredMimeType() {
  if (typeof MediaRecorder === "undefined") return "";
  return MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type)) ?? "";
}

export function useVoiceRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [preview, setPreview] = useState<RecordingPreview | null>(null);
  const [problem, setProblem] = useState<RecorderProblem>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const elapsedRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  const isSupported =
    Platform.OS === "web" &&
    typeof navigator !== "undefined" &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== "undefined";

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const revokePreviewUrl = useCallback(() => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    previewUrlRef.current = null;
  }, []);

  const beginTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setElapsed(elapsedRef.current);
    }, 1000);
  }, [clearTimer]);

  const start = useCallback(async () => {
    if (!isSupported) return;

    setProblem(null);
    revokePreviewUrl();
    setPreview(null);
    setElapsed(0);
    elapsedRef.current = 0;
    chunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = preferredMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onerror = () => {
        clearTimer();
        stopStream();
        setProblem("recording");
        setState("idle");
      };
      recorder.onstop = () => {
        clearTimer();
        stopStream();
        const resolvedType = recorder.mimeType || mimeType || "audio/webm";
        const blob = new Blob(chunksRef.current, { type: resolvedType });
        chunksRef.current = [];
        const url = URL.createObjectURL(blob);
        previewUrlRef.current = url;
        setPreview({
          blob,
          duration: Math.max(elapsedRef.current, 1),
          mimeType: resolvedType,
          url,
        });
        setState("preview");
        recorderRef.current = null;
      };

      recorder.start(250);
      setState("recording");
      beginTimer();
    } catch (error) {
      clearTimer();
      stopStream();
      const name = error instanceof DOMException ? error.name : "";
      setProblem(name === "NotAllowedError" || name === "SecurityError" ? "permission" : "recording");
      setState("idle");
    }
  }, [beginTimer, clearTimer, isSupported, revokePreviewUrl, stopStream]);

  const pause = useCallback(() => {
    if (recorderRef.current?.state !== "recording") return;
    recorderRef.current.pause();
    clearTimer();
    setState("paused");
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (recorderRef.current?.state !== "paused") return;
    recorderRef.current.resume();
    setState("recording");
    beginTimer();
  }, [beginTimer]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    clearTimer();
    recorder.stop();
  }, [clearTimer]);

  const discard = useCallback(() => {
    clearTimer();
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.onstop = null;
      recorderRef.current.stop();
    }
    recorderRef.current = null;
    stopStream();
    revokePreviewUrl();
    chunksRef.current = [];
    elapsedRef.current = 0;
    setElapsed(0);
    setPreview(null);
    setProblem(null);
    setState("idle");
  }, [clearTimer, revokePreviewUrl, stopStream]);

  useEffect(
    () => () => {
      clearTimer();
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      stopStream();
      revokePreviewUrl();
    },
    [clearTimer, revokePreviewUrl, stopStream],
  );

  return {
    discard,
    elapsed,
    isSupported,
    pause,
    preview,
    problem,
    resume,
    start,
    state,
    stop,
  };
}
