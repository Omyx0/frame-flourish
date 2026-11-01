import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchX, SlidersHorizontal, Loader2 } from "lucide-react";
import { btn } from "@/components/brand";
import { ChipGroup, SearchBar } from "@/components/filters";
import { OpportunityRow, MiniCard, getOppId } from "@/components/opportunity-card";
import { SwipeToSave } from "@/components/mobile";
import {
  opportunityService,
  DOMAINS,
  TYPES,
  MODES,
  type Opportunity,
  type EmploymentType,
  type WorkMode,
} from "@/services/opportunityService";
import { cn } from "@/utils/utils";

export function OpportunitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const qParam = searchParams.get("search") || "";
  const domainParam = searchParams.get("domain") || "";
  const typeParam = (searchParams.get("type") as EmploymentType) || "";
  const modeParam = (searchParams.get("mode") as WorkMode) || "";
  const locParam = searchParams.get("location") || "";

  const [q, setQ] = useState(qParam);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Sync input with search parameter
  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  // Debounced search input to query params
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (q.trim()) next.set("search", q.trim());
        else next.delete("search");
        return next;
      }, { replace: true });
    }, 300);
    return () => clearTimeout(timer);
  }, [q, setSearchParams]);

  // Fetch opportunities whenever query params change
  useEffect(() => {
    async function loadOpportunities() {
      setLoading(true);
      try {
        const res = await opportunityService.list({
          search: qParam || undefined,
          domain: domainParam || undefined,
          type: typeParam || undefined,
          mode: modeParam || undefined,
          location: locParam || undefined,
          limit: 50,
        });
        setOpportunities(res.data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, [qParam, domainParam, typeParam, modeParam, locParam]);

  const setFilter = (key: string, val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val) next.set(key, val);
      else next.delete(key);
      return next;
    }, { replace: true });
  };

  const clearAll = () => {
    setQ("");
    setSearchParams({}, { replace: true });
  };

  const activeCount = [domainParam, typeParam, modeParam, locParam].filter(Boolean).length;

  const locations = useMemo(() => {
    const locs = opportunities.map((o) => o.location).filter(Boolean);
    return [...new Set(locs)].sort();
  }, [opportunities]);

  const filters = (
    <div className="space-y-6">
      <ChipGroup
        label="Domain"
        options={DOMAINS}
        value={domainParam}
        onChange={(v) => setFilter("domain", v)}
      />
      <ChipGroup
        label="Employment Type"
        options={TYPES}
        value={typeParam}
        onChange={(v) => setFilter("type", v)}
      />
      <ChipGroup
        label="Work Mode"
        options={MODES}
        value={modeParam}
        onChange={(v) => setFilter("mode", v)}
      />
      {locations.length > 0 && (
        <ChipGroup
          label="Location"
          options={locations}
          value={locParam}
          onChange={(v) => setFilter("location", v)}
        />
      )}
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
            <button
              onClick={() => setShowFilters((s) => !s)}
              className={btn("outline", "sm")}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-4" /> Filters {activeCount > 0 && `(${activeCount})`}
            </button>
            {(activeCount > 0 || q) && (
              <button onClick={clearAll} className="text-sm font-semibold text-primary cursor-pointer">
                Clear all
              </button>
            )}
          </div>
          <div className={cn("mt-5 lg:mt-0 lg:block", !showFilters && "hidden")}>{filters}</div>
          {(activeCount > 0 || q) && (
            <button
              onClick={clearAll}
              className={cn(btn("ghost", "sm"), "mt-6 hidden text-primary lg:inline-flex")}
            >
              Clear all filters
            </button>
          )}
        </aside>

        <section aria-live="polite">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{opportunities.length}</span>{" "}
              {opportunities.length === 1 ? "role" : "roles"} found
              <span className="ml-2 text-xs md:hidden">· swipe right to save</span>
            </p>
            {loading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-lg border border-border bg-card/60" />
              ))}
            </div>
          ) : opportunities.length === 0 ? (
            <div className="grid place-items-center rounded-lg border-2 border-dashed border-input p-12 text-center">
              <SearchX className="size-10 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-bold">No matching roles</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try widening your search terms or clearing some active filters.
              </p>
              <button onClick={clearAll} className={cn(btn("primary"), "mt-6")}>
                Reset search
              </button>
            </div>
          ) : (
            <>
              {/* Desktop rows */}
              <div className="hidden border-t-2 border-frame md:block">
                {opportunities.map((o) => (
                  <OpportunityRow key={getOppId(o)} o={o} />
                ))}
              </div>
              {/* Mobile swipe grid */}
              <div className="grid grid-cols-2 gap-2.5 md:hidden">
                {opportunities.map((o) => {
                  const id = getOppId(o);
                  return (
                    <SwipeToSave key={id} id={id}>
                      <MiniCard o={o} />
                    </SwipeToSave>
                  );
                })}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default OpportunitiesPage;
