import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  ExternalLink,
  MapPin,
  Wallet,
  Loader2,
} from "lucide-react";
import { Logo, SavedButton, btn } from "@/components/brand";
import { Deadline, Tag, getOppId, getCompanyName } from "@/components/opportunity-card";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { opportunityService, type Opportunity } from "@/services/opportunityService";
import { fmtDate, cn } from "@/utils/utils";

function Fact({ icon: Icon, k, v }: { icon: any; k: string; v: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center bg-card p-3">
      <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" /> {k}
      </dt>
      <dd className="mt-1 font-semibold leading-tight">{v}</dd>
    </div>
  );
}

function SideFact({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-semibold text-right">{v}</dd>
    </div>
  );
}

function List({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <section>
      <h2 className="text-2xl font-bold">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-muted-foreground">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function OpportunityDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOpportunity() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await opportunityService.getById(id);
        setOpportunity(data);
      } catch (err: any) {
        setError(err.message || "Failed to load opportunity details");
      } finally {
        setLoading(false);
      }
    }
    fetchOpportunity();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">This role isn't available</h1>
        <p className="mt-2 text-muted-foreground">It may have been filled, removed, or the link is incorrect.</p>
        <Link to="/opportunities" className={cn(btn("primary"), "mt-6")}>
          Browse all roles
        </Link>
      </div>
    );
  }

  const oppId = getOppId(opportunity);
  const company = getCompanyName(opportunity);
  const closed = (opportunity.deadline && new Date(opportunity.deadline) < new Date()) || false;

  return (
    <div className="pb-28 lg:pb-0">
      {/* Header banner */}
      <div className="border-b-2 border-frame bg-card grid-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All roles
          </Link>
          <div className="mt-6 flex items-start gap-4">
            <Logo initials={opportunity.companyInitials} className="size-14 shadow-hard-sm" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-muted-foreground">{company}</p>
              <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-5xl">
                {opportunity.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag strong>{opportunity.type}</Tag>
                <Tag>{opportunity.domain}</Tag>
                <Tag>{opportunity.workMode}</Tag>
              </div>
            </div>
            <SavedButton id={oppId} className="hidden sm:grid" />
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_380px]">
        <article className="max-w-2xl space-y-10">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4 lg:hidden">
            <Fact icon={MapPin} k="Location" v={opportunity.location} />
            <Fact icon={Wallet} k="Pay" v={opportunity.pay ?? "Not listed"} />
            <Fact icon={Briefcase} k="Type" v={opportunity.type} />
            <Fact icon={Calendar} k="Deadline" v={opportunity.deadline ? fmtDate(opportunity.deadline) : "Rolling"} />
          </dl>

          <section>
            <h2 className="text-2xl font-bold">About the role</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">
              {opportunity.description}
            </p>
          </section>

          <List title="What you'll do" items={opportunity.responsibilities} />
          <List title="What we're looking for" items={opportunity.requirements} />

          <section id="apply" className="scroll-mt-24">
            <h2 className="text-2xl font-bold">Apply now</h2>
            {closed ? (
              <div className="mt-4 rounded-lg border border-border bg-secondary p-4 text-muted-foreground">
                Applications for this role have closed.
              </div>
            ) : (
              <ApplicationForm opportunityId={oppId} opportunityTitle={opportunity.title} />
            )}
          </section>
        </article>

        {/* Desktop Sticky Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-lg bg-card p-6 frame">
            <dl className="space-y-4 text-sm">
              <SideFact k="Pay" v={opportunity.pay ?? "Not listed"} />
              <SideFact k="Location" v={`${opportunity.location} · ${opportunity.workMode}`} />
              <SideFact k="Type" v={opportunity.type} />
              <SideFact
                k="Deadline"
                v={
                  opportunity.deadline ? (
                    <>
                      {fmtDate(opportunity.deadline)} · <Deadline deadline={opportunity.deadline} />
                    </>
                  ) : (
                    "Rolling"
                  )
                }
              />
              <SideFact k="Posted" v={fmtDate(opportunity.createdAt)} />
            </dl>

            <a
              href="#apply"
              className={cn(btn("primary", "lg"), "mt-6 w-full", closed && "pointer-events-none opacity-50")}
            >
              {closed ? "Applications Closed" : "Apply now"}
            </a>

            {opportunity.applicationLink && (
              <a
                href={opportunity.applicationLink}
                target="_blank"
                rel="noreferrer"
                className={cn(btn("outline"), "mt-2 w-full")}
              >
                Company site <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </aside>
      </div>

      {/* Mobile Sticky Apply Bar */}
      {!closed && (
        <div className="glass fixed inset-x-0 bottom-16 z-30 flex items-center justify-between border-t border-border p-3 lg:hidden">
          <div>
            <p className="text-xs text-muted-foreground">Quick apply</p>
            <p className="font-semibold">{opportunity.pay || opportunity.type}</p>
          </div>
          <a href="#apply" className={btn("primary", "sm")}>
            Apply now
          </a>
        </div>
      )}
    </div>
  );
}

export default OpportunityDetailsPage;
