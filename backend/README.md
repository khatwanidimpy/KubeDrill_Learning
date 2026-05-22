# Mock Test Platform — Auth Backend

Node.js + Express + TypeScript + PostgreSQL + Prisma + JWT.

## Setup (local)

```bash
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run dev
```

API runs at `http://localhost:4000`.

## Setup (Docker)

```bash
cd backend
docker compose up --build
```

Migrations run automatically on container start.

## Endpoints

### POST /register
```json
{ "name": "Alice", "email": "alice@test.com", "password": "secret123", "role": "STUDENT" }
```
→ `201 { user, token }`

### POST /login
```json
{ "email": "alice@test.com", "password": "secret123" }
```
→ `200 { user, token }`

### GET /me  (protected)
Header: `Authorization: Bearer <token>`
→ `200 { user }`

## cURL examples

```bash
curl -X POST localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"a@test.com","password":"secret123"}'

curl -X POST localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"a@test.com","password":"secret123"}'

curl localhost:4000/me -H "Authorization: Bearer <TOKEN>"
```

## Structure

```
backend/
├── prisma/schema.prisma
├── src/
│   ├── config/      # env, prisma client
│   ├── controllers/ # auth handlers
│   ├── middleware/  # auth, error
│   ├── routes/      # express routers
│   ├── utils/       # jwt
│   ├── app.ts
│   └── server.ts
├── Dockerfile
├── docker-compose.yml
└── .env.example
```
