'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-1">
              <img
                src="/g-logo.jpg"
                alt="Dicoding"
                className="w-8 h-8"
              />
              <span className="text-xl text-gray-900">Jobs</span>
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <div className="flex flex-col items-center">
                <Link
                  href="/"
                  className={`text-sm font-medium ${
                    isActive('/') && !isActive('/dashboard')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Lowongan Kerja
                </Link>
                <span className={`w-4 h-0.5 mt-1 ${isActive('/') && !isActive('/dashboard') ? 'bg-gray-900' : 'bg-transparent'}`}></span>
              </div>
              <div className="flex flex-col items-center">
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </Link>
                <span className={`w-4 h-0.5 mt-1 ${isActive('/dashboard') ? 'bg-gray-900' : 'bg-transparent'}`}></span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}