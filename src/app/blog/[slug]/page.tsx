import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { format, parseISO } from 'date-fns';
import { kebabCase } from 'lodash';
import { getPostBySlug } from '../../../lib/blog-utils';
import Markdown from '../../components/Markdown';

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const { post: frontmatter, content } = post;
  const formattedDate = format(parseISO(frontmatter.date), 'MMMM d, yyyy');
  const tags = (frontmatter.tags || [])
    .map(kebabCase)
    .filter((tag) => tag && tag !== 'public');

  return (
    <article>
      <Link href="/" className="text-sm text-subtle hover:text-foreground">
        ← All writing
      </Link>
      <header className="mb-10 mt-8 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {frontmatter.title}
        </h1>
        {frontmatter.description && (
          <p className="mt-3 text-lg text-muted">{frontmatter.description}</p>
        )}
        <p className="mt-4 text-sm text-subtle">
          <time dateTime={frontmatter.date}>{formattedDate}</time>
          {' · '}
          {frontmatter.readingTime}
          {tags.map((tag) => (
            <span key={tag}>
              {' · '}
              <Link
                href={`/?q=${encodeURIComponent(tag)}`}
                className="hover:text-accent"
              >
                {tag}
              </Link>
            </span>
          ))}
        </p>
      </header>
      <Markdown content={content} />
    </article>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const { post: frontmatter } = post;

  // Create the OG image URL
  // Preview deployments and local dev may not set NEXT_PUBLIC_BASE_URL
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000');
  const ogImage = new URL(`${baseUrl}/api/og`);
  ogImage.searchParams.append('title', frontmatter.title);

  return {
    title: frontmatter.title,
    openGraph: {
      images: [
        {
          url: ogImage.toString(),
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogImage.toString()],
    },
  };
}
