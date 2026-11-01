import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { opportunityService, DOMAINS, type Opportunity } from "@/services/opportunityService";

export function DomainsPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await opportunityService.list({ limit: 100 });
        setOpportunities(res.data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Browse</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-6xl">Career domains</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        Explore roles grouped by discipline. From software engineering to design and business operations.
      </p>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : (
        <ul className="mt-10 border-t-2 border-frame">
          {DOMAINS.map((d, i) => {
            const count = opportunities.filter((o) => o.domain === d).length;
            return (
              <li key={d}>
                <Link
                  to={`/opportunities?domain=${encodeURIComponent(d)}`}
                  className="group flex items-center gap-4 border-b border-border py-6 transition-colors hover:text-primary"
                >
                  <span className="w-8 text-sm text-muted-foreground">0{i + 1}</span>
                  <span className="flex-1 font-display text-2xl font-bold sm:text-5xl">{d}</span>
                  <span className="text-sm text-muted-foreground">{count} open</span>
                  <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default DomainsPage;
