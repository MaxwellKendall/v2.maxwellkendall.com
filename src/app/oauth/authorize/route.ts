import {
  isAllowedRedirect,
  issuerFor,
  redirectTo,
  resolveClient,
  resourceFor,
} from '@/lib/oauth/clients';
import { signPending } from '@/lib/oauth/tokens';
import { readEnv } from '@/lib/env';

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';

const badRequest = (message: string) =>
  new Response(message, { status: 400, headers: { 'Content-Type': 'text/plain' } });

// Validates the client's request, then hands the login off to GitHub
export async function GET(req: Request) {
  const issuer = issuerFor(req);
  const params = new URL(req.url).searchParams;
  const clientId = params.get('client_id');
  const redirectUri = params.get('redirect_uri');

  if (!clientId || !redirectUri) {
    return badRequest('client_id and redirect_uri are required');
  }

  let client;
  try {
    client = await resolveClient(clientId, issuer);
  } catch (error) {
    return badRequest(`Unknown client: ${(error as Error).message}`);
  }
  // Never redirect anywhere until the redirect URI is known to be safe
  if (!client.redirect_uris.includes(redirectUri) || !isAllowedRedirect(redirectUri)) {
    return badRequest('redirect_uri is not registered for this client');
  }

  const state = params.get('state') ?? undefined;
  const fail = (error: string, description: string) =>
    redirectTo(redirectUri, { error, error_description: description, state });

  if (params.get('response_type') !== 'code') {
    return fail('unsupported_response_type', 'Only the code flow is supported');
  }
  const codeChallenge = params.get('code_challenge');
  if (!codeChallenge || params.get('code_challenge_method') !== 'S256') {
    return fail('invalid_request', 'PKCE with S256 is required');
  }
  const resource = params.get('resource') ?? resourceFor(issuer);
  if (resource !== resourceFor(issuer)) {
    return fail('invalid_target', `Unknown resource ${resource}`);
  }

  const githubClientId = readEnv('GITHUB_OAUTH_CLIENT_ID');
  if (!githubClientId) {
    return fail('server_error', 'GitHub sign-in is not configured');
  }

  const pending = await signPending(
    {
      client_id: clientId,
      client_name: client.client_name,
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
      state,
      resource,
    },
    issuer
  );

  const github = new URL(GITHUB_AUTHORIZE_URL);
  github.searchParams.set('client_id', githubClientId);
  github.searchParams.set('redirect_uri', `${issuer}/oauth/callback`);
  github.searchParams.set('state', pending);
  github.searchParams.set('allow_signup', 'false');
  return Response.redirect(github.toString(), 302);
}
