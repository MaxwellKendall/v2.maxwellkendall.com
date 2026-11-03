import matter from 'gray-matter';
import { buildPost } from './posts';

describe('buildPost', () => {
  it('writes frontmatter that survives YAML-hostile titles', () => {
    const { slug, file } = buildPost({
      title: 'Dynamic Programming: A Strategic Approach',
      markdown: 'Body text',
      date: '2026-11-03',
    });
    const { data, content } = matter(file);

    expect(slug).toBe('dynamic-programming-a-strategic-approach');
    expect(data.title).toBe('Dynamic Programming: A Strategic Approach');
    // A bare YAML date would parse as a Date and break the site's sorting
    expect(data.date).toBe('2026-11-03');
    expect(content.trim()).toBe('Body text');
  });

  it('drops a leading H1 that repeats the title, as Bear notes have', () => {
    const { file } = buildPost({
      title: 'I, Pencil',
      markdown: '# I, Pencil\n\nNo one can make a pencil.',
    });
    expect(matter(file).content.trim()).toBe('No one can make a pencil.');
  });

  it('keeps a leading H1 that differs from the title', () => {
    const { file } = buildPost({
      title: 'I, Pencil',
      markdown: '# Introduction\n\nText',
    });
    expect(matter(file).content).toContain('# Introduction');
  });

  it('stores tags as the comma-separated kebab-case string the site expects', () => {
    const { file } = buildPost({
      title: 'Tagged',
      markdown: 'Body',
      tags: ['Technical Collaboration', 'dp'],
    });
    expect(matter(file).data.tags).toBe('technical-collaboration, dp');
  });

  it('defaults the date to today', () => {
    const { file } = buildPost({ title: 'Today', markdown: 'Body' });
    expect(matter(file).data.date).toBe(new Date().toISOString().slice(0, 10));
  });

  const invalidCases = {
    'an empty title': { title: '  ', markdown: 'Body' },
    'an empty body': { title: 'Empty', markdown: '# Empty\n' },
    'a slug with path characters': { title: 'X', markdown: 'B', slug: '../x' },
    'a malformed date': { title: 'X', markdown: 'B', date: 'Nov 3' },
  };

  Object.entries(invalidCases).forEach(([name, input]) => {
    it(`rejects ${name}`, () => {
      expect(() => buildPost(input)).toThrow();
    });
  });
});
