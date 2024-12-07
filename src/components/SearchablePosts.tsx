'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPostCard } from '../app/page';

export default function SearchablePosts({ posts }: { posts: BlogPostCard[] }) {
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
    </>
  );
}
