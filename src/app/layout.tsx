/* eslint-disable @typescript-eslint/no-unused-vars */
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import { Inter, Montserrat, JetBrains_Mono } from 'next/font/google';

// Initialize the fonts
const inter = Inter({ subsets: ['latin'] });
const montserrat = Montserrat({ subsets: ['latin'] });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] });

export const metadata = {
  title: 'Full Stack Software Engineering',
  description:
    'Max is a full stack software engineer. This site contains content related to his current studies.',
  icons: {
    icon: '/favicon.svg',
    // Optional: Add different sizes for iOS/Android
    apple: '/favicon.svg',
  },
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
