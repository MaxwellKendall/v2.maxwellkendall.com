import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import type { Nodes } from 'hast';
import 'highlight.js/styles/github-dark-dimmed.css';

const textOf = (node?: Nodes): string => {
  if (!node) return '';
  if (node.type === 'text') return node.value;
  return 'children' in node ? node.children.map(textOf).join('') : '';
};

const defaultComponents: Components = {
  a: ({ href, children }) => {
    const external = href?.startsWith('http');
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  },

  // Fenced code: line-number gutter beside the highlighted block
  pre: ({ node, children }) => {
    const lineCount = textOf(node).replace(/\n$/, '').split('\n').length;
    return (
      <div className="code-block not-prose my-6 flex overflow-hidden rounded-lg border border-[#2d333b] bg-[#22272e] font-mono text-[13px] leading-6 text-[#adbac7]">
        <div
          aria-hidden
          className="select-none border-r border-[#2d333b] py-3 pl-4 pr-3 text-right text-[#636e7b]"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="flex-1 overflow-x-auto px-4 py-3">{children}</pre>
      </div>
    );
  },
};

export default function Markdown({
  content,
  components,
}: {
  content: string;
  components?: Components;
}) {
  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{ ...defaultComponents, ...components }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
