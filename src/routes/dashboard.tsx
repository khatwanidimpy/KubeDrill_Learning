import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { interviewsApi } from "@/lib/interviews-api";
import type { Interview, AttemptResult } from "@/lib/types";
import { Loader2, Play, Trophy } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell><Dashboard /></AppShell>
    </ProtectedRoute>
  );
}

function Dashboard() {
  const [interviews, setInterviews] = useState<Interview[] | null>(null);
  const [history, setHistory] = useState<AttemptResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [list, hist] = await Promise.all([
          interviewsApi.list(),
          interviewsApi.history(),
        ]);
        setInterviews(list.filter((i) => i.published));
        setHistory(hist);
      } catch (e) {
        setError((e as Error).message);
      }
    })();
  }, []);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!interviews) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
  }

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Mock interviews</h1>
            <p className="text-sm text-muted-foreground">Pick a set to begin.</p>
          </div>
        </div>
        {interviews.length === 0 ? (
          <p className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
            No interviews published yet.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interviews.map((i) => (
              <div key={i.id} className="flex flex-col rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{i.category}</Badge>
                  <Badge variant="outline">{i.difficulty}</Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold">{i.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{i.description}</p>
                <div className="mt-3 text-xs text-muted-foreground">
                  {i.questions.length} questions · {i.durationMinutes} min
                </div>
                <Link to="/interview/$id" params={{ id: i.id }} className="mt-4">
                  <Button className="w-full"><Play className="mr-1 h-4 w-4" /> Start</Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Your history</h2>
        {history.length === 0 ? (
          <p className="rounded-md border border-border bg-card p-6 text-sm text-muted-foreground">
            No attempts yet. Start an interview above.
          </p>
        ) : (
          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {history.map((r) => (
              <li key={r.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{r.interviewTitle}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(r.submittedAt).toLocaleString()} · {r.correct}/{r.total}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="mono inline-flex items-center gap-1.5 text-sm">
                    <Trophy className="h-4 w-4 text-warning" /> {r.score}%
                  </div>
                  <Link to="/results/$id" params={{ id: r.id }}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
