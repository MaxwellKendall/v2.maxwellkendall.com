// Minimal GitHub REST client for committing posts. Needs a fine-grained token
// scoped to this repo with "Contents: read and write" and "Deployments: read".

import { readEnv } from '../env';

const API = 'https://api.github.com';
const DEFAULT_REPO = 'MaxwellKendall/v2.maxwellkendall.com';

export const MAIN_BRANCH = 'main';

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

const repo = () => readEnv('GITHUB_REPO') || DEFAULT_REPO;

async function github<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T | null> {
  const token = readEnv('GITHUB_TOKEN');
  if (!token) throw new Error('GITHUB_TOKEN is not configured');

  const res = await fetch(`${API}/repos/${repo()}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const detail = await res.text();
    throw new GitHubError(
      `GitHub ${method} ${path} failed (${res.status}): ${detail}`,
      res.status
    );
  }
  return res.status === 204 ? null : ((await res.json()) as T);
}

const encodePath = (filePath: string) =>
  filePath.split('/').map(encodeURIComponent).join('/');

export async function getBranchSha(branch: string): Promise<string | null> {
  const ref = await github<{ object: { sha: string } }>(
    'GET',
    `/git/ref/heads/${branch}`
  );
  return ref?.object.sha ?? null;
}

export async function createBranch(branch: string, fromSha: string) {
  await github('POST', '/git/refs', {
    ref: `refs/heads/${branch}`,
    sha: fromSha,
  });
}

export async function deleteBranch(branch: string) {
  await github('DELETE', `/git/refs/heads/${branch}`);
}

export async function getFile(
  filePath: string,
  ref: string
): Promise<{ sha: string; content: string } | null> {
  const file = await github<{ sha: string; content: string }>(
    'GET',
    `/contents/${encodePath(filePath)}?ref=${encodeURIComponent(ref)}`
  );
  if (!file) return null;
  return {
    sha: file.sha,
    content: Buffer.from(file.content, 'base64').toString('utf8'),
  };
}

// Creates or updates a file and returns the new commit sha
export async function putFile({
  filePath,
  content,
  message,
  branch,
}: {
  filePath: string;
  content: string;
  message: string;
  branch: string;
}): Promise<string> {
  const existing = await getFile(filePath, branch);
  const result = await github<{ commit: { sha: string } }>(
    'PUT',
    `/contents/${encodePath(filePath)}`,
    {
      message,
      branch,
      content: Buffer.from(content, 'utf8').toString('base64'),
      ...(existing ? { sha: existing.sha } : {}),
    }
  );
  return result!.commit.sha;
}

export async function deleteFile({
  filePath,
  message,
  branch,
}: {
  filePath: string;
  message: string;
  branch: string;
}) {
  const existing = await getFile(filePath, branch);
  if (!existing) throw new Error(`${filePath} does not exist on ${branch}`);
  await github('DELETE', `/contents/${encodePath(filePath)}`, {
    message,
    branch,
    sha: existing.sha,
  });
}

// Files that differ between main and a branch
export async function changedFiles(branch: string): Promise<string[]> {
  const comparison = await github<{
    files?: { filename: string; status: string }[];
  }>('GET', `/compare/${MAIN_BRANCH}...${encodeURIComponent(branch)}`);
  return (comparison?.files ?? [])
    .filter((f) => f.status !== 'removed')
    .map((f) => f.filename);
}

// The Vercel preview URL for a commit, once its deployment has finished
export async function getPreviewUrl(sha: string): Promise<string | null> {
  const deployments = await github<{ id: number }[]>(
    'GET',
    `/deployments?sha=${sha}`
  );
  for (const deployment of deployments ?? []) {
    const statuses = await github<
      { state: string; environment_url?: string; target_url?: string }[]
    >('GET', `/deployments/${deployment.id}/statuses`);
    const success = statuses?.find((s) => s.state === 'success');
    if (success) return success.environment_url || success.target_url || null;
  }
  return null;
}
