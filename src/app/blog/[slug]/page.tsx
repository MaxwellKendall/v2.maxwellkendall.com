import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css'; // or any other style you prefer
import Layout from '../../layout';

async function getBlogPost(slug: string) {
  const postsDirectory = path.join(process.cwd(), 'src/posts');
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const { data: frontmatter, content } = matter(fileContents);

  return {
    frontmatter,
    content,
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const { frontmatter, content } = await getBlogPost(params.slug);

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
