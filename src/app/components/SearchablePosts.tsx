'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPostCard } from '../page';

export default function SearchablePosts({ posts }: { posts: BlogPostCard[] }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchablePostsContent posts={posts} />
    </Suspense>
  );
}

function SearchablePostsContent({ posts }: { posts: BlogPostCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const searchLower = searchTerm.toLowerCase();

  // Update URL when search term changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }

    // Update the URL without refreshing the page
    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchTerm, router, searchParams]);

  return (
    <>
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 mb-4 border rounded-lg"
      />
      <div className="space-y-4">
        {posts
          .filter((p) => p.tags.includes('public'))
          .filter(
            (post) =>
              post.title.toLowerCase().includes(searchLower) ||
              post.description?.toLowerCase().includes(searchLower) ||
              post.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
          )
          .map((post) => (
            <article
              key={post.slug}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div>
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  {post.description && (
                    <p className="text-gray-700 mb-2">{post.description}</p>
                  )}
                </Link>
                <div className="flex gap-2 mb-2">
                  {post.tags
                    .filter((tag) => tag !== 'public')
                    .map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm rounded-full cursor-pointer transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <p className="text-gray-600">{post.date}</p>
                </Link>
              </div>
            </article>
          ))}
      </div>
    </>
  );
}
