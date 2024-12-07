import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPostCard } from '@/app/page';

const POSTS_DIRECTORY = 'src/blog-posts';

export interface Post {
  post: BlogPostCard;
  content: string;
}
// Helper function to search recursively through directories
function findPostInDirectory(dir: string, slug: string): string | null {
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
        frontmatter.slug = item.name.replace(/\.md$/, '');
      }
      if (frontmatter.slug === slug) {
        return fullPath;
      }
    }
  }

  return null;
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
      date: frontmatter.date,
      tags,
      slug: frontmatter.slug,
    },
    content,
  });
}