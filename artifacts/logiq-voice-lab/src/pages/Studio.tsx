import { useState } from "react";
import { Header } from "@/components/Header";
import { ScriptInput } from "@/components/ScriptInput";
import { VoiceSelector } from "@/components/VoiceSelector";
import { ControlPanel } from "@/components/ControlPanel";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useVoices } from "@/hooks/useVoices";
import { useSpeech } from "@/hooks/useSpeech";

export function Studio() {
  const [script, setScript] = useState("");
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  const { voices, selectedVoice, setSelectedVoice, loading, error } = useVoices();
  const { play, pause, resume, stop, speechState, progress, audioUrl } = useSpeech();

  const handleGenerate = () => {
    if (!script.trim() || !selectedVoice) return;
    void play(script, selectedVoice.id, speed, pitch);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-primary/20">
      <Header />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">Your Script</h2>
          <p className="text-muted-foreground mb-6">
            Write or paste your history content here. We'll handle the narration.
          </p>
          <ScriptInput value={script} onChange={setScript} />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
          <VoiceSelector
            voices={voices}
            selectedVoice={selectedVoice}
            onSelect={setSelectedVoice}
            loading={loading}
            error={error}
          />
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 fill-mode-both space-y-6">
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
