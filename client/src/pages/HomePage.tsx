import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, FileCheck2, Search, ArrowUpRight } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { Reveal, btn } from "@/components/brand";
import { SearchBar } from "@/components/filters";
import { FeaturedCard, OpportunityRow, RecentCard, getOppId } from "@/components/opportunity-card";
import { FeaturedCardSkeleton, useDelayedLoading } from "@/components/common/Skeleton";
import { opportunityService, DOMAINS, type Opportunity } from "@/services/opportunityService";

export function HomePage() {
  const [q, setQ] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [domainCounts, setDomainCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const showSkeleton = useDelayedLoading(loading, 300);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const [res, dCounts] = await Promise.all([
          opportunityService.list({ limit: 12 }),
          opportunityService.getDomainCounts().catch(() => ({})),
        ]);
        setOpportunities(res.data);
        if (dCounts) setDomainCounts(dCounts);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeData();
  }, []);

  const recent = [...opportunities].sort((a, b) => {
    const da = a.createdAt || "";
    const db = b.createdAt || "";
    return db.localeCompare(da);
  });
  const recent6 = recent.slice(0, 6);
  const recentPairs = Array.from({ length: Math.ceil(recent6.length / 2) }, (_, i) =>
    recent6.slice(i * 2, i * 2 + 2)
  );

  const counts = DOMAINS.map((d) => ({
    d,
    n: domainCounts[d] ?? opportunities.filter((o) => o.domain === d).length,
  }));

  const go = () => {
    navigate(q ? `/opportunities?search=${encodeURIComponent(q)}` : "/opportunities");
  };

  const firstRole = opportunities[0];

  return (
    <>
      {/* HERO */}
      <section className="grid-paper relative overflow-hidden border-b-2 border-frame">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-sm border-2 border-frame bg-card px-2.5 py-1 text-xs font-bold uppercase tracking-widest shadow-hard-sm">
              <span className="size-2 rounded-full bg-primary" /> {opportunities.length} open roles active
            </p>
            <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[0.92] sm:text-7xl lg:text-[5.6rem]">
              Skip the
              <br className="sm:hidden" /> noise.
              <br />
              Land your{" "}
              <span className="relative inline-block text-primary">
                first
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path d="M2 9 C 50 2, 150 2, 198 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              role.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              Internships and graduate jobs with pay, deadline and location up front, so you spend time applying, not decoding listings.
            </p>
            <div className="mt-5 sm:mt-8 max-w-xl">
              <SearchBar big value={q} onChange={setQ} onSubmit={go} />
              <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 text-sm sm:mx-0 sm:flex-wrap sm:px-0">
                <span className="shrink-0 py-1 text-muted-foreground">Try:</span>
                {["Frontend", "Data analyst", "Design", "Remote"].map((t) => (
                  <button
                    key={t}
                    onClick={() => navigate(`/opportunities?search=${encodeURIComponent(t)}`)}
                    className="shrink-0 rounded-sm border border-border bg-card px-2.5 py-1 transition-colors hover:border-primary hover:text-primary cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Framed preview collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none pb-6 sm:pb-8">
            <div className="relative ml-auto w-[78%] overflow-hidden rounded-lg border-2 border-frame shadow-hard-lg">
              <img
                src={hero}
                alt="Graduate walking through an office on her first day"
                width={896}
                height={1152}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            {/* swinging tag */}
            <div className="animate-swing absolute -top-2 left-[12%] z-30 hidden sm:block" aria-hidden>
              <div className="mx-auto h-8 w-0.5 bg-frame" />
              <div className="rounded-md border-2 border-frame bg-highlight px-3 py-2 text-center font-display text-sm font-extrabold leading-tight text-primary-foreground shadow-hard-sm dark:text-burgundy-foreground">
                NOW
                <br />
                HIRING
              </div>
            </div>
            {firstRole && (
              <Link
                to={`/opportunities/${getOppId(firstRole)}`}
                className="absolute -bottom-4 left-0 z-20 w-[78%] sm:w-[68%] rounded-lg border-2 border-frame bg-card/95 backdrop-blur-md p-4 shadow-hard frame-lift"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Closing soon</p>
                <p className="mt-1 font-display text-base sm:text-lg font-bold leading-tight line-clamp-2">{firstRole.title}</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground truncate">{firstRole.companyName} · {firstRole.pay || "Stipend"}</p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURED / RECENT GRID */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Featured roles</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-5xl">Curated early-career listings</h2>
          </div>
          <Link to="/opportunities" className={btn("outline", "sm")}>
            View all ({opportunities.length}) <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading && showSkeleton ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <FeaturedCardSkeleton key={i} />
            ))}
          </div>
        ) : loading ? (
          <div className="min-h-[250px]" aria-busy="true" />
        ) : opportunities.length === 0 ? (
          <div className="mt-10 rounded-lg border-2 border-dashed border-input p-12 text-center text-muted-foreground">
            No opportunities found yet. If you are an admin, sign in to add listings.
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.slice(0, 6).map((o) => (
              <FeaturedCard key={getOppId(o)} o={o} />
            ))}
          </div>
        )}
      </section>

      {/* DOMAINS STRIP */}
      <section className="border-y-2 border-frame bg-ink py-16 text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Browse by domain</h2>
            <Link to="/domains" className="text-sm font-semibold text-highlight hover:underline">
              All categories →
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {counts.map(({ d, n }) => (
              <Link
                key={d}
                to={`/opportunities?domain=${encodeURIComponent(d)}`}
                className="group flex flex-col justify-between rounded-md border border-ink-foreground/20 bg-ink p-4 transition-colors hover:border-highlight"
              >
                <span className="font-display text-base font-bold leading-snug group-hover:text-highlight sm:text-lg">
                  {d}
                </span>
                <span className="mt-4 text-xs opacity-60">{n} roles</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
