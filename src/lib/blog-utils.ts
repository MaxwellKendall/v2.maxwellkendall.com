import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { kebabCase } from 'lodash';

export const POSTS_DIRECTORY = 'src/blog-posts';

export interface BlogPostCard {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  description?: string;
  readingTime: string;
  // Repo-relative path of the source file
  path?: string;
}

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
    path: filePath,
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

export function getBlogPosts(): BlogPostCard[] {
  const files = getFiles();
  const posts = files.map(parseFile);
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export interface Post {
  post: BlogPostCard;
  content: string;
}

export const parseSlugFromFile = (
  filePath: string,
  frontMatterTitle: string
) => {
  const fileSlug = filePath.split('/').pop()?.replace(/\.md$/, '');
  return `${kebabCase(frontMatterTitle)}-${fileSlug}`;
};

// Helper function to search recursively through directories
function findPostInDirectory(dir: string, rawSlug: string): string | null {
  const slug = rawSlug.replace(/:/g, '/');
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      const found = findPostInDirectory(fullPath, slug);
      if (found) return found;
    } else if (item.name.endsWith('.md')) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data: frontmatter } = matter(fileContents);
      if (!frontmatter.slug) {
        frontmatter.slug = parseSlugFromFile(item.name, frontmatter.title);
      }
      if (frontmatter.slug === slug) {
        return fullPath;
      }
    }
  }

  return null;
}

const WORDS_PER_MINUTE = 200; // average per ai

export function getReadingTime(content: string): string {
  const wordCount = content.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return `${readingTime} min read`;
}

export function getPostBySlug(slug: string): Promise<Post | null> {
  const postsDirectory = path.join(process.cwd(), POSTS_DIRECTORY);

  const filePath = findPostInDirectory(postsDirectory, slug);

  if (!filePath) {
    return Promise.resolve(null);
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  const tags = frontmatter.tags.split(',');

  return Promise.resolve({
    post: {
      title: frontmatter.title,
      description: frontmatter.description,
      readingTime: getReadingTime(content),
      date: frontmatter.date,
      tags,
      slug: frontmatter.slug,
    },
    content,
  });
}
