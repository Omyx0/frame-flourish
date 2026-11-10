import { Link } from "react-router-dom";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import type { Opportunity } from "@/services/opportunityService";
import { daysLeft, cn } from "@/utils/utils";
import { Logo, SavedButton } from "./brand";

export function getOppId(o: Opportunity): string {
  return (o._id || o.id || "").toString();
}

export function getCompanyName(o: Opportunity): string {
  return o.companyName || (o as any).company || "";
}

export function Deadline({ deadline }: { deadline?: string | undefined }) {
  const d = daysLeft(deadline);
  if (d === null) return <span className="text-muted-foreground">Rolling</span>;
  if (d < 0) return <span className="text-muted-foreground">Closed</span>;
  return <span className={cn("tabular-nums", d <= 14 && "font-semibold text-primary")}>{d}d left</span>;
}

export function Tag({ children, strong, className }: { children: React.ReactNode; strong?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium",
        strong ? "border-frame bg-ink text-ink-foreground" : "border-border bg-secondary text-secondary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Featured card: framed, neo-brutal */
export function FeaturedCard({ o }: { o: Opportunity }) {
  const id = getOppId(o);
  const company = getCompanyName(o);

  return (
    <Link
      to={`/opportunities/${id}`}
      className="group flex h-full flex-col rounded-lg bg-card p-3 frame frame-lift sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <Logo initials={o.companyInitials} className="size-8 text-[10px] sm:size-11 sm:text-sm" />
        <SavedButton id={id} className="size-7 [&_svg]:size-3.5 sm:size-9 sm:[&_svg]:size-4" />
      </div>
      <p className="mt-2.5 truncate text-[11px] text-muted-foreground sm:mt-5 sm:text-sm">{company}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight sm:text-xl">{o.title}</h3>
      <div className="mt-2 flex flex-wrap gap-1 sm:mt-4 sm:gap-1.5">
        <Tag strong className="px-1.5 py-0 text-[10px] sm:px-2 sm:py-0.5 sm:text-xs">{o.type}</Tag>
        <Tag className="px-1.5 py-0 text-[10px] sm:px-2 sm:py-0.5 sm:text-xs">{o.domain}</Tag>
      </div>
      <div className="mt-auto flex items-end justify-between gap-2 pt-3 text-xs sm:pt-6 sm:text-sm">
        <div className="min-w-0">
          <p className="truncate font-semibold tabular-nums">{o.pay ?? "Unpaid / not listed"}</p>
          <p className="mt-0.5 flex items-center gap-1 truncate text-muted-foreground">
            <MapPin className="size-3 shrink-0 sm:size-3.5" /> {o.location} · {o.workMode}
          </p>
        </div>
        <ArrowUpRight className="size-4 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:size-5" />
      </div>
    </Link>
  );
}

/** Row listing: quiet, scannable */
export function OpportunityRow({ o }: { o: Opportunity }) {
  const id = getOppId(o);
  const company = getCompanyName(o);

  return (
    <Link
      to={`/opportunities/${id}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-border px-1 py-5 transition-colors hover:bg-card sm:px-4 lg:grid-cols-[auto_2fr_1fr_1fr_auto_auto]"
    >
      <Logo initials={o.companyInitials} className="transition-colors group-hover:border-primary" />
      <div className="min-w-0">
        <h3 className="truncate text-lg font-bold leading-tight transition-colors group-hover:text-primary">{o.title}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {company} <span className="lg:hidden">· {o.location}</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5 text-xs lg:hidden">
          <Tag strong>{o.type}</Tag>
          {o.pay && <Tag>{o.pay}</Tag>}
          <span className="inline-flex items-center gap-1 px-1 text-muted-foreground">
            <Clock className="size-3" /> <Deadline deadline={o.deadline} />
          </span>
        </div>
      </div>
      <div className="hidden text-sm lg:block">
        <p>{o.location}</p>
        <p className="text-muted-foreground">{o.workMode}</p>
      </div>
      <div className="hidden text-sm lg:block">
        <p className="font-semibold tabular-nums">{o.pay ?? "Not listed"}</p>
        <p className="text-muted-foreground">{o.type}</p>
      </div>
      <div className="hidden w-20 text-right text-sm lg:block">
        <Deadline deadline={o.deadline} />
      </div>
      <SavedButton id={id} />
    </Link>
  );
}

/** Compact card for phone grids and carousels */
export function MiniCard({ o }: { o: Opportunity }) {
  const id = getOppId(o);
  const company = getCompanyName(o);

  return (
    <Link
      to={`/opportunities/${id}`}
      className="flex h-full flex-col rounded-md border-2 border-frame bg-card p-2 shadow-hard-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
    >
      <div className="flex items-start justify-between gap-1.5">
        <Logo initials={o.companyInitials} className="size-6 text-[9px]" />
        <SavedButton id={id} className="size-6 [&_svg]:size-3" />
      </div>
      <h3 className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug">{o.title}</h3>
      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{company}</p>
      <div className="mt-auto flex flex-wrap items-center gap-1 pt-2 text-[9px]">
        <span className="rounded-sm bg-ink px-1 py-px font-medium text-ink-foreground">{o.type}</span>
        <span className="flex items-center gap-0.5 text-muted-foreground"><Clock className="size-2.5" /><Deadline deadline={o.deadline} /></span>
      </div>
      <p className="mt-1 flex items-center gap-0.5 truncate text-[9px] text-muted-foreground"><MapPin className="size-2.5 shrink-0" />{o.location}</p>
    </Link>
  );
}

/** Editorial "recently added" card */
export function RecentCard({ o, index }: { o: Opportunity; index: number }) {
  const id = getOppId(o);
  const company = getCompanyName(o);

  return (
    <Link
      to={`/opportunities/${id}`}
      className="group flex h-full flex-col rounded-md border border-border bg-secondary p-2.5 transition-colors hover:border-primary sm:p-3"
    >
      <div className="flex items-start justify-between">
        <span className="rounded-sm bg-primary px-1.5 py-px font-display text-[9px] font-bold uppercase tracking-widest text-primary-foreground">New</span>
        <span className="font-display text-xl font-extrabold leading-none opacity-15 sm:text-2xl tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-1.5 line-clamp-2 text-[13px] font-bold leading-snug">{o.title}</h3>
      <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{company}</p>
      <div className="mt-auto flex items-center justify-between gap-1 pt-2 text-[9px] text-muted-foreground">
        <Deadline deadline={o.deadline} />
        <span className="truncate">{o.workMode}</span>
      </div>
    </Link>
  );
}
