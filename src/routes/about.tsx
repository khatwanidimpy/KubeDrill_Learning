import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpenCheck, Brain, CheckCircle2, Layers3 } from "lucide-react";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <AppShell>
      <div className="space-y-10">
        <section className="max-w-3xl">
          <Badge variant="secondary">About KubeDrill</Badge>
          <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
            Practice Kubernetes until the exam questions feel familiar.
          </h1>
          <p className="mt-4 text-muted-foreground">
            KubeDrill is built for CKA, CKS and Kubernetes interview preparation.
            It focuses on practical scenarios, concise answers, command hints and
            timed repetition instead of passive reading.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/dashboard"><Button>Start practice</Button></Link>
            <Link to="/register"><Button variant="outline">Create account</Button></Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpenCheck,
              title: "CKA preparation",
              text: "Scheduling, services, storage, rollouts, probes and troubleshooting.",
            },
            {
              icon: CheckCircle2,
              title: "CKS preparation",
              text: "RBAC, NetworkPolicy, pod hardening, image risk and runtime security.",
            },
            {
              icon: Brain,
              title: "Interview answers",
              text: "Clear explanations for architecture, debugging and production behavior.",
            },
            {
              icon: Layers3,
              title: "Huge question pool",
              text: "A combinational generator creates fresh non-duplicate practice questions.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">How it works</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "Choose a track for CKA, CKS, guided practice or interview prep.",
              "Answer timed Kubernetes scenario questions from beginner to hard.",
              "Reveal the answer, mark correct or missed, then review progress.",
            ].map((text, index) => (
              <div key={text} className="rounded-md bg-muted/40 p-4">
                <div className="mono text-sm text-primary">0{index + 1}</div>
                <p className="mt-2 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
