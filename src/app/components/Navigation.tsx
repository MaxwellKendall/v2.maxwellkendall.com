import Link from 'next/link';
import Image from 'next/image';
import { links } from '@/lib/links';

export const Navigation = () => {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
      <div className="flex items-center gap-8">
        <Link href="/" className="w-12 h-12 overflow-hidden rounded-full">
          <Image
            src="/images/Headshot.jpg"
            alt="Profile Picture"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </Link>
        <ul className="flex items-center gap-8">
          <li>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              About
            </Link>
          </li>
          <li>
            <a
              target="_blank"
              href={links.resume}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
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
          </li>
          <li>
            <a
              target="_blank"
              href={links.email}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
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
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
