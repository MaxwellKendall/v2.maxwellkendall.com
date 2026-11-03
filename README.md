# maxwellkendall.com

My personal blog. Next.js app router, deployed on Vercel: pushes to `main`
deploy to production, and every other branch gets a preview deployment.

```bash
npm install
npm run dev     # http://localhost:3000
npm test
```

Posts are Markdown files with frontmatter under `src/blog-posts/`. Tag a post
`draft` or `private` to keep it off the post list.

## Publishing from Claude (MCP server)

The site hosts an MCP server at `/api/mcp`, so you can say "publish this post"
in any Claude client. It commits to this repo through the GitHub API, and
Vercel's normal deploys take it from there.

| Tool | What it does |
| --- | --- |
| `list_posts`, `get_post` | Read the live posts, including drafts |
| `preview_post` | Commit a new or revised post to `post/<slug>` and return the Vercel preview URL |
| `preview_status` | Check on a preview that was still building |
| `publish_post` | Land the previewed file on `main` as one `[post] <title>` commit, then delete the branch |
| `discard_preview` | Delete a preview branch |
| `unpublish_post` | Delete a post's file on `main` |

Nothing reaches `main` without a preview first, and repeated preview edits are
squashed into a single commit when published. Replacing an existing post
requires `overwrite: true`.

### Auth

The site is its own OAuth authorization server, and sign-in is delegated to
GitHub. Only the GitHub user in `ALLOWED_GITHUB_LOGIN` gets past login, and
each new connection asks for approval on a consent screen. Authorization codes
go only to `claude.ai`, `claude.com` or localhost (`OAUTH_ALLOWED_REDIRECT_HOSTS`).

Codes and tokens are JWTs signed with `MCP_AUTH_SECRET`, so there is no
database. Access tokens last an hour and refresh tokens 30 days. **To revoke
every connection, rotate `MCP_AUTH_SECRET`.**

### Setup

1. **GitHub OAuth App** (Settings → Developer settings → OAuth Apps → New).
   Homepage: your production URL. Callback URL:
   `https://<production-domain>/oauth/callback`.
2. **Fine-grained personal access token** limited to this repository, with
   *Contents: Read and write* and *Deployments: Read-only*.
3. **Vercel environment variables** (Production), then redeploy:

   | Variable | Value |
   | --- | --- |
   | `MCP_AUTH_SECRET` | Output of `openssl rand -hex 32` |
   | `ALLOWED_GITHUB_LOGIN` | `MaxwellKendall` |
   | `GITHUB_OAUTH_CLIENT_ID` | From step 1 |
   | `GITHUB_OAUTH_CLIENT_SECRET` | From step 1 |
   | `GITHUB_TOKEN` | From step 2 |
   | `GITHUB_REPO` | Optional, defaults to `MaxwellKendall/v2.maxwellkendall.com` |

4. **Connect Claude.** In claude.ai or the desktop app: Settings → Connectors →
   Add custom connector → `https://<production-domain>/api/mcp`. In Claude Code:

   ```bash
   claude mcp add --transport http blog https://<production-domain>/api/mcp
   ```

Preview URLs open only if you can view the project's preview deployments. With
Vercel's default deployment protection, that means being signed in to Vercel.
