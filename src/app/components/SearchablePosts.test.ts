import { getFilteredPosts } from './SearchablePosts';
import type { BlogPostCard } from '../page';

describe('getFilteredPosts', () => {
  const mockPosts: BlogPostCard[] = [
    {
      slug: 'post-1',
      title: 'Test Post 1',
      description: 'Description 1',
      tags: ['react', 'testing'],
      date: '2024-03-20',
      readingTime: '5 min read',
    },
    {
      slug: 'post-2',
      title: 'Test Post 2',
      description: 'Description 2',
      tags: ['javascript', 'private'],
      date: '2024-03-21',
      readingTime: '3 min read',
    },
    {
      slug: 'post-3',
      title: 'Draft Post',
      description: 'Draft Description',
      tags: ['react', 'draft'],
      date: '2024-03-22',
      readingTime: '4 min read',
    },
  ];

  const testCases = {
    'filters out posts with excluded tags (private, draft)': {
      input: '',
      expected: [mockPosts[0]],
    },
    'returns non-excluded posts when search term is empty': {
      input: '',
      expected: [mockPosts[0]],
    },
    'filters posts by search term in title': {
      input: 'Test Post 1',
      expected: [mockPosts[0]],
    },
    'filters posts by search term in description': {
      input: 'Description 1',
      expected: [mockPosts[0]],
    },
    'filters posts by search term in tags': {
      input: 'react',
      expected: [mockPosts[0]], // Only one because the other 'react' post is a draft
    },
    'is case insensitive': {
      input: 'TEST',
      expected: [mockPosts[0]],
    },
    'returns empty array when no matches found': {
      input: 'nonexistent',
      expected: [],
    },
  };

  Object.entries(testCases).forEach(([description, { input, expected }]) => {
    it(description, () => {
      const filtered = getFilteredPosts(input, mockPosts);
      expect(filtered).toEqual(expected);
    });
  });
});
