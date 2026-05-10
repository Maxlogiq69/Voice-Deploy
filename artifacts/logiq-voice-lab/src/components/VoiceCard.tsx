import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, PlayCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { EdgeVoice } from "@/hooks/useVoices";

interface VoiceCardProps {
  voice: EdgeVoice;
  isSelected: boolean;
  onSelect: (voice: EdgeVoice) => void;
  index: number;
}

export function VoiceCard({ voice, isSelected, onSelect, index }: VoiceCardProps) {
  const [previewing, setPreviewing] = useState(false);

  const handlePreview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewing) return;
    setPreviewing(true);
    try {
      const response = await fetch("/api/tts", {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="h-full"
    >
      <Card
        onClick={() => onSelect(voice)}
        data-testid={`card-voice-${index}`}
        className={`h-full min-w-[240px] cursor-pointer transition-all duration-300 flex flex-col justify-between ${
          isSelected
            ? "border-primary ring-1 ring-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50"
        }`}
      >
        <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-primary">
              <Mic className="w-5 h-5" />
            </div>
            {isSelected && (
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                Selected
              </span>
            )}
          </div>

          <div className="space-y-1">
            <h3
              className="font-semibold text-foreground text-lg leading-tight line-clamp-1"
              title={voice.name}
            >
              {voice.name}
            </h3>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <span>{voice.locale}</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>{voice.gender}</span>
            </p>
            <p className="text-xs text-muted-foreground/70 italic">{voice.description}</p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="w-full mt-2 gap-2 text-xs"
            onClick={handlePreview}
            disabled={previewing}
            data-testid={`button-preview-${index}`}
          >
            {previewing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Previewing…
              </>
            ) : (
              <>
                <PlayCircle className="w-3.5 h-3.5" />
                Preview
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
