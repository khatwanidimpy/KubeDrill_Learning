import { Link, useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Moon, Sun, LogOut, LayoutDashboard, Shield, Boxes } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useTheme } from "@/lib/theme-store";
import { Button } from "@/components/ui/button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { theme, toggle, apply } = useTheme();
  const router = useRouter();

  useEffect(() => { apply(); }, [apply]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Boxes className="h-5 w-5 text-primary" />
            <span>KubeDrill</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              to="/about"
              className="rounded-md px-3 py-1.5 text-sm hover:bg-accent"
              activeProps={{ className: "bg-accent text-accent-foreground" }}
            >
              About
            </Link>
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-md px-3 py-1.5 text-sm hover:bg-accent"
                  activeProps={{ className: "bg-accent text-accent-foreground" }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </span>
                </Link>
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="rounded-md px-3 py-1.5 text-sm hover:bg-accent"
                    activeProps={{ className: "bg-accent text-accent-foreground" }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <Shield className="h-4 w-4" /> Admin
                    </span>
                  </Link>
                )}
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            {user ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {user.name}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { logout(); router.navigate({ to: "/login" }); }}
                >
                  <LogOut className="mr-1 h-4 w-4" /> Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Login</Button></Link>
                <Link to="/register"><Button size="sm">Sign up</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 text-sm text-muted-foreground md:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Boxes className="h-4 w-4 text-primary" />
              <span>KubeDrill</span>
            </div>
            <p className="mt-2 max-w-md">
              Kubernetes exam preparation with timed CKA, CKS and interview-style
              question sessions from beginner to hard.
            </p>
          </div>
          <div>
            <div className="font-medium text-foreground">Practice</div>
            <div className="mt-2 grid gap-1">
              <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
              <Link to="/about" className="hover:text-foreground">About</Link>
            </div>
          </div>
          <div>
            <div className="font-medium text-foreground">Focus areas</div>
            <p className="mt-2">
              RBAC, NetworkPolicy, storage, troubleshooting, security context,
              services, probes and controller behavior.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
