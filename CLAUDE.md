## Git workflow

- After committing, always run `git push origin main` in the same turn. Do not leave commits sitting locally.
- Exception: only skip the push if I explicitly say not to push, or if the work is an experiment I've asked you to keep local.
- After pushing, confirm `origin/main` matches local HEAD and report the SHA, so I can match it against the Cloudflare Workers build.
- Never force push. If a push is rejected, stop and show me the error rather than resolving it yourself.
- Keep .claude/ and Logo.jpg untracked.

## Cloudflare

A scoped API token is available in the `CLOUDFLARE_API_TOKEN` environment variable. Wrangler picks it up automatically — do not run `wrangler login`.

Permissions the token HAS:
- Workers Scripts: Edit (deploy, update)
- Workers Observability: Read (build logs, runtime logs, tail)
- Zone: Read on tariffcompass.ca

Permissions the token deliberately does NOT have — these stay manual and must not be attempted:
- DNS changes
- Cloudflare Access / Zero Trust policies
- Environment variables on the Worker (incl. `NEXT_PUBLIC_SITE_URL`)
- Email Routing
- Billing, account settings, zone deletion

Note: `wrangler whoami` reports "not authenticated" with this token because it reads account user settings the token can't access. That is expected and not an error. Use `wrangler deployments list` to verify authentication instead.

Also note: tariffcompass.ca sits behind Cloudflare Access (pre-launch gating). Server-side fetches of the deployed site from outside will hit a login redirect. If a task needs a deployed route called, ask me to call it in my browser rather than trying to work around Access.
