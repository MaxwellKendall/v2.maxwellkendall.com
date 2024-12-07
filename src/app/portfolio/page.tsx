import fs from 'fs';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css'; // or any other style you prefer
import Layout from '../layout';
import { Navigation } from '../components/Navigation';

export default async function Portofolio() {
  const content = fs.readFileSync('src/app/portfolio/portfolio.md', 'utf8');

  return (
    <Layout>
      <Navigation />
      <main className="mx-auto max-w-4xl py-8 px-4">
        <article className="prose lg:prose-xl">
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
