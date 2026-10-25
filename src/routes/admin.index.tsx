import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Logo, Spinner, btn } from "@/components/brand";
import { Deadline, Tag } from "@/components/opportunity-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DOMAINS, MODES, TYPES, type Opportunity } from "@/lib/data";
import { api, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Field, inputCls } from "@/components/form";

type Errs = { [k in "name"|"email"|"phone"|"resumeUrl"|"coverLetter"|"title"|"company"|"location"|"description"]?: string };

export const Route = createFileRoute("/admin/")({ component: AdminOpportunities });

const blank: Opportunity = {
  id: "", title: "", company: "", companyInitials: "", domain: DOMAINS[0], location: "", workMode: "On-site",
  type: "Internship", pay: "", deadline: "", postedAt: "", description: "", responsibilities: [], requirements: [],
};

function AdminOpportunities() {
  const ops = useStore((s) => s.opportunities);
  const apps = useStore((s) => s.applications);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [del, setDel] = useState<Opportunity | null>(null);
  const [deleting, setDeleting] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Opportunities</h1>
          <p className="text-sm text-muted-foreground">{ops.length} listings · {apps.length} applications</p>
        </div>
        <button onClick={() => setEditing(blank)} className={btn("primary")}><Plus className="size-4" /> New opportunity</button>
      </div>

      {ops.length === 0 ? (
        <div className="mt-8 rounded-lg border-2 border-dashed border-input p-12 text-center text-muted-foreground">No opportunities yet. Create your first listing.</div>
      ) : (
        <>
          {/* desktop table */}
          <div className="mt-8 hidden overflow-hidden rounded-lg bg-card frame md:block">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-3">Role</th><th className="p-3">Type</th><th className="p-3">Location</th>
                  <th className="p-3">Deadline</th><th className="p-3">Apps</th><th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {ops.map((o) => (
                  <tr key={o.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-3"><p className="font-semibold">{o.title}</p><p className="text-muted-foreground">{o.company}</p></td>
                    <td className="p-3"><Tag>{o.type}</Tag></td>
                    <td className="p-3">{o.location}</td>
                    <td className="p-3"><Deadline deadline={o.deadline || undefined} /></td>
                    <td className="p-3 tabular-nums">{apps.filter((a) => a.opportunityId === o.id).length}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(o)} className={btn("ghost", "sm")} aria-label={`Edit ${o.title}`}><Pencil className="size-4" /></button>
                        <button onClick={() => setDel(o)} className={cn(btn("ghost", "sm"), "text-destructive")} aria-label={`Delete ${o.title}`}><Trash2 className="size-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* mobile cards */}
          <ul className="mt-6 space-y-3 md:hidden">
            {ops.map((o) => (
              <li key={o.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex gap-3">
                  <Logo initials={o.companyInitials} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold leading-tight">{o.title}</p>
                    <p className="text-sm text-muted-foreground">{o.company} · {o.location}</p>
                    <p className="mt-1 text-xs"><Deadline deadline={o.deadline || undefined} /></p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button onClick={() => setEditing(o)} className={btn("outline", "sm")}><Pencil className="size-4" /> Edit</button>
                  <button onClick={() => setDel(o)} className={cn(btn("outline", "sm"), "text-destructive")}><Trash2 className="size-4" /> Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-2 border-frame shadow-hard-lg sm:max-w-2xl">
          <DialogHeader><DialogTitle className="font-display text-2xl">{editing?.id ? "Edit opportunity" : "New opportunity"}</DialogTitle></DialogHeader>
          {editing && <OpportunityForm initial={editing} onDone={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!del} onOpenChange={(v) => !v && setDel(null)}>
        <AlertDialogContent className="border-2 border-frame shadow-hard-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{del?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>This removes the listing from the site. This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-burgundy"
              onClick={async (e) => {
                e.preventDefault();
                if (!del) return;
                setDeleting(true);
                await api.deleteOpportunity(del.id);
                setDeleting(false);
                setDel(null);
                toast.success("Opportunity deleted");
              }}
            >
              {deleting ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function OpportunityForm({ initial, onDone }: { initial: Opportunity; onDone: () => void }) {
  const [f, setF] = useState({ ...initial, resp: initial.responsibilities.join("\n"), reqs: initial.requirements.join("\n") });
  const [errs, setErrs] = useState<Errs>({});
  const [saving, setSaving] = useState(false);
  const u = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const er: Errs = {};
        if (!f.title.trim()) er.title = "Title is required.";
        if (!f.company.trim()) er.company = "Company is required.";
        if (!f.location.trim()) er.location = "Location is required.";
        if (f.description.trim().length < 20) er.description = "Add at least a short description (20+ characters).";
        setErrs(er);
        if (Object.keys(er).length) return;
        setSaving(true);
        const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
        const id = initial.id || `${f.title}-${f.company}`.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
        await api.saveOpportunity({
          id, title: f.title.trim(), company: f.company.trim(),
          companyInitials: f.company.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          domain: f.domain, location: f.location.trim(), workMode: f.workMode, type: f.type,
          pay: f.pay?.trim() || undefined, deadline: f.deadline || undefined,
          postedAt: initial.postedAt || new Date().toISOString().slice(0, 10),
          description: f.description.trim(), responsibilities: lines(f.resp), requirements: lines(f.reqs), applyUrl: initial.applyUrl,
        });
        setSaving(false);
        toast.success(initial.id ? "Changes saved" : "Opportunity published");
        onDone();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" required error={errs.title}><input className={inputCls} value={f.title} onChange={u("title")} aria-invalid={!!errs.title} /></Field>
        <Field label="Company" required error={errs.company}><input className={inputCls} value={f.company} onChange={u("company")} aria-invalid={!!errs.company} /></Field>
        <Field label="Domain"><select className={inputCls} value={f.domain} onChange={u("domain")}>{DOMAINS.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Type"><select className={inputCls} value={f.type} onChange={u("type")}>{TYPES.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Location" required error={errs.location}><input className={inputCls} value={f.location} onChange={u("location")} aria-invalid={!!errs.location} /></Field>
        <Field label="Work mode"><select className={inputCls} value={f.workMode} onChange={u("workMode")}>{MODES.map((d) => <option key={d}>{d}</option>)}</select></Field>
        <Field label="Pay / stipend"><input className={inputCls} value={f.pay ?? ""} onChange={u("pay")} placeholder="₹30,000 / month" /></Field>
        <Field label="Deadline"><input type="date" className={inputCls} value={f.deadline ?? ""} onChange={u("deadline")} /></Field>
      </div>
      <Field label="Description" required error={errs.description}><textarea className={cn(inputCls, "h-24 py-2")} value={f.description} onChange={u("description")} aria-invalid={!!errs.description} /></Field>
      <Field label="Responsibilities (one per line)"><textarea className={cn(inputCls, "h-24 py-2")} value={f.resp} onChange={u("resp")} /></Field>
      <Field label="Requirements (one per line)"><textarea className={cn(inputCls, "h-24 py-2")} value={f.reqs} onChange={u("reqs")} /></Field>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className={btn("outline")}>Cancel</button>
        <button disabled={saving} className={btn("primary")}>{saving ? <><Spinner /> Saving…</> : "Save"}</button>
      </div>
    </form>
  );
}
