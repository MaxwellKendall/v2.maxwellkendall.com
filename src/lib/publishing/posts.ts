import matter from 'gray-matter';
import { kebabCase } from 'lodash';
import { POSTS_DIRECTORY } from '../blog-utils';

export const NEW_POSTS_DIRECTORY = `${POSTS_DIRECTORY}/posts`;

export interface PostInput {
  title: string;
  markdown: string;
  tags?: string[];
  description?: string;
  date?: string;
  slug?: string;
}

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const today = () => new Date().toISOString().slice(0, 10);

export const newPostPath = (slug: string) =>
  `${NEW_POSTS_DIRECTORY}/${slug}.md`;

// Bear notes open with the title as an H1; the post page renders its own
const stripTitleHeading = (markdown: string, title: string) => {
  const [firstLine, ...rest] = markdown.trimStart().split('\n');
  const heading = firstLine.match(/^#\s+(.*)$/)?.[1]?.trim();
  return heading?.toLowerCase() === title.trim().toLowerCase()
    ? rest.join('\n').trimStart()
    : markdown.trimStart();
};

export function buildPost(input: PostInput): { slug: string; file: string } {
  const title = input.title.trim();
  if (!title) throw new Error('title is required');

  const slug = input.slug ?? kebabCase(title);
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`slug "${slug}" must be lowercase words joined by dashes`);
  }

  const date = input.date ?? today();
  if (!DATE_PATTERN.test(date) || Number.isNaN(Date.parse(date))) {
    throw new Error(`date "${date}" must be YYYY-MM-DD`);
  }

  const body = stripTitleHeading(input.markdown, title);
  if (!body.trim()) throw new Error('markdown body is empty');

  const tags = (input.tags ?? []).map(kebabCase).filter(Boolean);
  const frontmatter = {
    title,
    slug,
    date,
    ...(tags.length ? { tags: tags.join(', ') } : {}),
    ...(input.description?.trim()
      ? { description: input.description.trim() }
      : {}),
  };

  // gray-matter's YAML dump quotes anything ambiguous (colons, dates)
  return { slug, file: matter.stringify(`\n${body.trimEnd()}\n`, frontmatter) };
}
