import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { Boxes, Terminal, Timer as TimerIcon, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" />;

  return (
    <AppShell>
      <section className="grid gap-12 py-12 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Boxes className="h-3.5 w-3.5 text-primary" /> Built for DevOps engineers
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Ace your <span className="text-primary">Kubernetes</span> interviews.
          </h1>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Timed mock interviews covering Kubernetes, Docker, Helm, CI/CD,
            Networking, Monitoring, Linux and Terraform. MCQs + coding prompts.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/register"><Button size="lg">Get started</Button></Link>
            <Link to="/login"><Button size="lg" variant="outline">Log in</Button></Link>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mono text-xs text-muted-foreground">~ kubectl get interviews</div>
          <div className="mt-3 space-y-3">
            {[
              { i: Terminal, t: "MCQ + Code", d: "Realistic question mix" },
              { i: TimerIcon, t: "Timed sessions", d: "Practice under pressure" },
              { i: Trophy, t: "Instant scoring", d: "Track progress over time" },
            ].map(({ i: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3 rounded-md border border-border p-3">
                <Icon className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
}
