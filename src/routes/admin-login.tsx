import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Lock } from "lucide-react";
import { useState } from "react";
import { btn, Spinner } from "@/components/brand";
import { unlockAdmin } from "@/lib/gate.functions";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin sign-in · firstshift" },
      { name: "description", content: "Enter the admin password to manage firstshift." },
      { property: "og:title", content: "Admin sign-in · firstshift" },
      { property: "og:description", content: "Enter the admin password to manage firstshift." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const unlock = useServerFn(unlockAdmin);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    try {
      const { ok } = await unlock({ data: { password } });
      if (ok) await router.navigate({ to: "/admin" });
      else setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-[70vh] place-items-center px-4 py-16">
      <form onSubmit={onSubmit} className="w-full max-w-sm animate-rise rounded-lg bg-card p-6 frame">
        <span className="grid size-11 place-items-center rounded-md border-2 border-frame bg-primary text-primary-foreground">
          <Lock className="size-5" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold">Admin area</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter the password to continue.</p>
        <label htmlFor="pw" className="mt-6 block text-sm font-semibold">Password</label>
        <input
          id="pw"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1.5 h-11 w-full rounded-md border-2 border-input bg-background px-3 outline-none focus:border-ring"
        />
        {error && <p className="mt-2 text-sm font-medium text-destructive" role="alert">Incorrect password.</p>}
        <button type="submit" disabled={busy} className={`${btn("primary")} mt-6 w-full`}>
          {busy && <Spinner />} Unlock
        </button>
      </form>
    </div>
  );
}
