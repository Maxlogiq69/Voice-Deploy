import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Square, Play, Loader2 } from "lucide-react";
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
  speechState,
}: ControlPanelProps) {
  const isLoading = speechState === "loading";
  const isActive = speechState === "playing" || speechState === "paused";
  const isDisabled = isLoading || isActive;

  return (
    <div className="w-full flex flex-col gap-5 bg-card p-4 sm:p-6 rounded-xl border border-border shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-sm font-medium">
            <label className="text-foreground">Speed</label>
            <span className="text-muted-foreground tabular-nums">{speed.toFixed(1)}×</span>
          </div>
          <Slider
            value={[speed]}
            min={0.5}
            max={2.0}
            step={0.1}
            onValueChange={([v]) => onSpeedChange(v)}
            disabled={isDisabled}
            className="w-full"
            data-testid="slider-speed"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>0.5×</span><span>1.0×</span><span>2.0×</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex justify-between items-center text-sm font-medium">
            <label className="text-foreground">Pitch</label>
            <span className="text-muted-foreground tabular-nums">{pitch.toFixed(1)}</span>
          </div>
          <Slider
            value={[pitch]}
            min={0.5}
            max={2.0}
            step={0.1}
            onValueChange={([v]) => onPitchChange(v)}
            disabled={isDisabled}
            className="w-full"
            data-testid="slider-pitch"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>Low</span><span>Normal</span><span>High</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          size="lg"
          onClick={onGenerate}
          disabled={isDisabled}
          className="flex-1 h-12 sm:h-14 text-sm sm:text-base glow-primary font-semibold tracking-wide"
          data-testid="button-generate"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating…
            </span>
          ) : isActive ? (
            <span className="flex items-center gap-2">
              <span className="flex gap-0.5 items-end h-4">
                <span className="w-1 h-full bg-current animate-[bounce_1s_infinite_0ms] rounded-full" />
                <span className="w-1 h-2/3 bg-current animate-[bounce_1s_infinite_100ms] rounded-full" />
                <span className="w-1 h-full bg-current animate-[bounce_1s_infinite_200ms] rounded-full" />
                <span className="w-1 h-1/2 bg-current animate-[bounce_1s_infinite_300ms] rounded-full" />
              </span>
              Playing…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-current" />
              Generate Voice
            </span>
          )}
        </Button>

        <Button
          size="lg"
          variant="secondary"
          onClick={onStop}
          disabled={!isDisabled}
          className="h-12 sm:h-14 px-4 sm:px-6 font-medium"
          data-testid="button-stop-generate"
        >
          <Square className="w-4 h-4 fill-current opacity-70" />
          <span className="hidden sm:inline ml-2">Stop</span>
        </Button>
      </div>
    </div>
  );
}
