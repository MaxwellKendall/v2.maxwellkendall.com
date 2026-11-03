// A stateless OAuth authorization server for the blog's MCP endpoint.
// Every artifact (client registrations, codes, tokens) is a JWT signed with
// MCP_AUTH_SECRET, so rotating that secret revokes everything at once.
import { createHash } from 'crypto';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { readEnv } from '../env';

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL = '30d';
const CODE_TTL = '5m';
const PENDING_TTL = '10m';

export const SCOPE = 'blog';

type TokenType = 'client' | 'pending' | 'consent' | 'code' | 'access' | 'refresh';

export interface ClientClaims {
  redirect_uris: string[];
  client_name?: string;
}

// An authorization request carried through the GitHub login and consent steps
export interface PendingClaims {
  client_id: string;
  client_name: string;
  redirect_uri: string;
  code_challenge: string;
  state?: string;
  resource: string;
}

export interface CodeClaims extends PendingClaims {
  sub: string;
}

export interface SessionClaims {
  sub: string;
  client_id: string;
  resource: string;
}

const secret = () => {
  const value = readEnv('MCP_AUTH_SECRET');
  if (!value || value.length < 32) {
    throw new Error('MCP_AUTH_SECRET must be set to at least 32 characters');
  }
  return new TextEncoder().encode(value);
};

export async function sign(
  typ: TokenType,
  claims: object,
  issuer: string,
  expiresIn?: string | number
) {
  const jwt = new SignJWT({ ...claims, typ } as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(issuer)
    .setIssuedAt();
  if (expiresIn) jwt.setExpirationTime(expiresIn);
  return jwt.sign(secret());
}

// Verifies signature, issuer, expiry and token type; throws on any mismatch
export async function verify<T>(
  typ: TokenType,
  token: string,
  issuer: string
): Promise<T & JWTPayload> {
  const { payload } = await jwtVerify(token, secret(), {
    issuer,
    algorithms: ['HS256'],
  });
  if (payload.typ !== typ) throw new Error(`Expected a ${typ} token`);
  return payload as T & JWTPayload;
}

export const signPending = (claims: PendingClaims, issuer: string) =>
  sign('pending', claims, issuer, PENDING_TTL);

export const signConsent = (claims: CodeClaims, issuer: string) =>
  sign('consent', claims, issuer, PENDING_TTL);

export const signCode = (claims: CodeClaims, issuer: string) =>
  sign('code', claims, issuer, CODE_TTL);

export async function issueTokens(claims: SessionClaims, issuer: string) {
  return {
    access_token: await sign(
      'access',
      claims,
      issuer,
      `${ACCESS_TOKEN_TTL_SECONDS}s`
    ),
    refresh_token: await sign('refresh', claims, issuer, REFRESH_TOKEN_TTL),
    token_type: 'Bearer',
    expires_in: ACCESS_TOKEN_TTL_SECONDS,
    scope: SCOPE,
  };
}

export const pkceChallenge = (verifier: string) =>
  createHash('sha256').update(verifier).digest('base64url');

export const isAllowedUser = (login: string) => {
  const allowed = readEnv('ALLOWED_GITHUB_LOGIN');
  if (!allowed) throw new Error('ALLOWED_GITHUB_LOGIN is not configured');
  return login.toLowerCase() === allowed.toLowerCase();
};
