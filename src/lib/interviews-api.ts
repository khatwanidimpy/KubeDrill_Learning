/**
 * Interview API layer.
 *
 * Tries the backend at VITE_API_URL first. If those endpoints aren't
 * implemented yet, falls back to a local-storage mock so the UI is fully
 * usable end-to-end during development.
 */
import { api } from "./api";
import type { Interview, AttemptAnswer, AttemptResult } from "./types";

const LS_INTERVIEWS = "mock_interviews";
const LS_RESULTS = "mock_results";

function loadLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
function saveLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed a couple of demo interviews on first load
function seed() {
  const existing = loadLS<Interview[] | null>(LS_INTERVIEWS, null);
  if (existing && existing.length) return;
  const demo: Interview[] = [
    {
      id: "k8s-101",
      title: "Kubernetes Fundamentals",
      description: "Pods, Deployments, Services and core concepts.",
      difficulty: "EASY",
      durationMinutes: 15,
      category: "Kubernetes",
      published: true,
      questions: [
        {
          id: "q1",
          type: "MCQ",
          category: "Kubernetes",
          prompt: "Which object manages a set of identical pods with rolling updates?",
          options: ["DaemonSet", "Deployment", "StatefulSet", "Job"],
          correctIndex: 1,
        },
        {
          id: "q2",
          type: "MCQ",
          category: "Kubernetes",
          prompt: "Default service type that exposes a Service on a cluster-internal IP?",
          options: ["NodePort", "LoadBalancer", "ClusterIP", "ExternalName"],
          correctIndex: 2,
        },
        {
          id: "q3",
          type: "CODE",
          category: "Kubernetes",
          prompt: "Write the kubectl command to list all pods in the 'prod' namespace.",
          starterCode: "kubectl ",
          expectedAnswer: "kubectl get pods -n prod",
        },
      ],
    },
    {
      id: "docker-deep",
      title: "Docker Deep Dive",
      description: "Images, layers, networks and best practices.",
      difficulty: "MEDIUM",
      durationMinutes: 20,
      category: "Docker",
      published: true,
      questions: [
        {
          id: "q1",
          type: "MCQ",
          category: "Docker",
          prompt: "Which instruction creates a new image layer?",
          options: ["CMD", "ENTRYPOINT", "RUN", "EXPOSE"],
          correctIndex: 2,
        },
      ],
    },
  ];
  saveLS(LS_INTERVIEWS, demo);
}

export const interviewsApi = {
  async list(): Promise<Interview[]> {
    try {
      const { data } = await api.get("/interviews");
      return data.interviews ?? data;
    } catch {
      seed();
      return loadLS<Interview[]>(LS_INTERVIEWS, []);
    }
  },

  async get(id: string): Promise<Interview | null> {
    try {
      const { data } = await api.get(`/interviews/${id}`);
      return data.interview ?? data;
    } catch {
      seed();
      return loadLS<Interview[]>(LS_INTERVIEWS, []).find((i) => i.id === id) ?? null;
    }
  },

  async create(i: Interview): Promise<Interview> {
    try {
      const { data } = await api.post("/interviews", i);
      return data.interview ?? data;
    } catch {
      const all = loadLS<Interview[]>(LS_INTERVIEWS, []);
      saveLS(LS_INTERVIEWS, [...all, i]);
      return i;
    }
  },

  async update(i: Interview): Promise<Interview> {
    try {
      const { data } = await api.put(`/interviews/${i.id}`, i);
      return data.interview ?? data;
    } catch {
      const all = loadLS<Interview[]>(LS_INTERVIEWS, []);
      saveLS(LS_INTERVIEWS, all.map((x) => (x.id === i.id ? i : x)));
      return i;
    }
  },

  async remove(id: string): Promise<void> {
    try {
      await api.delete(`/interviews/${id}`);
    } catch {
      const all = loadLS<Interview[]>(LS_INTERVIEWS, []);
      saveLS(LS_INTERVIEWS, all.filter((x) => x.id !== id));
    }
  },

  async submit(
    interviewId: string,
    answers: AttemptAnswer[],
  ): Promise<AttemptResult> {
    try {
      const { data } = await api.post(`/interviews/${interviewId}/submit`, { answers });
      return data.result ?? data;
    } catch {
      // Local scoring fallback
      const interview = await interviewsApi.get(interviewId);
      if (!interview) throw new Error("Interview not found");
      let correct = 0;
      for (const a of answers) {
        const q = interview.questions.find((q) => q.id === a.questionId);
        if (!q) continue;
        if (q.type === "MCQ" && q.correctIndex === a.value) correct++;
        if (
          q.type === "CODE" &&
          typeof a.value === "string" &&
          q.expectedAnswer &&
          a.value.trim() === q.expectedAnswer.trim()
        ) {
          correct++;
        }
      }
      const total = interview.questions.length;
      const result: AttemptResult = {
        id: `r_${Date.now()}`,
        interviewId,
        interviewTitle: interview.title,
        score: total ? Math.round((correct / total) * 100) : 0,
        total,
        correct,
        submittedAt: new Date().toISOString(),
        answers,
      };
      const history = loadLS<AttemptResult[]>(LS_RESULTS, []);
      saveLS(LS_RESULTS, [result, ...history]);
      return result;
    }
  },

  async history(): Promise<AttemptResult[]> {
    try {
      const { data } = await api.get("/results");
      return data.results ?? data;
    } catch {
      return loadLS<AttemptResult[]>(LS_RESULTS, []);
    }
  },

  async getResult(id: string): Promise<AttemptResult | null> {
    try {
      const { data } = await api.get(`/results/${id}`);
      return data.result ?? data;
    } catch {
      return loadLS<AttemptResult[]>(LS_RESULTS, []).find((r) => r.id === id) ?? null;
    }
  },
};
