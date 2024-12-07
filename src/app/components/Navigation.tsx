import Link from 'next/link';
import Image from 'next/image';

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
              href="/portfolio"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Portfolio
            </Link>
          </li>
          <li>
            <a
              target="_blank"
              href="https://maxwell-kendall-resume.s3.amazonaws.com/MAXWELL_KENDALL_Resume.PDF"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Resume
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://linktr.ee/maxwellkendall"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Contact
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
