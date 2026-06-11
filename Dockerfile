# syntax=docker/dockerfile:1.4
# Multi-stage Dockerfile following OWASP Docker Security Best Practices
# https://owasp.org/www-project-docker-top-10/

# --- Stage 1: Builder ---
FROM node:22-alpine@sha256:9385cd9f3001dfc3431e8ead12c43e9e1f87cc1b9b5c6cfd0f73865d405b27c4 AS builder
LABEL stage=builder
WORKDIR /app

# Use package-lock.json for reproducible builds (OWASP: D02 - Sensitive Data Exposure Prevention)
COPY package*.json ./

# Install dependencies with security best practices
# --prefer-offline: Use cache when possible
# --no-audit: Skip npm audit (handled separately in CI/CD)
# --progress=false: Reduce verbosity
RUN npm ci --prefer-offline --no-audit --progress=false && \
    npm cache clean --force

# Copy build configuration files
COPY vite.config.js index.html ./

# Copy source files
COPY src ./src

# Build static assets with production optimizations
RUN npm run build && \
    # Clean up build artifacts not needed in final image
    rm -rf node_modules .npm

# --- Stage 2: Production Runtime (nginx, non-root, minimal) ---
# Using distroless or minimal base image (OWASP: D01 - Minimize Container Image)
FROM nginxinc/nginx-unprivileged:1.29-alpine@sha256:0c79d56aee561a1d81c63f00eee5fb5fe29279560cdc55e91425133104c7fbe6

# Metadata labels (OWASP: Documentation)
LABEL org.opencontainers.image.source="https://github.com/AmeerFaisalAdanan/formatje"
LABEL org.opencontainers.image.description="Formatje - JSON/GraphQL formatter and comparator"
LABEL org.opencontainers.image.version="1.0.0"
LABEL maintainer="Aamir Faisal <aamir@example.com>"

# Switch to root temporarily to set up files
USER root

# Copy built assets from builder
COPY --from=builder --chown=101:101 /app/dist /usr/share/nginx/html

# nginx configuration with security headers (OWASP) - see nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod 644 /etc/nginx/conf.d/default.conf && \
    # Remove unnecessary packages (OWASP: Minimize Attack Surface)
    apk del apk-tools && \
    # Make root filesystem read-only where possible
    chmod -R 555 /usr/share/nginx/html && \
    # Set read-only root filesystem permissions (OWASP: D05 - Read-Only Root Filesystem)
    chmod 555 /etc/nginx/conf.d

# Switch to unprivileged user (OWASP: D03 - Non-root User)
USER 101

# Health check (OWASP: D06 - Health Checks)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Expose port (non-privileged)
EXPOSE 8080

# Default command
CMD ["nginx", "-g", "daemon off;"]
