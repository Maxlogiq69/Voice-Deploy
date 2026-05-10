import { VoiceCard } from "./VoiceCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EdgeVoice } from "@/hooks/useVoices";
import { Loader2, AlertCircle } from "lucide-react";

interface VoiceSelectorProps {
  voices: EdgeVoice[];
  selectedVoice: EdgeVoice | null;
  onSelect: (voice: EdgeVoice) => void;
  loading: boolean;
  error: string | null;
}

export function VoiceSelector({ voices, selectedVoice, onSelect, loading, error }: VoiceSelectorProps) {
  if (loading) {
    return (
      <div className="w-full h-48 border border-dashed border-border rounded-xl flex items-center justify-center bg-card gap-3">
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm font-medium">Loading neural voices…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-48 border border-dashed border-destructive/40 rounded-xl flex items-center justify-center bg-card gap-3">
        <AlertCircle className="w-5 h-5 text-destructive" />
        <p className="text-muted-foreground text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Select Voice</h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md font-medium">
          {voices.length} Neural Voices
        </span>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-border bg-background/50 p-4">
        <div className="flex w-max space-x-4 p-1">
          {voices.map((voice, idx) => (
            <VoiceCard
              key={voice.id}
              voice={voice}
              isSelected={selectedVoice?.id === voice.id}
              onSelect={onSelect}
              index={idx}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
}
