import { issuerFor, redirectTo } from '@/lib/oauth/clients';
import { htmlPage } from '@/lib/oauth/pages';
import { CodeClaims, signCode, verify } from '@/lib/oauth/tokens';

export async function POST(req: Request) {
  const issuer = issuerFor(req);

  // Only the consent page itself may submit this form
  if (req.headers.get('origin') !== issuer) {
    return htmlPage('Request rejected', '<h1>Request rejected</h1><p>Cross-site consent is not allowed.</p>', 403);
  }

  const form = await req.formData();
  let claims: CodeClaims;
  try {
    claims = await verify<CodeClaims>('consent', String(form.get('consent')), issuer);
  } catch {
    return htmlPage('Expired', '<h1>This request expired</h1><p>Start the connection again from Claude.</p>', 400);
  }

  if (form.get('decision') !== 'allow') {
    return redirectTo(claims.redirect_uri, {
      error: 'access_denied',
      state: claims.state,
    });
  }

  const code = await signCode(
    {
      client_id: claims.client_id,
      client_name: claims.client_name,
      redirect_uri: claims.redirect_uri,
      code_challenge: claims.code_challenge,
      state: claims.state,
      resource: claims.resource,
      sub: claims.sub,
    },
    issuer
  );
  return redirectTo(claims.redirect_uri, {
    code,
    state: claims.state,
    iss: issuer,
  });
}
