import { useRef, useEffect } from "react";

interface ScriptInputProps {
  value: string;
  onChange: (val: string) => void;
}

export function ScriptInput({ value, onChange }: ScriptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const chars = value.length;
  const readTimeMins = (words / 150).toFixed(1);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="w-full flex flex-col gap-2">
      <textarea
        ref={textareaRef}
        placeholder="Paste your history script here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        data-testid="textarea-script"
        rows={8}
        style={{ resize: "none", overflow: "hidden" }}
        className="w-full min-h-[200px] sm:min-h-[240px] text-base sm:text-lg p-4 sm:p-6 bg-card border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-200 leading-relaxed font-serif text-foreground placeholder:text-muted-foreground"
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
