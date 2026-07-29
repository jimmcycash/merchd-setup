# Security Policy

## Reporting a vulnerability

If you believe you've found a security issue in this repository, please
email **mike@merchd.co** with the details rather than opening a public
issue.

## What must never be committed

This is a **public repository**. The following data must never be pushed
to it, in any file, at any time:

- API keys or client secrets (Stripe, QuickBooks, OpenAI, Google, AWS, etc.)
- OAuth tokens (access, refresh) for any service
- Private SSH / GPG keys, TLS certificates
- Database connection strings with credentials
- User passwords or hashes
- Customer PII beyond what's already public on merchd.co
- Internal vendor pricing, cost data, or margin information

## Local development

Local secrets belong in `.env.local` (or `.env` — both are `.gitignore`d).
Copy `.env.example` if present, fill in your own values, and never
commit the filled-in file.

## Pre-commit checks

The repository owner runs `git-secrets` at the machine level to block
common credential patterns before commit. If you're contributing:

```bash
brew install git-secrets
git secrets --install
git secrets --register-aws
```

## If a secret leaks

1. **Rotate immediately** — do not wait for the git history to be cleaned.
2. Rotating first is more effective than trying to purge history, because
   caches, forks, and clones may already contain the old value.
3. After rotation, contact the repo owner to purge history with
   `git filter-repo` and force-push.
