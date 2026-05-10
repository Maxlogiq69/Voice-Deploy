import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceCardProps {
  voice: SpeechSynthesisVoice;
  isSelected: boolean;
  onSelect: (voice: SpeechSynthesisVoice) => void;
  index: number;
}

export function VoiceCard({ voice, isSelected, onSelect, index }: VoiceCardProps) {
  const cleanName = voice.name.replace(/^Microsoft\s+/i, '').replace(/ - English .*$/i, '');
  const isFemale = voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('zira') || voice.name.toLowerCase().includes('susan');
  
  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("Welcome to LogiQ Voice Lab. Let the story begin.");
    utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
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
        className={`h-full min-w-[240px] cursor-pointer transition-all duration-300 hover-elevate flex flex-col justify-between ${
          isSelected 
            ? 'border-primary ring-1 ring-primary bg-primary/5' 
            : 'border-border bg-card hover:border-primary/50'
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
            <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-1" title={cleanName}>
              {cleanName}
            </h3>
            <p className="text-xs text-muted-foreground font-medium flex items-center gap-2">
              <span>{voice.lang}</span>
              <span className="w-1 h-1 rounded-full bg-border"></span>
              <span>{isFemale ? 'Female' : 'Male'}</span>
            </p>
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full mt-2 gap-2 text-xs"
            onClick={handlePreview}
            data-testid={`button-preview-${index}`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Preview
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}