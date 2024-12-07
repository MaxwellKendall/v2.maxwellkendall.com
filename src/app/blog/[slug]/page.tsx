import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css'; // or any other style you prefer
import Layout from '../../layout';
import { getPostBySlug } from '../../../lib/blog-utils';
import { notFound } from 'next/navigation';

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

  return (
    <Layout>
      <main className="max-w-4xl mx-auto py-8 px-4">
        <article className="prose lg:prose-xl">
          <h1>{frontmatter.title}</h1>
          <p className="text-gray-600">{frontmatter.date}</p>
          <ReactMarkdown
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
            remarkPlugins={[remarkGfm]}
          >
            {content}
          </ReactMarkdown>
        </article>
      </main>
    </Layout>
  );
}
