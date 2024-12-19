import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { links } from '@/lib/links';

export const Footer = () => {
  return (
    <footer className="font-['Inter'] antialiased mt-auto w-full bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto">
        <div className="flex justify-center gap-8">
          <a
            href={links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transform hover:scale-110 transition-all duration-200"
            aria-label="GitHub"
          >
            <FaGithub size={28} />
          </a>

          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transform hover:scale-110 transition-all duration-200"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={28} />
          </a>

          <a
            href={links.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transform hover:scale-110 transition-all duration-200"
            aria-label="Resume"
          >
            <HiOutlineDocumentText size={28} />
          </a>

          <a
            href={links.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transform hover:scale-110 transition-all duration-200"
            aria-label="Linktree"
          >
            <HiOutlineUserCircle size={28} />
          </a>
          <a
            href={
              links.email +
              '?subject=' +
              encodeURIComponent('Hello from your portfolio!') +
              '&body=' +
              encodeURIComponent(
                'I found your portfolio and would love to connect!'
              )
            }
            className="hover:text-white transform hover:scale-110 transition-all duration-200"
            aria-label="Email"
          >
            <MdEmail size={28} />
          </a>
        </div>
      </div>
      <span className="flex justify-center text-sm mt-8">
        Please send questions or comments to
        <a
          className="ml-1 hover:text-white transition-colors duration-200"
          href={links.email}
        >
          maxwell.n.kendall@gmail.com
        </a>
      </span>
      <span className="flex justify-center mt-2 text-xs">
        © {new Date().getFullYear()} Maxwell Kendall. All rights reserved.
      </span>
    </footer>
  );
};

export default Footer;
