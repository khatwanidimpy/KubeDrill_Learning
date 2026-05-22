import type { LabSession, PracticeQuestion, TrainingMode, TrainingTrack } from "./types";


const seedQuestions: PracticeQuestion[] = [
  {
    id: "q-networkpolicy-dns",
    category: "Networking",
    difficulty: "HARD",
    prompt: "A namespace has a default-deny egress NetworkPolicy. Pods can no longer resolve DNS. What should you add?",
    scenario: "The policy blocks all egress. Applications must keep default-deny but regain DNS resolution through kube-dns/CoreDNS.",
    answer: "Add an egress rule that allows UDP and TCP port 53 to the kube-system DNS pods, usually selected with k8s-app=kube-dns.",
    explanation: "NetworkPolicy egress is additive. Keep default-deny, then explicitly allow DNS traffic to CoreDNS so service discovery works without opening all egress.",
    commands: [
      "kubectl get pods -n kube-system -l k8s-app=kube-dns",
      "kubectl apply -f allow-dns-egress.yaml",
    ],
    tags: ["NetworkPolicy", "DNS", "CKS"],
  },
  {
    id: "q-rbac-reader",
    category: "Kubernetes",
    difficulty: "MEDIUM",
    prompt: "Create least-privilege RBAC so service account scanner can list pods but cannot delete them.",
    scenario: "The scanner runs in namespace security and needs read-only visibility into pods in namespace workloads.",
    answer: "Create a Role in workloads with get/list/watch on pods, then bind it to system:serviceaccount:security:scanner with a RoleBinding.",
    explanation: "Use a namespaced Role instead of ClusterRole when the access is only needed in one namespace. Avoid verbs like create, update, patch or delete.",
    commands: [
      "kubectl create role pod-reader -n workloads --verb=get,list,watch --resource=pods",
      "kubectl create rolebinding scanner-pod-reader -n workloads --role=pod-reader --serviceaccount=security:scanner",
    ],
    tags: ["RBAC", "ServiceAccount", "Least privilege"],
  },
  {
    id: "q-privileged-pod",
    category: "Kubernetes",
    difficulty: "MEDIUM",
    prompt: "A pod is running with privileged: true. How do you harden it for a CKS-style answer?",
    scenario: "The workload does not need host-level access and should follow restricted pod security expectations.",
    answer: "Set privileged to false or remove it, run as non-root, drop ALL capabilities, disable privilege escalation, use RuntimeDefault seccomp and optionally readOnlyRootFilesystem.",
    explanation: "Privileged containers bypass most isolation. CKS hardening expects layered controls in securityContext, not just one field.",
    commands: [
      "kubectl get pod app -o yaml",
      "kubectl patch deployment app --type merge -p '<security context patch>'",
    ],
    tags: ["SecurityContext", "Seccomp", "Capabilities"],
  },
  {
    id: "q-image-vulnerability",
    category: "Kubernetes",
    difficulty: "EASY",
    prompt: "How do you find which workload is using a vulnerable image tag such as latest?",
    scenario: "A cluster contains many deployments and one security task asks you to identify risky image usage.",
    answer: "List workload images across namespaces and inspect tags. Prefer immutable version tags or digests instead of latest.",
    explanation: "The latest tag is mutable and weak for auditing. In exams, quickly query all images and narrow by namespace/workload.",
    commands: [
      "kubectl get deploy -A -o custom-columns='NS:.metadata.namespace,NAME:.metadata.name,IMAGE:.spec.template.spec.containers[*].image'",
    ],
    tags: ["Images", "Audit", "kubectl"],
  },
  {
    id: "q-apparmor-seccomp",
    category: "Kubernetes",
    difficulty: "HARD",
    prompt: "What is the difference between AppArmor and Seccomp in pod hardening?",
    scenario: "You need to choose the correct control for file/profile restrictions versus syscall filtering.",
    answer: "Seccomp filters Linux syscalls. AppArmor applies a Linux security profile that can restrict file access, capabilities and program behavior.",
    explanation: "Both can be used together. Seccomp RuntimeDefault is common baseline hardening, while AppArmor requires a loaded profile and pod annotation or security context support.",
    tags: ["AppArmor", "Seccomp", "Runtime security"],
  },
  {
    id: "q-crashloop-debug",
    category: "Kubernetes",
    difficulty: "MEDIUM",
    prompt: "A pod is in CrashLoopBackOff. What is your fastest troubleshooting sequence?",
    scenario: "The exam gives a broken deployment and you must identify whether it is config, command, image, probe or permission related.",
    answer: "Describe the pod, inspect previous logs, check events, compare env/config/secret mounts, verify probes and image command/args.",
    explanation: "CrashLoopBackOff is a symptom. previous logs and events usually reveal the failing command, missing file, bad env var or probe issue fastest.",
    commands: [
      "kubectl describe pod <pod>",
      "kubectl logs <pod> --previous",
      "kubectl get events --sort-by=.lastTimestamp",
    ],
    tags: ["Debugging", "Pods", "kubectl"],
  },
  {
    id: "q-interview-statefulset",
    category: "Kubernetes",
    difficulty: "EASY",
    prompt: "Interview: When would you use a StatefulSet instead of a Deployment?",
    scenario: "An interviewer asks for a practical workload example, not only a definition.",
    answer: "Use a StatefulSet when pods need stable names, ordered rollout or termination, and stable per-pod storage. Use a Deployment for stateless replicas.",
    explanation: "Good interview answers connect the controller to workload behavior. Databases and quorum systems often need identity and storage stability.",
    commands: ["kubectl explain statefulset", "kubectl explain deployment"],
    tags: ["Interview", "Workloads", "Beginner"],
  },
  {
    id: "q-interview-service-types",
    category: "Networking",
    difficulty: "EASY",
    prompt: "Interview: Explain ClusterIP, NodePort and LoadBalancer.",
    scenario: "The interviewer wants to know how traffic reaches pods from inside and outside the cluster.",
    answer: "ClusterIP exposes a Service only inside the cluster. NodePort opens a static port on every node. LoadBalancer asks the provider to create an external load balancer.",
    explanation: "Mention that Ingress often handles HTTP routing above Services, while Service type controls the exposure path.",
    commands: ["kubectl get svc -A", "kubectl expose deployment app --port=80 --type=ClusterIP"],
    tags: ["Interview", "Services", "Beginner"],
  },
];

