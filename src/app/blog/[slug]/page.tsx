import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Layout from '../../layout';
import { getPostBySlug } from '../../../lib/blog-utils';
import { notFound } from 'next/navigation';
import { Navigation } from '../../components/Navigation';
import { Footer } from '../../components/Footer';
import { Components } from 'react-markdown';
import { ReactNode } from 'react';
import { format, parseISO } from 'date-fns';
// import 'highlight.js/styles/github-dark.css'; // or any other style you prefer
import 'highlight.js/styles/github-dark-dimmed.css';
import Image from 'next/image';

// Create a custom components object for ReactMarkdown
const customComponents: Components = {
  // Convert strong to b tags
  strong: ({ children }: { children: ReactNode }) => (
    <b className="font-bold">{children}</b>
  ),

  // Convert p to div tags with styling
  p: ({ children }: { children: ReactNode }) => (
    <div className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
      {children}
    </div>
  ),

  // Style headings
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-3xl font-bold mb-6 mt-8">{children}</h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-2xl font-bold mb-4 mt-8">{children}</h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-xl font-bold mb-3 mt-6">{children}</h3>
  ),

  // Style links
  a: ({ href, children }: { href?: string; children: ReactNode }) => (
    <a
      href={href}
      className="text-blue-600 dark:text-blue-400 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),

  pre: ({ children }: { children: ReactNode }) => <pre>{children}</pre>,

  // Style code blocks and inline code
  code: ({
    className,
    children,
  }: {
    inline?: boolean;
    className?: string;
    children: ReactNode;
  }) => {
    const isInline = !className;

    return isInline ? (
      <code className="rounded bg-[#f6f8fa] px-[0.4em] py-[0.2em] text-[0.9em] font-['Consolas',_'Menlo',_'Ubuntu_Mono',_monospace] text-[#24292e] dark:bg-[#21262d] dark:text-[#c9d1d9]">
        {children}
      </code>
    ) : (
      <div className="grid grid-cols-[auto_1fr] bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden my-4 border border-gray-700 shadow-lg">
        <div className="py-2 text-gray-400 text-right bg-gray-700/50 select-none font-['Consolas',_'Menlo',_'Ubuntu_Mono',_monospace] text-[12px] min-w-[2.5rem] px-6">
          {Array.from(
            { length: (children?.toString().split('\n').length || 1) - 1 },
            (_, i) => (
              <div
                key={i + 1}
                className="h-[21px] flex items-center justify-center"
              >
                {i + 1}
              </div>
            )
          )}
        </div>
        <code className="block text-gray-200 py-2 px-4 text-[14px] leading-[1.5] font-['Consolas',_'Menlo',_'Ubuntu_Mono',_monospace] overflow-x-auto">
          {children}
        </code>
      </div>
    );
  },

  // Style blockquotes
  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic">
      {children}
    </blockquote>
  ),

  // Style lists
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
  ),
  ol: ({ children, start }: { children: ReactNode; start?: number }) => (
    <ol start={start} className="list-decimal list-inside mb-4 space-y-2">
      {children}
    </ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="text-gray-800 dark:text-gray-200">{children}</li>
  ),

  img: ({ src, alt }) => {
    if (!src) return null;

    return (
      <div className="my-6">
        <Image
          src={src}
          alt={alt || ''}
          className="rounded-lg mx-auto"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    );
  },
};

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
  const formattedDate = format(parseISO(frontmatter.date), 'MMMM do, yyyy');

  return (
    <Layout>
      <Navigation />
      <main className="max-w-4xl mx-auto py-8 px-4 font-['Inter'] antialiased">
        <article className="prose lg:prose-xl">
          <h1 className="text-center text-4xl font-bold mb-4 font-['Inter']">
            {frontmatter.title}
          </h1>
          <p className="text-center text-gray-600 mb-4 font-['Inter']">
            {formattedDate}
          </p>
          {frontmatter.tags && (
            <p className="text-center text-gray-600 mb-8 font-['Inter']">
              {frontmatter.tags.map((tag) => `#${tag.trim()}`).join(', ')}
            </p>
          )}
          <ReactMarkdown
            components={customComponents}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
      <Footer />
    </Layout>
  );
}
