'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from '../lib/api';

export default function Layout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="header-title">
            🐾 宠物健康养护平台
          </Link>
          <nav className="header-nav">
            {isLoggedIn ? (
              <>
                <Link href="/pets">宠物档案</Link>
                <Link href="/care">养护记录</Link>
                <div className="header-user">
                  <span>欢迎, {user?.username}</span>
                  <button onClick={handleLogout} className="header-logout">
                    退出登录
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className="header-login">
                登录
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
