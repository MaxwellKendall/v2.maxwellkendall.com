import {
  generateProtectedResourceMetadata,
  metadataCorsOptionsRequestHandler,
} from 'mcp-handler';
import { corsHeaders, issuerFor, resourceFor } from '@/lib/oauth/clients';
import { SCOPE } from '@/lib/oauth/tokens';

// RFC 9728 metadata: this site is both the MCP resource and its auth server
export function GET(req: Request) {
  const issuer = issuerFor(req);
  return Response.json(
    generateProtectedResourceMetadata({
      authServerUrls: [issuer],
      resourceUrl: resourceFor(issuer),
      additionalMetadata: { scopes_supported: [SCOPE] },
    }),
    { headers: { ...corsHeaders, 'Cache-Control': 'max-age=3600' } }
  );
}

export const OPTIONS = metadataCorsOptionsRequestHandler();
