import { getPublicOrigin } from 'mcp-handler';
import { verify, ClientClaims } from './tokens';

export const MCP_PATH = '/api/mcp';

const DEFAULT_REDIRECT_HOSTS = 'claude.ai,claude.com';
const LOOPBACK_HOSTS = ['localhost', '127.0.0.1', '[::1]'];
const METADATA_FETCH_TIMEOUT_MS = 5_000;

export const issuerFor = (req: Request) => getPublicOrigin(req);
export const resourceFor = (issuer: string) => `${issuer}${MCP_PATH}`;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': '*',
};

export const oauthError = (
  error: string,
  description: string,
  status = 400
) =>
  Response.json(
    { error, error_description: description },
    { status, headers: corsHeaders }
  );

export function redirectTo(uri: string, params: Record<string, string | undefined>) {
  const url = new URL(uri);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, value);
  }
  return Response.redirect(url.toString(), 303);
}

const allowedHosts = () =>
  (process.env.OAUTH_ALLOWED_REDIRECT_HOSTS || DEFAULT_REDIRECT_HOSTS)
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

// Codes only ever go to Claude's own callbacks or a local CLI listener
export function isAllowedRedirect(uri: string) {
  let url: URL;
  try {
    url = new URL(uri);
  } catch {
    return false;
  }
  if (url.hash) return false;
  if (url.protocol === 'http:') return LOOPBACK_HOSTS.includes(url.hostname);
  return (
    url.protocol === 'https:' &&
    allowedHosts().includes(url.hostname.toLowerCase())
  );
}

export interface ResolvedClient {
  client_name: string;
  redirect_uris: string[];
}

// Client ID Metadata Documents: the client_id is an HTTPS URL describing it
async function fetchClientMetadata(clientId: string): Promise<ResolvedClient> {
  const url = new URL(clientId);
  if (
    url.protocol !== 'https:' ||
    !allowedHosts().includes(url.hostname.toLowerCase())
  ) {
    throw new Error(`Client metadata host ${url.hostname} is not allowed`);
  }

  const res = await fetch(url, {
    redirect: 'error',
    signal: AbortSignal.timeout(METADATA_FETCH_TIMEOUT_MS),
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Client metadata fetch failed (${res.status})`);

  const doc = (await res.json()) as Partial<ResolvedClient> & {
    client_id?: string;
  };
  if (doc.client_id !== clientId || !Array.isArray(doc.redirect_uris)) {
    throw new Error('Client metadata document is invalid');
  }
  return {
    client_name: doc.client_name || url.hostname,
    redirect_uris: doc.redirect_uris,
  };
}

export async function resolveClient(
  clientId: string,
  issuer: string
): Promise<ResolvedClient> {
  if (clientId.startsWith('https://')) return fetchClientMetadata(clientId);

  // Dynamically registered clients carry their registration in the id itself
  const claims = await verify<ClientClaims>('client', clientId, issuer);
  return {
    client_name: claims.client_name || 'MCP client',
    redirect_uris: claims.redirect_uris,
  };
}
