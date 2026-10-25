import { useSyncExternalStore } from "react";
import { SEED_OPPORTUNITIES, type Application, type Opportunity } from "./data";

// Local demo store backed by localStorage. Async helpers simulate a server round-trip.
interface State {
  opportunities: Opportunity[];
  applications: Application[];
  saved: string[];
}
const KEY = "intern-portal-v1";
const seed: State = { opportunities: SEED_OPPORTUNITIES, applications: [], saved: [] };
let state: State = seed;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...seed, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
}
function set(next: State) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}
const wait = (ms = 700) => new Promise((r) => setTimeout(r, ms));

export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return sel(state);
    },
    () => sel(seed),
  );
}

export const api = {
  async submitApplication(a: Omit<Application, "id" | "status" | "submittedAt">) {
    await wait(900);
    if (a.email.toLowerCase().endsWith("@fail.test")) throw new Error("The server rejected this submission.");
    const app: Application = { ...a, id: crypto.randomUUID(), status: "New", submittedAt: new Date().toISOString() };
    set({ ...state, applications: [app, ...state.applications] });
    return app;
  },
  async saveOpportunity(o: Opportunity) {
    await wait(500);
    const exists = state.opportunities.some((x) => x.id === o.id);
    set({
      ...state,
      opportunities: exists ? state.opportunities.map((x) => (x.id === o.id ? o : x)) : [o, ...state.opportunities],
    });
  },
  async deleteOpportunity(id: string) {
    await wait(400);
    set({ ...state, opportunities: state.opportunities.filter((x) => x.id !== id) });
  },
  async setStatus(id: string, status: Application["status"]) {
    set({ ...state, applications: state.applications.map((a) => (a.id === id ? { ...a, status } : a)) });
  },
  toggleSaved(id: string) {
    const saved = state.saved.includes(id) ? state.saved.filter((x) => x !== id) : [...state.saved, id];
    set({ ...state, saved });
  },
};

export function daysLeft(deadline?: string) {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000);
}
export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
