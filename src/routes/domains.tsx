import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DOMAINS } from "@/lib/data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/domains")({
  head: () => ({
    meta: [
      { title: "Career domains · firstshift" },
      { name: "description", content: "Browse internships and jobs by career domain." },
      { property: "og:title", content: "Career domains · firstshift" },
      { property: "og:description", content: "Browse internships and jobs by career domain." },
    ],
  }),
  component: Domains,
});

function Domains() {
  const ops = useStore((s) => s.opportunities);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold sm:text-6xl">Domains</h1>
      <ul className="mt-10 border-t-2 border-frame">
        {DOMAINS.map((d, i) => {
          const n = ops.filter((o) => o.domain === d).length;
          return (
            <li key={d}>
              <Link to="/opportunities" search={{ domain: d }} className="group flex items-center gap-4 border-b border-border py-6 transition-colors hover:text-primary">
                <span className="w-8 text-sm text-muted-foreground">0{i + 1}</span>
                <span className="flex-1 font-display text-2xl font-bold sm:text-5xl">{d}</span>
                <span className="text-sm text-muted-foreground">{n} open</span>
                <ArrowUpRight className="size-6 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
