// Every change goes through a preview branch first: preview_post commits to
// `post/<slug>` (Vercel builds a preview), publish_post lands the final file on
// main as a single commit, so repeated preview edits never reach main's history.
import matter from 'gray-matter';
import { getBlogPosts, POSTS_DIRECTORY } from '../blog-utils';
import { buildPost, newPostPath, PostInput } from './posts';
import {
  MAIN_BRANCH,
  changedFiles,
  createBranch,
  deleteBranch,
  deleteFile,
  getBranchSha,
  getFile,
  getPreviewUrl,
  putFile,
} from './github';

const PREVIEW_POLL_MS = 5_000;

export const branchFor = (slug: string) => `post/${slug}`;

export const siteUrl = () =>
  process.env.NEXT_PUBLIC_BASE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

// Posts as of the current deployment
export const findPost = (slug: string) =>
  getBlogPosts().find((post) => post.slug === slug);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function waitForPreview(sha: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const url = await getPreviewUrl(sha);
    if (url) return url;
    await sleep(PREVIEW_POLL_MS);
  }
  return null;
}

export async function previewPost(
  input: PostInput & { overwrite?: boolean },
  { waitMs = 0 }: { waitMs?: number } = {}
) {
  const existing = findPost(input.slug ?? buildPost(input).slug);
  if (existing && !input.overwrite) {
    throw new Error(
      `A post with slug "${existing.slug}" already exists (${existing.path}). ` +
        'Pass overwrite: true to replace it, or choose a different slug.'
    );
  }

  // Keep the original publish date when revising a post
  const { slug, file } = buildPost({
    ...input,
    // Older frontmatter may hold an unquoted YAML date (parsed as a Date)
    date:
      input.date ??
      (existing?.date
        ? new Date(existing.date).toISOString().slice(0, 10)
        : undefined),
  });
  const filePath = existing?.path ?? newPostPath(slug);
  const branch = branchFor(slug);

  if (!(await getBranchSha(branch))) {
    const mainSha = await getBranchSha(MAIN_BRANCH);
    if (!mainSha) throw new Error(`Branch ${MAIN_BRANCH} not found`);
    await createBranch(branch, mainSha);
  }

  const commitSha = await putFile({
    filePath,
    content: file,
    message: `[post] ${input.title.trim()}`,
    branch,
  });
  const deploymentUrl = waitMs ? await waitForPreview(commitSha, waitMs) : null;

  return {
    slug,
    action: existing ? 'update' : 'create',
    filePath,
    branch,
    commitSha,
    previewUrl: deploymentUrl ? `${deploymentUrl}/blog/${slug}` : null,
  };
}

export async function previewStatus(slug: string) {
  const sha = await getBranchSha(branchFor(slug));
  if (!sha) throw new Error(`No preview exists for "${slug}"`);
  const deploymentUrl = await getPreviewUrl(sha);
  return {
    slug,
    ready: Boolean(deploymentUrl),
    previewUrl: deploymentUrl ? `${deploymentUrl}/blog/${slug}` : null,
  };
}

export async function publishPost(slug: string) {
  const branch = branchFor(slug);
  if (!(await getBranchSha(branch))) {
    throw new Error(`No preview exists for "${slug}". Call preview_post first.`);
  }

  const postFiles = (await changedFiles(branch)).filter(
    (f) => f.startsWith(`${POSTS_DIRECTORY}/`) && f.endsWith('.md')
  );
  if (postFiles.length !== 1) {
    throw new Error(
      `Expected ${branch} to change exactly one post, found: ${postFiles.join(', ') || 'none'}`
    );
  }

  const [filePath] = postFiles;
  const file = await getFile(filePath, branch);
  if (!file) throw new Error(`${filePath} is missing on ${branch}`);
  const { data } = matter(file.content);

  await putFile({
    filePath,
    content: file.content,
    message: `[post] ${data.title}`,
    branch: MAIN_BRANCH,
  });
  await deleteBranch(branch);

  return { slug, filePath, url: `${siteUrl()}/blog/${slug}` };
}

export async function discardPreview(slug: string) {
  const branch = branchFor(slug);
  if (!(await getBranchSha(branch))) {
    throw new Error(`No preview exists for "${slug}"`);
  }
  await deleteBranch(branch);
  return { slug, discarded: branch };
}

export async function unpublishPost(slug: string) {
  const post = findPost(slug);
  if (!post?.path) throw new Error(`No published post with slug "${slug}"`);
  await deleteFile({
    filePath: post.path,
    message: `[post] unpublish ${post.title}`,
    branch: MAIN_BRANCH,
  });
  return { slug, removed: post.path };
}
