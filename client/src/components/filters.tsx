import { Search, X } from "lucide-react";
import { cn } from "@/utils/utils";

export function SearchBar({
  value,
  onChange,
  onSubmit,
  big,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: () => void;
  big?: boolean;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn("flex w-full items-stretch rounded-lg bg-card frame", big ? "h-16" : "h-12")}
    >
      <label className="flex flex-1 items-center gap-3 px-4">
        <Search className="size-5 shrink-0 text-muted-foreground" />
        <span className="sr-only">Search by role, company, or keyword</span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Role, company or keyword"
          className="w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
        {value && (
          <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="text-muted-foreground hover:text-foreground cursor-pointer">
            <X className="size-4" />
          </button>
        )}
      </label>
      {onSubmit && (
        <button className="m-1.5 rounded-md bg-primary px-4 font-semibold text-primary-foreground transition-colors hover:bg-burgundy hover:text-burgundy-foreground cursor-pointer sm:px-6">
          Search
        </button>
      )}
    </form>
  );
}

export function Chip({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-all cursor-pointer",
        active
          ? "border-frame bg-ink text-ink-foreground shadow-hard-sm"
          : "border-border bg-card text-foreground hover:border-foreground/60",
      )}
    >
      {children}
    </button>
  );
}

export function ChipGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T | "";
  onChange: (v: T | "") => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-wrap lg:px-0">
        {options.map((o) => (
          <Chip key={o} active={value === o} onClick={() => onChange(value === o ? "" : o)}>
            {o}
          </Chip>
        ))}
      </div>
    </div>
  );
}
