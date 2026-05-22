export type Role = "STUDENT" | "ADMIN";

export type Category =
  | "Kubernetes"
  | "Docker"
  | "Helm"
  | "CI/CD"
  | "Networking"
  | "Monitoring"
  | "Linux"
  | "Terraform";

export const CATEGORIES: Category[] = [
  "Kubernetes",
  "Docker",
  "Helm",
  "CI/CD",
  "Networking",
  "Monitoring",
  "Linux",
  "Terraform",
];

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type QuestionType = "MCQ" | "CODE";

export interface Question {
  id: string;
  type: QuestionType;
  category: Category;
  prompt: string;
  options?: string[];           // MCQ only
  correctIndex?: number;        // MCQ only
  starterCode?: string;         // CODE only
  expectedAnswer?: string;      // CODE only (simple match)
}

export interface Interview {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  durationMinutes: number;
  category: Category;
  published: boolean;
  questions: Question[];
}

export interface AttemptAnswer {
  questionId: string;
  value: string | number;
}

export interface AttemptResult {
  id: string;
  interviewId: string;
  interviewTitle: string;
  score: number;       // 0..100
  total: number;
  correct: number;
  submittedAt: string;
  answers: AttemptAnswer[];
}
