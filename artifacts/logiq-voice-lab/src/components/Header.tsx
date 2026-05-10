import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-8 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 sticky top-0">
      <div className="flex items-center gap-3">
        <img
          src="/logo.png"
          alt="LogiQ Voice Lab"
          className="h-10 w-10 rounded-lg object-cover shadow-md"
          style={{ boxShadow: "0 0 12px rgba(245,158,11,0.35)" }}
        />
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground leading-none">
            LogiQ Voice Lab
          </h1>
          <p className="text-sm text-muted-foreground font-medium">AI Narration Studio</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        data-testid="button-theme-toggle"
        className="rounded-full"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-foreground" />
        ) : (
          <Sun className="h-5 w-5 text-foreground" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  );
}
