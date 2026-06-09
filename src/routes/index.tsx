import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Compass,
  ExternalLink,
  FileQuestion,
  FileText,
  Gauge,
  ListChecks,
  Network,
  NotebookTabs,
  SearchCheck,
  ServerCog,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/")({ component: Landing });

const sections = [
  { id: "home-details", label: "Home Details" },
  { id: "overview", label: "CKA and CKAD Overview" },
  { id: "format", label: "Exam Format" },
  { id: "question-format", label: "Question Format" },
  { id: "comparison", label: "CKA vs CKAD" },
  { id: "domains", label: "Topic Domains" },
  { id: "practice-flow", label: "Practice Flow" },
  { id: "commands", label: "Command Patterns" },
  { id: "questions", label: "Practice Questions" },
  { id: "blog", label: "Blog Preview" },
  { id: "tips", label: "Preparation Tips" },
  { id: "resources", label: "Useful Resources" },
];

const examFacts = [
  { label: "Duration", value: "2 hours", icon: Clock },
  { label: "Style", value: "Hands-on tasks", icon: Terminal },
  { label: "Pass score", value: "66% for CKA and CKAD", icon: CheckCircle2 },
  { label: "Cluster version", value: "Kubernetes v1.35", icon: ServerCog },
];

const homeHighlights = [
  {
    title: "Practice like the real exam",
    text: "The home page now starts with task-based Kubernetes scenarios, not abstract theory.",
    icon: Terminal,
  },
  {
    title: "Learn the answer pattern",
    text: "Each question follows a practical flow: read the task, choose commands, apply YAML and verify.",
    icon: SearchCheck,
  },
  {
    title: "Move from blog to drills",
    text: "Read the strategy notes, then jump into timed practice sessions when you are ready.",
    icon: Gauge,
  },
];

const examComparison = [
  {
    exam: "CKA",
    focus: "Cluster administration",
    examples:
      "Nodes, scheduling, storage, services, troubleshooting, upgrades and cluster operations.",
  },
  {
    exam: "CKAD",
    focus: "Application delivery",
    examples: "Pods, Deployments, Jobs, probes, ConfigMaps, Secrets, Services and NetworkPolicy.",
  },
];

const practiceFlow = [
  {
    step: "Read",
    text: "Find the namespace, resource type, name, image, port, labels and expected result.",
  },
  {
    step: "Generate",
    text: "Use kubectl create or run with dry-run output when a manifest will save time.",
  },
  {
    step: "Apply",
    text: "Edit only the fields required by the task, then apply the manifest or run the command.",
  },
  {
    step: "Verify",
    text: "Confirm with get, describe, logs, events, rollout status, endpoints or a direct request.",
  },
];

const commandPatterns = [
  {
    title: "Generate YAML fast",
    command: "kubectl create deployment api --image=nginx:1.27 --dry-run=client -o yaml",
  },
  {
    title: "Check namespace events",
    command: "kubectl get events -n app-team --sort-by=.lastTimestamp",
  },
  {
    title: "Inspect service endpoints",
    command: "kubectl get endpoints api -n app-team",
  },
  {
    title: "Debug previous crash logs",
    command: "kubectl logs pod/api-1 -n app-team --previous",
  },
];

const domains = [
  {
    title: "Cluster operations",
    text: "Create resources, inspect node health, debug workloads, manage scheduling and read events quickly.",
    icon: ServerCog,
  },
  {
    title: "Workloads and apps",
    text: "Deploy Pods, Deployments, Jobs, CronJobs, ConfigMaps, Secrets, probes and resource limits.",
    icon: BookOpenCheck,
  },
  {
    title: "Services and networking",
    text: "Expose applications with Services and Ingress, troubleshoot DNS and apply NetworkPolicy rules.",
    icon: Network,
  },
  {
    title: "Security and access",
    text: "Work with ServiceAccounts, RBAC, securityContext settings, admission behavior and least privilege.",
    icon: ShieldCheck,
  },
];

