import { metadataCorsOptionsRequestHandler } from 'mcp-handler';
import { corsHeaders, issuerFor } from '@/lib/oauth/clients';
import { SCOPE } from '@/lib/oauth/tokens';

// RFC 8414 authorization server metadata
export function GET(req: Request) {
  const issuer = issuerFor(req);
  return Response.json(
    {
      issuer,
      authorization_endpoint: `${issuer}/oauth/authorize`,
      token_endpoint: `${issuer}/oauth/token`,
      registration_endpoint: `${issuer}/oauth/register`,
      client_id_metadata_document_supported: true,
      response_types_supported: ['code'],
      grant_types_supported: ['authorization_code', 'refresh_token'],
      code_challenge_methods_supported: ['S256'],
      token_endpoint_auth_methods_supported: ['none'],
      scopes_supported: [SCOPE],
    },
    { headers: { ...corsHeaders, 'Cache-Control': 'max-age=3600' } }
  );
}

export const OPTIONS = metadataCorsOptionsRequestHandler();
