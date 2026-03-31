# ──────────────────────────────────────────
# Stage 1: Builder
# ──────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies needed for native modules (e.g. sharp, pg)
RUN apk add --no-cache python3 make g++

# Copy package files first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (dev + prod needed for build)
RUN npm ci

# Copy the full source
COPY . .

# Build frontend (Vite → dist/public) and server (esbuild → dist/index.cjs)
RUN npm run build

# ──────────────────────────────────────────
# Stage 2: Production
# ──────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Default port (Dokploy can override via PORT env var)
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "dist/index.cjs"]
