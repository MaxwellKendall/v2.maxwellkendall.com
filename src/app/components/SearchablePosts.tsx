'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPostCard } from '../page';
import { format } from 'date-fns';

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
    <div className="min-w-full">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[20rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem] 
                  p-2 mb-4 border rounded-lg"
      />
      <div className="space-y-4 w-[20rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem]">
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
              className="w-[20rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem] 
                         border rounded-lg p-4 hover:bg-gray-50"
            >
              <Link href={`/blog/${post.slug}`}>
                <div>
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  {post.description && (
                    <p className="text-gray-700 mb-2">{post.description}</p>
                  )}
                  <div className="flex gap-2 mb-2">
                    {post.tags
                      .filter((tag) => tag !== 'public')
                      .map((tag) => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            setSearchTerm(tag);
                          }}
                          className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 
                            text-gray-700 text-sm rounded-full cursor-pointer 
                            transition-all duration-200 border border-gray-200 
                            hover:border-gray-300 font-medium 
                            hover:shadow-sm active:scale-95"
                        >
                          #{tag}
                        </button>
                      ))}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-xs">
                    <p>{format(new Date(post.date), 'MMMM do, yyyy')}</p>
                    <span>•</span>
                    <p>{post.readingTime}</p>
                  </div>
                </div>
              </Link>
            </article>
          ))}
      </div>
    </div>
  );
}
