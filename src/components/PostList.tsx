'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { BlogPostCard } from '../types';

export function PostList({ initialPosts }: { initialPosts: BlogPostCard[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  
  const filteredPosts = useMemo(() => {
    if (!search) return initialPosts;
    
    const searchLower = search.toLowerCase();
    return initialPosts.filter((post) => 
      post.title.toLowerCase().includes(searchLower) ||
      post.description?.toLowerCase().includes(searchLower) ||
      post.category.toLowerCase().includes(searchLower)
    );
  }, [initialPosts, search]);

  const handleSearch = useCallback((value: string) => {
    const params = new URLSearchParams();
    if (value) {
      params.set('search', value);
    }
    router.push(`/?${params.toString()}`);
  }, [router]);

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-600">No posts found</p>
        ) : (
          filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.description && (
                  <p className="text-gray-700 mb-2">{post.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">{post.date}</p>
                  <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {post.category}
                  </span>
                </div>
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  );
} 