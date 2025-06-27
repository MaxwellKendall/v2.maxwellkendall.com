import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Layout from './layout';
import SearchablePosts from './components/SearchablePosts';
import Navigation from './components/Navigation';
import { Footer } from './components/Footer';
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

const parseFile = (filePath: string) => {
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data: frontmatter, content } = matter(fileContents);
  console.log('Frontmatter:', frontmatter, content);
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
