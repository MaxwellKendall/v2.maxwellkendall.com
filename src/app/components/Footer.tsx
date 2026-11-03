import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdEmail } from 'react-icons/md';
import { links } from '@/lib/links';

const socials = [
  { href: links.github, label: 'GitHub', Icon: FaGithub },
  { href: links.linkedin, label: 'LinkedIn', Icon: FaLinkedin },
  { href: links.resume, label: 'Resume', Icon: HiOutlineDocumentText },
  { href: links.email, label: 'Email', Icon: MdEmail },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col-reverse items-center justify-between gap-4 px-4 py-8 text-sm text-subtle sm:flex-row sm:px-6">
        <span>© {new Date().getFullYear()} Maxwell Kendall</span>
        <div className="flex items-center gap-5">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto:') ? undefined : '_blank'}
              rel="noopener noreferrer"
              aria-label={label}
              className="transition-colors hover:text-foreground"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
