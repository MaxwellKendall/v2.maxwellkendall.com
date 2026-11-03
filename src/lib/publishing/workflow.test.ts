/**
 * @jest-environment node
 */
import matter from 'gray-matter';
import { getBlogPosts } from '../blog-utils';
import {
  discardPreview,
  previewPost,
  publishPost,
  unpublishPost,
} from './workflow';

jest.mock('../blog-utils', () => ({
  ...jest.requireActual('../blog-utils'),
  getBlogPosts: jest.fn(),
}));

const EXISTING_PATH = 'src/blog-posts/culture/i-pencil.md';
const EXISTING_POST = {
  slug: 'i-pencil',
  title: 'I, Pencil',
  date: '2025-06-27',
  tags: [],
  readingTime: '6 min read',
  path: EXISTING_PATH,
};

// An in-memory stand-in for the slice of the GitHub API the workflow uses
class FakeGitHub {
  branches = new Map<string, { sha: string; files: Map<string, string> }>();
  commits: { branch: string; message: string }[] = [];
  deployments = new Map<string, string>();
  private counter = 0;

  constructor(files: Record<string, string>) {
    this.branches.set('main', { sha: this.nextSha(), files: new Map(Object.entries(files)) });
  }

  nextSha = () => `sha${++this.counter}`;
  blobSha = (content: string) => `blob:${content.length}:${content.slice(0, 20)}`;

  commit(branch: string, message: string) {
    const b = this.branches.get(branch)!;
    b.sha = this.nextSha();
    this.commits.push({ branch, message });
    return b.sha;
  }

  fetch = async (input: string | URL, init: RequestInit = {}) => {
    const url = new URL(input.toString());
    const path = url.pathname.replace(/^\/repos\/[^/]+\/[^/]+/, '');
    const method = init.method ?? 'GET';
    const body = init.body ? JSON.parse(init.body as string) : undefined;
    const json = (value: unknown, status = 200) => Response.json(value, { status });
    const missing = () => new Response('Not Found', { status: 404 });

    let m: RegExpMatchArray | null;
    if ((m = path.match(/^\/git\/ref\/heads\/(.+)$/))) {
      const b = this.branches.get(m[1]);
      return b ? json({ object: { sha: b.sha } }) : missing();
    }
    if (path === '/git/refs' && method === 'POST') {
      const source = [...this.branches.values()].find((b) => b.sha === body.sha)!;
      this.branches.set(body.ref.replace('refs/heads/', ''), {
        sha: body.sha,
        files: new Map(source.files),
      });
      return json({}, 201);
    }
    if ((m = path.match(/^\/git\/refs\/heads\/(.+)$/)) && method === 'DELETE') {
      return this.branches.delete(m[1]) ? new Response(null, { status: 204 }) : missing();
    }
    if ((m = path.match(/^\/contents\/(.+)$/))) {
      const filePath = decodeURIComponent(m[1]);
      const branch = method === 'GET' ? url.searchParams.get('ref')! : body.branch;
      const b = this.branches.get(branch);
      if (!b) return missing();
      const current = b.files.get(filePath);
      if (method === 'GET') {
        return current === undefined
          ? missing()
          : json({ sha: this.blobSha(current), content: Buffer.from(current).toString('base64') });
      }
      // GitHub requires the current blob sha to change or delete a file
      if (current !== undefined && body.sha !== this.blobSha(current)) {
        return json({ message: 'sha mismatch' }, 409);
      }
      if (method === 'PUT') {
        b.files.set(filePath, Buffer.from(body.content, 'base64').toString('utf8'));
      } else {
        b.files.delete(filePath);
      }
      return json({ commit: { sha: this.commit(branch, body.message) } });
    }
    if ((m = path.match(/^\/compare\/main\.\.\.(.+)$/))) {
      const main = this.branches.get('main')!.files;
      const b = this.branches.get(decodeURIComponent(m[1]))!.files;
      const files = [...b.keys()]
        .filter((f) => main.get(f) !== b.get(f))
        .map((filename) => ({ filename, status: main.has(filename) ? 'modified' : 'added' }));
      return json({ files });
    }
    if (path === '/deployments') {
      const deployed = this.deployments.get(url.searchParams.get('sha')!);
      return json(deployed ? [{ id: 1 }] : []);
    }
    if ((m = path.match(/^\/deployments\/\d+\/statuses$/))) {
      const url = [...this.deployments.values()][0];
      return json([{ state: 'success', environment_url: url }]);
    }
    throw new Error(`Unhandled ${method} ${path}`);
  };
}

