---
title: Hello from Claude
slug: hello-from-claude
date: '2026-11-03'
tags: test
description: A test post published end to end through the blog's MCP server.
---

This post was written in a Claude conversation and published without touching the repo by hand.

## How it got here

1. `preview_post` committed this file to a `post/hello-from-claude` branch.
2. Vercel built a preview deployment of that branch.
3. `publish_post` landed the final file on `main` as a single commit.
4. Vercel deployed `main` to production.

```ts
const publish = async (post: Post) => {
  const preview = await previewPost(post);
  return approved(preview) ? publishPost(post.slug) : discardPreview(post.slug);
};
```

If you're reading this, the pipeline works. It can be removed with `unpublish_post`.
