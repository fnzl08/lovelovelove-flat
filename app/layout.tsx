import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Love!Love!Love!',
  description: 'Whole sign romance simulator dashboard with tarot, compatibility, and logs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
