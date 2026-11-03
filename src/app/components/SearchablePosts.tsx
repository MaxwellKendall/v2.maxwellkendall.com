'use client';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { BlogPostCard } from '../page';
import { format } from 'date-fns';
import { countBy, groupBy } from 'lodash';

const EXCLUDED_TAGS = ['private', 'draft'];
const HIDDEN_TAGS = ['public'];
const TOPIC_LIMIT = 10;

export const getFilteredPosts = (searchTerm: string, posts: BlogPostCard[]) => {
  const searchLower = searchTerm.toLowerCase();
  return posts
    .filter((p) => !EXCLUDED_TAGS.some((t) => p.tags.includes(t)))
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.description?.toLowerCase().includes(searchLower) ||
        post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
    );
};

const visibleTags = (post: BlogPostCard) =>
  post.tags.filter((tag) => !HIDDEN_TAGS.includes(tag));

export default function SearchablePosts({ posts }: { posts: BlogPostCard[] }) {
  return (
    <Suspense fallback={null}>
      <SearchablePostsContent posts={posts} />
    </Suspense>
  );
}

function SearchablePostsContent({ posts }: { posts: BlogPostCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  // Replace rather than push so typing doesn't flood the back button
  const updateSearch = (term: string) => {
    setSearchTerm(term);
    const params = new URLSearchParams(searchParams);
    if (term) params.set('q', term);
    else params.delete('q');
    const query = params.toString();
    router.replace(query ? `?${query}` : '/', { scroll: false });
  };

  const publishedPosts = getFilteredPosts('', posts);
  const topics = Object.entries(countBy(publishedPosts.flatMap(visibleTags)))
    .sort(([, a], [, b]) => b - a)
    .slice(0, TOPIC_LIMIT);

  const filteredPosts = getFilteredPosts(searchTerm, posts);
  const postsByYear = groupBy(filteredPosts, (post) =>
    post.date ? new Date(post.date).getFullYear() : 'Undated'
  );
  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <section aria-labelledby="writing">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="writing" className="text-sm font-medium text-foreground">
          Writing
          <span className="ml-2 font-normal text-subtle">
            {filteredPosts.length}
          </span>
        </h2>
        <input
          type="search"
          placeholder="Search posts"
          aria-label="Search posts"
          value={searchTerm}
          onChange={(e) => updateSearch(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm placeholder:text-subtle focus:border-accent focus:outline-none sm:w-64"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {topics.map(([tag, count]) => {
          const active = searchTerm === tag;
          return (
            <button
              key={tag}
              onClick={() => updateSearch(active ? '' : tag)}
              aria-pressed={active}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                active
                  ? 'border-accent bg-accent text-background'
                  : 'border-border text-muted hover:border-subtle hover:text-foreground'
              }`}
            >
              {tag}
              <span className={active ? 'ml-1' : 'ml-1 text-subtle'}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="mt-12 border-t border-border pt-12 text-center">
          <p className="text-muted">
            Nothing on &ldquo;{searchTerm}&rdquo; yet.
          </p>
          <button
            onClick={() => updateSearch('')}
            className="mt-3 text-sm text-accent hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        years.map((year) => (
          <div key={year} className="mt-10">
            <h3 className="border-b border-border pb-2 font-mono text-xs text-subtle">
              {year}
            </h3>
            <ul>
              {postsByYear[year].map((post) => (
                <li key={post.slug} className="border-b border-border">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group grid gap-x-6 py-4 sm:grid-cols-[4.5rem_1fr]"
                  >
                    <span className="hidden pt-0.5 font-mono text-xs text-subtle sm:block">
                      {post.date && format(new Date(post.date), 'MMM d')}
                    </span>
                    <div>
                      <span className="font-medium text-foreground group-hover:text-accent">
                        {post.title}
                      </span>
                      {post.description && (
                        <p className="mt-1 text-sm text-muted">
                          {post.description}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-subtle">
                        <span className="sm:hidden">
                          {post.date &&
                            `${format(new Date(post.date), 'MMM d')} · `}
                        </span>
                        {post.readingTime}
                        {visibleTags(post).length > 0 &&
                          ` · ${visibleTags(post).join(', ')}`}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </section>
  );
}
