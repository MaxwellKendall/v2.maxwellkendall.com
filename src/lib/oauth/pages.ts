// Bare HTML pages for the OAuth flow, outside the site's React layout

export const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        char
      ]!
  );

export function htmlPage(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<style>
  :root { --bg: #fcfcfb; --fg: #1c1c1a; --muted: #5c5c57; --border: #e6e5e1; --accent: #0f766e; }
  @media (prefers-color-scheme: dark) {
    :root { --bg: #111110; --fg: #ececea; --muted: #a3a39e; --border: #2a2a28; --accent: #2dd4bf; }
  }
  body { margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 16px;
         background: var(--bg); color: var(--fg); font: 16px/1.5 system-ui, sans-serif; }
  main { width: 100%; max-width: 420px; border: 1px solid var(--border); border-radius: 12px; padding: 28px; }
  h1 { font-size: 20px; margin: 0 0 12px; }
  p { color: var(--muted); margin: 0 0 12px; }
  strong { color: var(--fg); }
  form { display: flex; gap: 8px; margin-top: 20px; }
  button { flex: 1; padding: 10px; border-radius: 8px; font: inherit; cursor: pointer;
           border: 1px solid var(--border); background: transparent; color: var(--fg); }
  button[value="allow"] { background: var(--accent); border-color: var(--accent); color: var(--bg); }
</style>
</head>
<body><main>${body}</main></body>
</html>`;

  return new Response(html, {
    status,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self' https: http://localhost:* http://127.0.0.1:*; frame-ancestors 'none'",
      'X-Frame-Options': 'DENY',
    },
  });
}
