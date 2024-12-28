import Link from 'next/link';
import { links } from '@/lib/links';

export const Navigation = () => {
  return (
    <nav className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-sm">
      <div className="container max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-gray-800 dark:text-white font-semibold">
            <Link href="/" className="flex items-center gap-2">
              <div className="pointer w-12 h-12 overflow-hidden rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors duration-200 dark:text-gray-300 dark:hover:text-white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
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
