import { useState, useRef, useCallback, useEffect } from "react";

export type SpeechState = "idle" | "loading" | "playing" | "paused" | "complete";

export function useSpeech() {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [progress, setProgress] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const clearInterval_ = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback(() => {
    clearInterval_();
    intervalRef.current = setInterval(() => {
      const audio = audioRef.current;
      if (audio && audio.duration && !isNaN(audio.duration)) {
        setProgress(audio.currentTime / audio.duration);
      }
    }, 150);
  }, [clearInterval_]);

  const stop = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    clearInterval_();
    setSpeechState("idle");
    setProgress(0);
  }, [clearInterval_]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    clearInterval_();
    setSpeechState("paused");
  }, [clearInterval_]);

  const resume = useCallback(() => {
    if (audioRef.current) {
      void audioRef.current.play();
      setSpeechState("playing");
      startProgressTracking();
    }
  }, [startProgressTracking]);

  const play = useCallback(
    async (text: string, voiceId: string, speed: number, pitch: number) => {
      if (!text.trim()) return;

      if (abortRef.current) abortRef.current.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
      clearInterval_();
      setSpeechState("loading");
      setProgress(0);

      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, voice: voiceId, speed, pitch }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`TTS API returned ${response.status}`);
        }

        const blob = await response.blob();
        if (controller.signal.aborted) return;

        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        const audio = new Audio(url);
        audioRef.current = audio;

        audio.onplay = () => {
          setSpeechState("playing");
          startProgressTracking();
        };

        audio.onpause = () => {
          if (!audio.ended) {
            setSpeechState("paused");
          }
        };

        audio.onended = () => {
          clearInterval_();
          setSpeechState("complete");
          setProgress(1);
        };

        audio.onerror = () => {
          clearInterval_();
          setSpeechState("idle");
        };

        await audio.play();
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        console.error("TTS error:", err);
        setSpeechState("idle");
      }
    },
    [clearInterval_, startProgressTracking],
  );

  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      clearInterval_();
    };
  }, [clearInterval_]);

  return { play, pause, resume, stop, speechState, progress, audioUrl };
}
