import { Textarea } from "@/components/ui/textarea";

interface ScriptInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;
  const readTimeMins = (words / 150).toFixed(1);

  return (
    <div className="w-full flex flex-col gap-2">
      <Textarea
        placeholder="Paste your history script here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="textarea-script"
        className="min-h-[180px] sm:min-h-[220px] resize-y text-base sm:text-lg p-4 sm:p-6 bg-card border-border focus:ring-primary shadow-sm transition-all duration-200 leading-relaxed font-serif"
      />
      <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground px-1 font-medium">
        <div className="flex gap-3">
          <span>{words} words</span>
          <span>{readTimeMins} min read</span>
        </div>
        <span>{chars.toLocaleString()} chars</span>
      </div>
    </div>
  );
}
