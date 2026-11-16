import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Al-Bayan | القرآن الكريم',
  description: 'A multilingual Quran reading, recitation and tafsir experience in Arabic, English, German and French.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ar"><body>{children}</body></html>;
}
