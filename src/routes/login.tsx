import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const { login, loading, error } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocalError(null);
    if (!email.includes("@")) return setLocalError("Enter a valid email");
    if (password.length < 6) return setLocalError("Password too short");
    try {
      await login(email, password);
      router.navigate({ to: "/dashboard" });
    } catch { /* shown via store error */ }
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-sm py-10">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          </div>
          {(localError || error) && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {localError || error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted-foreground">
          No account? <Link to="/register" className="text-primary underline">Sign up</Link>
        </p>
      </div>
    </AppShell>
  );
}
