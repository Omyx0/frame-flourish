import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bookmark, Menu, Moon, Sun, X, Monitor } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/utils/utils";
import GooeyNav from "@/components/GooeyNav";
import { useSaved } from "@/context/SavedContext";

/* ---------- Buttons ---------- */
type BtnVariant = "primary" | "ink" | "outline" | "ghost";
export function btn(variant: BtnVariant = "primary", size: "sm" | "md" | "lg" = "md") {
  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold rounded-md select-none disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap cursor-pointer transition-all",
    size === "sm" && "h-9 px-3 text-sm",
    size === "md" && "h-11 px-5 text-sm",
    size === "lg" && "h-13 px-7 text-base",
    variant === "primary" && "bg-primary text-primary-foreground frame press hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard-lg",
    variant === "ink" && "bg-ink text-ink-foreground frame press hover:bg-burgundy hover:text-burgundy-foreground",
    variant === "outline" && "border-2 border-foreground/80 bg-card text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
    variant === "ghost" && "text-foreground transition-colors hover:bg-secondary",
  );
}

export function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />;
}

export function Logo({ initials, className }: { initials?: string; className?: string }) {
  return (
    <span
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-md border-2 border-frame bg-secondary font-display text-sm font-bold text-foreground",
        className,
      )}
      aria-hidden
    >
      {initials || "FS"}
    </span>
  );
}

/* ---------- Theme ---------- */
export function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };
  return { dark, toggle };
}

/* ---------- Reveal ---------- */
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.classList.add("is-in");
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ---------- Nav ---------- */
const links = [
  { to: "/opportunities", label: "Explore" },
  { to: "/domains", label: "Domains" },
  { to: "/saved", label: "Saved" },
  { to: "/admin", label: "Admin" },
] as const;
const navItems = [{ to: "/", label: "Home" }, ...links] as const;

export function Wordmark() {
  return (
    <Link to="/" className="group flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
      <span className="grid size-8 place-items-center rounded-sm border-2 border-frame bg-primary text-primary-foreground shadow-hard-sm transition-transform group-hover:-rotate-6">
        F
      </span>
      <span>first<span className="text-primary">shift</span></span>
    </Link>
  );
}

export function SiteHeader() {
  const { dark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const { saved } = useSaved();
  const nav = useNavigate();
  const pathIndex = Math.max(0, navItems.findIndex((l) => (l.to === "/" ? path === "/" : path.startsWith(l.to))));
  const [pending, setPending] = useState<number | null>(null);

  useEffect(() => {
    setOpen(false);
    setPending(null);
  }, [path]);

  return (
    <header className="glass sticky top-0 z-40 border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Wordmark />
        <div className="hidden md:block">
          <GooeyNav
            items={navItems.map((l) => ({ label: l.to === "/saved" && saved.length > 0 ? `Saved (${saved.length})` : l.label }))}
            activeIndex={pending ?? pathIndex}
            onChange={(i) => {
              setPending(i);
              nav(navItems[i]!.to);
              setPending(null);
            }}
            theme={dark ? "dark" : "light"}
            color={dark ? "#E5383B" : "#BA181B"}
            activeTextColor="#FFFFFF"
            colors={dark ? ["#E5383B", "#BA181B"] : ["#BA181B", "#A4161A", "#660708"]}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className={btn("ghost", "sm")}>
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link to="/opportunities" className={cn(btn("primary", "sm"), "hidden sm:inline-flex")}>
            Find roles
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event("fs-preview"))}
            className={cn(btn("ghost", "sm"), "md:hidden")}
            aria-label="Open desktop preview"
          >
            <Monitor className="size-4" />
          </button>
          <button className={cn(btn("outline", "sm"), "md:hidden")} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Menu">
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="animate-rise border-t border-border bg-background px-4 pb-6 pt-2 md:hidden" aria-label="Mobile">
          {links.map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex items-baseline justify-between border-b border-border py-4 font-display text-3xl font-bold"
            >
              {l.label}
              <span className="font-sans text-xs text-muted-foreground">0{i + 1}</span>
            </Link>
          ))}
          <Link to="/opportunities" className={cn(btn("primary", "lg"), "mt-6 w-full")}>
            Find roles
          </Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-4xl font-extrabold leading-none md:text-6xl">
            Your first shift
            <br />
            <span className="text-highlight">starts here.</span>
          </p>
          <p className="mt-4 max-w-sm text-sm opacity-70">Internships and early-career roles for students and fresh graduates.</p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm md:contents">
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest opacity-60">Explore</p>
            <ul className="space-y-2">
              <li><Link to="/opportunities" className="hover:text-highlight">All roles</Link></li>
              <li><Link to="/domains" className="hover:text-highlight">Domains</Link></li>
              <li><Link to="/saved" className="hover:text-highlight">Saved</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-widest opacity-60">Employers</p>
            <ul className="space-y-2">
              <li><Link to="/admin" className="hover:text-highlight">Post a role</Link></li>
              <li><Link to="/admin/applications" className="hover:text-highlight">Applications</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-ink-foreground/15">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs opacity-60 sm:px-6">© 2026 firstshift. Sample listings are fictional.</p>
      </div>
    </footer>
  );
}

/* ---------- Desktop preview (mobile only) ---------- */
export function DesktopPreviewToggle() {
  const [on, setOn] = useState(false);
  const location = useLocation();
  const path = location.pathname + location.search;

  useEffect(() => {
    const open = () => setOn(true);
    window.addEventListener("fs-preview", open);
    return () => window.removeEventListener("fs-preview", open);
  }, []);

  return (
    <>
      {on && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/90 p-3 md:hidden" role="dialog" aria-label="Desktop preview">
          <div className="mb-2 flex items-center justify-between text-ink-foreground">
            <p className="text-xs">Desktop preview · 1280px · scroll sideways</p>
            <button onClick={() => setOn(false)} className={btn("primary", "sm")}>Close</button>
          </div>
          <div className="flex-1 overflow-auto rounded-md border-2 border-frame bg-background">
            <iframe src={path} title="Desktop preview" className="h-full min-h-[80vh] w-[1280px] origin-top-left border-0" />
          </div>
        </div>
      )}
    </>
  );
}

export function SavedButton({ id, className }: { id: string; className?: string }) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(id);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved(id);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
      className={cn("grid size-9 place-items-center rounded-md border border-border transition-colors hover:border-primary cursor-pointer", saved && "border-primary bg-accent text-primary", className)}
    >
      <Bookmark className={cn("size-4 transition-transform", saved && "fill-current scale-110")} />
    </button>
  );
}
