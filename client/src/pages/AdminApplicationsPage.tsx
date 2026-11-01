import { useEffect, useState } from "react";
import { ExternalLink, Inbox, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  applicationService,
  type Application,
  type ApplicationStatus,
} from "@/services/applicationService";
import { opportunityService, type Opportunity } from "@/services/opportunityService";
import { fmtDate, cn } from "@/utils/utils";

const STATUSES: ApplicationStatus[] = ["New", "Reviewing", "Shortlisted", "Rejected"];

const tone: Record<ApplicationStatus, string> = {
  New: "border-primary text-primary",
  Reviewing: "border-input text-foreground",
  Shortlisted: "border-success text-success",
  Rejected: "border-border text-muted-foreground",
};

export function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [appRes, oppRes] = await Promise.all([
        applicationService.list({ limit: 100 }),
        opportunityService.list({ limit: 100 }),
      ]);
      setApplications(appRes.data);
      setOpportunities(oppRes.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (appId: string, status: ApplicationStatus) => {
    try {
      await applicationService.updateStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => ((a._id || a.id) === appId ? { ...a, status } : a))
      );
      toast.success(`Status updated to ${status}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const getOppTitle = (oppIdRef: any) => {
    if (typeof oppIdRef === "object" && oppIdRef?.title) {
      return oppIdRef.title;
    }
    const match = opportunities.find((o) => (o._id || o.id) === oppIdRef);
    return match ? match.title : "Opportunity listing";
  };

  return (
    <>
      <h1 className="text-3xl font-extrabold sm:text-4xl">Applications</h1>
      <p className="text-sm text-muted-foreground">{applications.length} candidates applied</p>

      {loading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : applications.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-lg border-2 border-dashed border-input p-12 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No applications yet</p>
          <p className="text-sm text-muted-foreground">Submissions from candidates will appear here.</p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-lg bg-card frame shadow-hard-sm">
          {applications.map((a) => {
            const id = (a._id || a.id) as string;
            return (
              <li key={id} className="grid gap-3 p-4 md:grid-cols-[1.5fr_1.5fr_auto_auto] md:items-center">
                <div>
                  <p className="font-semibold text-foreground">{a.fullName}</p>
                  <p className="text-sm text-muted-foreground break-all">
                    {a.email} · {a.phone}
                  </p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{getOppTitle(a.opportunityId)}</p>
                  <p className="text-muted-foreground">{fmtDate(a.createdAt)}</p>
                </div>
                <div>
                  {a.resumeUrl ? (
                    <a
                      href={a.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      Resume <ExternalLink className="size-3.5" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">No link provided</span>
                  )}
                </div>
                <div>
                  <select
                    aria-label={`Status for ${a.fullName}`}
                    value={a.status}
                    onChange={(e) => handleStatusChange(id, e.target.value as ApplicationStatus)}
                    className={cn(
                      "h-9 rounded-full border-2 bg-card px-3 text-sm font-semibold outline-none cursor-pointer",
                      tone[a.status]
                    )}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {a.coverLetter && (
                  <p className="text-sm text-muted-foreground italic md:col-span-4 bg-secondary/50 p-2.5 rounded-sm">
                    &quot;{a.coverLetter}&quot;
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

export default AdminApplicationsPage;
