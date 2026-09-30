import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feniksa Civilizo Web4 0.1 Alpha',
  description: 'Phoenix Civilization multilingual education, digital museum and DAD collaboration prototype.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh">
      <body>
        <header className="site-header">
          <Link className="brand" href="/">凤凰文明 · Feniksa Civilizo</Link>
          <nav>
            <Link href="/courses">课程 / Kursoj</Link>
            <Link href="/museum">博物馆 / Muzeo</Link>
            <Link href="/dad">DAD</Link>
            <Link href="/passport">护照 / Pasporto</Link>
            <Link href="/dual-wing">双翼 / Du Flugiloj</Link>
            <Link href="/status">状态 / Stato</Link>
            <a href="/api/locale?locale=zh&next=/">中</a>
            <a href="/api/locale?locale=eo&next=/">EO</a>
            <a href="/api/locale?locale=en&next=/">EN</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
