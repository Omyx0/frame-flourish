import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Home,
  Briefcase,
  Layers,
  Bookmark,
  Shield,
  Sun,
  Moon,
  ArrowRight,
  Filter,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useTheme } from "@/components/brand";
import { cn } from "@/utils/utils";

export function getModifierKey(): string {
  if (typeof window === "undefined") return "Ctrl";
  const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
  return isMac ? "⌘" : "Ctrl";
}

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Actions" | "Quick Filters";
  icon: any;
  shortcut?: string;
  run: () => void;
}

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modKey, setModKey] = useState("Ctrl");
  const navigate = useNavigate();
  const { dark, toggle: toggleTheme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  // Global keydown listeners for shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable;

      // Cmd+K / Ctrl+K opens command menu anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      // If user is currently typing in an input field, do not trigger other single-key shortcuts
      if (isInput) return;

      // '/' opens command menu and focuses search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setOpen(true);
        return;
      }

      // 'Shift+D' toggles dark/light theme
      if (e.shiftKey && e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        toggleTheme();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

  const items: CommandItem[] = [
    {
      id: "nav-home",
      title: "Go to Home",
      category: "Navigation",
      icon: Home,
      run: () => navigate("/"),
    },
    {
      id: "nav-opps",
      title: "Explore Opportunities",
      category: "Navigation",
      icon: Briefcase,
      run: () => navigate("/opportunities"),
    },
    {
      id: "nav-domains",
      title: "Browse by Domain",
      category: "Navigation",
      icon: Layers,
      run: () => navigate("/domains"),
    },
    {
      id: "nav-saved",
      title: "View Saved Roles",
      category: "Navigation",
      icon: Bookmark,
      run: () => navigate("/saved"),
    },
    {
      id: "nav-admin",
      title: "Admin Console",
      category: "Navigation",
      icon: Shield,
      run: () => navigate("/admin"),
    },
    {
      id: "act-theme",
      title: dark ? "Switch to Light Mode" : "Switch to Dark Mode",
      category: "Actions",
      icon: dark ? Sun : Moon,
      shortcut: "Shift+D",
      run: () => toggleTheme(),
    },
    {
      id: "filter-swe",
      title: "Software Engineering Roles",
      category: "Quick Filters",
      icon: Filter,
      run: () => navigate("/opportunities?domain=Software+Engineering"),
    },
    {
      id: "filter-design",
      title: "Design Roles",
      category: "Quick Filters",
      icon: Filter,
      run: () => navigate("/opportunities?domain=Design"),
    },
    {
      id: "filter-data",
      title: "Data & Analytics Roles",
      category: "Quick Filters",
      icon: Filter,
      run: () => navigate("/opportunities?domain=Data+%26+Analytics"),
    },
    {
      id: "filter-remote",
      title: "Remote Opportunities",
      category: "Quick Filters",
      icon: Filter,
      run: () => navigate("/opportunities?mode=Remote"),
    },
    {
      id: "filter-intern",
      title: "Internship Postings",
      category: "Quick Filters",
      icon: Filter,
      run: () => navigate("/opportunities?type=Internship"),
    },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = (item: CommandItem) => {
    setOpen(false);
    setQuery("");
    item.run();
  };

  const handleKeyDownInMenu = (e: React.KeyboardEvent) => {
    if (filtered.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[selectedIndex];
      if (item) handleSelect(item);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl p-0 overflow-hidden border-2 border-frame bg-card shadow-hard-lg">
        <div className="flex items-center gap-3 border-b-2 border-border px-4 py-3 bg-secondary/30">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDownInMenu}
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2" role="listbox">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching commands or pages
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2.5 text-sm cursor-pointer transition-colors",
                    isSelected ? "bg-primary text-primary-foreground font-semibold" : "text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.shortcut ? (
                      <kbd
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[10px] font-mono",
                          isSelected
                            ? "border-primary-foreground/40 bg-primary-foreground/20 text-primary-foreground"
                            : "border-border bg-secondary text-muted-foreground"
                        )}
                      >
                        {item.shortcut.replace("⌘", modKey).replace("Ctrl", modKey)}
                      </kbd>
                    ) : (
                      <span className={cn("text-xs opacity-60", isSelected && "opacity-90")}>
                        {item.category}
                      </span>
                    )}
                    {isSelected && <ArrowRight className="size-3.5" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground bg-secondary/50">
          <div className="flex items-center gap-2">
            <span>Navigate:</span>
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↑</kbd>
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↓</kbd>
            <span>Select:</span>
            <kbd className="rounded border border-border bg-background px-1 py-0.5 font-mono text-[10px]">↵</kbd>
          </div>
          <div>
            Open anytime: <kbd className="font-mono">{modKey}+K</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Reusable badge showing shortcut hints (e.g., ⌘K / Ctrl+K)
 */
export function ShortcutHint({ keys, className }: { keys: string; className?: string }) {
  const [modKey, setModKey] = useState("Ctrl");

  useEffect(() => {
    setModKey(getModifierKey());
  }, []);

  const formatted = keys.replace("⌘", modKey).replace("Ctrl", modKey);

  return (
    <kbd
      className={cn(
        "hidden sm:inline-flex items-center gap-0.5 rounded border border-border bg-secondary/80 px-1.5 py-0.5 text-[11px] font-mono font-medium text-muted-foreground shadow-sm select-none",
        className
      )}
      aria-label={`Shortcut: ${formatted}`}
    >
      {formatted}
    </kbd>
  );
}
