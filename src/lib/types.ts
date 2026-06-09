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

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: Category;
  published: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
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

export type TrainingMode = "MOCK_EXAM" | "PRACTICE_LAB" | "PLAYGROUND";

export type SessionStatus =
  | "PROVISIONING"
  | "READY"
  | "EXPIRED"
  | "FAILED"
  | "PROVISIONER_REQUIRED";

export interface ValidationRule {
  id: string;
  label: string;
  points: number;
  command: string;
}

export interface LabTask {
  id: string;
  title: string;
  objective: string;
  category: Category;
  difficulty: Difficulty;
  estimatedMinutes: number;
  skills: string[];
  validationRules: ValidationRule[];
}

export interface TrainingTrack {
  id: string;
  mode: TrainingMode;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: Difficulty;
  tasks: LabTask[];
  questions?: PracticeQuestion[];
}

export interface LabSession {
  id: string;
  mode: TrainingMode;
  title: string;
  status: SessionStatus;
  namespace?: string;
  terminalUrl?: string;
  expiresAt?: string;
  tasks: LabTask[];
  questions?: PracticeQuestion[];
  message?: string;
}

export interface PracticeQuestion {
  id: string;
  category: Category;
  difficulty: Difficulty;
  prompt: string;
  scenario: string;
  answer: string;
  explanation: string;
  commands?: string[];
  tags: string[];
}
