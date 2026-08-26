import { useCallback, useEffect, useState } from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening";

export type Pill = {
  id: string;
  name: string;
  dose: string;
  times: TimeOfDay[];
  note?: string;
  photo?: string; // data URL of reference photo
  fingerprint?: number[];
};

export type DoseLog = {
  id: string;
  pillId: string;
  time: TimeOfDay;
  date: string; // yyyy-mm-dd
  method: "scan" | "voice";
  at: number;
};

export type FamilyMessage = {
  id: string;
  from: string;
  text: string;
  photo?: string;
  video?: string;
  at: number;
  read?: boolean;
};


export type Caregiver = {
  id: string;
  name: string;
  relation: string;
  phone?: string;
};

export type ChatMessage = { id: string; role: "user" | "animo"; text: string; at: number };

export type AnimoState = {
  onboarded: boolean;
  name: string;
  caregiverName: string;
  caregivers: Caregiver[];
  pills: Pill[];
  logs: DoseLog[];
  messages: FamilyMessage[];
  chat: ChatMessage[];
  points: number;
  largeText: boolean;
  voiceOn: boolean;
  darkMode: boolean;
};

const KEY = "animo-state-v1";

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const timeLabel: Record<TimeOfDay, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
};

function daysAgoKey(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return todayKey(d);
}

export const defaultState: AnimoState = {
  onboarded: false,
  name: "Friend",
  caregiverName: "Maria",
  caregivers: [
    { id: "cg1", name: "Maria", relation: "Daughter", phone: "555-0142" },
    { id: "cg2", name: "Tom", relation: "Grandson", phone: "555-0177" },
    { id: "cg3", name: "Sofia", relation: "Neighbour & nurse", phone: "555-0119" },
  ],
  pills: [
    {
      id: "p1",
      name: "Lisinopril",
      dose: "10 mg, one tablet",
      times: ["morning"],
      note: "Small white round tablet",
    },
    {
      id: "p2",
      name: "Vitamin D",
      dose: "1000 IU, one softgel",
      times: ["morning", "evening"],
      note: "Golden softgel",
    },
    {
      id: "p3",
      name: "Metformin",
      dose: "500 mg, one tablet",
      times: ["evening"],
      note: "Oval white tablet",
    },
  ],
  logs: [
    { id: "l1", pillId: "p1", time: "morning", date: daysAgoKey(1), method: "scan", at: Date.now() },
    { id: "l2", pillId: "p2", time: "morning", date: daysAgoKey(1), method: "scan", at: Date.now() },
    { id: "l3", pillId: "p3", time: "evening", date: daysAgoKey(1), method: "voice", at: Date.now() },
    { id: "l4", pillId: "p1", time: "morning", date: daysAgoKey(2), method: "scan", at: Date.now() },
    { id: "l5", pillId: "p2", time: "morning", date: daysAgoKey(2), method: "scan", at: Date.now() },
    { id: "l6", pillId: "p2", time: "evening", date: daysAgoKey(2), method: "scan", at: Date.now() },
    { id: "l7", pillId: "p3", time: "evening", date: daysAgoKey(2), method: "scan", at: Date.now() },
  ],
  messages: [
    {
      id: "m1",
      from: "Maria (daughter)",
      text: "Good morning Dad! The tulips you planted are blooming. Call me after breakfast?",
      at: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: "m2",
      from: "Tom (grandson)",
      text: "Thanks for the birthday card, Grandpa. It made my week!",
      at: Date.now() - 1000 * 60 * 60 * 30,
    },
  ],
  chat: [
    {
      id: "c1",
      role: "animo",
      text: "Hello! I'm Animo. I keep your little garden company. How are you feeling today?",
      at: Date.now() - 1000 * 60 * 60,
    },
  ],
  points: 120,
  largeText: false,
  voiceOn: true,
  darkMode: false,
};

function read(): AnimoState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = { ...defaultState, ...(JSON.parse(raw) as AnimoState) };
    if (!Array.isArray(parsed.caregivers) || parsed.caregivers.length === 0) {
      parsed.caregivers = [{ id: "cg1", name: parsed.caregiverName || "Maria", relation: "Family" }];
    }
    parsed.caregiverName = parsed.caregivers[0]!.name;
    return parsed;
  } catch {
    return defaultState;
  }
}

const EVT = "animo-state-change";

export function useAnimo() {
  const [state, setState] = useState<AnimoState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
    const onChange = () => setState(read());
    window.addEventListener(EVT, onChange);
    return () => window.removeEventListener(EVT, onChange);
  }, []);

  const update = useCallback((fn: (s: AnimoState) => AnimoState) => {
    const next = fn(read());
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(EVT));
  }, []);

  return { state, update, hydrated };
}

