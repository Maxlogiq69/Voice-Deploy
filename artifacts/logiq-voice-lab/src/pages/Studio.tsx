import { Header } from "@/components/Header";
import { ScriptInput } from "@/components/ScriptInput";
import { VoiceSelector } from "@/components/VoiceSelector";
import { ControlPanel } from "@/components/ControlPanel";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useVoices } from "@/hooks/useVoices";
import { useSpeech } from "@/hooks/useSpeech";
import { useSettings } from "@/hooks/useSettings";
import { useState } from "react";

export function Studio() {
  const [script, setScript] = useState("");

  const {
    selectedVoiceId,
    setSelectedVoiceId,
    speed,
    setSpeed,
    pitch,
    setPitch,
    favoriteIds,
    toggleFavorite,
  } = useSettings();

  const { voices, loading, error } = useVoices();
  const { play, pause, resume, stop, speechState, progress, audioUrl } = useSpeech();

  const handleGenerate = () => {
    if (!script.trim() || !selectedVoiceId) return;
    void play(script, selectedVoiceId, speed, pitch);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8 py-5 sm:py-8 flex flex-col gap-5 sm:gap-8 pb-safe">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2 text-foreground">
            Your Script
          </h2>
          <p className="text-sm text-muted-foreground mb-3 sm:mb-5">
            Paste your history content — settings are saved automatically.
          </p>
          <ScriptInput value={script} onChange={setScript} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <VoiceSelector
            voices={voices}
            selectedVoiceId={selectedVoiceId}
            onSelect={setSelectedVoiceId}
            loading={loading}
            error={error}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both space-y-4">
          <ControlPanel
            speed={speed}
            pitch={pitch}
            onSpeedChange={setSpeed}
            onPitchChange={setPitch}
            onGenerate={handleGenerate}
            onStop={stop}
            speechState={speechState}
          />

          <AudioPlayer
            speechState={speechState}
            progress={progress}
            onPause={pause}
            onResume={resume}
            onStop={stop}
            scriptText={script}
            audioUrl={audioUrl}
          />
        </section>
      </main>
    </div>
  );
}
