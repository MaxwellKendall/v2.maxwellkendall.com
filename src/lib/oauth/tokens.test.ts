/**
 * @jest-environment node
 */
import { isAllowedRedirect } from './clients';
import { issueTokens, pkceChallenge, sign, signCode, verify } from './tokens';

const ISSUER = 'https://blog.test';
const session = { sub: 'MaxwellKendall', client_id: 'c', resource: `${ISSUER}/api/mcp` };

beforeAll(() => {
  process.env.MCP_AUTH_SECRET = 'x'.repeat(32);
});

describe('tokens', () => {
  it('round-trips a token of the expected type', async () => {
    const { access_token } = await issueTokens(session, ISSUER);
    await expect(verify('access', access_token, ISSUER)).resolves.toMatchObject(session);
  });

  it('rejects one token type used as another', async () => {
    const { access_token, refresh_token } = await issueTokens(session, ISSUER);
    await expect(verify('refresh', access_token, ISSUER)).rejects.toThrow();
    await expect(verify('access', refresh_token, ISSUER)).rejects.toThrow();
  });

  it('rejects tokens from another issuer', async () => {
    const { access_token } = await issueTokens(session, ISSUER);
    await expect(verify('access', access_token, 'https://evil.test')).rejects.toThrow();
  });

  it('rejects tokens signed with a different secret', async () => {
    const token = await sign('access', session, ISSUER, '1h');
    process.env.MCP_AUTH_SECRET = 'y'.repeat(32);
    await expect(verify('access', token, ISSUER)).rejects.toThrow();
    process.env.MCP_AUTH_SECRET = 'x'.repeat(32);
  });

  it('rejects expired codes', async () => {
    const code = await sign('code', session, ISSUER, Math.floor(Date.now() / 1000) - 1);
    await expect(verify('code', code, ISSUER)).rejects.toThrow();
  });

  it('carries PKCE challenges through codes', async () => {
    const verifier = 'a-long-random-code-verifier-value-1234567890';
    const code = await signCode(
      {
        ...session,
        client_name: 'Claude',
        redirect_uri: 'https://claude.ai/cb',
        code_challenge: pkceChallenge(verifier),
      },
      ISSUER
    );
    const claims = await verify<{ code_challenge: string }>('code', code, ISSUER);
    expect(claims.code_challenge).toBe(pkceChallenge(verifier));
    expect(claims.code_challenge).not.toBe(pkceChallenge('wrong'));
  });

  it('refuses to run without a strong secret', async () => {
    process.env.MCP_AUTH_SECRET = 'short';
    await expect(issueTokens(session, ISSUER)).rejects.toThrow(/MCP_AUTH_SECRET/);
    process.env.MCP_AUTH_SECRET = 'x'.repeat(32);
  });
});

describe('isAllowedRedirect', () => {
  const cases: Record<string, boolean> = {
    'https://claude.ai/api/mcp/auth_callback': true,
    'https://claude.com/api/mcp/auth_callback': true,
    'http://localhost:33418/callback': true,
    'http://127.0.0.1:5000/cb': true,
    'https://evil.test/cb': false,
    'https://claude.ai.evil.test/cb': false,
    'http://claude.ai/cb': false,
    'https://claude.ai/cb#fragment': false,
    'javascript:alert(1)': false,
    'not a url': false,
  };

  Object.entries(cases).forEach(([uri, allowed]) => {
    it(`${allowed ? 'allows' : 'rejects'} ${uri}`, () => {
      expect(isAllowedRedirect(uri)).toBe(allowed);
    });
  });
});
