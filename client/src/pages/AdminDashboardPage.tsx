import { useEffect, useState, useRef } from "react";
import { Pencil, Plus, Trash2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Logo, Spinner, btn } from "@/components/brand";
import { Deadline, Tag, getOppId, getCompanyName } from "@/components/opportunity-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { OpportunityForm } from "@/components/forms/OpportunityForm";
import { opportunityService, type Opportunity } from "@/services/opportunityService";
import { applicationService, type Application } from "@/services/applicationService";
import { cn } from "@/utils/utils";

const blank: Partial<Opportunity> = {
  title: "",
  companyName: "",
  domain: "Software Engineering",
  location: "",
  workMode: "On-site",
  type: "Internship",
  pay: "",
  deadline: "",
  description: "",
  responsibilities: [],
  requirements: [],
};

export function AdminDashboardPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Opportunity> | null>(null);
  
  // Pending deletions map: id -> { opportunity: Opportunity, index: number, timer: NodeJS.Timeout }
  const pendingDeletionsRef = useRef<Map<string, { opp: Opportunity; index: number; timer: NodeJS.Timeout }>>(new Map());

  const loadData = async () => {
    try {
      const [oppRes, appRes] = await Promise.all([
        opportunityService.list({ limit: 100 }),
        applicationService.list({ limit: 100 }),
      ]);
      setOpportunities(oppRes.data);
      setApplications(appRes.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      // Flush any pending deletions on unmount
      pendingDeletionsRef.current.forEach(({ opp, timer }) => {
        clearTimeout(timer);
        const id = getOppId(opp);
        if (id) opportunityService.delete(id).catch(console.error);
      });
    };
  }, []);

  const triggerDeleteWithUndo = (opp: Opportunity) => {
    const id = getOppId(opp);
    if (!id) return;

    // Record original index for clean restoration
    const originalIndex = opportunities.findIndex((o) => getOppId(o) === id);

    // 1. Optimistic instant removal from UI
    setOpportunities((prev) => prev.filter((o) => getOppId(o) !== id));

    // 2. Schedule actual delete after 7 seconds
    const timer = setTimeout(async () => {
      try {
        await opportunityService.delete(id);
        pendingDeletionsRef.current.delete(id);
      } catch (err: any) {
        // Restore if backend delete fails
        setOpportunities((prev) => {
          const next = [...prev];
          next.splice(originalIndex, 0, opp);
          return next;
        });
        toast.error(`Failed to delete "${opp.title}". Restored.`);
        pendingDeletionsRef.current.delete(id);
      }
    }, 7000);

    pendingDeletionsRef.current.set(id, { opp, index: originalIndex, timer });

    // 3. Show Gmail-style Undo toast with role="status"
    toast(`"${opp.title}" removed`, {
      duration: 7000,
      action: {
        label: "Undo",
        onClick: () => {
          const entry = pendingDeletionsRef.current.get(id);
          if (entry) {
            clearTimeout(entry.timer);
            pendingDeletionsRef.current.delete(id);
            setOpportunities((prev) => {
              const next = [...prev];
              next.splice(entry.index, 0, entry.opp);
              return next;
            });
            toast.success(`Restored "${opp.title}"`, { duration: 3000 });
          }
        },
      },
      // role="status" ensures screen readers announce the reversible action
      description: "You have 7 seconds to undo this action.",
    });
  };

  const getAppCount = (oppId: string) => {
    return applications.filter((a) => {
      const aOppId = typeof a.opportunityId === "object" ? a.opportunityId?._id : a.opportunityId;
      return aOppId === oppId;
    }).length;
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Opportunities</h1>
          <p className="text-sm text-muted-foreground">
            {opportunities.length} listings · {applications.length} applications
          </p>
        </div>
        <button
          onClick={() => setEditing(blank)}
          className={cn(btn("primary"), "cursor-pointer")}
        >
          <Plus className="size-4" /> New opportunity
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : opportunities.length === 0 ? (
        <div className="mt-8 rounded-lg border-2 border-dashed border-input p-12 text-center text-muted-foreground">
          No opportunities yet. Click &quot;New opportunity&quot; above to create your first listing.
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-8 hidden overflow-hidden rounded-lg bg-card frame md:block shadow-hard-sm">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Role</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3">Apps</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {opportunities.map((o) => {
                  const id = getOppId(o);
                  const company = getCompanyName(o);
                  return (
                    <tr key={id} className="border-t border-border hover:bg-muted/50">
                      <td className="p-3">
                        <p className="font-semibold">{o.title}</p>
                        <p className="text-muted-foreground">{company}</p>
                      </td>
                      <td className="p-3">
                        <Tag>{o.type}</Tag>
                      </td>
                      <td className="p-3">{o.location}</td>
                      <td className="p-3">
                        <Deadline deadline={o.deadline} />
                      </td>
                      <td className="p-3 tabular-nums font-semibold">{getAppCount(id)}</td>
                      <td className="p-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditing(o)}
                            className={cn(btn("ghost", "sm"), "cursor-pointer")}
                            aria-label={`Edit ${o.title}`}
                          >
                            <Pencil className="size-4" />
                          </button>
                          <button
                            onClick={() => triggerDeleteWithUndo(o)}
                            className={cn(btn("ghost", "sm"), "text-destructive cursor-pointer")}
                            aria-label={`Delete ${o.title} (reversible)`}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="mt-6 space-y-3 md:hidden">
            {opportunities.map((o) => {
              const id = getOppId(o);
              const company = getCompanyName(o);
              return (
                <li key={id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex gap-3">
                    <Logo initials={o.companyInitials} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold leading-tight">{o.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {company} · {o.location}
                      </p>
                      <p className="mt-1 text-xs">
                        <Deadline deadline={o.deadline} />
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setEditing(o)}
                      className={cn(btn("outline", "sm"), "cursor-pointer")}
                    >
                      <Pencil className="size-4" /> Edit
                    </button>
                    <button
                      onClick={() => triggerDeleteWithUndo(o)}
                      className={cn(btn("outline", "sm"), "text-destructive cursor-pointer")}
                    >
                      <Trash2 className="size-4" /> Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Opportunity Edit/Create Modal */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-2 border-frame shadow-hard-lg sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing?._id || editing?.id ? "Edit opportunity" : "New opportunity"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <OpportunityForm
              initial={editing}
              onDone={() => {
                setEditing(null);
                loadData();
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminDashboardPage;
