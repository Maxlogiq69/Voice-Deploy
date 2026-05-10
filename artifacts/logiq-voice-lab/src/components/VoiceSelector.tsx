import { VoiceCard } from "./VoiceCard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useVoices } from "@/hooks/useVoices";

interface VoiceSelectorProps {
  voices: SpeechSynthesisVoice[];
  selectedVoice: SpeechSynthesisVoice | null;
  onSelect: (voice: SpeechSynthesisVoice) => void;
}

export function VoiceSelector({ voices, selectedVoice, onSelect }: VoiceSelectorProps) {
  if (voices.length === 0) {
    return (
      <div className="w-full h-48 border border-dashed border-border rounded-xl flex items-center justify-center bg-card">
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Loading studio voices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">Select Voice</h2>
        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-md font-medium">{voices.length} Available</span>
      </div>
      
      <ScrollArea className="w-full whitespace-nowrap rounded-xl border border-border bg-background/50 p-4">
        <div className="flex w-max space-x-4 p-1">
          {voices.map((voice, idx) => (
            <VoiceCard 
              key={voice.voiceURI + idx} 
              voice={voice} 
              isSelected={selectedVoice?.voiceURI === voice.voiceURI}
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