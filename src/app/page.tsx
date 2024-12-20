import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Layout from './layout';
import SearchablePosts from './components/SearchablePosts';
import Navigation from './components/Navigation';
import { Footer } from './components/Footer';
import { getReadingTime } from '../lib/blog-utils';
export interface BlogPostCard {
  slug: string;
  title: string;
  tags: string[];
  date: string;
  description?: string;
  readingTime: string;
}

const POSTS_DIRECTORY = 'src/blog-posts';

const parseFile = (filePath: string) => {
  console.log({ filePath });
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  const tags = frontmatter.tags.split(',');
  if (!frontmatter.slug) {
    frontmatter.slug = filePath.replace(/\.md$/, '').replace(/\//g, '-');
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
      console.log({ path });
      if (dirent.isDirectory()) return [acc[0], [...acc[1], path]];
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
    <Layout>
      <Navigation />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <SearchablePosts posts={posts} />
      </main>
      <Footer />
    </Layout>
  );
}
