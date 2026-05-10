import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/voices`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<EdgeVoice[]>;
      })
      .then((data) => {
        setVoices(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        console.error("Failed to load voices:", err);
        setError("Could not load voices from server.");
        setLoading(false);
      });
  }, []);

  return { voices, loading, error };
}
