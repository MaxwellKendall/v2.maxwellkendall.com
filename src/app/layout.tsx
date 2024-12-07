import './globals.css';
import 'highlight.js/styles/github-dark.css';
import { Navigation } from './components/Navigation';

export const metadata = {
  title: 'Blog App',
  description: 'Next.js blog with Markdown support',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
