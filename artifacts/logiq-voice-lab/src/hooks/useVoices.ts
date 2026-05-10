import { useEffect, useState } from "react";

export interface EdgeVoice {
  id: string;
  name: string;
  lang: string;
  gender: "Female" | "Male";
  locale: string;
  description: string;
}

export function useVoices() {
  const [voices, setVoices] = useState<EdgeVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<EdgeVoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/voices")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<EdgeVoice[]>;
      })
      .then((data) => {
        setVoices(data);
        if (data.length > 0) setSelectedVoice(data[0]);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to load voices:", err);
        setError("Could not load voices from server.");
        setLoading(false);
      });
  }, []);

  return { voices, selectedVoice, setSelectedVoice, loading, error };
}
