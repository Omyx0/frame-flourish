import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Briefcase, Calendar, CheckCircle2, ExternalLink, MapPin, Wallet } from "lucide-react";
import { useState } from "react";
import { Logo, SavedButton, Spinner, btn } from "@/components/brand";
import { Deadline, Tag } from "@/components/opportunity-card";
import { api, fmtDate, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Field, inputCls } from "@/components/form";

type Errs = { [k in "name"|"email"|"phone"|"resumeUrl"|"coverLetter"|"title"|"company"|"location"|"description"]?: string };

export const Route = createFileRoute("/opportunities/$id")({
  head: () => ({
    meta: [
      { title: "Opportunity details · firstshift" },
      { name: "description", content: "Full role details, requirements and application form." },
      { property: "og:title", content: "Opportunity details · firstshift" },
      { property: "og:description", content: "Full role details, requirements and application form." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const o = useStore((s) => s.opportunities.find((x) => x.id === id));
  if (!o)
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">This role isn't available</h1>
        <p className="mt-2 text-muted-foreground">It may have been filled or removed.</p>
        <Link to="/opportunities" className={cn(btn("primary"), "mt-6")}>Browse roles</Link>
      </div>
    );
  const closed = (o.deadline && new Date(o.deadline) < new Date()) || false;

  return (
    <div className="pb-28 lg:pb-0">
      <div className="border-b-2 border-frame bg-card grid-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> All roles
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <Logo initials={o.companyInitials} className="size-14 shadow-hard-sm" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-muted-foreground">{o.company}</p>
              <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-5xl">{o.title}</h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag strong>{o.type}</Tag>
                <Tag>{o.domain}</Tag>
                <Tag>{o.workMode}</Tag>
              </div>
            </div>
            <SavedButton id={o.id} className="hidden sm:grid" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
        <article className="max-w-2xl space-y-10">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 lg:hidden">
            <Fact icon={MapPin} k="Location" v={o.location} />
            <Fact icon={Wallet} k="Pay" v={o.pay ?? "Not listed"} />
            <Fact icon={Briefcase} k="Type" v={o.type} />
            <Fact icon={Calendar} k="Deadline" v={o.deadline ? fmtDate(o.deadline) : "Rolling"} />
          </dl>
          <section>
            <h2 className="text-2xl font-bold">About the role</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{o.description}</p>
          </section>
          <List title="What you'll do" items={o.responsibilities} />
          <List title="What we're looking for" items={o.requirements} />
          <section id="apply" className="scroll-mt-24">
            <h2 className="text-2xl font-bold">Apply</h2>
            {closed ? <p className="mt-3 text-muted-foreground">Applications for this role have closed.</p> : <ApplyForm opportunityId={o.id} />}
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg bg-card p-6 frame">
            <dl className="space-y-4 text-sm">
              <SideFact k="Pay" v={o.pay ?? "Not listed"} />
              <SideFact k="Location" v={`${o.location} · ${o.workMode}`} />
              <SideFact k="Type" v={o.type} />
              <SideFact k="Deadline" v={o.deadline ? <>{fmtDate(o.deadline)} · <Deadline deadline={o.deadline} /></> : "Rolling"} />
              <SideFact k="Posted" v={fmtDate(o.postedAt)} />
            </dl>
            <a href="#apply" className={cn(btn("primary", "lg"), "mt-6 w-full", closed && "pointer-events-none opacity-50")}>Apply now</a>
            {o.applyUrl && (
              <a href={o.applyUrl} target="_blank" rel="noreferrer" className={cn(btn("outline"), "mt-2 w-full")}>
                Company site <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* mobile sticky apply */}
      {!closed && (
        <div className="glass fixed inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t border-border px-4 py-3 lg:hidden">
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-semibold">{o.pay ?? o.type}</p>
            <p className="text-muted-foreground"><Deadline deadline={o.deadline} /></p>
          </div>
          <a href="#apply" className={btn("primary")}>Apply now</a>
        </div>
      )}
    </div>
  );
}

function Fact({ icon: I, k, v }: { icon: typeof MapPin; k: string; v: string }) {
  return (
    <div className="bg-card p-3">
      <dt className="flex items-center gap-1 text-xs text-muted-foreground"><I className="size-3.5" />{k}</dt>
      <dd className="mt-1 text-sm font-semibold">{v}</dd>
    </div>
  );
}
function SideFact({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-semibold">{v}</dd>
    </div>
  );
}
function List({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-2 size-2 shrink-0 rotate-45 bg-primary" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ApplyForm({ opportunityId }: { opportunityId: string }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
  const [errs, setErrs] = useState<Errs>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [serverErr, setServerErr] = useState("");
  const upd = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const validate = () => {
    const e: Errs = {};
    if (f.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{7,}$/.test(f.phone)) e.phone = "Enter a valid phone number.";
    try {
      new URL(f.resumeUrl);
    } catch {
      e.resumeUrl = "Paste a link to your résumé (e.g. Google Drive).";
    }
    if (f.coverLetter.length > 1500) e.coverLetter = "Keep it under 1500 characters.";
    setErrs(e);
    return !Object.keys(e).length;
  };

  if (status === "done")
    return (
      <div className="mt-4 animate-rise rounded-lg border-2 border-frame bg-accent p-6 text-accent-foreground shadow-hard">
        <CheckCircle2 className="size-8" />
        <h3 className="mt-3 text-xl font-bold">Application received</h3>
        <p className="mt-1 text-sm">We've sent it to the hiring team. You'll hear back at {f.email}.</p>
      </div>
    );

  return (
    <form
      noValidate
      className="mt-4 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setServerErr("");
        if (!validate()) return;
        setStatus("loading");
        try {
          await api.submitApplication({ opportunityId, ...f });
          setStatus("done");
        } catch (err) {
          setServerErr(err instanceof Error ? err.message : "Something went wrong.");
          setStatus("error");
        }
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errs.name}>
          <input className={inputCls} value={f.name} onChange={upd("name")} aria-invalid={!!errs.name} autoComplete="name" />
        </Field>
        <Field label="Email" required error={errs.email}>
          <input className={inputCls} type="email" value={f.email} onChange={upd("email")} aria-invalid={!!errs.email} autoComplete="email" />
        </Field>
        <Field label="Phone" required error={errs.phone}>
          <input className={inputCls} type="tel" value={f.phone} onChange={upd("phone")} aria-invalid={!!errs.phone} autoComplete="tel" />
        </Field>
        <Field label="Résumé link" required error={errs.resumeUrl}>
          <input className={inputCls} type="url" placeholder="https://" value={f.resumeUrl} onChange={upd("resumeUrl")} aria-invalid={!!errs.resumeUrl} />
        </Field>
      </div>
      <Field label="Cover note (optional)" error={errs.coverLetter}>
        <textarea className={cn(inputCls, "h-32 py-2")} value={f.coverLetter} onChange={upd("coverLetter")} aria-invalid={!!errs.coverLetter} />
      </Field>
      {serverErr && <p className="rounded-md border-2 border-destructive bg-accent p-3 text-sm text-accent-foreground" role="alert">{serverErr} Please try again.</p>}
      <button disabled={status === "loading"} className={cn(btn("primary", "lg"), "w-full sm:w-auto")}>
        {status === "loading" ? <><Spinner /> Submitting…</> : "Submit application"}
      </button>
    </form>
  );
}