const namespaces = [
  "finance",
  "payments",
  "frontend",
  "backend",
  "observability",
  "platform",
  "security",
  "staging",
  "production",
  "analytics",
  "orders",
  "shipping",
  "identity",
  "gateway",
  "logging",
  "monitoring",
  "data",
  "cache",
  "search",
  "sandbox",
  "audit",
  "billing",
  "inventory",
  "support",
  "ml",
  "batch",
  "registry",
  "ingress",
  "tools",
  "qa",
];

const workloads = [
  "api",
  "web",
  "worker",
  "scheduler",
  "consumer",
  "gateway",
  "checkout",
  "catalog",
  "reports",
  "notifier",
  "scanner",
  "agent",
  "controller",
  "syncer",
  "proxy",
  "frontend",
  "backend",
  "auth",
  "billing",
  "orders",
  "shipper",
  "indexer",
  "cache",
  "database",
  "collector",
  "logger",
  "metrics",
  "importer",
  "exporter",
  "search",
];

const ports = [53, 80, 443, 8080, 8443, 9090, 9093, 9100, 10250, 2379, 2380, 3000, 5000, 5432, 6379, 9200];
const resources = ["pods", "deployments", "services", "configmaps", "secrets", "jobs", "cronjobs", "nodes", "events", "endpoints"];
const verbs = ["get", "list", "watch", "create", "update", "patch", "delete"];
const probes = ["readiness", "liveness", "startup"];
const storageModes = ["ReadWriteOnce", "ReadOnlyMany", "ReadWriteMany"];
const imageIssues = ["latest tag", "root user", "privileged mode", "mutable tag", "missing digest", "known CVE"];
const ckaTopics = ["scheduling", "services", "storage", "rollouts", "troubleshooting", "autoscaling", "node maintenance", "config"];
const cksTopics = ["RBAC", "NetworkPolicy", "seccomp", "AppArmor", "audit logs", "image scanning", "runtime security", "Pod Security"];
const interviewTopics = ["architecture", "controllers", "networking", "storage", "debugging", "security", "scaling", "upgrades"];

type GeneratedTemplate = {
  category: PracticeQuestion["category"];
  tag: string;
  exam: "CKA" | "CKS" | "Interview";
  build: (parts: {
    namespace: string;
    workload: string;
    port: number;
    resource: string;
    verb: string;
    probe: string;
    storageMode: string;
    imageIssue: string;
    topic: string;
  }) => Pick<PracticeQuestion, "prompt" | "scenario" | "answer" | "explanation" | "commands">;
};

