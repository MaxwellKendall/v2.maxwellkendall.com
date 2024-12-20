import Link from 'next/link';
import { links } from '@/lib/links';

export const Navigation = () => {
  return (
    <nav className="w-full bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 dark:text-white font-semibold">
            <Link
              href="/"
              replace
              className="pointer w-12 h-12 overflow-hidden rounded-full flex items-center justify-center bg-black hover:bg-gray-900 transition-all duration-300 relative group"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 text-lime-400"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line
                  x1="12"
                  y1="6"
                  x2="12"
                  y2="18"
                  className="animate-[blink_1s_step-end_infinite]"
                />
              </svg>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-lime-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <Link
              href="/about"
              className="font-['Inter'] text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
            >
              About
            </Link>
            <a
              target="_blank"
              href={links.resume}
              className="font-['Inter'] text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 dark:text-gray-300 dark:hover:text-white"
            >
              Resume
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <a
              target="_blank"
              href={links.email}
              className="font-['Inter'] text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1 dark:text-gray-300 dark:hover:text-white"
            >
              Contact
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
