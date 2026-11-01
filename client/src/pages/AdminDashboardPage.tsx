import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo, Spinner, btn } from "@/components/brand";
import { Deadline, Tag, getOppId, getCompanyName } from "@/components/opportunity-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [delTarget, setDelTarget] = useState<Opportunity | null>(null);
  const [deleting, setDeleting] = useState(false);

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
  }, []);

  const handleDelete = async () => {
    if (!delTarget) return;
    const id = getOppId(delTarget);
    setDeleting(true);
    try {
      await opportunityService.delete(id);
      toast.success("Opportunity deleted");
      setDelTarget(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete opportunity");
    } finally {
      setDeleting(false);
    }
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
                            onClick={() => setDelTarget(o)}
                            className={cn(btn("ghost", "sm"), "text-destructive cursor-pointer")}
                            aria-label={`Delete ${o.title}`}
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
                      onClick={() => setDelTarget(o)}
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

      {/* Delete confirmation alert */}
      <AlertDialog open={!!delTarget} onOpenChange={(v) => !v && setDelTarget(null)}>
        <AlertDialogContent className="border-2 border-frame shadow-hard-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{delTarget?.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the listing from the database. Existing candidate applications will remain safely preserved in the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-burgundy"
              onClick={handleDelete}
            >
              {deleting ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default AdminDashboardPage;
