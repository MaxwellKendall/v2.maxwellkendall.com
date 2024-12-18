/* eslint-disable @typescript-eslint/no-unused-vars */
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';

// Initialize the fonts
const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });
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
      <body className="flex flex-col min-h-screen">{children}</body>
    </html>
  );
}
