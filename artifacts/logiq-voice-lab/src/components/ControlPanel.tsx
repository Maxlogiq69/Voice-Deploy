import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Square, Play } from "lucide-react";
import { SpeechState } from "@/hooks/useSpeech";

interface ControlPanelProps {
  speed: number;
  pitch: number;
  onSpeedChange: (v: number) => void;
  onPitchChange: (v: number) => void;
  onGenerate: () => void;
  onStop: () => void;
  speechState: SpeechState;
}

export function ControlPanel({ 
  speed, 
  pitch, 
  onSpeedChange, 
  onPitchChange, 
  onGenerate, 
  onStop,
  speechState 
}: ControlPanelProps) {
  const isGenerating = speechState === "playing" || speechState === "paused";

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-center bg-card p-6 rounded-xl border border-border shadow-sm">
      <div className="flex-1 flex flex-col gap-6 w-full">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <label className="text-foreground">Speed</label>
            <span className="text-muted-foreground w-12 text-right">{speed.toFixed(1)}x</span>
          </div>
          <Slider 
            value={[speed]} 
            min={0.5} 
            max={2.0} 
            step={0.1} 
            onValueChange={([v]) => onSpeedChange(v)} 
            disabled={isGenerating}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <label className="text-foreground">Pitch</label>
            <span className="text-muted-foreground w-12 text-right">{pitch.toFixed(1)}</span>
          </div>
          <Slider 
            value={[pitch]} 
            min={0.5} 
            max={2.0} 
            step={0.1} 
            onValueChange={([v]) => onPitchChange(v)} 
            disabled={isGenerating}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full md:w-auto min-w-[200px]">
        <Button 
          size="lg" 
          onClick={onGenerate}
          disabled={isGenerating}
          className="w-full h-14 text-base glow-primary font-semibold tracking-wide"
        >
          {isGenerating ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1 items-center justify-center h-4">
                <span className="w-1 h-full bg-current animate-[bounce_1s_infinite_0ms] rounded-full"></span>
                <span className="w-1 h-2/3 bg-current animate-[bounce_1s_infinite_100ms] rounded-full"></span>
                <span className="w-1 h-full bg-current animate-[bounce_1s_infinite_200ms] rounded-full"></span>
                <span className="w-1 h-1/2 bg-current animate-[bounce_1s_infinite_300ms] rounded-full"></span>
              </div>
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" />
              <span>Generate Voice</span>
            </div>
          )}
        </Button>
        <Button 
          size="lg" 
          variant="secondary"
          onClick={onStop}
          disabled={!isGenerating}
          className="w-full font-medium"
        >
          <Square className="w-4 h-4 mr-2 fill-current opacity-70" /> Stop
        </Button>
      </div>
    </div>
  );
}