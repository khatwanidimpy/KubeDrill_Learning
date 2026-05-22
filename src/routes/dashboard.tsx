import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { k8sPlatformApi, trainingCatalog } from "@/lib/k8s-platform-api";
import type { TrainingMode, TrainingTrack } from "@/lib/types";
import {
  Activity,
  FlaskConical,
  Gauge,
  Loader2,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: DashboardPage });

function DashboardPage() {
  return (
    <ProtectedRoute>
      <AppShell><Dashboard /></AppShell>
    </ProtectedRoute>
  );
}

const modeCopy: Record<TrainingMode, { label: string; icon: typeof ShieldCheck }> = {
  MOCK_EXAM: { label: "Mock Exam", icon: ShieldCheck },
  PRACTICE_LAB: { label: "Practice Lab", icon: FlaskConical },
  PLAYGROUND: { label: "Live Questions", icon: Sparkles },
};

function Dashboard() {
  const router = useRouter();
  const [starting, setStarting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function start(track: TrainingTrack) {
    setStarting(track.id);
    setError(null);
    try {
      const session = await k8sPlatformApi.createSession(track.id, track.mode);
      sessionStorage.setItem(`lab_session:${session.id}`, JSON.stringify(session));
      router.navigate({ to: "/session/$id", params: { id: session.id } });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setStarting(null);
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h1 className="text-2xl font-semibold">Kubernetes exam practice</h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Pick a question track, answer under a timer, reveal the correct solution,
            then click More questions to keep practicing.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-card p-3">
          {[
            { label: "Generator", value: "1M+", icon: Gauge },
            { label: "Sessions", value: "0", icon: Activity },
            { label: "Rank", value: "-", icon: Trophy },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-md bg-muted/50 p-3">
              <Icon className="h-4 w-4 text-primary" />
              <div className="mono mt-2 text-lg font-semibold">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <section className="grid gap-4 md:grid-cols-3">
        {trainingCatalog.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            starting={starting === track.id}
            onStart={() => start(track)}
          />
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Skill weaknesses</h2>
          <div className="mt-4 space-y-3">
            {["NetworkPolicy", "RBAC", "Runtime security", "Troubleshooting"].map((skill, index) => (
              <div key={skill}>
                <div className="flex justify-between text-sm">
                  <span>{skill}</span>
                  <span className="mono text-muted-foreground">{45 + index * 9}%</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${45 + index * 9}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Live question session</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Timed Kubernetes certification practice without cluster setup.</li>
            <li>Each question includes a scenario, answer, explanation and useful commands.</li>
            <li>Click More questions to append fresh non-duplicate exam-style questions instantly.</li>
            <li>Question difficulty moves from Beginner to Medium to Hard.</li>
            <li>Mark answers as correct or missed to track session score.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function TrackCard({
  track,
  starting,
  onStart,
}: {
  track: TrainingTrack;
  starting: boolean;
  onStart: () => void;
}) {
  const mode = modeCopy[track.mode];
  const Icon = mode.icon;

  return (
    <div className="flex min-h-[280px] flex-col rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="gap-1">
          <Icon className="h-3.5 w-3.5" /> {mode.label}
        </Badge>
        <Badge variant="outline">{track.difficulty}</Badge>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{track.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{track.description}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span>{track.durationMinutes} min</span>
        <span>{track.questions?.length ?? 0} starter questions</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {Array.from(new Set(track.tasks.flatMap((task) => task.skills))).slice(0, 4).map((skill) => (
          <Badge key={skill} variant="outline">{skill}</Badge>
        ))}
      </div>
      <Button className="mt-auto" onClick={onStart} disabled={starting}>
        {starting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Play className="mr-1 h-4 w-4" />}
        Start
      </Button>
    </div>
  );
}
