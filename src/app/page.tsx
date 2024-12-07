import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Layout from './layout';
import SearchablePosts from './components/SearchablePosts';
import Navigation from './components/Navigation';
import { Footer } from './components/Footer';
export interface BlogPostCard {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  description?: string; // should be required
}

const POSTS_DIRECTORY = 'src/blog-posts';

function getBlogPosts(): BlogPostCard[] {
  const postsDirectory = path.join(process.cwd(), POSTS_DIRECTORY);
  const posts: BlogPostCard[] = [];

  // Get all directories
  const directories = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Process each directory
  directories.forEach((directory) => {
    const categoryPath = path.join(postsDirectory, directory);
    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith('.md'));

    files.forEach((fileName) => {
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data: frontmatter } = matter(fileContents);
      const tags = frontmatter.tags.split(',');
      if (!frontmatter.slug) {
        frontmatter.slug = fileName.replace(/\.md$/, '');
      }

      // Add the category to the post data
      posts.push({
        ...(frontmatter as BlogPostCard),
        tags,
      });
    });
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export default function Home() {
  const posts = getBlogPosts();

  return (
    <Layout>
      <Navigation />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <SearchablePosts posts={posts} />
      </main>
      <Footer />
    </Layout>
  );
}
