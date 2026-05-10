import { Router } from "express";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const ttsRouter = Router();

export interface EdgeVoice {
  id: string;
  name: string;
  lang: string;
  gender: "Female" | "Male";
  locale: string;
  description: string;
}

const ENGLISH_VOICES: EdgeVoice[] = [
  { id: "en-US-AriaNeural", name: "Aria", lang: "en-US", gender: "Female", locale: "US English", description: "Natural, conversational" },
  { id: "en-US-GuyNeural", name: "Guy", lang: "en-US", gender: "Male", locale: "US English", description: "Confident, clear" },
  { id: "en-US-JennyNeural", name: "Jenny", lang: "en-US", gender: "Female", locale: "US English", description: "Friendly, warm" },
  { id: "en-US-ChristopherNeural", name: "Christopher", lang: "en-US", gender: "Male", locale: "US English", description: "Deep, authoritative" },
  { id: "en-US-EricNeural", name: "Eric", lang: "en-US", gender: "Male", locale: "US English", description: "Documentary style" },
  { id: "en-US-RogerNeural", name: "Roger", lang: "en-US", gender: "Male", locale: "US English", description: "Bold, commanding" },
  { id: "en-US-SteffanNeural", name: "Steffan", lang: "en-US", gender: "Male", locale: "US English", description: "Professional, crisp" },
  { id: "en-GB-LibbyNeural", name: "Libby", lang: "en-GB", gender: "Female", locale: "UK English", description: "Elegant, refined" },
  { id: "en-GB-RyanNeural", name: "Ryan", lang: "en-GB", gender: "Male", locale: "UK English", description: "Rich, cinematic" },
  { id: "en-GB-SoniaNeural", name: "Sonia", lang: "en-GB", gender: "Female", locale: "UK English", description: "Sophisticated, clear" },
  { id: "en-AU-NatashaNeural", name: "Natasha", lang: "en-AU", gender: "Female", locale: "Australian", description: "Warm, engaging" },
  { id: "en-AU-WilliamNeural", name: "William", lang: "en-AU", gender: "Male", locale: "Australian", description: "Strong, reliable" },
];

ttsRouter.get("/voices", (_req, res) => {
  res.json(ENGLISH_VOICES);
});

ttsRouter.post("/tts", async (req, res) => {
  const { text, voice, speed = 1.0, pitch = 1.0 } = req.body as {
    text: string;
    voice?: string;
    speed?: number;
    pitch?: number;
  };

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    res.status(400).json({ error: "text is required" });
    return;
  }

  const voiceId = voice || "en-US-AriaNeural";
  const rate = Math.max(0.5, Math.min(2.0, Number(speed) || 1.0));
  const pitchNum = Math.max(0.5, Math.min(2.0, Number(pitch) || 1.0));
  const pitchHz = `${pitchNum >= 1 ? "+" : ""}${Math.round((pitchNum - 1) * 50)}Hz`;

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceId, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text.trim(), { rate, pitch: pitchHz });

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");

    audioStream.on("data", (chunk: Buffer) => {
      res.write(chunk);
    });

    audioStream.on("close", () => {
      res.end();
    });

    audioStream.on("error", (err: Error) => {
      req.log.error({ err }, "TTS stream error");
      if (!res.headersSent) {
        res.status(500).json({ error: "TTS generation failed" });
      } else {
        res.end();
      }
    });
  } catch (err) {
    req.log.error({ err }, "TTS error");
    if (!res.headersSent) {
      res.status(500).json({ error: "TTS generation failed" });
    }
  }
});

export default ttsRouter;
