# syntax=docker/dockerfile:1.4
# Multi-stage Dockerfile following OWASP Docker Security Best Practices
# https://owasp.org/www-project-docker-top-10/

# --- Stage 1: Builder ---
FROM node:20.10-alpine@sha256:9e38d3d4117da74a643f67041c83914480b335c3bd44d37ccf5b5ad86cd715d1 AS builder
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
COPY vite.config.js .eslintignore* ./
COPY index.html ./

# Copy source files
COPY src ./src
COPY public ./public

# Build static assets with production optimizations
RUN npm run build && \
    # Clean up build artifacts not needed in final image
    rm -rf node_modules .npm

# --- Stage 2: Production Runtime (nginx, non-root, minimal) ---
# Using distroless or minimal base image (OWASP: D01 - Minimize Container Image)
FROM nginxinc/nginx-unprivileged:1.25-alpine@sha256:8265b1df5a89cc1a0a067e472bf47aca7cee52f0561c98a0dff91312dcdd8adb

# Metadata labels (OWASP: Documentation)
LABEL org.opencontainers.image.source="https://github.com/AamirFaisal-Adanan/formatje"
LABEL org.opencontainers.image.description="Formatje - JSON/GraphQL formatter and comparator"
LABEL org.opencontainers.image.version="1.0.0"
LABEL maintainer="Aamir Faisal <aamir@example.com>"

# Switch to root temporarily to set up files
USER root

# Copy built assets from builder
COPY --from=builder --chown=101:101 /app/dist /usr/share/nginx/html

# Create nginx configuration with security best practices
# OWASP: Secure headers, CSP, gzip compression
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 8080;' >> /etc/nginx/conf.d/default.conf && \
    echo '    listen [::]:8080;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name _;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html index.htm;' >> /etc/nginx/conf.d/default.conf && \
    echo '    client_max_body_size 10m;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Gzip compression' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip on;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_vary on;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_min_length 1000;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Security Headers (OWASP)' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header X-Frame-Options "SAMEORIGIN" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header X-XSS-Protection "1; mode=block" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header Referrer-Policy "strict-origin-when-cross-origin" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    add_header Content-Security-Policy "default-src '\''self'\''; script-src '\''self'\'' https://cdn.jsdelivr.net; style-src '\''self'\'' '\''unsafe-inline'\'' https://cdn.jsdelivr.net; img-src '\''self'\'' data: https:; font-src '\''self'\'' https://cdn.jsdelivr.net data:; connect-src '\''self'\'' https://cdn.jsdelivr.net; worker-src blob:; object-src '\''none'\''; frame-ancestors '\''none'\'';" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # SPA routing' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '    ' >> /etc/nginx/conf.d/default.conf && \
    echo '    # Cache static assets' >> /etc/nginx/conf.d/default.conf && \
    echo '    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {' >> /etc/nginx/conf.d/default.conf && \
    echo '        expires 1y;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Cache-Control "public, immutable";' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf && \
    # Set proper permissions
    chmod 644 /etc/nginx/conf.d/default.conf && \
    # Remove unnecessary packages (OWASP: Minimize Attack Surface)
    apk del apk-tools && \
    # Make root filesystem read-only where possible
    chmod -R 555 /usr/share/nginx/html

# Set read-only root filesystem permissions (OWASP: D05 - Read-Only Root Filesystem)
RUN chmod 555 /etc/nginx/conf.d

# Switch to unprivileged user (OWASP: D03 - Non-root User)
USER 101

# Health check (OWASP: D06 - Health Checks)
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8080/ || exit 1

# Expose port (non-privileged)
EXPOSE 8080

# Default command
CMD ["nginx", "-g", "daemon off;"]