import { Link, useLocation } from "react-router-dom";
import { Bookmark, Compass, Home, LayoutGrid, X } from "lucide-react";
import { useRef, useState, useEffect, type ReactNode } from "react";
import { useSaved } from "@/context/SavedContext";
import { cn } from "@/utils/utils";

const tabs = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/opportunities", label: "Explore", icon: Compass, exact: false },
  { to: "/domains", label: "Domains", icon: LayoutGrid, exact: false },
  { to: "/saved", label: "Saved", icon: Bookmark, exact: false },
] as const;

/** App-style bottom tab bar, phones only. */
export function MobileTabBar() {
  const { saved } = useSaved();
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav
      aria-label="Tabs"
      className="glass fixed inset-x-0 bottom-0 z-40 border-t-2 border-frame pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <ul className="grid grid-cols-4">
        {tabs.map(({ to, label, icon: Icon, exact }) => {
          const isActive = exact ? path === to : path.startsWith(to) && to !== "/";
          return (
            <li key={to}>
              <Link
                to={to}
                className={cn(
                  "tap group relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground",
                  isActive && "text-foreground [&_.pill]:bg-primary [&_.pill]:text-primary-foreground [&_.pill]:scale-100",
                )}
              >
                <span className="pill grid h-7 w-12 scale-90 place-items-center rounded-full transition-all duration-300 ease-snap">
                  <Icon className="size-4" />
                </span>
                {label}
                {to === "/saved" && saved.length > 0 && (
                  <span className="absolute right-[calc(50%-22px)] top-1.5 grid min-w-4 place-items-center rounded-full border border-frame bg-ink px-1 text-[9px] text-ink-foreground">
                    {saved.length}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Re-keys on navigation so each page slides in. */
export function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="animate-page-in">
      {children}
    </div>
  );
}

/** Swipe right to save / unsave a role on touch screens. */
export function SwipeToSave({ id, children }: { id: string; children: ReactNode }) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(id);
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
            toggleSaved(id);
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
              navigator.vibrate(12);
            }
          }
          setAnim(true);
          setDx(0);
          start.current = null;
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Apple-style Swipe-to-dismiss bottom sheet for mobile.
 * Follows the finger on drag down, closes on threshold distance (>90px) or quick flick,
 * has an accessible close button, and respects safe-area insets and reduced motion.
 */
export function SwipeDismissSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  const [dy, setDy] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef<number | null>(null);
  const startTime = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setDy(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0]!.clientY;
    startTime.current = Date.now();
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const currentY = e.touches[0]!.clientY;
    const delta = currentY - startY.current;
    // Only drag downwards
    if (delta > 0) {
      setDy(delta);
    }
  };

  const onTouchEnd = () => {
    if (startY.current === null) return;
    const elapsed = Date.now() - startTime.current;
    const velocity = dy / Math.max(elapsed, 1);

    // Dismiss if dragged down > 90px or quick downward flick (> 0.5 px/ms)
    if (dy > 90 || velocity > 0.5) {
      onClose();
    }
    setDy(0);
    setIsDragging(false);
    startY.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label={title || "Bottom sheet"}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        ref={sheetRef}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateY(${dy}px)`,
          transition: isDragging ? "none" : "transform 240ms cubic-bezier(0.2, 0.9, 0.3, 1.2)",
          touchAction: "pan-x",
        }}
        className="relative max-h-[85vh] w-full rounded-t-2xl border-t-2 border-frame bg-card p-5 shadow-hard-lg flex flex-col pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
      >
        {/* Grab bar / Handle */}
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border/80 shrink-0 cursor-grab active:cursor-grabbing mb-4" />

        {/* Header with Title and Close Button (minimum 44x44px touch target) */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h2 className="font-display text-lg font-bold">{title || "Filters"}</h2>
          <button
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close sheet"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable sheet body */}
        <div className="overflow-y-auto pt-4 flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
