import { useState, useRef, useCallback, useEffect } from "react";

export type SpeechState = "idle" | "playing" | "paused" | "complete";

export function useSpeech() {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const [progress, setProgress] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const durationEstimateRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgressTracking = useCallback(() => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    startTimeRef.current = Date.now() - (progress * durationEstimateRef.current);

    progressTimerRef.current = setInterval(() => {
      if (speechState === "playing") {
        const elapsed = Date.now() - startTimeRef.current;
        let newProgress = (elapsed / durationEstimateRef.current);
        if (newProgress > 0.99) newProgress = 0.99; // Cap at 99% until onend
        setProgress(newProgress);
      }
    }, 100);
  }, [progress, speechState]);

  const stopProgressTracking = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
    stopProgressTracking();
    setSpeechState("idle");
    setProgress(0);
  }, [stopProgressTracking]);

  const play = useCallback((
    text: string, 
    voice: SpeechSynthesisVoice | null, 
    speed: number, 
    pitch: number, 
    volume: number = 1.0
  ) => {
    if (!voice || !text.trim()) return;

    stop();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utteranceRef.current = utterance;

    // Estimate duration: words / (150 words per minute * speed)
    const words = text.split(/\s+/).length;
    durationEstimateRef.current = (words / (150 * speed)) * 60 * 1000;

    resumeTimerRef.current = setInterval(() => {
      if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 10000);

    utterance.onstart = () => {
      setSpeechState("playing");
      setProgress(0);
      startProgressTracking();
    };

    utterance.onend = () => {
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
      stopProgressTracking();
      setSpeechState("complete");
      setProgress(1);
    };

    utterance.onerror = (e) => {
      console.error("SpeechSynthesis Error:", e);
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
      stopProgressTracking();
      setSpeechState("idle");
    };

    window.speechSynthesis.speak(utterance);
  }, [stop, startProgressTracking, stopProgressTracking]);

  const pause = useCallback(() => {
    if (speechState === "playing") {
      window.speechSynthesis.pause();
      setSpeechState("paused");
      stopProgressTracking();
    }
  }, [speechState, stopProgressTracking]);

  const resume = useCallback(() => {
    if (speechState === "paused") {
      window.speechSynthesis.resume();
      setSpeechState("playing");
      startProgressTracking();
    }
  }, [speechState, startProgressTracking]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearInterval(resumeTimerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      window.speechSynthesis.cancel();
    };
  }, []);

  return {
    play,
    pause,
    resume,
    stop,
    speechState,
    progress
  };
}