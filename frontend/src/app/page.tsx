'use client';

import { useState, useEffect } from 'react';
import { useVacancies } from '@/lib/hooks';
import HeroBanner from '@/components/HeroBanner';
import SearchInput from '@/components/SearchInput';
import JobCard from '@/components/JobCard';

export default function Home() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data: vacancies, isLoading, error } = useVacancies(debouncedSearch);

  const title = debouncedSearch ? 'Hasil Pencarian' : 'Daftar Pekerjaan Terbaru';

  return (
    <div>
      <HeroBanner />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="w-80">
            <SearchInput value={search} onChange={setSearch} />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse rounded-lg h-28"
              />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading vacancies</p>
          </div>
        ) : vacancies && vacancies.length > 0 ? (
          <div className="mb-8">
            {vacancies.map((vacancy) => (
              <JobCard key={vacancy.id} vacancy={vacancy} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {debouncedSearch
                ? 'Tidak ada lowongan yang ditemukan'
                : 'Belum ada lowongan tersedia'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}