import fs from 'fs';
import { createMcpHandler, withMcpAuth } from 'mcp-handler';
import type { AuthInfo } from '@modelcontextprotocol/server';
import { z } from 'zod';
import { getBlogPosts } from '@/lib/blog-utils';
import { issuerFor, resourceFor } from '@/lib/oauth/clients';
import { SCOPE, SessionClaims, isAllowedUser, verify } from '@/lib/oauth/tokens';
import {
  discardPreview,
  findPost,
  previewPost,
  previewStatus,
  publishPost,
  unpublishPost,
} from '@/lib/publishing/workflow';

// Long enough for preview_post to wait on Vercel's preview build
export const maxDuration = 60;
const PREVIEW_WAIT_MS = 40_000;

const slugInput = z.object({
  slug: z.string().describe('The post slug, as shown by list_posts'),
});

const result = (value: unknown) => ({
  content: [{ type: 'text' as const, text: JSON.stringify(value, null, 2) }],
});

// Tool failures go back to the model as readable errors, not protocol errors
const safely =
  <A,>(run: (args: A) => Promise<unknown>) =>
  async (args: A) => {
    try {
      return result(await run(args));
    } catch (error) {
      return {
        content: [{ type: 'text' as const, text: (error as Error).message }],
        isError: true,
      };
    }
  };

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      'list_posts',
      {
        title: 'List posts',
        description:
          'List every post on the live site, newest first, including ones tagged draft or private (hidden from readers).',
        annotations: { readOnlyHint: true },
      },
      safely(async () =>
        getBlogPosts().map(({ slug, title, date, tags, description, path }) => ({
          slug,
          title,
          date,
          tags,
          description,
          path,
        }))
      )
    );

    server.registerTool(
      'get_post',
      {
        title: 'Get post',
        description:
          'Read a published post’s full Markdown source, including frontmatter. Use before revising a post.',
        inputSchema: slugInput,
        annotations: { readOnlyHint: true },
      },
      safely(async ({ slug }: z.infer<typeof slugInput>) => {
        const post = findPost(slug);
        if (!post?.path) throw new Error(`No published post with slug "${slug}"`);
        return { path: post.path, source: fs.readFileSync(post.path, 'utf8') };
      })
    );

    const previewInput = z.object({
      title: z.string().describe('Post title'),
      markdown: z
        .string()
        .describe(
          'Post body in Markdown, without frontmatter. A leading "# Title" heading matching the title is removed.'
        ),
      tags: z
        .array(z.string())
        .optional()
        .describe('Topic tags. Add "draft" or "private" to keep it off the post list.'),
      description: z.string().optional().describe('One-sentence summary shown under the title'),
      date: z
        .string()
        .optional()
        .describe('Publish date as YYYY-MM-DD. Defaults to today, or the original date when revising.'),
      slug: z.string().optional().describe('URL slug. Defaults to the title in kebab-case.'),
      overwrite: z
        .boolean()
        .optional()
        .describe('Required to replace a post that already exists with this slug'),
    });

    server.registerTool(
      'preview_post',
      {
        title: 'Preview post',
        description:
          'Create or revise a post on a preview branch and return its Vercel preview URL. Nothing goes live until publish_post. Call again with the same slug to revise the preview. Show the user the preview URL and wait for their go-ahead before publishing.',
        inputSchema: previewInput,
      },
      safely((input: z.infer<typeof previewInput>) =>
        previewPost(input, { waitMs: PREVIEW_WAIT_MS })
      )
    );

    server.registerTool(
      'preview_status',
      {
        title: 'Preview status',
        description: 'Check whether a post’s preview has finished building and get its URL.',
        inputSchema: slugInput,
        annotations: { readOnlyHint: true },
      },
      safely(({ slug }: z.infer<typeof slugInput>) => previewStatus(slug))
    );

    server.registerTool(
      'publish_post',
      {
        title: 'Publish post',
        description:
          'Publish a previewed post to the live site as one commit on main, then delete its preview branch. Only call after the user approves the preview.',
        inputSchema: slugInput,
      },
      safely(({ slug }: z.infer<typeof slugInput>) => publishPost(slug))
    );

    server.registerTool(
      'discard_preview',
      {
        title: 'Discard preview',
        description: 'Throw away a post’s preview branch without publishing it.',
        inputSchema: slugInput,
        annotations: { destructiveHint: true },
      },
      safely(({ slug }: z.infer<typeof slugInput>) => discardPreview(slug))
    );

    server.registerTool(
      'unpublish_post',
      {
        title: 'Unpublish post',
        description:
          'Remove a published post from the live site by deleting its file on main. Git history keeps a copy.',
        inputSchema: slugInput,
        annotations: { destructiveHint: true },
      },
      safely(({ slug }: z.infer<typeof slugInput>) => unpublishPost(slug))
    );
  },
  {
    serverInfo: { name: 'maxwellkendall-blog', version: '1.0.0' },
    instructions:
      'Publishes Markdown posts to Maxwell Kendall’s blog. Always preview_post first, share the preview URL, and only publish_post once the user approves.',
  }
);

async function verifyToken(
  req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> {
  if (!bearerToken) return undefined;
  const issuer = issuerFor(req);
  const session = await verify<SessionClaims>('access', bearerToken, issuer).catch(
    () => undefined
  );
  if (
    !session ||
    session.resource !== resourceFor(issuer) ||
    !isAllowedUser(session.sub)
  ) {
    return undefined;
  }
  return {
    token: bearerToken,
    clientId: session.client_id,
    scopes: [SCOPE],
    expiresAt: session.exp,
    resource: new URL(session.resource),
    extra: { login: session.sub },
  };
}

const authHandler = withMcpAuth(handler, verifyToken, { required: true });

export { authHandler as GET, authHandler as POST, authHandler as DELETE };
