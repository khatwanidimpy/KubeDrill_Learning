import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer } from "@/components/Timer";
import {
  generateMoreQuestions,
  k8sPlatformApi,
  sortQuestionsByDifficulty,
} from "@/lib/k8s-platform-api";
import type { LabSession, PracticeQuestion } from "@/lib/types";
import {
  CheckCircle2,
  Eye,
  Loader2,
  Plus,
  RotateCcw,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/session/$id")({ component: Page });

function Page() {
  return (
    <ProtectedRoute>
      <AppShell><QuestionSession /></AppShell>
    </ProtectedRoute>
  );
}

function QuestionSession() {
  const { id } = Route.useParams();
  const [session, setSession] = useState<LabSession | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, "correct" | "missed">>({});
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = sessionStorage.getItem(`lab_session:${id}`);
    const source = cached
      ? Promise.resolve(JSON.parse(cached) as LabSession)
      : k8sPlatformApi.getSession(id);

    source
      .then((data) => {
        if (!data) {
          setError("Session not found");
          return;
        }
        setSession(data);
        setQuestions(sortQuestionsByDifficulty(data.questions ?? []));
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [id]);

  const question = questions[active];
  const answered = Object.keys(scores).length;
  const correct = Object.values(scores).filter((value) => value === "correct").length;
  const percent = answered ? Math.round((correct / answered) * 100) : 0;

  const remainingSeconds = useMemo(() => {
    if (!session?.expiresAt) return 45 * 60;
    return Math.max(0, Math.floor((new Date(session.expiresAt).getTime() - Date.now()) / 1000));
  }, [session?.expiresAt]);

  function persist(nextQuestions: PracticeQuestion[]) {
    if (!session) return;
    const nextSession = { ...session, questions: nextQuestions };
    setSession(nextSession);
    sessionStorage.setItem(`lab_session:${session.id}`, JSON.stringify(nextSession));
  }

  function addMoreQuestions() {
    const more = generateMoreQuestions(questions, 3);
    if (more.length === 0) return;
    const next = sortQuestionsByDifficulty([...questions, ...more]);
    setQuestions(next);
    persist(next);
  }

  function resetSession() {
    setActive(0);
    setRevealed({});
    setScores({});
    setDone(false);
  }

  if (loading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading questions...</div>;
  }
  if (error) return <p className="text-destructive">{error}</p>;
  if (!session || !question) return <p className="text-muted-foreground">No questions in this session.</p>;

  if (done) {
    const missed = answered - correct;
    const remaining = questions.length - answered;

    return (
      <div className="mx-auto max-w-3xl space-y-5">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h1 className="text-2xl font-semibold">Session progress</h1>
          <div className="mono mt-6 text-6xl font-bold text-primary">{percent}%</div>
          <p className="mt-2 text-sm text-muted-foreground">
            {correct} correct, {missed} missed, {remaining} not marked
          </p>
          <div className="mt-6 h-3 rounded-full bg-muted">
            <div className="h-3 rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mono text-2xl font-semibold">{questions.length}</div>
            <div className="text-sm text-muted-foreground">Total questions</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mono text-2xl font-semibold text-success">{correct}</div>
            <div className="text-sm text-muted-foreground">Correct</div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="mono text-2xl font-semibold text-destructive">{missed}</div>
            <div className="text-sm text-muted-foreground">Missed</div>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setDone(false)}>Review answers</Button>
          <Button onClick={addMoreQuestions}>
            <Plus className="mr-1 h-4 w-4" /> More questions
          </Button>
          <Link to="/dashboard"><Button variant="outline">Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{session.title}</h1>
            <Badge variant="secondary">Live questions</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {questions.length} questions loaded. Reveal answers when you are ready, then mark yourself.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Timer seconds={remainingSeconds} onElapsed={() => undefined} />
          <Button variant="outline" size="sm" onClick={resetSession}>
            <RotateCcw className="mr-1 h-4 w-4" /> Reset
          </Button>
          <Button size="sm" onClick={addMoreQuestions}>
            <Plus className="mr-1 h-4 w-4" /> More questions
          </Button>
          <Button size="sm" onClick={() => setDone(true)}>
            Done
          </Button>
        </div>
      </div>

      <div className="grid min-h-[68vh] gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <h2 className="font-semibold">Question queue</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Score: {correct}/{answered || 0} {answered > 0 ? `(${percent}%)` : ""}
            </p>
          </div>
          <div className="max-h-[62vh] divide-y divide-border overflow-y-auto">
            {questions.map((item, index) => (
              <button
                key={item.id}
                className={`block w-full p-4 text-left hover:bg-accent ${
                  active === index ? "bg-accent" : ""
                }`}
                onClick={() => setActive(index)}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium">Question {index + 1}</span>
                  <span className="flex items-center gap-2">
                    <Badge variant="outline">{item.difficulty === "EASY" ? "Beginner" : item.difficulty}</Badge>
                    {scores[item.id] === "correct" && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {scores[item.id] === "missed" && <XCircle className="h-4 w-4 text-destructive" />}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.prompt}</p>
              </button>
            ))}
          </div>
        </aside>

        <main className="rounded-lg border border-border bg-card p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{question.category}</Badge>
            <Badge variant="outline">{question.difficulty === "EASY" ? "Beginner" : question.difficulty}</Badge>
            {question.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>

          <h2 className="mt-4 text-2xl font-semibold">{question.prompt}</h2>
          <p className="mt-3 rounded-md border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
            {question.scenario}
          </p>

          {question.commands && question.commands.length > 0 && (
            <div className="mt-4 rounded-md border border-border bg-background p-4">
              <div className="text-sm font-medium">Useful commands</div>
              <div className="mt-2 space-y-2">
                {question.commands.map((command) => (
                  <pre key={command} className="mono overflow-x-auto rounded-md bg-black p-3 text-xs text-white">
                    {command}
                  </pre>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => setRevealed((state) => ({ ...state, [question.id]: true }))}
            >
              <Eye className="mr-1 h-4 w-4" /> Show answer
            </Button>
            <Button
              variant={scores[question.id] === "correct" ? "default" : "outline"}
              onClick={() => setScores((state) => ({ ...state, [question.id]: "correct" }))}
            >
              <CheckCircle2 className="mr-1 h-4 w-4" /> I got it
            </Button>
            <Button
              variant={scores[question.id] === "missed" ? "destructive" : "outline"}
              onClick={() => setScores((state) => ({ ...state, [question.id]: "missed" }))}
            >
              <XCircle className="mr-1 h-4 w-4" /> Missed
            </Button>
          </div>

          {revealed[question.id] && (
            <section className="mt-5 space-y-4 rounded-md border border-border bg-muted/30 p-4">
              <div>
                <h3 className="font-semibold">Answer</h3>
                <p className="mt-2 text-sm">{question.answer}</p>
              </div>
              <div>
                <h3 className="font-semibold">Why</h3>
                <p className="mt-2 text-sm text-muted-foreground">{question.explanation}</p>
              </div>
            </section>
          )}

          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" disabled={active === 0} onClick={() => setActive((value) => value - 1)}>
              Previous
            </Button>
            <Button
              disabled={active >= questions.length - 1}
              onClick={() => setActive((value) => value + 1)}
            >
              Next
            </Button>
          </div>
        </main>
      </div>

      <div className="flex justify-end">
        <Link to="/dashboard"><Button variant="outline">Back to dashboard</Button></Link>
      </div>
    </div>
  );
}
