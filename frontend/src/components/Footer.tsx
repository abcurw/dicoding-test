'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <img src="/dicoding-long.jpg" alt="Dicoding" className="h-8" />
            </div>
            <div className="text-sm text-gray-600">
              <p className="font-medium">Dicoding Space</p>
              <p>Jl. Batik Kumeli No.50, Sukaluyu,</p>
              <p>Kec. Cibeunying Kaler, Kota Bandung Jawa</p>
              <p>Barat 40123</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}