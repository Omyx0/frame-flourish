import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock } from "lucide-react";
import { btn, Spinner } from "@/components/brand";
import { useAuth } from "@/context/AuthContext";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState("admin@firstshift.dev");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // If already authenticated, redirect
  const from = location.state?.from?.pathname || "/admin";
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm animate-rise rounded-lg bg-card p-6 frame shadow-hard">
        <span className="grid size-11 place-items-center rounded-md border-2 border-frame bg-primary text-primary-foreground">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Admin console</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to manage listings and review candidate submissions.</p>

        <label htmlFor="email" className="mt-6 block text-sm font-semibold">
          Admin Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-md border-2 border-input bg-background px-3 outline-none focus:border-ring"
        />

        <label htmlFor="pw" className="mt-4 block text-sm font-semibold">
          Password
        </label>
        <input
          id="pw"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-md border-2 border-input bg-background px-3 outline-none focus:border-ring"
        />

        {error && (
          <p className="mt-3 rounded-sm border border-destructive bg-accent p-2 text-xs font-semibold text-destructive" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={busy} className={`${btn("primary")} mt-6 w-full cursor-pointer`}>
          {busy && <Spinner />} Sign in
        </button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Default seed credentials: <br />
          <span className="font-mono text-foreground">admin@firstshift.dev / admin123</span>
        </p>
      </form>
    </div>
  );
}

export default AdminLoginPage;
