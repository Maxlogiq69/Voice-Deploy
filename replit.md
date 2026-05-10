# LogiQ Voice Lab

A personal AI voice narration studio for creating cinematic voiceovers for history YouTube videos. Converts text scripts to speech with Microsoft Edge Neural TTS, voice tabs, settings persistence, and a mobile-friendly UI.

## Run & Operate

- `pnpm --filter @workspace/logiq-voice-lab run dev` — frontend dev server
- `pnpm --filter @workspace/api-server run dev` — API server (TTS backend)
- `pnpm run typecheck` — full typecheck across all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- TTS Backend: Express + msedge-tts (Microsoft Edge Neural TTS via WebSocket)
- Theme: next-themes (dark/light, localStorage)
- Animations: framer-motion
- Icons: lucide-react

## Where things live

- `artifacts/logiq-voice-lab/src/` — frontend app
- `artifacts/logiq-voice-lab/src/lib/api.ts` — configurable API base URL (reads VITE_API_URL)
- `artifacts/logiq-voice-lab/src/hooks/useSettings.ts` — localStorage persistence (voice, speed, pitch, favorites)
- `artifacts/logiq-voice-lab/src/hooks/useSpeech.ts` — TTS playback via HTML5 Audio + API fetch
- `artifacts/logiq-voice-lab/src/hooks/useVoices.ts` — loads voices from /api/voices
- `artifacts/logiq-voice-lab/src/components/` — Header, ScriptInput, VoiceCard, VoiceSelector, ControlPanel, AudioPlayer
- `artifacts/logiq-voice-lab/src/pages/Studio.tsx` — main studio page
- `artifacts/api-server/src/routes/tts.ts` — POST /api/tts and GET /api/voices endpoints

## Architecture decisions

- **Edge Neural TTS backend**: msedge-tts connects to Microsoft's Edge Read Aloud WebSocket API. No API key needed. Returns real MP3 audio.
- **Settings persistence**: All settings (selected voice, speed, pitch, favorite voice IDs) are saved to localStorage automatically and restored on next visit.
- **Voice tabs**: "My Voices" shows up to 5 starred favorites for quick access. "All Voices" shows all 12 with a star toggle to customize the favorites list.
- **Default favorites (history narration)**: Davis, Guy, Jason, Ryan, William — powerful documentary-style voices.
- **Configurable API URL**: Set VITE_API_URL env var on Netlify to point to the deployed API server. Defaults to /api for Replit.
- **MP3 download**: Real audio file download after generation (not a browser-recorded capture).
- **No character limit**: Scripts of any length are supported.

## Product

- Paste a script → select a voice from My Voices tab → adjust speed/pitch → generate speech
- Voice preview (sample sentence) per card
- Download MP3 directly after generation
- Dark mode (deep navy + amber glow) / Light mode toggle

## User preferences

- Top 5 voices for history videos in "My Voices" tab; rest in "All Voices"
- Settings (voice, speed, pitch, favorites) saved to localStorage automatically
- Mobile-friendly grid layout
- No login, database, ads, or multi-user features

## Deployment

### Replit (dev/production)
Both api-server and frontend run together via Replit proxy routing.

### Netlify (frontend only)
Build command: `pnpm --filter @workspace/logiq-voice-lab run build`
Publish directory: `artifacts/logiq-voice-lab/dist/public`
Environment variable: `VITE_API_URL=https://your-deployed-api-server.com/api`

The API server must be deployed separately (e.g., Replit Deployments, Railway, Render).
Set the deployed API URL as `VITE_API_URL` in Netlify's environment variables.

## Voice List (Edge Neural TTS)

| ID | Name | Locale | Style |
|---|---|---|---|
| en-US-AriaNeural | Aria | US English | Natural, conversational |
| en-US-GuyNeural | Guy | US English | Confident, clear |
| en-US-JennyNeural | Jenny | US English | Friendly, warm |
| en-US-TonyNeural | Tony | US English | Casual, relaxed |
| en-US-DavisNeural | Davis | US English | Deep, authoritative |
| en-US-JasonNeural | Jason | US English | Documentary style |
| en-US-NancyNeural | Nancy | US English | Professional, crisp |
| en-GB-LibbyNeural | Libby | UK English | Elegant, refined |
| en-GB-RyanNeural | Ryan | UK English | Rich, cinematic |
| en-GB-SoniaNeural | Sonia | UK English | Sophisticated, clear |
| en-AU-NatashaNeural | Natasha | Australian | Warm, engaging |
| en-AU-WilliamNeural | William | Australian | Strong, reliable |