const practiceQuestions = [
  {
    badge: "CKA",
    title: "Create a deployment and expose it",
    prompt:
      "Create a deployment named web with 3 replicas using nginx:1.27, then expose it as a ClusterIP service on port 80.",
    answer: [
      "kubectl create deployment web --image=nginx:1.27 --replicas=3",
      "kubectl expose deployment web --port=80 --target-port=80",
      "kubectl get deploy,svc web",
    ],
    note: "Verify the selector and endpoint count. A service without matching endpoints usually means the labels do not line up.",
  },
  {
    badge: "CKAD",
    title: "Add a readiness probe",
    prompt:
      "Update an existing pod manifest so the app is ready only after /healthz returns success on container port 8080.",
    answer: [
      "readinessProbe:",
      "  httpGet:",
      "    path: /healthz",
      "    port: 8080",
      "  initialDelaySeconds: 5",
      "  periodSeconds: 10",
    ],
    note: "Use a readiness probe when traffic should wait. Use a liveness probe when Kubernetes should restart a stuck container.",
  },
  {
    badge: "CKA",
    title: "Find a failing workload",
    prompt:
      "A pod in namespace payments is CrashLoopBackOff. Find the error and capture the previous container logs.",
    answer: [
      "kubectl get pods -n payments",
      "kubectl describe pod <pod-name> -n payments",
      "kubectl logs <pod-name> -n payments --previous",
    ],
    note: "In the exam, describe output and events often point to image, command, probe or volume issues faster than guessing.",
  },
  {
    badge: "CKAD",
    title: "Create a NetworkPolicy",
    prompt:
      "Allow only pods with label role=frontend to connect to pods labeled app=api on TCP port 8080 in the same namespace.",
    answer: [
      "apiVersion: networking.k8s.io/v1",
      "kind: NetworkPolicy",
      "metadata:",
      "  name: allow-frontend-to-api",
      "spec:",
      "  podSelector:",
      "    matchLabels:",
      "      app: api",
      "  ingress:",
      "    - from:",
      "        - podSelector:",
      "            matchLabels:",
      "              role: frontend",
      "      ports:",
      "        - protocol: TCP",
      "          port: 8080",
      "  policyTypes:",
      "    - Ingress",
    ],
    note: "NetworkPolicies are namespace-scoped. If cross-namespace access is required, include a namespaceSelector.",
  },
];

const questionFormats = [
  {
    label: "Task",
    text: "A short scenario tells you what Kubernetes resource to create, update, inspect or fix.",
  },
  {
    label: "Context",
    text: "The prompt may mention a namespace, cluster context, labels, image, port, storage class or policy rule.",
  },
  {
    label: "Command or YAML",
    text: "Most answers use kubectl first, then generated YAML when the task needs exact fields.",
  },
  {
    label: "Verification",
    text: "Every answer should end with a quick check such as get, describe, logs, events or endpoint validation.",
  },
];

const blogPosts = [
  {
    title: "How to Solve CKA and CKAD Questions Faster",
    text: "Build a habit of reading the noun, namespace and success condition before touching the terminal.",
    href: "/blog",
  },
  {
    title: "kubectl Commands You Should Know Before the Exam",
    text: "Dry-run output, explain, rollout status, events and logs are the daily tools of exam speed.",
    href: "/blog#kubectl-commands",
  },
  {
    title: "CKAD YAML Mistakes That Waste Time",
    text: "Selectors, probe ports, command arrays and indentation cause more lost minutes than hard concepts.",
    href: "/blog#yaml-mistakes",
  },
];

