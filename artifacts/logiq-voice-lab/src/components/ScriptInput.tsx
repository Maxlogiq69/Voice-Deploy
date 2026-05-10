import { Textarea } from "@/components/ui/textarea";

interface ScriptInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;
  const maxChars = 5000;
  const readTimeMins = (words / 150).toFixed(1);

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="relative group">
        <Textarea
          placeholder="Paste your history script here…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid="textarea-script"
          className="min-h-[250px] resize-y text-lg p-6 bg-card border-border focus:ring-primary shadow-sm hover-elevate transition-all duration-200 leading-relaxed font-serif"
        />
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground px-2 font-medium">
        <div className="flex gap-4">
          <span>{words} words</span>
          <span>{readTimeMins} min read</span>
        </div>
        <span className={chars > maxChars ? "text-destructive" : ""}>
          {chars} / {maxChars} chars
        </span>
      </div>
    </div>
  );
}