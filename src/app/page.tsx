import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import SearchablePosts from './components/SearchablePosts';
import Link from 'next/link';
import { getReadingTime, parseSlugFromFile } from '../lib/blog-utils';
import { kebabCase } from 'lodash';

export interface BlogPostCard {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  description?: string;
  readingTime: string;
}

const POSTS_DIRECTORY = 'src/blog-posts';
const IMAGE_FILE_EXTENSIONS = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.svg',
  '.webp',
  '.bmp',
];

const parseFile = (filePath: string) => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  const tags = frontmatter.tags?.split(',')?.map(kebabCase) || [];
  if (!frontmatter.slug) {
    const fileSlug = filePath.split('/').pop() || '';
    frontmatter.slug = parseSlugFromFile(fileSlug, frontmatter.title);
  }

  // Add the category and reading time to the post data
  return {
    ...(frontmatter as BlogPostCard),
    tags,
    readingTime: getReadingTime(content),
  };
};

const getFiles = (directory: string = POSTS_DIRECTORY): Array<string> => {
  const postsDirectory = path.join(process.cwd(), directory);
  const dirContent = fs.readdirSync(postsDirectory, { withFileTypes: true });

  const [files, childDirectories] = dirContent.reduce(
    (acc: Array<Array<string>>, dirent) => {
      const path = `${directory}/${dirent.name}`;
      if (dirent.isDirectory()) return [acc[0], [...acc[1], path]];

      // Exclude image files
      const fileExtension = dirent.name
        .toLowerCase()
        .substring(dirent.name.lastIndexOf('.'));
      if (IMAGE_FILE_EXTENSIONS.includes(fileExtension)) {
        return acc; // Skip image files
      }

      return [[...acc[0], path], acc[1]];
    },
    [[], []]
  );

  childDirectories.forEach((child) => {
    files.push(...getFiles(child));
  });

  return files;
};

function getBlogPosts(): BlogPostCard[] {
  const files = getFiles();
  const posts = files.map(parseFile);
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function Home() {
  const posts = getBlogPosts();

  return (
    <>
      <header className="mb-16">
        <h1 className="sr-only">Maxwell Kendall</h1>
        <p className="max-w-xl text-xl leading-relaxed text-muted">
          Staff software engineer. I write here to work through algorithms,
          architecture, and the craft of building software with other people.
        </p>
        <Link
          href="/about"
          className="mt-4 inline-block text-sm text-accent hover:underline"
        >
          More about me →
        </Link>
      </header>
      <SearchablePosts posts={posts} />
    </>
  );
}