function Landing() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" />;

  return (
    <AppShell>
      <div className="space-y-10">
        <section className="grid gap-8 py-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="gap-2">
              <FileQuestion className="h-3.5 w-3.5" />
              CKA and CKAD exam questions
            </Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Kubernetes CKA and CKAD Questions and Answers
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              A focused practice page for hands-on Kubernetes certification tasks, command patterns,
              YAML fixes and quick answer review.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["CKA", "Admin tasks"],
                ["CKAD", "App tasks"],
                ["Blog", "Exam notes"],
              ].map(([label, text]) => (
                <div key={label} className="rounded-lg border border-border bg-card p-3">
                  <div className="text-xl font-semibold">{label}</div>
                  <div className="text-sm text-muted-foreground">{text}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/register">
                <Button size="lg">
                  Start practice <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#questions">
                <Button size="lg" variant="outline">
                  View questions
                </Button>
              </a>
              <Link to="/blog">
                <Button size="lg" variant="ghost">
                  Read blog
                </Button>
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-card p-4 shadow-sm lg:sticky lg:top-20">
            <div className="flex items-center gap-2 font-semibold">
              <ListChecks className="h-4 w-4 text-primary" />
              Table of contents
            </div>
            <nav className="mt-3 grid gap-1 text-sm">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="rounded-md px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {section.label}
                </a>
              ))}
            </nav>
          </aside>
        </section>

        <section id="home-details" className="scroll-mt-20">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <Badge variant="secondary" className="gap-2">
                <Compass className="h-3.5 w-3.5" />
                Detailed home
              </Badge>
              <h2 className="mt-3 text-2xl font-semibold">What You Can Do on KubeDrill</h2>
              <p className="mt-3 text-muted-foreground">
                This home page is designed like a practical exam-prep article. You can scan the exam
                format, understand the question structure, study examples and move into live
                practice without changing context.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {homeHighlights.map(({ title, text, icon: Icon }) => (
                <div key={title} className="rounded-lg border border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="overview" className="scroll-mt-20">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold">CKA and CKAD Overview</h2>
              <p className="mt-3 text-muted-foreground">
                CKA focuses on administrator responsibilities. CKAD focuses on building, configuring
                and troubleshooting applications that run on Kubernetes. Both reward fast terminal
                work and clear command choices.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {examFacts.map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-lg border border-border bg-card p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <div className="mt-3 text-sm text-muted-foreground">{label}</div>
                  <div className="mt-1 font-semibold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="format" className="scroll-mt-20 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold">Exam Format</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              "Read each task, set the correct context and namespace, then solve directly in the terminal.",
              "Use kubectl dry-run output, short names and official docs to reduce YAML typing time.",
              "Verify every result with get, describe, logs, events or a direct workload check before moving on.",
            ].map((item, index) => (
              <div key={item} className="rounded-md bg-muted/45 p-4">
                <div className="mono text-sm text-primary">0{index + 1}</div>
                <p className="mt-2 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="question-format" className="scroll-mt-20">
          <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <h2 className="text-2xl font-semibold">Question Format</h2>
              <p className="mt-3 text-muted-foreground">
                A strong CKA or CKAD practice question should look like the real exam: direct task,
                minimal story, clear constraints and a result you can verify.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 font-semibold">
                <NotebookTabs className="h-5 w-5 text-primary" />
                Sample question structure
              </div>
              <div className="mt-4 grid gap-3">
                {questionFormats.map((item, index) => (
                  <div
                    key={item.label}
                    className="grid gap-2 rounded-md bg-muted/45 p-4 sm:grid-cols-[7rem_1fr]"
                  >
                    <div className="mono text-sm text-primary">
                      {index + 1}. {item.label}
                    </div>
                    <p className="text-sm text-muted-foreground">{item.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-md border border-border p-4">
                <div className="text-sm font-medium">Example format</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  In namespace <code>app-team</code>, create a Deployment named <code>api</code>
                  with image <code>nginx:1.27</code> and 2 replicas. Expose it on port 80, then
                  verify that the Service has endpoints.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="comparison"
          className="scroll-mt-20 rounded-lg border border-border bg-card p-6"
        >
          <h2 className="text-2xl font-semibold">CKA vs CKAD</h2>
          <p className="mt-2 text-muted-foreground">
            Both exams are hands-on, but the questions feel different. CKA asks you to operate the
            cluster. CKAD asks you to build and fix workloads inside the cluster.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {examComparison.map((item) => (
              <div key={item.exam} className="rounded-md bg-muted/45 p-5">
                <div className="text-sm text-muted-foreground">Exam focus</div>
                <h3 className="mt-1 text-xl font-semibold">{item.exam}</h3>
                <p className="mt-2 font-medium">{item.focus}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.examples}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="domains" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold">Topic Domains</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {domains.map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-lg border border-border bg-card p-5">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="practice-flow" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold">Practice Flow</h2>
          <p className="mt-2 text-muted-foreground">
            Use this same flow for every mock question. Repetition is what turns Kubernetes lookup
            into exam speed.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-4">
            {practiceFlow.map((item, index) => (
              <div key={item.step} className="rounded-lg border border-border bg-card p-5">
                <div className="mono text-sm text-primary">0{index + 1}</div>
                <h3 className="mt-3 font-semibold">{item.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="commands" className="scroll-mt-20 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold">Command Patterns to Remember</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {commandPatterns.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-md border border-border">
                <div className="border-b border-border px-3 py-2 text-sm font-medium">
                  {item.title}
                </div>
                <pre className="overflow-x-auto bg-muted/35 p-3 text-sm">
                  <code>{item.command}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section id="questions" className="scroll-mt-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Practice Questions and Answers</h2>
              <p className="mt-2 text-muted-foreground">
                Use these as short drills. Solve first, reveal mentally, then compare with the
                answer.
              </p>
            </div>
            <Link to="/register">
              <Button variant="outline">Practice in sessions</Button>
            </Link>
          </div>

          <div className="mt-5 space-y-4">
            {practiceQuestions.map((question, index) => (
              <article key={question.title} className="rounded-lg border border-border bg-card p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>{question.badge}</Badge>
                  <span className="mono text-sm text-muted-foreground">Question {index + 1}</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold">{question.title}</h3>
                <p className="mt-2 text-muted-foreground">{question.prompt}</p>
                <div className="mt-4 overflow-hidden rounded-md border border-border bg-muted/35">
                  <div className="border-b border-border px-3 py-2 text-sm font-medium">Answer</div>
                  <pre className="overflow-x-auto p-3 text-sm">
                    <code>{question.answer.join("\n")}</code>
                  </pre>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{question.note}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="blog" className="scroll-mt-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Kubernetes Exam Blog</h2>
              <p className="mt-2 text-muted-foreground">
                Short blog-style guides for command speed, YAML repair and exam strategy.
              </p>
            </div>
            <Link to="/blog">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Open blog
              </Button>
            </Link>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.title}
                to={post.href}
                className="rounded-lg border border-border bg-card p-5 hover:border-primary/50"
              >
                <h3 className="font-semibold">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{post.text}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Read article <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="tips" className="scroll-mt-20 rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold">Preparation Tips</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              "Set aliases for kubectl, but keep full commands familiar in case an environment resets.",
              "Practice editing generated YAML instead of writing long manifests from memory.",
              "Learn to debug from events, logs, endpoints and selectors before changing resources.",
              "Time-box difficult questions and return after collecting easier points.",
            ].map((tip) => (
              <div key={tip} className="flex gap-3 rounded-md bg-muted/45 p-4 text-sm">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="resources" className="scroll-mt-20">
          <h2 className="text-2xl font-semibold">Useful Resources</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                title: "Official Kubernetes docs",
                href: "https://kubernetes.io/docs/",
                text: "Use docs during practice so lookup becomes natural.",
              },
              {
                title: "Linux Foundation FAQ",
                href: "https://docs.linuxfoundation.org/tc-docs/certification/faq-cka-ckad-cks",
                text: "Check exam duration, pass score, version and candidate rules.",
              },
              {
                title: "KubeDrill dashboard",
                href: "/register",
                text: "Move from reading to timed practice sessions.",
              },
            ].map((resource) => (
              <a
                key={resource.title}
                href={resource.href}
                className="rounded-lg border border-border bg-card p-5 hover:border-primary/50"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold">{resource.title}</h3>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{resource.text}</p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
