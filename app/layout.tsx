import type { Metadata } from 'next'; import './globals.css';
export const metadata: Metadata = { title:'Al-Bayan | القرآن الكريم', description:'A multilingual Quran reading and listening experience.' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
