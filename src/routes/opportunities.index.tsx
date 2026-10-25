import { SwipeToSave } from "@/components/mobile";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { btn } from "@/components/brand";
import { ChipGroup, SearchBar } from "@/components/filters";
import { OpportunityRow, MiniCard } from "@/components/opportunity-card";
import { DOMAINS, MODES, TYPES, type EmploymentType, type WorkMode } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type S = { q?: string | undefined; domain?: string | undefined; type?: EmploymentType | undefined; mode?: WorkMode | undefined; loc?: string | undefined };

export const Route = createFileRoute("/opportunities/")({
  validateSearch: (s: { q?: unknown; domain?: unknown; type?: unknown; mode?: unknown; loc?: unknown }): S => ({
    q: typeof s.q === "string" ? s.q : undefined,
    domain: typeof s.domain === "string" ? s.domain : undefined,
    type: TYPES.includes(s.type as EmploymentType) ? (s.type as EmploymentType) : undefined,
    mode: MODES.includes(s.mode as WorkMode) ? (s.mode as WorkMode) : undefined,
    loc: typeof s.loc === "string" ? s.loc : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Explore internships & jobs · firstshift" },
      { name: "description", content: "Filter internships and early-career jobs by domain, location, work mode and employment type." },
      { property: "og:title", content: "Explore internships & jobs · firstshift" },
      { property: "og:description", content: "Filter internships and early-career jobs by domain, location and type." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const search = Route.useSearch();
  const nav = useNavigate({ from: "/opportunities/" });
  const ops = useStore((s) => s.opportunities);
  const [q, setQ] = useState(search.q ?? "");
  const dq = useDeferredValue(q);
  const [showFilters, setShowFilters] = useState(false);
  const locations = useMemo(() => [...new Set(ops.map((o) => o.location))].sort(), [ops]);

  useEffect(() => {
    const t = setTimeout(() => nav({ search: (p) => ({ ...p, q: q || undefined }), replace: true }), 250);
    return () => clearTimeout(t);
  }, [q, nav]);

  const set = (patch: Partial<S>) => nav({ search: (p) => ({ ...p, ...patch }), replace: true });
  const results = ops.filter((o) => {
    const term = dq.trim().toLowerCase();
    if (term && ![o.title, o.company, o.domain, o.location, o.workMode, o.description].join(" ").toLowerCase().includes(term)) return false;
    if (search.domain && o.domain !== search.domain) return false;
    if (search.type && o.type !== search.type) return false;
    if (search.mode && o.workMode !== search.mode) return false;
    if (search.loc && o.location !== search.loc) return false;
    return true;
  });
  const active = [search.domain, search.type, search.mode, search.loc].filter(Boolean).length;
  const clear = () => {
    setQ("");
    nav({ search: {}, replace: true });
  };

  const filters = (
    <div className="space-y-6">
      <ChipGroup label="Domain" options={DOMAINS} value={(search.domain as (typeof DOMAINS)[number]) ?? ""} onChange={(v) => set({ domain: v || undefined })} />
      <ChipGroup label="Type" options={TYPES} value={search.type ?? ""} onChange={(v) => set({ type: v || undefined })} />
      <ChipGroup label="Work mode" options={MODES} value={search.mode ?? ""} onChange={(v) => set({ mode: v || undefined })} />
      <ChipGroup label="Location" options={locations} value={search.loc ?? ""} onChange={(v) => set({ loc: v || undefined })} />
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Explore</p>
          <h1 className="mt-2 text-4xl font-extrabold sm:text-6xl">All opportunities</h1>
        </div>
        <div className="w-full md:max-w-md">
          <SearchBar value={q} onChange={setQ} />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between lg:hidden">
            <button onClick={() => setShowFilters((s) => !s)} className={btn("outline", "sm")} aria-expanded={showFilters}>
              <SlidersHorizontal className="size-4" /> Filters {active > 0 && `(${active})`}
            </button>
            {(active > 0 || q) && <button onClick={clear} className="text-sm font-semibold text-primary">Clear all</button>}
          </div>
          <div className={cn("mt-5 lg:mt-0 lg:block", !showFilters && "hidden")}>{filters}</div>
          {(active > 0 || q) && (
            <button onClick={clear} className={cn(btn("ghost", "sm"), "mt-6 hidden text-primary lg:inline-flex")}>Clear all filters</button>
          )}
        </aside>

        <section aria-live="polite">
          <p className="mb-3 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{results.length}</span> {results.length === 1 ? "role" : "roles"} found<span className="ml-2 text-xs md:hidden">· swipe right to save</span>
            {q !== dq && " · searching…"}
          </p>
          {results.length ? (
            <>
              <div className="grid grid-cols-2 gap-2.5 md:hidden">
                {results.map((o) => <SwipeToSave key={o.id} id={o.id}><MiniCard o={o} /></SwipeToSave>)}
              </div>
              <div className="hidden border-t-2 border-frame md:block">
                {results.map((o) => <OpportunityRow key={o.id} o={o} />)}
              </div>
            </>
          ) : (
            <div className="grid place-items-center rounded-lg border-2 border-dashed border-input px-6 py-16 text-center">
              <SearchX className="size-10 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-bold">No matches yet</h2>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">Try a broader keyword or remove a filter or two.</p>
              <button onClick={clear} className={cn(btn("primary"), "mt-6")}>Clear filters</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
