import type { Metadata } from 'next';
import Link from 'next/link';
import LogoutButton from '@/components/auth/LogoutButton';
import { getCurrentUser } from '@/lib/auth/session';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feniksa Civilizo Web4 0.1 Alpha',
  description: 'Phoenix Civilization multilingual education, digital museum and DAD collaboration prototype.'
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user=await getCurrentUser();
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
            {user ? <>
              <span className="nav-user">{user.display_name}</span>
              <LogoutButton label="退出 / Eliri" />
            </> : <>
              <Link href="/login">登录 / Ensaluti</Link>
              <Link href="/register">注册 / Registriĝi</Link>
            </>}
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
