import { useState, useCallback } from "react";

export const DEFAULT_FAVORITE_IDS = [
  "en-US-GuyNeural",
  "en-US-ChristopherNeural",
  "en-US-EricNeural",
  "en-GB-RyanNeural",
  "en-AU-WilliamNeural",
];

function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setAndStore = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const next =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {}
        return next;
      });
    },
    [key],
  );

  return [value, setAndStore] as const;
}

export function useSettings() {
  const [selectedVoiceId, setSelectedVoiceId] = useLocalStorage<string>(
    "logiq-voice-id",
    "en-US-ChristopherNeural",
  );
  const [speed, setSpeed] = useLocalStorage<number>("logiq-speed", 1.0);
  const [pitch, setPitch] = useLocalStorage<number>("logiq-pitch", 1.0);
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(
    "logiq-favorites",
    DEFAULT_FAVORITE_IDS,
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setFavoriteIds((prev) =>
        prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
      );
    },
    [setFavoriteIds],
  );

  return {
    selectedVoiceId,
    setSelectedVoiceId,
    speed,
    setSpeed,
    pitch,
    setPitch,
    favoriteIds,
    toggleFavorite,
  };
}
