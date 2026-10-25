import { Link, useRouterState } from "@tanstack/react-router";
import { Bookmark, Compass, Home, LayoutGrid } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { api, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/opportunities", label: "Explore", icon: Compass, exact: false },
  { to: "/domains", label: "Domains", icon: LayoutGrid, exact: false },
  { to: "/saved", label: "Saved", icon: Bookmark, exact: false },
] as const;

/** App-style bottom tab bar, phones only. */
export function MobileTabBar() {
  const saved = useStore((s) => s.saved.length);
  return (
    <nav
      aria-label="Tabs"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t-2 border-frame pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, exact }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact }}
              className="tap group relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground"
              activeProps={{ className: "text-foreground [&_.pill]:bg-primary [&_.pill]:text-primary-foreground [&_.pill]:scale-100" }}
            >
              <span className="pill grid h-7 w-12 scale-90 place-items-center rounded-full transition-all duration-300 ease-snap">
                <Icon className="size-4" />
              </span>
              {label}
              {to === "/saved" && saved > 0 && (
                <span className="absolute right-[calc(50%-22px)] top-1.5 grid min-w-4 place-items-center rounded-full border border-frame bg-ink px-1 text-[9px] text-ink-foreground">
                  {saved}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Re-keys on navigation so each page slides in. */
export function PageTransition({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div key={path} className="animate-page-in">
      {children}
    </div>
  );
}

/** Swipe right to save / unsave a role on touch screens. */
export function SwipeToSave({ id, children }: { id: string; children: ReactNode }) {
  const saved = useStore((s) => s.saved.includes(id));
  const start = useRef<{ x: number; y: number } | null>(null);
  const locked = useRef<"x" | "y" | null>(null);
  const [dx, setDx] = useState(0);
  const [anim, setAnim] = useState(false);
  const THRESHOLD = 90;

  return (
    <div className="relative h-full overflow-hidden">
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-0 left-0 flex items-center gap-2 overflow-hidden rounded-md pl-4 font-semibold transition-colors",
          dx > THRESHOLD ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground",
        )}
        style={{ width: Math.max(dx, 0), visibility: dx > 0 ? "visible" : "hidden" }}
      >
        <Bookmark className={cn("size-5 shrink-0 transition-transform", dx > THRESHOLD && "scale-125 fill-current")} />
        <span className="whitespace-nowrap text-sm">{saved ? "Unsave" : "Save"}</span>
      </div>
      <div
        className={cn("relative h-full bg-background", anim && "transition-transform duration-300 ease-snap")}
        style={{ transform: `translateX(${dx}px)`, touchAction: "pan-y" }}
        onTouchStart={(e) => {
          const t = e.touches[0]!;
          start.current = { x: t.clientX, y: t.clientY };
          locked.current = null;
          setAnim(false);
        }}
        onTouchMove={(e) => {
          if (!start.current) return;
          const t = e.touches[0]!;
          const mx = t.clientX - start.current.x;
          const my = t.clientY - start.current.y;
          if (!locked.current && (Math.abs(mx) > 8 || Math.abs(my) > 8)) locked.current = Math.abs(mx) > Math.abs(my) ? "x" : "y";
          if (locked.current === "x") setDx(Math.max(0, Math.min(mx, 160)) * (mx > THRESHOLD ? 0.9 : 1));
        }}
        onTouchEnd={() => {
          if (dx > THRESHOLD) {
            api.toggleSaved(id);
            navigator.vibrate?.(12);
          }
          setAnim(true);
          setDx(0);
          start.current = null;
        }}
        onClickCapture={(e) => {
          if (locked.current === "x") {
            e.preventDefault();
            e.stopPropagation();
            locked.current = null;
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
