# Security

formatje is a 100% client-side app: every tool (formatter, compare, JSON to
cURL, hash generator) runs in the browser. Inputs, secrets, and tokens are
never sent anywhere — there are no API calls, no storage, no telemetry.

## Container hardening

The production image (`Dockerfile` + `docker-compose.yml`) applies OWASP
Docker Top 10 practices:

- **Multi-stage build** — the final image contains only nginx and static
  files; node, npm, and sources never reach the runtime image.
- **Digest-pinned base images** — both stages pin their base image by
  sha256 digest for reproducible, tamper-evident builds. Dependabot keeps
  the pins current.
- **Non-root** — runs as the unprivileged `nginx-unprivileged` user
  (UID 101) on port 8080; `apk-tools` is removed from the runtime image.
- **Compose hardening** — `cap_drop: ALL`, `read_only: true` with tmpfs
  mounts for nginx scratch space, `no-new-privileges`, CPU/memory limits,
  log rotation, and a healthcheck.
- **Security headers** — see `nginx.conf`: `Content-Security-Policy`,
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`.

### Notes on specific headers

- **HSTS is intentionally not set by the container.** It serves plain HTTP;
  browsers ignore `Strict-Transport-Security` over HTTP. Configure HSTS on
  the TLS-terminating reverse proxy in front of the container.
- **The CSP allows `https://cdn.jsdelivr.net`** because the Monaco editor
  (`@monaco-editor/react`'s default loader) fetches its runtime from that
  CDN. Self-hosting Monaco would allow tightening the CSP to `'self'` and
  is tracked as a potential improvement.

## CI/CD security

- `secure-ci.yml` runs on every PR to master and push to master: ESLint,
  Prettier, Vitest, Trivy (filesystem + image, CRITICAL/HIGH gate), CodeQL,
  Semgrep (OWASP Top Ten), Hadolint, and Gitleaks secret scanning.
- `release.yml` publishes images to GHCR using the built-in
  `GITHUB_TOKEN`; a Trivy scan gates every push, and images are published
  with provenance attestations and an SBOM.
- Third-party GitHub Actions are pinned to full commit SHAs.
- Workflows run with least-privilege `permissions:` blocks.

## Reporting a vulnerability

Please open a GitHub issue (or use GitHub's private vulnerability
reporting if enabled) on
[AmeerFaisalAdanan/formatje](https://github.com/AmeerFaisalAdanan/formatje).
