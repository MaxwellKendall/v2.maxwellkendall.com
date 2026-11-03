// Reads a configured value, ignoring stray whitespace. Values piped into
// `vercel env add` keep their trailing newline, which silently breaks ids,
// secrets and HTTP headers.
export const readEnv = (name: string): string | undefined =>
  process.env[name]?.trim() || undefined;
