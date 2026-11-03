import { Components } from 'react-markdown';
import Image from 'next/image';
import path from 'path';
import fs from 'fs/promises';
import Markdown from '../components/Markdown';

export const metadata = { title: 'About' };

// Company logos sit inside headings, so render them inline at a fixed size
const aboutComponents: Components = {
  img: ({ src, alt }) => {
    if (!src || typeof src !== 'string') return null;
    const isMural = src.includes('mural');

    return (
      <Image
        src={src}
        alt={alt || ''}
        width={isMural ? 80 : 200}
        height={isMural ? 80 : 48}
        className="my-0 inline-block h-auto max-w-full dark:rounded dark:bg-white dark:px-2 dark:py-1"
      />
    );
  },
};

export default async function About() {
  const aboutContent = await fs.readFile(
    path.join(process.cwd(), 'src/app/about/about.md'),
    'utf8'
  );

  return <Markdown content={aboutContent} components={aboutComponents} />;
}
