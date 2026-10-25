import { createFileRoute, Link, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Briefcase, Inbox, LogOut } from "lucide-react";
import { checkAdmin, lockAdmin } from "@/lib/gate.functions";

export const Route = createFileRoute("/admin")({
  beforeLoad: async () => {
    const { unlocked } = await checkAdmin();
    if (!unlocked) throw redirect({ to: "/admin-login" });
  },
  head: () => ({
    meta: [
      { title: "Admin · firstshift" },
      { name: "description", content: "Manage opportunities and review applications." },
      { property: "og:title", content: "Admin · firstshift" },
      { property: "og:description", content: "Manage opportunities and review applications." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const lock = useServerFn(lockAdmin);
  const item = "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
  const active = { className: "bg-ink text-ink-foreground hover:bg-ink hover:text-ink-foreground" };
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-3 hidden text-xs font-bold uppercase tracking-widest text-muted-foreground lg:block">Employer console</p>
        <p className="mb-3 rounded-md border border-border bg-card p-2 text-xs text-muted-foreground">Demo mode: changes are stored in this browser only.</p>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
          <Link to="/admin" activeOptions={{ exact: true }} className={item} activeProps={active}>
            <Briefcase className="size-4" /> Opportunities
          </Link>
          <Link to="/admin/applications" className={item} activeProps={active}>
            <Inbox className="size-4" /> Applications
          </Link>
          <button
            className={item}
            onClick={async () => {
              await lock();
              await router.navigate({ to: "/admin-login" });
            }}
          >
            <LogOut className="size-4" /> Lock
          </button>
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
