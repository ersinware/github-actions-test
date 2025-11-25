# Base Stage: Common dependencies for both dev and prod builds
FROM node:lts-alpine@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43 AS base
WORKDIR /app
# Copy package files first to leverage layer caching
COPY package*.json ./
# Security: Give ownership of the workdir to the 'node' user (non-root)
RUN chown -R node:node /app
# Switch to the non-root user for all subsequent operations
USER node

# Development Stage: Used for local development or 'docker compose up --watch'
FROM base AS development
# Install ALL dependencies, including devDependencies
RUN npm install
# Copy all source code with correct ownership
COPY --chown=node:node . .
# Expose the default NestJS port
EXPOSE 3000
# Command to run the dev server with hot-reload
CMD ["npm", "run", "start:dev"]

# Builder Stage: Intermediate stage to build the production app
FROM base AS builder
# NOTE: NestJS requires devDependencies (like @nestjs/cli, typescript) to build.
# We do NOT set NODE_ENV="production" here to ensure 'npm ci' installs them.
RUN npm ci
# Copy all source code
COPY --chown=node:node . .
# Run the build script (outputs to /app/dist)
RUN npm run build

# Production Stage: Final lean image for deployment
FROM node:lts-alpine@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43 AS production
WORKDIR /app
# Copy only package files needed for runtime
COPY package*.json ./
# Set permissions
RUN chown -R node:node /app
USER node
# Install only production dependencies and clean up cache/files
RUN npm ci --production && \
    npm cache clean --force && \
    rm -f package*.json package-lock.json
# Copy the built application from the 'builder' stage
COPY --from=builder --chown=node:node /app/dist ./dist
# Expose the application port
EXPOSE 3000
# Force production mode for performance and cleaner logs
ENV NODE_ENV="production"
# Healthcheck: Verifies the app is responsive
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --tries=1 --spider http://localhost:3000/v1/healthcheck || exit 1
# Start the application
CMD ["node", "dist/main.js"]