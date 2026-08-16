import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export type VoiceStatus = "idle" | "listening" | "denied" | "error" | "unsupported";

/**
 * Small wrapper around the browser's speech recognition.
 * Returns live transcript text and a status the UI can show in plain language.
 */
export function useVoiceInput({
  onResult,
  lang = "en-US",
}: {
  onResult?: (transcript: string, isFinal: boolean) => void;
  lang?: string;
} = {}) {
  const [supported, setSupported] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const cbRef = useRef(onResult);
  cbRef.current = onResult;

  useEffect(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      setStatus("unsupported");
      return;
    }
    setSupported(true);
    setStatus("idle");

    const rec = new Ctor();
    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 3;

    rec.onstart = () => setStatus("listening");
    rec.onresult = (e: any) => {
      let text = "";
      let isFinal = false;
      for (let i = e.resultIndex; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
        if (e.results[i].isFinal) isFinal = true;
      }
      const clean = text.trim();
      setTranscript(clean);
      cbRef.current?.(clean, isFinal);
    };
    rec.onerror = (e: any) => {
      const err = String(e?.error ?? "");
      if (err === "not-allowed" || err === "service-not-allowed") setStatus("denied");
      else if (err === "aborted" || err === "no-speech") setStatus("idle");
      else setStatus("error");
    };
    rec.onend = () => setStatus((s) => (s === "listening" ? "idle" : s));

    recRef.current = rec;
    return () => {
      rec.onresult = null;
      rec.onerror = null;
      rec.onend = null;
      rec.onstart = null;
      try {
        rec.abort();
      } catch {
        /* already stopped */
      }
      recRef.current = null;
    };
  }, [lang]);

  const start = useCallback(() => {
    const rec = recRef.current;
    if (!rec) return;
    setTranscript("");
    try {
      rec.start();
      setStatus("listening");
    } catch {
      /* already listening */
    }
  }, []);

  const stop = useCallback(() => {
    try {
      recRef.current?.stop();
    } catch {
      /* not started */
    }
    setStatus("idle");
  }, []);

  return { supported, status, transcript, start, stop };
}

const YES = ["yes", "yeah", "yep", "yup", "taken", "took", "i took", "i have", "ive taken", "i've taken", "done", "swallowed", "ok", "okay", "sure", "confirm"];
const NO = ["no", "not yet", "later", "nope", "wait", "not now"];

export function matchesYes(text: string) {
  const t = text.toLowerCase().replace(/[^a-z\s']/g, " ");
  if (NO.some((n) => t.includes(n))) return false;
  return YES.some((y) => t.includes(y));
}

export function matchesNo(text: string) {
  const t = text.toLowerCase().replace(/[^a-z\s']/g, " ");
  return NO.some((n) => t.includes(n));
}
