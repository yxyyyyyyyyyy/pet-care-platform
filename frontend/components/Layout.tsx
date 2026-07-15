'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              🐾 宠物健康养护平台
            </Link>
            <nav className="flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <Link href="/pets" className="text-gray-600 hover:text-indigo-600">
                    宠物档案
                  </Link>
                  <Link href="/care" className="text-gray-600 hover:text-indigo-600">
                    养护记录
                  </Link>
                  <span className="text-gray-500 text-sm">欢迎, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 text-sm"
                  >
                    退出登录
                  </button>
                </>
              ) : (
                <Link href="/login" className="text-indigo-600 hover:text-indigo-700">
                  登录
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