const generatedTemplates: GeneratedTemplate[] = [
  {
    category: "Kubernetes",
    tag: "CKA",
    exam: "CKA",
    build: ({ namespace, workload, probe }) => ({
      prompt: `CKA: ${workload} in namespace ${namespace} is not receiving traffic because its ${probe} probe fails. What do you check and fix first?`,
      scenario: `A Service selects the pods, but endpoints are empty or unstable. The workload uses a ${probe} probe.`,
      answer: `Describe the pod, inspect the ${probe} probe path/port, check container logs, then fix the probe so healthy pods become ready.`,
      explanation: "For CKA, connect Service traffic to readiness and endpoints. A pod can be Running but not Ready, so it will not receive Service traffic.",
      commands: [
        `kubectl describe pod -n ${namespace} -l app=${workload}`,
        `kubectl get endpoints -n ${namespace}`,
        `kubectl logs -n ${namespace} deploy/${workload}`,
      ],
    }),
  },
  {
    category: "Kubernetes",
    tag: "CKA",
    exam: "CKA",
    build: ({ namespace, workload, storageMode }) => ({
      prompt: `CKA: ${workload} in ${namespace} is Pending because its PVC cannot bind. How do you troubleshoot it?`,
      scenario: `The PVC asks for ${storageMode}. The pod never starts because storage is unavailable.`,
      answer: "Inspect the PVC, StorageClass, access mode, capacity and provisioner events. Fix the StorageClass or PVC request so it can bind.",
      explanation: "Pending pods often depend on unbound PVCs. CKA expects fast event-driven troubleshooting.",
      commands: [
        `kubectl describe pvc -n ${namespace}`,
        "kubectl get storageclass",
        `kubectl describe pod -n ${namespace} -l app=${workload}`,
      ],
    }),
  },
  {
    category: "Networking",
    tag: "CKA",
    exam: "CKA",
    build: ({ namespace, workload, port }) => ({
      prompt: `CKA: Expose deployment ${workload} in namespace ${namespace} internally on port ${port}. What should you create?`,
      scenario: "Other pods in the cluster need stable access to this workload, but no external exposure is required.",
      answer: `Create a ClusterIP Service selecting ${workload}, mapping port ${port} to the correct targetPort.`,
      explanation: "ClusterIP is the default internal Service type and is usually the safest answer for internal-only access.",
      commands: [`kubectl expose deployment ${workload} -n ${namespace} --port=${port} --type=ClusterIP`],
    }),
  },
  {
    category: "Kubernetes",
    tag: "CKS",
    exam: "CKS",
    build: ({ namespace, workload, imageIssue }) => ({
      prompt: `CKS: Workload ${workload} in ${namespace} has a security issue: ${imageIssue}. What should you change?`,
      scenario: "You must harden the workload without breaking application availability.",
      answer: "Patch the workload to remove the risky setting, use least privilege, pin trusted images, and verify the rollout.",
      explanation: "CKS rewards secure minimum-change fixes: remove unsafe runtime settings, avoid mutable images and verify the resulting workload state.",
      commands: [
        `kubectl get deploy ${workload} -n ${namespace} -o yaml`,
        `kubectl rollout status deploy/${workload} -n ${namespace}`,
      ],
    }),
  },
  {
    category: "Kubernetes",
    tag: "CKS",
    exam: "CKS",
    build: ({ namespace, workload }) => ({
      prompt: `CKS: Harden pod ${workload} in ${namespace} so it follows restricted security settings. What fields matter?`,
      scenario: "The pod currently runs too permissively and must be corrected for exam-style hardening.",
      answer: "Use runAsNonRoot, allowPrivilegeEscalation false, drop ALL capabilities, seccomp RuntimeDefault and avoid privileged/host namespaces.",
      explanation: "CKS pod hardening is layered. A single field is rarely enough for a strong answer.",
      commands: [`kubectl get pod -n ${namespace} -l app=${workload} -o yaml`],
    }),
  },
  {
    category: "Networking",
    tag: "CKS",
    exam: "CKS",
    build: ({ namespace, workload, port }) => ({
      prompt: `CKS: Only app=${workload} pods in ${namespace} should receive ingress on TCP ${port}. How do you lock this down?`,
      scenario: "The namespace currently allows too much pod-to-pod traffic.",
      answer: `Create a NetworkPolicy selecting app=${workload}, set policyTypes Ingress, and allow only the required source selectors and TCP ${port}.`,
      explanation: "NetworkPolicy is allow-list based once selected. Keep selectors precise and avoid broad namespace-wide access.",
      commands: [`kubectl get networkpolicy -n ${namespace}`, `kubectl describe pod -n ${namespace} -l app=${workload}`],
    }),
  },
  {
    category: "Kubernetes",
    tag: "Interview",
    exam: "Interview",
    build: ({ topic, resource }) => ({
      prompt: `Interview: Explain Kubernetes ${topic} using ${resource} as your example.`,
      scenario: "The interviewer wants a practical answer that shows real troubleshooting and operational understanding.",
      answer: `Explain what ${resource} does, how it affects ${topic}, one common failure mode, and the kubectl commands you would use to verify it.`,
      explanation: "Strong interview answers are structured: concept, real example, failure mode, command-level verification.",
      commands: [`kubectl explain ${resource}`, `kubectl get ${resource} -A`],
    }),
  },
  {
    category: "Kubernetes",
    tag: "Interview",
    exam: "Interview",
    build: ({ workload, namespace, resource }) => ({
      prompt: `Interview: ${workload} in ${namespace} is unhealthy. How would you debug it from Kubernetes first principles?`,
      scenario: "You need to answer like an engineer who has handled production incidents.",
      answer: `Start with pod status, events, logs, resource usage, selectors, config, secrets and related ${resource}. Then make the smallest safe fix.`,
      explanation: "Interviewers look for a calm debugging sequence, not random commands.",
      commands: [
        `kubectl get pods -n ${namespace}`,
        `kubectl describe pod -n ${namespace} -l app=${workload}`,
        `kubectl logs -n ${namespace} deploy/${workload}`,
      ],
    }),
  },
  {
    category: "Kubernetes",
    tag: "CKA",
    exam: "CKA",
    build: ({ namespace, workload, verb, resource }) => ({
      prompt: `CKA: Create access so ${workload} in ${namespace} can ${verb} ${resource}. What RBAC objects are needed?`,
      scenario: "The workload uses a service account and should receive only the needed namespace-scoped permission.",
      answer: `Create a Role with verb ${verb} on ${resource}, then create a RoleBinding to the workload service account.`,
      explanation: "Use Role/RoleBinding for namespaced access. Use ClusterRole only when cluster-scoped access is truly required.",
      commands: [
        `kubectl create role ${workload}-${resource}-${verb} -n ${namespace} --verb=${verb} --resource=${resource}`,
        `kubectl auth can-i ${verb} ${resource} -n ${namespace}`,
      ],
    }),
  },
  {
    category: "Kubernetes",
    tag: "CKS",
    exam: "CKS",
    build: ({ namespace, workload, verb, resource }) => ({
      prompt: `CKS: Service account for ${workload} can ${verb} ${resource} in ${namespace}, but this is too broad. How do you reduce risk?`,
      scenario: "The exam asks you to enforce least privilege without removing required application behavior.",
      answer: "Inspect the Role/ClusterRole and bindings, remove unnecessary verbs/resources, prefer namespaced RoleBinding and verify with kubectl auth can-i.",
      explanation: "Least privilege is central to CKS. Always verify the final permission from the service account identity.",
      commands: [
        `kubectl get role,rolebinding -n ${namespace}`,
        `kubectl auth can-i ${verb} ${resource} -n ${namespace} --as system:serviceaccount:${namespace}:${workload}`,
      ],
    }),
  },
];

