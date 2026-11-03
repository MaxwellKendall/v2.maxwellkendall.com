import {
  corsHeaders,
  isAllowedRedirect,
  issuerFor,
  oauthError,
} from '@/lib/oauth/clients';
import { sign } from '@/lib/oauth/tokens';

// RFC 7591 dynamic client registration, kept for clients that predate CIMD
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const redirectUris: unknown = body?.redirect_uris;

  if (
    !Array.isArray(redirectUris) ||
    redirectUris.length === 0 ||
    !redirectUris.every((uri) => typeof uri === 'string')
  ) {
    return oauthError('invalid_redirect_uri', 'redirect_uris is required');
  }
  const rejected = redirectUris.filter((uri) => !isAllowedRedirect(uri));
  if (rejected.length) {
    return oauthError(
      'invalid_redirect_uri',
      `Redirect URI not allowed: ${rejected.join(', ')}`
    );
  }

  const clientName =
    typeof body.client_name === 'string'
      ? body.client_name.slice(0, 100)
      : undefined;
  const clientId = await sign(
    'client',
    { redirect_uris: redirectUris, client_name: clientName },
    issuerFor(req)
  );

  return Response.json(
    {
      client_id: clientId,
      client_id_issued_at: Math.floor(Date.now() / 1000),
      client_name: clientName,
      redirect_uris: redirectUris,
      token_endpoint_auth_method: 'none',
      grant_types: ['authorization_code', 'refresh_token'],
      response_types: ['code'],
    },
    { status: 201, headers: corsHeaders }
  );
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
