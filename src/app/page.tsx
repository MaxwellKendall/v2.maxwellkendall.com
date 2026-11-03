import SearchablePosts from './components/SearchablePosts';
import Link from 'next/link';
import { getBlogPosts } from '../lib/blog-utils';

export type { BlogPostCard } from '../lib/blog-utils';

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
