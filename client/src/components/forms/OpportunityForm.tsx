import { useState } from "react";
import { toast } from "sonner";
import { btn, Spinner } from "@/components/brand";
import { Field, inputCls } from "@/components/form";
import {
  opportunityService,
  DOMAINS,
  TYPES,
  MODES,
  type Opportunity,
} from "@/services/opportunityService";
import { cn } from "@/utils/utils";

interface OpportunityFormProps {
  initial: Partial<Opportunity>;
  onDone: () => void;
}

export function OpportunityForm({ initial, onDone }: OpportunityFormProps) {
  const isEditing = Boolean(initial._id || initial.id);
  const targetId = (initial._id || initial.id) as string;

  const [f, setF] = useState({
    title: initial.title || "",
    companyName: initial.companyName || (initial as any).company || "",
    domain: initial.domain || DOMAINS[0],
    type: initial.type || TYPES[0],
    location: initial.location || "",
    workMode: initial.workMode || MODES[0],
    pay: initial.pay || "",
    deadline: initial.deadline ? new Date(initial.deadline).toISOString().slice(0, 10) : "",
    description: initial.description || "",
    applicationLink: initial.applicationLink || (initial as any).applyUrl || "",
    resp: (initial.responsibilities || []).join("\n"),
    reqs: (initial.requirements || []).join("\n"),
  });

  const [errs, setErrs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);

  const u = (k: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }));
    if (errs[k]) {
      setErrs((prev) => {
        const next = { ...prev };
        delete next[k];
        return next;
      });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrs: Record<string, string> = {};

    if (!f.title.trim()) nextErrs.title = "Title is required";
    if (!f.companyName.trim()) nextErrs.companyName = "Company name is required";
    if (!f.location.trim()) nextErrs.location = "Location is required";
    if (f.description.trim().length < 20) {
      nextErrs.description = "Add at least a short description (20+ characters)";
    }

    if (f.applicationLink.trim()) {
      try {
        new URL(f.applicationLink.trim());
      } catch {
        nextErrs.applicationLink = "Must be a valid URL";
      }
    }

    setErrs(nextErrs);
    if (Object.keys(nextErrs).length > 0) return;

    setSaving(true);
    setServerErr(null);

    const lines = (s: string) =>
      s
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

    const payload: Partial<Opportunity> = {
      title: f.title.trim(),
      companyName: f.companyName.trim(),
      domain: f.domain,
      type: f.type,
      location: f.location.trim(),
      workMode: f.workMode,
      pay: f.pay.trim() || undefined,
      deadline: f.deadline ? new Date(f.deadline).toISOString() : undefined,
      description: f.description.trim(),
      responsibilities: lines(f.resp),
      requirements: lines(f.reqs),
      applicationLink: f.applicationLink.trim() || undefined,
    };

    try {
      if (isEditing) {
        await opportunityService.update(targetId, payload);
        toast.success("Opportunity updated successfully");
      } else {
        await opportunityService.create(payload);
        toast.success("Opportunity published successfully");
      }
      onDone();
    } catch (err: any) {
      setServerErr(err.message || "Failed to save opportunity");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form noValidate className="space-y-4" onSubmit={onSubmit}>
      {serverErr && (
        <div className="rounded-md border-2 border-destructive bg-accent p-3 text-sm text-accent-foreground" role="alert">
          {serverErr}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Job / Internship title" required error={errs.title}>
          <input className={inputCls} value={f.title} onChange={u("title")} placeholder="e.g. Frontend Engineering Intern" aria-invalid={!!errs.title} />
        </Field>
        <Field label="Company name" required error={errs.companyName}>
          <input className={inputCls} value={f.companyName} onChange={u("companyName")} placeholder="e.g. Northlane Labs" aria-invalid={!!errs.companyName} />
        </Field>
        <Field label="Domain">
          <select className={inputCls} value={f.domain} onChange={u("domain")}>
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Employment type">
          <select className={inputCls} value={f.type} onChange={u("type")}>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Location" required error={errs.location}>
          <input className={inputCls} value={f.location} onChange={u("location")} placeholder="e.g. Bengaluru / Remote" aria-invalid={!!errs.location} />
        </Field>
        <Field label="Work mode">
          <select className={inputCls} value={f.workMode} onChange={u("workMode")}>
            {MODES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Pay / Stipend">
          <input className={inputCls} value={f.pay} onChange={u("pay")} placeholder="e.g. ₹35,000 / month" />
        </Field>
        <Field label="Application deadline">
          <input type="date" className={inputCls} value={f.deadline} onChange={u("deadline")} />
        </Field>
      </div>

      <Field label="External application URL (optional)" error={errs.applicationLink}>
        <input className={inputCls} type="url" value={f.applicationLink} onChange={u("applicationLink")} placeholder="https://careers.company.com/role" aria-invalid={!!errs.applicationLink} />
      </Field>

      <Field label="Job description" required error={errs.description}>
        <textarea className={cn(inputCls, "h-24 py-2")} value={f.description} onChange={u("description")} placeholder="Describe the role, team, and expectations..." aria-invalid={!!errs.description} />
      </Field>

      <Field label="Key responsibilities (one item per line)">
        <textarea className={cn(inputCls, "h-24 py-2")} value={f.resp} onChange={u("resp")} placeholder="Build responsive components&#10;Collaborate with product managers" />
      </Field>

      <Field label="Requirements (one item per line)">
        <textarea className={cn(inputCls, "h-24 py-2")} value={f.reqs} onChange={u("reqs")} placeholder="Experience with React and TypeScript&#10;Good communication skills" />
      </Field>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onDone} className={btn("outline")}>
          Cancel
        </button>
        <button disabled={saving} className={btn("primary")}>
          {saving ? (
            <>
              <Spinner /> Saving…
            </>
          ) : isEditing ? (
            "Save changes"
          ) : (
            "Publish opportunity"
          )}
        </button>
      </div>
    </form>
  );
}
