import { issuerFor } from '@/lib/oauth/clients';
import { escapeHtml, htmlPage } from '@/lib/oauth/pages';
import {
  PendingClaims,
  isAllowedUser,
  signConsent,
  verify,
} from '@/lib/oauth/tokens';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';

async function githubLogin(code: string, redirectUri: string) {
  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_OAUTH_CLIENT_ID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });
  const { access_token: accessToken } = await tokenRes.json();
  if (!accessToken) throw new Error('GitHub did not return an access token');

  const userRes = await fetch(GITHUB_USER_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });
  if (!userRes.ok) throw new Error('Could not read the GitHub user');
  const { login } = (await userRes.json()) as { login: string };
  return login;
}

// GitHub sends the user back here; only the site owner gets a consent screen
export async function GET(req: Request) {
  const issuer = issuerFor(req);
  const params = new URL(req.url).searchParams;
  const code = params.get('code');
  const state = params.get('state');
  if (!code || !state) {
    return htmlPage('Sign-in failed', '<h1>Sign-in failed</h1><p>GitHub did not return a code.</p>', 400);
  }

  let pending: PendingClaims;
  let login: string;
  try {
    pending = await verify<PendingClaims>('pending', state, issuer);
    login = await githubLogin(code, `${issuer}/oauth/callback`);
  } catch (error) {
    return htmlPage(
      'Sign-in failed',
      `<h1>Sign-in failed</h1><p>${escapeHtml((error as Error).message)}</p>`,
      400
    );
  }

  if (!isAllowedUser(login)) {
    return htmlPage(
      'Not allowed',
      `<h1>Not allowed</h1><p>GitHub user <strong>${escapeHtml(login)}</strong> can't publish to this site.</p>`,
      403
    );
  }

  const consent = await signConsent(
    {
      client_id: pending.client_id,
      client_name: pending.client_name,
      redirect_uri: pending.redirect_uri,
      code_challenge: pending.code_challenge,
      state: pending.state,
      resource: pending.resource,
      sub: login,
    },
    issuer
  );
  const redirectHost = new URL(pending.redirect_uri).host;

  return htmlPage(
    'Allow publishing access',
    `<h1>Allow publishing access?</h1>
     <p><strong>${escapeHtml(pending.client_name)}</strong> (${escapeHtml(redirectHost)}) wants to publish, edit and unpublish posts on this site as <strong>${escapeHtml(login)}</strong>.</p>
     <form method="post" action="/oauth/consent">
       <input type="hidden" name="consent" value="${escapeHtml(consent)}">
       <button type="submit" name="decision" value="deny">Deny</button>
       <button type="submit" name="decision" value="allow">Allow</button>
     </form>`
  );
}
