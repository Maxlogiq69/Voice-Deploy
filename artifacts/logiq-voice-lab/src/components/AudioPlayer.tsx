import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SpeechState } from "@/hooks/useSpeech";
import { Play, Pause, Square, Download, Copy, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  speechState: SpeechState;
  progress: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  scriptText: string;
  audioUrl: string | null;
}

export function AudioPlayer({
  speechState,
  progress,
  onPause,
  onResume,
  onStop,
  scriptText,
  audioUrl,
}: AudioPlayerProps) {
  const { toast } = useToast();

  const handleDownloadMp3 = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `logiq-voice-${Date.now()}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(scriptText);
    toast({
      title: "Copied to clipboard",
      description: "Your script is ready to paste anywhere.",
    });
  };

  if (speechState === "idle") return null;

  const isPlaying = speechState === "playing";
  const isPaused = speechState === "paused";
  const isComplete = speechState === "complete";

  const statusLabel = isPlaying
    ? "Playing"
    : isPaused
      ? "Paused"
      : isComplete
        ? "Complete"
        : "Ready";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full bg-card border border-border rounded-xl p-6 shadow-lg space-y-6"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 bg-background p-2 rounded-full border border-border">
            <Button
              size="icon"
              variant={isPlaying ? "secondary" : "default"}
              className="rounded-full h-12 w-12"
              onClick={isPlaying ? onPause : onResume}
              disabled={isComplete}
              data-testid="button-play-pause"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive"
              onClick={onStop}
              data-testid="button-stop"
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isPlaying && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isPlaying
                        ? "bg-primary"
                        : isComplete
                          ? "bg-green-500"
                          : "bg-muted-foreground"
                    }`}
                  ></span>
                </span>
                {statusLabel}
              </span>
              <span className="text-muted-foreground font-mono">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <Progress value={progress * 100} className="h-2" />
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Music2 className="h-4 w-4 text-primary shrink-0" />
            <span>Microsoft Edge Neural TTS — High quality audio</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleCopy}
              data-testid="button-copy-script"
            >
              <Copy className="h-4 w-4" /> Copy Script
            </Button>
            <Button
              variant="default"
              className="gap-2 glow-primary"
              onClick={handleDownloadMp3}
              disabled={!audioUrl}
              data-testid="button-download-mp3"
            >
              <Download className="h-4 w-4" /> Download MP3
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