/* ---------- care team helpers ---------- */

export function primaryCaregiver(state: AnimoState): Caregiver {
  return state.caregivers[0] ?? { id: "cg1", name: state.caregiverName, relation: "Family" };
}

export function caregiverLabel(c: Caregiver) {
  return c.relation ? `${c.name} (${c.relation.toLowerCase()})` : c.name;
}

export function caregiverNames(state: AnimoState) {
  const names = state.caregivers.map((c) => c.name);
  if (names.length <= 1) return names[0] ?? state.caregiverName;
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/* ---------- derived adherence helpers ---------- */

export function dueToday(state: AnimoState) {
  const out: { pill: Pill; time: TimeOfDay; taken: boolean }[] = [];
  const t = todayKey();
  for (const pill of state.pills) {
    for (const time of pill.times) {
      out.push({
        pill,
        time,
        taken: state.logs.some((l) => l.pillId === pill.id && l.time === time && l.date === t),
      });
    }
  }
  const order: TimeOfDay[] = ["morning", "afternoon", "evening"];
  return out.sort((a, b) => order.indexOf(a.time) - order.indexOf(b.time));
}

export function dayComplete(state: AnimoState, dateKey: string) {
  const expected = state.pills.flatMap((p) => p.times.map((t) => ({ p, t })));
  if (expected.length === 0) return false;
  return expected.every(({ p, t }) =>
    state.logs.some((l) => l.pillId === p.id && l.time === t && l.date === dateKey),
  );
}

export function streak(state: AnimoState) {
  let n = 0;
  for (let i = 0; i < 60; i++) {
    const key = daysAgoKey(i);
    if (dayComplete(state, key)) n++;
    else if (i > 0) break;
  }
  return n;
}

export function weekAdherence(state: AnimoState) {
  const days = Array.from({ length: 7 }, (_, i) => daysAgoKey(6 - i));
  const perDay = state.pills.reduce((a, p) => a + p.times.length, 0) || 1;
  return days.map((date) => {
    const taken = state.logs.filter((l) => l.date === date).length;
    return { date, taken, of: perDay, pct: Math.min(100, Math.round((taken / perDay) * 100)) };
  });
}

export type CompanionState = "celebrating" | "thriving" | "waiting";

export function companionState(state: AnimoState, justTook = false): CompanionState {
  if (justTook) return "celebrating";
  const due = dueToday(state);
  if (due.length > 0 && due.every((d) => d.taken)) return "thriving";
  if (due.some((d) => d.taken)) return "thriving";
  return "waiting";
}

export const companionCopy: Record<CompanionState, { title: string; body: string }> = {
  celebrating: {
    title: "Your garden is glowing",
    body: "Thank you for the visit. Everything here feels a little brighter.",
  },
  thriving: {
    title: "Your garden is doing well",
    body: "Warm and open, just like it likes to be. Come back anytime.",
  },
  waiting: {
    title: "Your garden is waiting for you",
    body: "It's resting quietly. Whenever you're ready, it'll brighten right back up.",
  },
};

/* ---------- pill fingerprint (prototype image matching) ---------- */

export async function fingerprintFromCanvas(canvas: HTMLCanvasElement): Promise<number[]> {
  const size = 8;
  const small = document.createElement("canvas");
  small.width = size;
  small.height = size;
  const ctx = small.getContext("2d")!;
  ctx.drawImage(canvas, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);
  const fp: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    fp.push((data[i] ?? 0) / 255, (data[i + 1] ?? 0) / 255, (data[i + 2] ?? 0) / 255);
  }
  return fp;
}

export async function fingerprintFromDataUrl(url: string): Promise<number[]> {
  const img = new Image();
  img.src = url;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = 128;
  c.height = 128;
  c.getContext("2d")!.drawImage(img, 0, 0, 128, 128);
  return fingerprintFromCanvas(c);
}

/** 0..1 similarity between two fingerprints. */
export function compareFingerprints(a: number[], b: number[]) {
  if (!a?.length || !b?.length || a.length !== b.length) return 0;
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += ((a[i] ?? 0) - (b[i] ?? 0)) ** 2;
  const dist = Math.sqrt(sum / a.length);
  return Math.max(0, 1 - dist * 1.6);
}

export const MATCH_THRESHOLD = 0.82;

export function speak(text: string, enabled = true) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.9;
    u.pitch = 1;
    window.speechSynthesis.speak(u);
  } catch {
    /* ignore */
  }
}

export const uid = () => Math.random().toString(36).slice(2, 10);
