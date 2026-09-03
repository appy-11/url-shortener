# -----------------------------
# Build stage
# -----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first.
# Docker can cache npm install when source code hasn't changed.
COPY package*.json ./

RUN npm ci

# Copy TypeScript configuration and source code.
COPY tsconfig.json ./
COPY vitest.config.ts ./
COPY src ./src

# Copy database migration files.
COPY migrations ./migrations

# Compile TypeScript into dist/
RUN npm run build


# -----------------------------
# Production stage
# -----------------------------
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled application.
COPY --from=builder /app/dist ./dist

# Copy SQL migration files.
# The migration runner expects them at /app/migrations.
COPY --from=builder /app/migrations ./migrations

# API port.
EXPOSE 3000

# Start the Express API.
CMD ["node", "dist/server.js"]