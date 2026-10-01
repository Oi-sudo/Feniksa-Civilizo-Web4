import type { Metadata } from 'next';
import Link from 'next/link';
import LogoutButton from '@/components/auth/LogoutButton';
import { getCurrentUser } from '@/lib/auth/session';
import { getLocale } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: 'Feniksa Civilizo Web4 0.1 Alpha',
  description: 'Phoenix Civilization multilingual education, digital museum and DAD collaboration prototype.'
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user,locale]=await Promise.all([getCurrentUser(),getLocale()]);
  const eo=locale==='eo';
  return (
    <html lang={locale}>
      <body>
        <header className="site-header">
          <Link className="brand" href="/">{eo?'Feniksa Civilizo':'凤凰文明 · Feniksa Civilizo'}</Link>
          <nav>
            <Link href="/courses">{eo?'Kursoj':'课程 / Kursoj'}</Link>
            <Link href="/museum">{eo?'Muzeo':'博物馆 / Muzeo'}</Link>
            <Link href="/dad">DAD</Link>
            <Link href="/passport">{eo?'Pasporto':'护照 / Pasporto'}</Link>
            <Link href="/dual-wing">{eo?'Du Flugiloj':'双翼 / Du Flugiloj'}</Link>
            <Link href="/status">{eo?'Stato':'状态 / Stato'}</Link>
            {user ? <>
              <span className="nav-user">{user.display_name}</span>
              <LogoutButton label={eo?'Eliri':'退出 / Eliri'} />
            </> : <>
              <Link href="/login">{eo?'Ensaluti':'登录 / Ensaluti'}</Link>
              <Link href="/register">{eo?'Registriĝi':'注册 / Registriĝi'}</Link>
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