const generatedQuestionCapacity =
  generatedTemplates.length *
  namespaces.length *
  workloads.length *
  ports.length *
  resources.length *
  verbs.length *
  probes.length *
  storageModes.length *
  imageIssues.length *
  Math.max(ckaTopics.length, cksTopics.length, interviewTopics.length);

const difficultyOrder = { EASY: 0, MEDIUM: 1, HARD: 2 };

export function sortQuestionsByDifficulty(questions: PracticeQuestion[]) {
  return [...questions].sort(
    (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty],
  );
}

export const trainingCatalog: TrainingTrack[] = [
  {
    id: "cks-question-exam",
    mode: "MOCK_EXAM",
    title: "CKS Mock Question Session",
    description: "Timed practical Kubernetes security questions with answers and explanations.",
    durationMinutes: 60,
    difficulty: "HARD",
    tasks: [],
    questions: seedQuestions.slice(0, 4),
  },
  {
    id: "cka-question-exam",
    mode: "MOCK_EXAM",
    title: "CKA Exam Preparation",
    description: "Beginner-to-hard CKA practice for scheduling, services, storage, rollouts and troubleshooting.",
    durationMinutes: 60,
    difficulty: "MEDIUM",
    tasks: [],
    questions: seedQuestions.filter((question) => question.difficulty !== "HARD").slice(0, 5),
  },
  {
    id: "cks-clear-path",
    mode: "MOCK_EXAM",
    title: "Clear CKS Practice Path",
    description: "Security-focused CKS questions for RBAC, NetworkPolicy, runtime hardening and image risk.",
    durationMinutes: 90,
    difficulty: "HARD",
    tasks: [],
    questions: seedQuestions.filter((question) => question.tags.includes("CKS") || question.difficulty === "HARD"),
  },
  {
    id: "guided-question-lab",
    mode: "PRACTICE_LAB",
    title: "Guided Answer Practice",
    description: "Scenario questions with command hints, correct answers and explanation review.",
    durationMinutes: 35,
    difficulty: "MEDIUM",
    tasks: [],
    questions: seedQuestions.slice(1, 5),
  },
  {
    id: "live-question-session",
    mode: "PLAYGROUND",
    title: "Live Question Session",
    description: "Continuous Kubernetes question stream. Click More questions whenever you want a fresh set.",
    durationMinutes: 45,
    difficulty: "EASY",
    tasks: [],
    questions: seedQuestions.slice(2),
  },
  {
    id: "kubernetes-interview",
    mode: "PRACTICE_LAB",
    title: "Kubernetes Interview Questions",
    description: "Beginner-to-hard interview questions with concise answers and command hints.",
    durationMinutes: 40,
    difficulty: "MEDIUM",
    tasks: [],
    questions: seedQuestions.filter((question) => question.tags.includes("Interview")),
  },
];

