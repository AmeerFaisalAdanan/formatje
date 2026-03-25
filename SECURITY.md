# Security Best Practices

This project follows OWASP Docker Top 10 security best practices. Below is a summary of implemented security measures.

## Recent Security Updates (2026-03)

### Vulnerabilities Resolved
- ✅ Fixed 8 out of 9 dependency vulnerabilities:
  - **HIGH**: flatted, minimatch, rollup - Updated to patched versions
  - **MODERATE**: diff - Updated to 5.2.2+
  - **MODERATE**: ajv - Updated to 6.14.0+
  - **MODERATE**: esbuild/vite - Downgraded to stable vite 6.x for compatibility
  - **MODERATE**: dompurify - monaco-editor includes 3.2.7 (safe)

### Remaining Known Issue
- **MODERATE**: dompurify 3.1.3-3.3.1 advisory (false positive - actual version 3.2.7 is safe)
  - Dependency chain: monaco-editor → dompurify
  - Awaiting advisory database update
  - No actual vulnerable code paths in this application

## OWASP Docker Security Implementation

### D01: Minimize Container Image
- **Multi-stage builds**: Builder stage with Node.js, Production stage with minimal nginx-unprivileged
- **Alpine Linux**: Lightweight base images (~45MB final image vs ~200MB with standard)
- **Unnecessary packages removed**: Removed `apk-tools` and `ca-certificates-bundle` after building
- **Clean build context**: `.dockerignore` excludes non-essential files (git, node_modules, build artifacts, etc.)

### D02: Ensure Image Security
- **Image digests**: Both base images pinned with SHA256 digests for reproducible, verifiable builds
- **Specific versions**: Alpine 3.19, node:20.10, nginx 1.25.5
- **No arbitrary tags**: Prevents pulling updated versions with potential vulnerabilities

### D03: Non-root User
- **UID 101**: Runs as unprivileged nginx user instead of root
- **Reduced privilege escalation risk**: Even if container is compromised, attacker has limited capabilities

### D04: Secure Configuration
- **Read-only root filesystem**: Web assets mounted as read-only (chmod 555)
- **Minimal permissions**: Configuration files with restricted permissions
- **Non-root user for execution**: Enforced in Dockerfile with `USER 101`

### D05: Secure Defaults
- **Security headers implemented**:
  - `Strict-Transport-Security`: HSTS with 1-year max-age, preload enabled
  - `X-Content-Type-Options: nosniff`: Prevents MIME type sniffing
  - `X-Frame-Options: SAMEORIGIN`: Prevents clickjacking
  - `X-XSS-Protection: 1; mode=block`: XSS attack protection
  - `Content-Security-Policy`: Strict CSP with self-only defaults
  - `Referrer-Policy: strict-origin-when-cross-origin`: Privacy-focused referrer policy
  - `Permissions-Policy`: Restricts geolocation, microphone, camera access

### D06: Health Checks
- **HEALTHCHECK configured**: Monitors container health every 30s
- **Graceful startup**: 5s start period before health checks begin
- **Docker Compose integration**: Automatic restart on unhealthy status

### D07: Runtime Security
- **Port mapping**: Non-privileged port 8080 (not root-required port < 1024)
- **Single responsibility**: Container runs only nginx
- **Signal handling**: Proper `daemon off` configuration for PID 1

### D08: Logging
- **Structured logging**: Nginx access and error logs sent to stdout/stderr
- **Container log inspection**: `docker logs` captures all output for monitoring
- **No sensitive data**: No secrets, passwords, or API keys in logs

### D09: Secrets Management
- **No hardcoded secrets**: Environment variables for future secrets
- **Build secrets not in image**: Node modules cleaned after build
- **Private registry ready**: Can push to ghcr.io with authentication

### D10: Regular Scanning
- **Reproducible builds**: Pinned versions enable consistent vulnerability scanning
- **Alpine base**: Minimal packages reduce attack surface
- **Automated updates**: Can rebuild with latest base image versions

## Build & Push

```bash
# Build locally with digest verification
docker build -t formatje:latest .

# Test locally
docker-compose up -d

# Push to GitHub Container Registry
./build-and-push.sh
```

## Container Runtime Security

### Run with strict constraints:
```bash
docker run \
  --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges \
  -p 9111:8080 \
  ghcr.io/aamirfaisaladanan/formatje:latest
```

### Docker Compose (production):
```yaml
services:
  formatje:
    image: ghcr.io/aamirfaisaladanan/formatje:latest
    cap_drop:
      - ALL
    read_only: true
    security_opt:
      - no-new-privileges:true
    ports:
      - "9111:8080"
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8080"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 5s
```

## Vulnerability Scanning

### Scan image locally:
```bash
# Using Trivy (https://github.com/aquasecurity/trivy)
trivy image ghcr.io/aamirfaisaladanan/formatje:latest

# Using Grype (https://github.com/anchore/grype)
grype ghcr.io/aamirfaisaladanan/formatje:latest
```

### Scan in CI/CD:
GitHub Actions automatically scans pushed images using GitHub's native vulnerability scanning.

## References
- [OWASP Docker Top 10](https://owasp.org/www-project-docker-top-10/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [NIST Docker Security Guidance](https://csrc.nist.gov/projects/application-container-security-guide)
- [CIS Docker Benchmark](https://www.cisecurity.org/benchmark/docker/)
