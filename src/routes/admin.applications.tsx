import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Inbox } from "lucide-react";
import type { Application } from "@/lib/data";
import { api, fmtDate, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/applications")({ component: Applications });

const STATUSES: Application["status"][] = ["New", "Reviewing", "Shortlisted", "Rejected"];
const tone: Record<Application["status"], string> = {
  New: "border-primary text-primary",
  Reviewing: "border-input text-foreground",
  Shortlisted: "border-success text-success",
  Rejected: "border-border text-muted-foreground",
};

function Applications() {
  const apps = useStore((s) => s.applications);
  const ops = useStore((s) => s.opportunities);
  const title = (id: string) => ops.find((o) => o.id === id)?.title ?? "Removed listing";

  return (
    <>
      <h1 className="text-3xl font-extrabold sm:text-4xl">Applications</h1>
      <p className="text-sm text-muted-foreground">{apps.length} received</p>
      {apps.length === 0 ? (
        <div className="mt-8 grid place-items-center rounded-lg border-2 border-dashed border-input p-12 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No applications yet</p>
          <p className="text-sm text-muted-foreground">Submissions from candidates will appear here.</p>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-border overflow-hidden rounded-lg bg-card frame">
          {apps.map((a) => (
            <li key={a.id} className="grid gap-3 p-4 md:grid-cols-[1.5fr_1.5fr_auto_auto] md:items-center">
              <div>
                <p className="font-semibold">{a.name}</p>
                <p className="text-sm text-muted-foreground break-all">{a.email} · {a.phone}</p>
              </div>
              <div className="text-sm">
                <p className="font-medium">{title(a.opportunityId)}</p>
                <p className="text-muted-foreground">{fmtDate(a.submittedAt)}</p>
              </div>
              <a href={a.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                Résumé <ExternalLink className="size-3.5" />
              </a>
              <select
                aria-label={`Status for ${a.name}`}
                value={a.status}
                onChange={(e) => api.setStatus(a.id, e.target.value as Application["status"])}
                className={cn("h-9 rounded-full border-2 bg-card px-3 text-sm font-semibold", tone[a.status])}
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              {a.coverLetter && <p className="text-sm text-muted-foreground md:col-span-4">"{a.coverLetter}"</p>}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
