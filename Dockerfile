FROM node:20-alpine

WORKDIR /app

ARG VITE_API_URL=http://localhost:4000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json bun.lock* ./
RUN npm install -g bun && bun install

COPY . .

EXPOSE 8080

CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "8080"]
