import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/Timer";
import { CodeEditor } from "@/components/CodeEditor";
import { interviewsApi } from "@/lib/interviews-api";
import type { Interview, AttemptAnswer } from "@/lib/types";
import { Loader2, ChevronLeft, ChevronRight, Send } from "lucide-react";

export const Route = createFileRoute("/interview/$id")({ component: Page });

function Page() {
  return (
    <ProtectedRoute>
      <AppShell><InterviewRunner /></AppShell>
    </ProtectedRoute>
  );
}

function InterviewRunner() {
  const { id } = Route.useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    interviewsApi.get(id).then((i) => {
      if (!i) setError("Interview not found");
      else setInterview(i);
    }).catch((e) => setError((e as Error).message));
  }, [id]);

  const onSubmit = useMemo(() => async () => {
    if (!interview) return;
    setSubmitting(true);
    try {
      const payload: AttemptAnswer[] = interview.questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] ?? (q.type === "MCQ" ? -1 : ""),
      }));
      const r = await interviewsApi.submit(interview.id, payload);
      router.navigate({ to: "/results/$id", params: { id: r.id } });
    } catch (e) {
      setError((e as Error).message);
      setSubmitting(false);
    }
  }, [interview, answers, router]);

  if (error) return <p className="text-destructive">{error}</p>;
  if (!interview) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
  }

  const q = interview.questions[idx];
  const total = interview.questions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{interview.title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{interview.category}</Badge>
            <Badge variant="outline">{interview.difficulty}</Badge>
            <span>Question {idx + 1} of {total}</span>
          </div>
        </div>
        <Timer seconds={interview.durationMinutes * 60} onElapsed={onSubmit} />
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="text-sm text-muted-foreground">{q.category} · {q.type}</div>
        <h2 className="mt-2 text-lg font-medium">{q.prompt}</h2>

        <div className="mt-5">
          {q.type === "MCQ" && q.options ? (
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                const checked = answers[q.id] === i;
                return (
                  <label key={i}
                    className={`flex cursor-pointer items-center gap-3 rounded-md border p-3 text-sm transition-colors ${
                      checked ? "border-primary bg-primary/10" : "border-border hover:bg-accent"
                    }`}>
                    <input
                      type="radio"
                      name={q.id}
                      checked={checked}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                      className="h-4 w-4 accent-current"
                    />
                    <span>{opt}</span>
                  </label>
                );
              })}
            </div>
          ) : (
            <CodeEditor
              value={(answers[q.id] as string) ?? q.starterCode ?? ""}
              onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))}
              placeholder="Type your answer…"
            />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" disabled={idx === 0} onClick={() => setIdx((i) => i - 1)}>
          <ChevronLeft className="mr-1 h-4 w-4" /> Previous
        </Button>
        <div className="flex gap-2">
          {idx < total - 1 ? (
            <Button onClick={() => setIdx((i) => i + 1)}>
              Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={onSubmit} disabled={submitting}>
              <Send className="mr-1 h-4 w-4" />
              {submitting ? "Submitting…" : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
