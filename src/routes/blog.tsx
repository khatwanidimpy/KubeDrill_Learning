import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  FileText,
  Terminal,
  Wrench,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog")({ component: Blog });

const posts = [
  {
    id: "solve-faster",
    title: "How to Solve CKA and CKAD Questions Faster",
    icon: Clock,
    intro:
      "The exam is not only about knowing Kubernetes. It is about recognizing the task shape quickly and choosing the shortest reliable path.",
    points: [
      "Read the namespace, resource name, image and success condition before running commands.",
      "Use kubectl generators for common objects, then edit YAML only when a field is missing.",
      "Verify with a command that proves the task is complete, not just with a successful apply.",
    ],
  },
  {
    id: "kubectl-commands",
    title: "kubectl Commands You Should Know Before the Exam",
    icon: Terminal,
    intro: "A small set of commands covers most real exam tasks when you know how to combine them.",
    points: [
      "Use dry-run output to create Deployment, Pod, Service, Job and CronJob manifests quickly.",
      "Use describe, logs, events and endpoints to debug before changing a resource.",
      "Use rollout status and rollout undo when Deployment updates become the task.",
    ],
  },
  {
    id: "yaml-mistakes",
    title: "CKAD YAML Mistakes That Waste Time",
    icon: Wrench,
    intro:
      "Most YAML mistakes are small, but they cost time because the error appears after apply or during workload startup.",
    points: [
      "Match Service selectors to Pod labels exactly, including spelling and casing.",
      "Check whether command and args need string arrays instead of a single shell line.",
      "Use the correct probe port name or number, especially when the container exposes multiple ports.",
    ],
  },
];

function Blog() {
  return (
    <AppShell>
      <div className="space-y-10">
        <section className="max-w-4xl">
          <Badge variant="secondary" className="gap-2">
            <FileText className="h-3.5 w-3.5" />
            KubeDrill blog
          </Badge>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            CKA and CKAD Exam Preparation Blog
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
            Practical Kubernetes exam notes written in the same direct question-and-answer style you
            should practice before the real terminal exam.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#solve-faster">
              <Button>
                Start reading <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <Link to="/">
              <Button variant="outline">Back to questions</Button>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Hands-on",
              text: "Every article is written for terminal practice, not memorization.",
              icon: Terminal,
            },
            {
              title: "Exam focused",
              text: "Topics stay close to CKA and CKAD task patterns.",
              icon: BookOpenCheck,
            },
            {
              title: "Verification first",
              text: "Each habit ends with a way to prove the answer is correct.",
              icon: CheckCircle2,
            },
          ].map(({ title, text, icon: Icon }) => (
            <div key={title} className="rounded-lg border border-border bg-card p-5">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section className="space-y-5">
          {posts.map(({ id, title, icon: Icon, intro, points }) => (
            <article
              id={id}
              key={id}
              className="scroll-mt-20 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" />
                Kubernetes certification guide
              </div>
              <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
              <p className="mt-3 text-muted-foreground">{intro}</p>
              <div className="mt-5 grid gap-3">
                {points.map((point, index) => (
                  <div key={point} className="rounded-md bg-muted/45 p-4">
                    <div className="mono text-sm text-primary">0{index + 1}</div>
                    <p className="mt-2 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
