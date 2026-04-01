import './globals.css';
import type { Metadata } from 'next';
import { Jua } from 'next/font/google';

const jua = Jua({ weight: '400', subsets: ['latin'], display: 'swap', preload: false });

export const metadata: Metadata = {
  title: 'Love!Love!Love!',
  description: 'Whole sign romance simulator dashboard with tarot, compatibility, and logs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={jua.className}>{children}</body>
    </html>
  );
}
