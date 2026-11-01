import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark, Loader2 } from "lucide-react";
import { btn } from "@/components/brand";
import { SwipeToSave } from "@/components/mobile";
import { MiniCard, OpportunityRow, getOppId } from "@/components/opportunity-card";
import { useSaved } from "@/context/SavedContext";
import { opportunityService, type Opportunity } from "@/services/opportunityService";

export function SavedPage() {
  const { saved } = useSaved();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpportunities() {
      try {
        const res = await opportunityService.list({ limit: 100 });
        setOpportunities(res.data);
      } catch (err) {
        console.error("Failed to load opportunities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, []);

  const bookmarked = opportunities.filter((o) => saved.includes(getOppId(o)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <p className="text-xs font-bold uppercase tracking-widest text-primary">Bookmarks</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-6xl">Saved roles</h1>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : bookmarked.length > 0 ? (
        <>
          <p className="mt-3 text-sm text-muted-foreground">
            {bookmarked.length} {bookmarked.length === 1 ? "role" : "roles"} saved on this device.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2.5 md:hidden">
            {bookmarked.map((o) => {
              const id = getOppId(o);
              return (
                <SwipeToSave key={id} id={id}>
                  <MiniCard o={o} />
                </SwipeToSave>
              );
            })}
          </div>
          <div className="mt-8 hidden border-t-2 border-frame md:block">
            {bookmarked.map((o) => (
              <OpportunityRow key={getOppId(o)} o={o} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-lg border-2 border-dashed border-input p-12 text-center">
          <Bookmark className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">Nothing saved yet</p>
          <p className="text-sm text-muted-foreground">
            Tap the bookmark icon on any opportunity to save it here for later.
          </p>
          <Link to="/opportunities" className={`${btn("primary")} mt-6`}>
            Explore roles
          </Link>
        </div>
      )}
    </div>
  );
}

export default SavedPage;