export function generateMoreQuestions(
  existingQuestions: PracticeQuestion[],
  count = 3,
): PracticeQuestion[] {
  const usedPrompts = new Set(existingQuestions.map((question) => question.prompt));
  const questions: PracticeQuestion[] = [];
  let cursor = existingQuestions.length;

  while (questions.length < count && cursor < generatedQuestionCapacity) {
    const template = generatedTemplates[cursor % generatedTemplates.length];
    const namespace = namespaces[Math.floor(cursor / generatedTemplates.length) % namespaces.length];
    const workload = workloads[Math.floor(cursor / 7) % workloads.length];
    const port = ports[Math.floor(cursor / 11) % ports.length];
    const resource = resources[Math.floor(cursor / 13) % resources.length];
    const verb = verbs[Math.floor(cursor / 17) % verbs.length];
    const probe = probes[Math.floor(cursor / 19) % probes.length];
    const storageMode = storageModes[Math.floor(cursor / 23) % storageModes.length];
    const imageIssue = imageIssues[Math.floor(cursor / 29) % imageIssues.length];
    const topics =
      template.exam === "CKA"
        ? ckaTopics
        : template.exam === "CKS"
          ? cksTopics
          : interviewTopics;
    const topic = topics[Math.floor(cursor / 31) % topics.length];
    const built = template.build({
      namespace,
      workload,
      port,
      resource,
      verb,
      probe,
      storageMode,
      imageIssue,
      topic,
    });

    if (!usedPrompts.has(built.prompt)) {
      const serial = cursor + 1;
      questions.push({
        id: `generated-${serial}`,
        category: template.category,
        difficulty: serial % 5 === 0 ? "HARD" : serial % 2 === 0 ? "MEDIUM" : "EASY",
        prompt: built.prompt,
        scenario: built.scenario,
        answer: built.answer,
        explanation: built.explanation,
        commands: built.commands,
        tags: [template.tag, template.exam, "Generated"],
      });
      usedPrompts.add(built.prompt);
    }
    cursor++;
  }

  return questions;
}

export const k8sPlatformApi = {
  async createSession(trackId: string, mode: TrainingMode): Promise<LabSession> {
    const track = trainingCatalog.find((item) => item.id === trackId);
    if (!track) throw new Error("Training track not found");

    return {
      id: `session_${Date.now()}`,
      mode,
      title: track.title,
      status: "READY",
      expiresAt: new Date(Date.now() + track.durationMinutes * 60_000).toISOString(),
      tasks: [],
      questions: sortQuestionsByDifficulty(track.questions ?? []),
    };
  },

  async getSession(id: string): Promise<LabSession | null> {
    const cached = sessionStorage.getItem(`lab_session:${id}`);
    return cached ? (JSON.parse(cached) as LabSession) : null;
  },
};
