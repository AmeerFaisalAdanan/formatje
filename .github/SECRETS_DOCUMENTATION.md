# Secrets Documentation for GitHub Actions Workflows

## Required repository secrets

### `GH_TOKS` (required by secret scanning)

The Gitleaks job in `secure-ci.yml` authenticates with this repository
secret:

```yaml
# In the secret-scanning job
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@<pinned-sha> # v2
  env:
    GITHUB_TOKEN: ${{ secrets.GH_TOKS }}
```

**This secret must exist in the repository settings** (Settings → Secrets
and variables → Actions). If it is missing, the job runs with an empty
token and gitleaks-action cannot call the GitHub API.

Required scope:

- A fine-grained PAT with **read access to this repository's contents and
  metadata** (or a classic PAT with `repo` scope) is sufficient.
  gitleaks-action uses the token to read repository/PR information when
  commenting on pull requests.

## Secrets that are NOT needed

- **`release.yml` (GHCR publishing) needs no manual secret.** It logs in to
  `ghcr.io` with the automatic `GITHUB_TOKEN` and the job-level
  `packages: write` permission. No personal access token is involved.
- **Trivy, CodeQL, Semgrep, and Hadolint need no secrets.** SARIF uploads
  to the Security tab use the automatic `GITHUB_TOKEN` via job-level
  `security-events: write` permissions.

## Security practices applied

- Least-privilege `permissions:` blocks at workflow and job level
- Automatic `GITHUB_TOKEN` (rotated per run) wherever possible
- Third-party actions pinned to full commit SHAs
- No hardcoded credentials anywhere in the repository

## References

- [GitHub Actions: Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [gitleaks-action](https://github.com/gitleaks/gitleaks-action)
- [Working with the Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
