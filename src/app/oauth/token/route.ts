import {
  corsHeaders,
  issuerFor,
  oauthError,
  resourceFor,
} from '@/lib/oauth/clients';
import {
  CodeClaims,
  SessionClaims,
  isAllowedUser,
  issueTokens,
  pkceChallenge,
  verify,
} from '@/lib/oauth/tokens';

const tokenResponse = (body: object) =>
  Response.json(body, {
    headers: { ...corsHeaders, 'Cache-Control': 'no-store', Pragma: 'no-cache' },
  });

export async function POST(req: Request) {
  const issuer = issuerFor(req);
  const form = await req.formData().catch(() => null);
  if (!form) return oauthError('invalid_request', 'Expected a form-encoded body');

  const field = (name: string) => form.get(name)?.toString();
  const resource = field('resource');
  if (resource && resource !== resourceFor(issuer)) {
    return oauthError('invalid_target', `Unknown resource ${resource}`);
  }

  const grantType = field('grant_type');

  if (grantType === 'authorization_code') {
    let code: CodeClaims;
    try {
      code = await verify<CodeClaims>('code', field('code') ?? '', issuer);
    } catch {
      return oauthError('invalid_grant', 'Authorization code is invalid or expired');
    }
    if (field('client_id') !== code.client_id) {
      return oauthError('invalid_grant', 'client_id does not match the code');
    }
    if (field('redirect_uri') !== code.redirect_uri) {
      return oauthError('invalid_grant', 'redirect_uri does not match the code');
    }
    const verifier = field('code_verifier');
    if (!verifier || pkceChallenge(verifier) !== code.code_challenge) {
      return oauthError('invalid_grant', 'PKCE verification failed');
    }
    return tokenResponse(
      await issueTokens(
        { sub: code.sub, client_id: code.client_id, resource: code.resource },
        issuer
      )
    );
  }

  if (grantType === 'refresh_token') {
    let session: SessionClaims;
    try {
      session = await verify<SessionClaims>('refresh', field('refresh_token') ?? '', issuer);
    } catch {
      return oauthError('invalid_grant', 'Refresh token is invalid or expired');
    }
    const clientId = field('client_id');
    if (clientId && clientId !== session.client_id) {
      return oauthError('invalid_grant', 'client_id does not match the token');
    }
    // Re-check so changing ALLOWED_GITHUB_LOGIN cuts off existing sessions
    if (!isAllowedUser(session.sub)) {
      return oauthError('invalid_grant', 'User is no longer allowed');
    }
    return tokenResponse(
      await issueTokens(
        { sub: session.sub, client_id: session.client_id, resource: session.resource },
        issuer
      )
    );
  }

  return oauthError('unsupported_grant_type', `Unsupported grant_type ${grantType}`);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}
