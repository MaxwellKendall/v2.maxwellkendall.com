import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import Layout from '../layout';
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';
import { Components } from 'react-markdown';
import { ReactNode } from 'react';
import Image from 'next/image';
import path from 'path';
import fs from 'fs/promises';
// Reuse the same custom components from the blog post
const customComponents: Components = {
  strong: ({ children }: { children: ReactNode }) => (
    <b className="font-bold">{children}</b>
  ),

  p: ({ children }: { children: ReactNode }) => (
    <div className="mb-4 leading-relaxed text-gray-800 dark:text-gray-200">
      {children}
    </div>
  ),

  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="flex items-center text-3xl font-bold mb-6 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="flex items-center text-2xl font-bold mb-4 mt-8">
      {children}
    </h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="flex items-center text-xl font-bold mb-3 mt-6">
      {children}
    </h3>
  ),

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

  img: ({ src, alt }) => {
    if (!src) return null;
    const isMural = src.includes('mural');

    return (
      <Image
        src={src}
        alt={alt || ''}
        width={isMural ? 80 : 200} // Small size for inline
        height={isMural ? 80 : 48}
        className={`rounded-lg ${isMural ? 'mr-2' : 'rounded-lg mx-2'}`}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
        // Add loading priority for images
        loading="lazy"
        // Add quality optimization
        quality={75}
      />
    );
  },

  blockquote: ({ children }: { children: ReactNode }) => (
    <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 italic">
      {children}
    </blockquote>
  ),

  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="text-gray-800 dark:text-gray-200">{children}</li>
  ),
};

export default async function About() {
  // Read the about.md file
  const aboutContent = await fs.readFile(
    path.join(process.cwd(), 'src/app/about/about.md'),
    'utf8'
  );

  return (
    <Layout>
      <Navigation />
      <main className="max-w-4xl mx-auto py-8 px-4 font-['Inter'] antialiased">
        <article className="prose lg:prose-xl">
          <ReactMarkdown
            components={customComponents}
            rehypePlugins={[rehypeHighlight, rehypeRaw]}
          >
            {aboutContent}
          </ReactMarkdown>
        </article>
      </main>
      <Footer />
    </Layout>
  );
}
