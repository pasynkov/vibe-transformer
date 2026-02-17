# Multi-stage build for Transformator Mock API
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package*.json ./
COPY nest-cli.json ./
COPY tsconfig.json ./

# Copy workspace files
COPY apps/tsconfig.json ./apps/
COPY apps/transformator-mock ./apps/transformator-mock/

# Install dependencies
RUN npm ci

# Build the application
RUN npm run build:transformator

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist/apps/transformator-mock ./dist/apps/transformator-mock

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "dist/apps/transformator-mock/main.js"]
