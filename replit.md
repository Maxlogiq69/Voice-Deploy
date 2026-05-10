# LogiQ Voice Lab

A personal AI voice narration studio for creating cinematic voiceovers for history YouTube videos. Converts text scripts to speech with multiple voice options, speed/pitch control, and a cinematic studio UI.

## Run & Operate

- `pnpm --filter @workspace/logiq-voice-lab run dev` — run the frontend (port assigned by workflow)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind CSS
- TTS: Web Speech API (browser-native, no backend required)
- Theme: next-themes (dark/light mode, localStorage persistence)
- Animations: framer-motion
- Icons: lucide-react

## Where things live

- `artifacts/logiq-voice-lab/src/` — main frontend app
- `artifacts/logiq-voice-lab/src/hooks/useSpeech.ts` — all TTS logic (Chrome bug fix included)
- `artifacts/logiq-voice-lab/src/hooks/useVoices.ts` — loads/filters browser voices
- `artifacts/logiq-voice-lab/src/components/` — Header, ScriptInput, VoiceCard, VoiceSelector, ControlPanel, AudioPlayer
- `artifacts/logiq-voice-lab/src/pages/Studio.tsx` — main studio page

## Architecture decisions

- **Frontend-only (no backend)**: Uses the browser Web Speech API — works 100% on Netlify as a static site with no server needed.
- **Chrome 15s bug fix**: The Chrome speechSynthesis API stops after ~15 seconds. Fixed with a setInterval that pauses/resumes every 10 seconds during playback.
- **Voice loading**: `getVoices()` is async (fires `voiceschanged` event) — handled properly with a custom hook.
- **Download**: Audio download via Web Speech API is not natively possible; users are guided to use system recording tools. Script text downloads as .txt.
- **Dark mode default**: Default theme is dark for the cinematic studio feel; preference saved to localStorage.

## Product

- Paste a script → select a voice → adjust speed/pitch → generate speech narration
- Supports all English voices provided by the browser (Chrome/Edge have Microsoft Neural voices)
- Playback controls: play, pause, resume, stop
- Dark mode (deep navy + amber glow) / Light mode toggle

## User preferences

- Must deploy on Netlify as a static site with no backend
- TTS must work 100% correctly — uses browser-native Web Speech API
- No login, database, ads, or multi-user features

## Gotchas

- Voice quality depends on the browser — Chrome/Edge have the best neural voices (Microsoft voices)
- `getVoices()` returns empty array synchronously on first call; always wait for `voiceschanged` event
- Chrome stops speechSynthesis after ~15s without the pause/resume workaround

## Netlify Deployment

Build command: `pnpm --filter @workspace/logiq-voice-lab run build`
Publish directory: `artifacts/logiq-voice-lab/dist/public`
No environment variables needed.
