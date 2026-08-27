## Git workflow

- After committing, always run `git push origin main` in the same turn. Do not leave commits sitting locally.
- Exception: only skip the push if I explicitly say not to push, or if the work is an experiment I've asked you to keep local.
- After pushing, confirm `origin/main` matches local HEAD and report the SHA, so I can match it against the Cloudflare Workers build.
- Never force push. If a push is rejected, stop and show me the error rather than resolving it yourself.
- Keep .claude/ and Logo.jpg untracked.
