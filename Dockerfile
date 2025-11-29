# ------------------------------------------------------------------------------
# Base Stage: Common setup for all stages
# ------------------------------------------------------------------------------
# Use specific digest (SHA) for reproducible builds and security (prevents supply chain attacks via tag updates).
FROM node:lts-alpine@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43 AS base
WORKDIR /app

# [SECURITY UPDATE & DEPENDENCIES]
# 1. Update/Upgrade: Patches known OS-level vulnerabilities in the base image.
# 2. libc6-compat: Required for some C++ based Node.js modules to work on Alpine.
# 3. tini: A tiny init process that handles OS signals (like SIGTERM/SIGINT) correctly for graceful shutdowns.
RUN apk update && apk upgrade && \
    apk add --no-cache libc6-compat tini

COPY package*.json ./
# Change ownership to the 'node' user (non-root) to prevent permission issues
RUN chown -R node:node /app
# Switch to non-root user for all subsequent operations
USER node

# ------------------------------------------------------------------------------
# Development Stage: Local development environment
# ------------------------------------------------------------------------------
FROM base AS development
# Explicitly set CI to false to avoid default CI behaviors in some tools
ENV CI=false
# Install ALL dependencies (including devDependencies)
RUN npm install
COPY --chown=node:node . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# ------------------------------------------------------------------------------
# Builder Stage: Compiles the TypeScript code
# ------------------------------------------------------------------------------
FROM base AS builder
# Set CI to true to ensure deterministic builds and avoid interactive prompts
ENV CI=true
# Clean install of dependencies (respects package-lock.json)
RUN npm ci
COPY --chown=node:node . .
# Builds the application to the /dist folder
RUN npm run build

# ------------------------------------------------------------------------------
# Prod-Deps Stage: Prepares production-only dependencies
# ------------------------------------------------------------------------------
FROM base AS prod-deps
ENV CI=true
# Install only production dependencies into a clean layer.
# --omit=dev: Skips devDependencies (saves space).
# --ignore-scripts: Critical security measure to prevent malicious scripts from running during installation.
RUN npm ci --omit=dev --ignore-scripts

# ------------------------------------------------------------------------------
# Production Stage: The final, lean executable image
# ------------------------------------------------------------------------------
FROM base AS production
ENV NODE_ENV="production"
# Ensure we are running as the non-root 'node' user for security
USER node

WORKDIR /app

# Copy package.json files as they might be needed by some libraries at runtime (e.g., for version reading).
COPY --chown=node:node package*.json ./

# Copy only necessary artifacts from previous stages:
# 1. node_modules from 'prod-deps' (clean, production-only)
# 2. dist folder from 'builder' (compiled code)
COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/dist ./dist

EXPOSE 3000

# Healthcheck: Ensures the application is responsive.
# Allows orchestrators (like Docker Swarm/K8s) to restart the container if it hangs.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --tries=1 --spider http://localhost:3000/v1/healthcheck || exit 1

# Use Tini as the entrypoint to handle signal forwarding to the Node.js process
ENTRYPOINT ["/sbin/tini", "--"]

# Start the application
CMD ["node", "dist/main.js"]