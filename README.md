# K8sPrep — Kubernetes Mock Interview Platform (Frontend)

Modern, dark-mode-first frontend for practicing Kubernetes / DevOps interviews.

## Stack

- **React 19 + TypeScript** on Vite (TanStack Start)
- **TanStack Router** (file-based, type-safe — same role as React Router)
- **Tailwind CSS v4** + shadcn/ui
- **Zustand** for auth + theme state (with `persist`)
- **Axios** with JWT interceptor

## Setup

```bash
cp .env.example .env
bun install        # or: npm install
bun run dev        # http://localhost:8080
```

## Environment

```
VITE_API_URL=http://localhost:4000
```

If the backend isn't running, the app falls back to a localStorage mock with
seeded interviews so the full UI flow remains demoable.

## Docker

```bash
docker build -t k8sprep-frontend .
docker run -p 8080:80 k8sprep-frontend
```

## Pages

| Route             | Purpose                                |
|-------------------|----------------------------------------|
| `/`               | Landing                                |
| `/login`          | Email + password login                 |
| `/register`       | Sign up                                |
| `/dashboard`      | Interview list + attempt history       |
| `/interview/$id`  | Timed runner (MCQ + code editor)       |
| `/results/$id`    | Score + summary                        |
| `/admin`          | CRUD interviews & questions, publish   |

`/dashboard`, `/interview/*`, `/results/*` require auth. `/admin` requires `ADMIN` role.

## Folder structure

```
src/
├── components/
│   ├── AppShell.tsx        # Header, theme toggle, nav
│   ├── ProtectedRoute.tsx  # Auth + role guard
│   ├── Timer.tsx
│   ├── CodeEditor.tsx
│   └── ui/                 # shadcn primitives
├── lib/
│   ├── api.ts              # Axios + JWT interceptor
│   ├── auth-store.ts       # Zustand auth (login/register/me/logout)
│   ├── theme-store.ts      # Dark mode
│   ├── interviews-api.ts   # Interview/result API (with LS fallback)
│   └── types.ts
└── routes/                 # File-based routes
```

## API integration

The Axios client attaches `Authorization: Bearer <token>` automatically from
`localStorage.auth_token`. Expected backend endpoints:

```
POST   /register             { name, email, password } -> { user, token }
POST   /login                { email, password }       -> { user, token }
GET    /me                                              -> { user }

GET    /interviews                                      -> Interview[]
GET    /interviews/:id                                  -> Interview
POST   /interviews           Interview                  -> Interview     (admin)
PUT    /interviews/:id       Interview                  -> Interview     (admin)
DELETE /interviews/:id                                                   (admin)

POST   /interviews/:id/submit { answers: [...] }        -> AttemptResult
GET    /results                                         -> AttemptResult[]
GET    /results/:id                                     -> AttemptResult
```

## Question categories

Kubernetes · Docker · Helm · CI/CD · Networking · Monitoring · Linux · Terraform
