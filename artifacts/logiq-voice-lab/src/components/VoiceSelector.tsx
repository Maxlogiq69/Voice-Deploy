import { useState } from "react";
import { VoiceCard } from "./VoiceCard";
import { EdgeVoice } from "@/hooks/useVoices";
import { Loader2, AlertCircle, Star, Mic2 } from "lucide-react";

interface VoiceSelectorProps {
  voices: EdgeVoice[];
  selectedVoiceId: string;
  onSelect: (id: string) => void;
  loading: boolean;
  error: string | null;
  favoriteIds?: string[];
  onToggleFavorite: (id: string) => void;
}

export function VoiceSelector({
  voices,
  selectedVoiceId,
  onSelect,
  loading,
  error,
  favoriteIds = [],
  onToggleFavorite,
}: VoiceSelectorProps) {
  const [activeTab, setActiveTab] = useState<"favorites" | "all">("favorites");

  if (loading) {
    return (
      <div className="w-full h-36 border border-dashed border-border rounded-xl flex items-center justify-center bg-card gap-3">
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading neural voices…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-36 border border-dashed border-destructive/40 rounded-xl flex items-center justify-center bg-card gap-3 px-4">
        <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  const favoriteVoices = voices.filter((v) => favoriteIds.includes(v.id));
  const displayVoices = activeTab === "favorites" ? favoriteVoices : voices;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
          Select Voice
        </h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded font-medium shrink-0">
          {voices.length} voices
        </span>
      </div>

      <div className="flex gap-1 bg-secondary/60 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("favorites")}
          data-testid="tab-my-voices"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === "favorites"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${activeTab === "favorites" ? "text-amber-400 fill-amber-400" : ""}`} />
          My Voices
          <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-semibold">
            {favoriteVoices.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("all")}
          data-testid="tab-all-voices"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
            activeTab === "all"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Mic2 className="w-3.5 h-3.5" />
          All Voices
        </button>
      </div>

      {displayVoices.length === 0 && activeTab === "favorites" ? (
        <div className="w-full h-28 border border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 bg-card">
          <Star className="w-5 h-5 text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm text-center px-4">
            No favorites yet. Go to All Voices and tap{" "}
            <Star className="w-3 h-3 inline fill-current" /> to add voices here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
          {displayVoices.map((voice, idx) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              isSelected={selectedVoiceId === voice.id}
              onSelect={(v) => onSelect(v.id)}
              index={idx}
              isFavorite={favoriteIds.includes(voice.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {activeTab === "all" && (
        <p className="text-xs text-muted-foreground text-center">
          Tap <Star className="w-3 h-3 inline" /> on any voice to add it to My Voices
        </p>
      )}
    </div>
  );
}
