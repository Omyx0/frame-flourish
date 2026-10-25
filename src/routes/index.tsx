import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, FileCheck2, Search } from "lucide-react";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { Reveal, btn } from "@/components/brand";
import { SearchBar } from "@/components/filters";
import { FeaturedCard, OpportunityRow, RecentCard } from "@/components/opportunity-card";
import { DOMAINS } from "@/lib/data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "firstshift · Find your first internship or graduate job" },
      { name: "description", content: "Search internships and early-career roles by domain, location and type. Apply in minutes." },
      { property: "og:title", content: "firstshift · Find your first internship or graduate job" },
      { property: "og:description", content: "Search internships and early-career roles by domain, location and type." },
    ],
  }),
  component: Home,
});

function Home() {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  const ops = useStore((s) => s.opportunities);
  const recent = [...ops].sort((a, b) => b.postedAt.localeCompare(a.postedAt));
  const recent6 = recent.slice(0, 6);
  const recentPairs = Array.from({ length: Math.ceil(recent6.length / 2) }, (_, i) => recent6.slice(i * 2, i * 2 + 2));
  const counts = DOMAINS.map((d) => ({ d, n: ops.filter((o) => o.domain === d).length }));
  const go = () => nav({ to: "/opportunities", search: { q: q || undefined } });

  return (
    <>
      {/* HERO */}
      <section className="grid-paper relative overflow-hidden border-b-2 border-frame">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:pb-20 lg:pt-16">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-sm border-2 border-frame bg-card px-2.5 py-1 text-xs font-bold uppercase tracking-widest shadow-hard-sm">
              <span className="size-2 rounded-full bg-primary" /> {ops.length} open roles this week
            </p>
            <h1 className="mt-4 text-[2.8rem] font-extrabold leading-[0.92] sm:text-7xl lg:text-[5.6rem]">
              Skip the
              <br className="sm:hidden" /> noise.
              <br />
              Land your{" "}
              <span className="relative inline-block text-primary">
                first
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 9 C 50 2, 150 2, 198 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{" "}
              role.
            </h1>
            <p className="mt-6 max-w-lg text-base text-muted-foreground sm:text-lg">
              Internships and graduate jobs with the pay, deadline and location up front, so you spend time applying, not decoding listings.
            </p>
            <div className="mt-5 sm:mt-8 max-w-xl">
              <SearchBar big value={q} onChange={setQ} onSubmit={go} />
              <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 text-sm sm:mx-0 sm:flex-wrap sm:px-0">
                <span className="shrink-0 py-1 text-muted-foreground">Try:</span>
                {["Frontend", "Data analyst", "Design", "Remote"].map((t) => (
                  <button key={t} onClick={() => nav({ to: "/opportunities", search: { q: t } })} className="shrink-0 rounded-sm border border-border bg-card px-2.5 py-1 transition-colors hover:border-primary hover:text-primary">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Framed preview collage */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative ml-auto w-[78%] overflow-hidden rounded-lg border-2 border-frame shadow-hard-lg">
              <img src={hero} alt="Graduate walking through an office on her first day" width={896} height={1152} className="aspect-[4/5] w-full object-cover" />
            </div>
            {/* swinging tag */}
            <div className="animate-swing absolute -top-2 left-[14%] hidden sm:block" aria-hidden>
              <div className="mx-auto h-8 w-0.5 bg-frame" />
              <div className="rounded-md border-2 border-frame bg-highlight px-3 py-2 text-center font-display text-sm font-extrabold leading-tight text-primary-foreground shadow-hard-sm dark:text-burgundy-foreground">
                NOW
                <br />
                HIRING
              </div>
            </div>
            {ops[0] && (
              <Link
                to="/opportunities/$id"
                params={{ id: ops[0].id }}
                className="absolute -bottom-6 left-0 w-[70%] rounded-lg bg-card p-4 frame frame-lift sm:w-[60%]"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Closing soon</p>
                <p className="mt-1 font-display text-lg font-bold leading-tight">{ops[0].title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{ops[0].company} · {ops[0].pay}</p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* DOMAIN STRIP — colour block */}
      <section className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-14">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 className="text-3xl font-extrabold sm:text-5xl">
              Browse by <span className="text-highlight">domain</span>
            </h2>
            <Link to="/domains" className="group inline-flex items-center gap-2 text-sm font-semibold hover:text-highlight">
              All domains <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-6 sm:mt-10 grid grid-cols-2 border-l border-t border-ink-foreground/20 md:grid-cols-3">
            {counts.map(({ d, n }, i) => (
              <Link
                key={d}
                to="/opportunities"
                search={{ domain: d }}
                className={cn(
                  "group flex min-h-32 flex-col justify-between border-b border-r border-ink-foreground/20 p-4 transition-colors hover:bg-burgundy hover:text-burgundy-foreground sm:p-6",
                  i === 0 && "col-span-2 md:min-h-40",
                )}
              >
                <span className="text-xs opacity-60">0{i + 1}</span>
                <div className="flex items-end justify-between gap-2">
                  <span className={cn("font-display font-bold leading-tight", i === 0 ? "text-2xl sm:text-4xl" : "text-lg sm:text-2xl")}>{d}</span>
                  <span className="text-sm tabular-nums opacity-70">{n}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED — asymmetric */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-[1fr_2fr]">
          <Reveal className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Editor's picks</p>
            <h2 className="mt-3 text-4xl font-extrabold leading-none sm:text-5xl">Roles worth your weekend.</h2>
            <p className="mt-4 max-w-sm text-muted-foreground">Clear pay, real responsibilities, and teams that train juniors.</p>
            <Link to="/opportunities" className={cn(btn("ink"), "mt-6")}>
              See all roles <ArrowRight className="size-4" />
            </Link>
          </Reveal>
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {ops.slice(0, 4).map((o, i) => (
              <Reveal key={o.id} delay={i * 80} className={cn(i % 2 === 1 && "sm:translate-y-10")}>
                <FeaturedCard o={o} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* RECENT — list */}
      <section className="border-y border-border bg-card/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-extrabold sm:text-4xl">Recently added</h2>
            <Link to="/opportunities" className="text-sm font-semibold text-primary hover:underline">View all</Link>
          </div>
          <p className="mt-1 text-xs text-muted-foreground md:hidden">Swipe to browse</p>
          <div className="no-scrollbar -mx-4 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-3 md:hidden">
            {recentPairs.map((pair, i) => (
              <div key={i} className="grid w-full shrink-0 snap-start grid-cols-2 gap-3">
                {pair.map((o, j) => <RecentCard key={o.id} o={o} index={i * 2 + j} />)}
              </div>
            ))}
          </div>
          <div className="mt-6 hidden border-t-2 border-frame md:block">
            {recent.slice(0, 5).map((o) => (
              <OpportunityRow key={o.id} o={o} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-20">
        <h2 className="max-w-xl text-3xl font-extrabold sm:text-5xl">Three steps. No account maze.</h2>
        <ol className="mt-6 sm:mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-lg border-2 border-frame bg-frame">
          {[
            { icon: Search, t: "Search & filter", d: "Narrow by domain, city, work mode and type in seconds." },
            { icon: BriefcaseBusiness, t: "Read the full brief", d: "Pay, deadline, responsibilities and requirements on one page." },
            { icon: FileCheck2, t: "Apply in minutes", d: "Share your résumé link and a short note. That's it." },
          ].map((s, i) => (
            <li key={s.t} className={cn("bg-card p-3 sm:p-8", i === 1 && "bg-accent text-accent-foreground")}>
              <div className="flex items-center justify-between">
                <s.icon className="size-4 sm:size-6" />
                <span className="font-display text-2xl font-extrabold opacity-15 sm:text-5xl">{i + 1}</span>
              </div>
              <h3 className="mt-4 text-[13px] font-bold leading-tight sm:mt-8 sm:text-xl">{s.t}</h3>
              <p className="mt-1.5 text-[10px] leading-snug opacity-80 sm:mt-2 sm:text-sm">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-lg border-2 border-frame bg-burgundy p-5 text-burgundy-foreground shadow-hard-red sm:p-12">
          <div className="grid items-center gap-6 md:grid-cols-[2fr_1fr]">
            <div>
              <h2 className="text-3xl font-extrabold sm:text-5xl">Hiring students or graduates?</h2>
              <p className="mt-3 max-w-lg opacity-80">Post an opening and review applications from one dashboard.</p>
            </div>
            <Link to="/admin" className={cn(btn("primary", "lg"), "md:justify-self-end")}>
              Post a role <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
