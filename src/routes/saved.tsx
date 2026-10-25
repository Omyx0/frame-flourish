import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { btn } from "@/components/brand";
import { SwipeToSave } from "@/components/mobile";
import { MiniCard, OpportunityRow } from "@/components/opportunity-card";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved roles · firstshift" },
      { name: "description", content: "Opportunities you've bookmarked." },
      { property: "og:title", content: "Saved roles · firstshift" },
      { property: "og:description", content: "Opportunities you've bookmarked." },
    ],
  }),
  component: Saved,
});

function Saved() {
  const saved = useStore((s) => s.saved);
  const ops = useStore((s) => s.opportunities);
  const list = ops.filter((o) => saved.includes(o.id));
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="text-4xl font-extrabold sm:text-6xl">Saved</h1>
      {list.length ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:hidden">
            {list.map((o) => <SwipeToSave key={o.id} id={o.id}><MiniCard o={o} /></SwipeToSave>)}
          </div>
          <div className="mt-8 hidden border-t-2 border-frame md:block">{list.map((o) => <OpportunityRow key={o.id} o={o} />)}</div>
        </>
      ) : (
        <div className="mt-10 rounded-lg border-2 border-dashed border-input p-12 text-center">
          <Bookmark className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">Nothing saved yet</p>
          <p className="text-sm text-muted-foreground">Tap the bookmark on any role to keep it here.</p>
          <Link to="/opportunities" className={`${btn("primary")} mt-6`}>Explore roles</Link>
        </div>
      )}
    </div>
  );
}
