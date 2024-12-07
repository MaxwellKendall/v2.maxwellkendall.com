import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';
import Layout from './layout';

const PUBLIC_POST = 'public';

interface BlogPostCard {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  description: string;
  category: string;
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
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
        <div className="space-y-4">
          {posts
            .filter((p) => p.tags.includes(PUBLIC_POST))
            .map((post) => (
              <article
                key={post.slug}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  {post.description && (
                    <p className="text-gray-700 mb-2">{post.description}</p>
                  )}
                  <p className="text-gray-600">{post.date}</p>
                </Link>
              </article>
            ))}
        </div>
      </main>
    </Layout>
  );
}
