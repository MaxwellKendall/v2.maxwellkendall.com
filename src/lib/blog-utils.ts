import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPostCard } from '@/app/page';
import { kebabCase } from 'lodash';

const POSTS_DIRECTORY = 'src/blog-posts';

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
