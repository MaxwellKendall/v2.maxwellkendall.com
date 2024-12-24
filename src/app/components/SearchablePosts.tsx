'use client';
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { BlogPostCard } from '../page';
import { format } from 'date-fns';
import Image from 'next/image';

const EXCLUDED_TAGS = ['private', 'draft'];

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

  const filteredPosts = getFilteredPosts(searchTerm, posts);

  return (
    <div className="min-w-full font-['Inter'] antialiased">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-[20rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem] 
                  p-2 mb-4 border rounded-lg font-['Inter']"
      />
      <div className="space-y-4 w-[20rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem]">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <Image
              src="https://media.giphy.com/media/baPIkfAo0Iv5K/giphy.gif?cid=790b7611tmc3e8e515dfcxz80fqrgq6hy5i8j5g8ev8j9ngy&ep=v1_gifs_search&rid=giphy.gif&ct=g"
              alt="Eddie Murphy tapping head thinking meme"
              width={192}
              height={192}
              className="mx-auto mb-4 rounded-lg object-cover w-[300px] md:w-[450px] lg:w-[600px] xl:w-[750px]"
            />
            <p className="text-xl text-gray-600 mb-2 font-['Inter']">
              Oops I haven&apos;t written anything up about that yet!
            </p>
            <p className="text-gray-500 font-['Inter']">
              Try searching for something else!
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => {
            return (
              <article
                key={post.slug}
                className="w-[20rem] sm:w-[24rem] md:w-[28rem] lg:w-[32rem] xl:w-[36rem] 
                         border rounded-lg p-4 
                         hover:bg-gray-50 dark:hover:bg-gray-800/50 
                         transition-colors duration-200
                         dark:border-gray-700"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 font-['Inter'] dark:text-gray-100">
                      {post.title}
                    </h2>
                    {post.description && (
                      <p className="text-gray-700 mb-2 font-['Inter'] dark:text-gray-300">
                        {post.description}
                      </p>
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
                            className="inline-block px-2 py-1 text-sm rounded-md 
                              bg-gray-100 text-gray-700
                              dark:bg-gray-800 dark:text-gray-300
                              hover:bg-gray-200 dark:hover:bg-gray-700 
                              transition-colors duration-200"
                          >
                            {tag}
                          </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-xs font-['Inter']">
                      {post.date && (
                        <p>{format(new Date(post.date), 'MMMM do, yyyy')}</p>
                      )}
                      <span>•</span>
                      <p>{post.readingTime}</p>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
