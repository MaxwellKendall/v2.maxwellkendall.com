import Link from 'next/link';
import { links } from '@/lib/links';

const linkClass = 'text-muted transition-colors hover:text-foreground';

export const Navigation = () => {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight text-foreground hover:text-accent"
        >
          Maxwell Kendall
        </Link>
        <div className="flex items-center gap-5 text-sm">
          <Link href="/about" className={linkClass}>
            About
          </Link>
          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Resume
            <span aria-hidden className="ml-0.5 text-subtle">
              ↗
            </span>
          </a>
          <a href={links.email} className={linkClass}>
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
