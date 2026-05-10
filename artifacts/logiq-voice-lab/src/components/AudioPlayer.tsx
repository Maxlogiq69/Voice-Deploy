import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SpeechState } from "@/hooks/useSpeech";
import { Play, Pause, Square, Download, Copy, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  speechState: SpeechState;
  progress: number;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  scriptText: string;
}

export function AudioPlayer({ 
  speechState, 
  progress, 
  onPause, 
  onResume, 
  onStop,
  scriptText 
}: AudioPlayerProps) {
  const { toast } = useToast();

  const handleDownloadTxt = () => {
    const blob = new Blob([scriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "logiq-script.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    toast({
      title: "Copied to clipboard",
      description: "Your script is ready to paste anywhere.",
    });
  };

  if (speechState === "idle") return null;

  const isPlaying = speechState === "playing";
  const isComplete = speechState === "complete";

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
              onClick={isPlaying ? onPause : (isComplete ? undefined : onResume)}
              disabled={isComplete}
            >
              {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive"
              onClick={onStop}
            >
              <Square className="h-4 w-4 fill-current" />
            </Button>
          </div>

          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  {isPlaying && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                </span>
                {speechState === "paused" ? "Paused" : speechState === "playing" ? "Playing" : "Complete"}
              </span>
              <span className="text-muted-foreground font-mono">{Math.round(progress * 100)}%</span>
            </div>
            <Progress value={progress * 100} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="flex items-start gap-3 text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
            <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <p>
              To save this audio, use a system tool like OBS, Audacity, or Screen Recording while it plays. Browser API doesn't support direct MP3 export for this high-quality voice.
            </p>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" className="gap-2" onClick={handleCopy}>
              <Copy className="h-4 w-4" /> Copy Script
            </Button>
            <Button variant="default" className="gap-2" onClick={handleDownloadTxt}>
              <Download className="h-4 w-4" /> Download .txt
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}