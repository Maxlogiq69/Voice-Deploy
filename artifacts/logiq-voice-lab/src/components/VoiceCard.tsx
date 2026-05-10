import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, PlayCircle, Loader2, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { EdgeVoice } from "@/hooks/useVoices";
import { API_BASE } from "@/lib/api";

interface VoiceCardProps {
  voice: EdgeVoice;
  isSelected: boolean;
  onSelect: (voice: EdgeVoice) => void;
  index: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function VoiceCard({
  voice,
  isSelected,
  onSelect,
  index,
  isFavorite = false,
  onToggleFavorite,
}: VoiceCardProps) {
  const [previewing, setPreviewing] = useState(false);

  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewing) return;
    setPreviewing(true);
    try {
      const response = await fetch(`${API_BASE}/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: "Welcome to LogiQ Voice Lab. Let the story begin.",
          voice: voice.id,
          speed: 1.0,
          pitch: 1.0,
        }),
      });
      if (!response.ok) throw new Error("Preview failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPreviewing(false);
        URL.revokeObjectURL(url);
      };
      audio.onerror = () => setPreviewing(false);
      await audio.play();
    } catch {
      setPreviewing(false);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(voice.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3), duration: 0.25 }}
      className="h-full"
    >
      <Card
        onClick={() => onSelect(voice)}
        data-testid={`card-voice-${index}`}
        className={`h-full cursor-pointer transition-all duration-200 flex flex-col justify-between ${
          isSelected
            ? "border-primary ring-1 ring-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/40"
        }`}
      >
        <CardContent className="p-3 sm:p-4 flex flex-col h-full gap-3">
          <div className="flex items-start justify-between gap-1">
            <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-secondary text-primary shrink-0">
              <Mic className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1">
              {isSelected && (
                <span className="text-[10px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                  Active
                </span>
              )}
              {onToggleFavorite && (
                <button
                  onClick={handleToggleFavorite}
                  data-testid={`button-favorite-${index}`}
                  className={`p-1 rounded transition-colors ${
                    isFavorite
                      ? "text-amber-400 hover:text-amber-300"
                      : "text-muted-foreground/40 hover:text-muted-foreground"
                  }`}
                  title={isFavorite ? "Remove from My Voices" : "Add to My Voices"}
                >
                  <Star className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-0.5 flex-1">
            <h3
              className="font-semibold text-foreground text-sm sm:text-base leading-tight line-clamp-1"
              title={voice.name}
            >
              {voice.name}
            </h3>
            <p className="text-[11px] text-muted-foreground font-medium">
              {voice.locale} · {voice.gender}
            </p>
            <p className="text-[11px] text-muted-foreground/60 italic line-clamp-1">
              {voice.description}
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full gap-1.5 text-xs h-8"
            onClick={handlePreview}
            disabled={previewing}
            data-testid={`button-preview-${index}`}
          >
            {previewing ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Previewing…
              </>
            ) : (
              <>
                <PlayCircle className="w-3 h-3" />
                Preview
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