let github: FakeGitHub;

beforeEach(() => {
  process.env.GITHUB_TOKEN = 'test-token';
  github = new FakeGitHub({ [EXISTING_PATH]: '---\ntitle: I, Pencil\n---\nOld body\n' });
  global.fetch = jest.fn(github.fetch) as typeof fetch;
  (getBlogPosts as jest.Mock).mockReturnValue([EXISTING_POST]);
});

const mainFiles = () => github.branches.get('main')!.files;
const mainCommits = () => github.commits.filter((c) => c.branch === 'main');

describe('publishing workflow', () => {
  it('previews a new post on its own branch without touching main', async () => {
    const preview = await previewPost({ title: 'New Idea', markdown: 'Draft one' });

    expect(preview).toMatchObject({
      slug: 'new-idea',
      action: 'create',
      branch: 'post/new-idea',
      filePath: 'src/blog-posts/posts/new-idea.md',
    });
    expect(github.branches.get('post/new-idea')!.files.get(preview.filePath)).toContain('Draft one');
    expect(mainFiles().has(preview.filePath)).toBe(false);
  });

  it('publishes repeated preview edits to main as a single commit', async () => {
    await previewPost({ title: 'New Idea', markdown: 'Draft one' });
    await previewPost({ title: 'New Idea', markdown: 'Draft two' });
    const published = await publishPost('new-idea');

    expect(mainCommits()).toEqual([{ branch: 'main', message: '[post] New Idea' }]);
    expect(matter(mainFiles().get(published.filePath)!).content).toContain('Draft two');
    expect(github.branches.has('post/new-idea')).toBe(false);
    expect(published.url).toMatch(/\/blog\/new-idea$/);
  });

  it('refuses to replace an existing post without overwrite', async () => {
    await expect(previewPost({ title: 'I, Pencil', markdown: 'New body' })).rejects.toThrow(
      /already exists/
    );
    expect(github.branches.has('post/i-pencil')).toBe(false);
  });

  it('revises an existing post in place and keeps its original date', async () => {
    const preview = await previewPost({
      title: 'I, Pencil',
      markdown: 'New body',
      overwrite: true,
    });
    await publishPost('i-pencil');

    expect(preview).toMatchObject({ action: 'update', filePath: EXISTING_PATH });
    const { data, content } = matter(mainFiles().get(EXISTING_PATH)!);
    expect(data.date).toBe('2025-06-27');
    expect(content).toContain('New body');
  });

  it('returns the preview URL once Vercel has deployed the commit', async () => {
    github.deployments.set('sha2', 'https://blog-git-post-new-idea.vercel.app');
    const preview = await previewPost(
      { title: 'New Idea', markdown: 'Body' },
      { waitMs: 1_000 }
    );
    expect(preview.previewUrl).toBe('https://blog-git-post-new-idea.vercel.app/blog/new-idea');
  });

  it('will not publish a post that was never previewed', async () => {
    await expect(publishPost('nothing-here')).rejects.toThrow(/preview_post first/);
    expect(mainCommits()).toEqual([]);
  });

  it('discards a preview without publishing it', async () => {
    await previewPost({ title: 'New Idea', markdown: 'Body' });
    await discardPreview('new-idea');
    expect(github.branches.has('post/new-idea')).toBe(false);
    expect(mainCommits()).toEqual([]);
  });

  it('unpublishes a post by deleting its file on main', async () => {
    await unpublishPost('i-pencil');
    expect(mainFiles().has(EXISTING_PATH)).toBe(false);
    expect(mainCommits()).toEqual([{ branch: 'main', message: '[post] unpublish I, Pencil' }]);
  });
});
