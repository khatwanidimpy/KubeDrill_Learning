import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { interviewsApi } from "@/lib/interviews-api";
import type { AttemptResult } from "@/lib/types";
import { Loader2, Trophy } from "lucide-react";

export const Route = createFileRoute("/results/$id")({ component: Page });

function Page() {
  return (
    <ProtectedRoute>
      <AppShell><Results /></AppShell>
    </ProtectedRoute>
  );
}

function Results() {
  const { id } = Route.useParams();
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    interviewsApi.getResult(id).then((r) => {
      if (!r) setError("Result not found");
      else setResult(r);
    }).catch((e) => setError((e as Error).message));
  }, [id]);

  if (error) return <AppShell><p className="text-destructive">{error}</p></AppShell>;
  if (!result) {
    return <div className="flex items-center gap-2 p-8 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
  }

  const tone =
    result.score >= 80 ? "text-success" :
    result.score >= 50 ? "text-warning" : "text-destructive";

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Trophy className={`mx-auto h-12 w-12 ${tone}`} />
        <h1 className="mt-4 text-2xl font-semibold">{result.interviewTitle}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Submitted {new Date(result.submittedAt).toLocaleString()}
        </p>
        <div className={`mono mt-6 text-6xl font-bold ${tone}`}>{result.score}%</div>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.correct} of {result.total} correct
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Link to="/dashboard"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    </div>
  );
}
