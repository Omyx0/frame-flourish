import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Briefcase, Inbox, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/utils/utils";

export function AdminLayout() {
  const { isAuthenticated, isLoading, logout, admin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/admin-login", { state: { from: location }, replace: true });
    return null;
  }

  const itemClass = (path: string, exact = false) => {
    const active = exact ? location.pathname === path : location.pathname.startsWith(path);
    return cn(
      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      active
        ? "bg-ink text-ink-foreground shadow-hard-sm"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/admin-login");
  };

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <p className="mb-2 hidden text-xs font-bold uppercase tracking-widest text-muted-foreground lg:block">
          Employer console
        </p>
        <div className="mb-4 rounded-md border border-border bg-card p-3 text-xs">
          <p className="font-semibold text-foreground truncate">{admin?.email}</p>
          <p className="text-muted-foreground">Admin Access</p>
        </div>
        <nav className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
          <Link to="/admin" className={itemClass("/admin", true)}>
            <Briefcase className="size-4" /> Opportunities
          </Link>
          <Link to="/admin/applications" className={itemClass("/admin/applications")}>
            <Inbox className="size-4" /> Applications
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </nav>
      </aside>

      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
