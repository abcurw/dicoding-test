'use client';

import { use, useState, useEffect } from 'react';
import { useVacancy } from '@/lib/hooks';
import Link from 'next/link';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];
  let inList = false;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 mb-4">
          {currentList.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
      currentList = [];
    }
    inList = false;
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith('## ')) {
      flushList();
      elements.push(
        <h2 key={index} className="text-lg font-semibold mt-6 mb-3">
          {trimmedLine.replace('## ', '')}
        </h2>
      );
    } else if (trimmedLine.startsWith('- ')) {
      inList = true;
      currentList.push(trimmedLine.replace('- ', ''));
    } else if (trimmedLine === '') {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {trimmedLine}
        </p>
      );
    }
  });

  flushList();
  return elements;
}

export default function VacancyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: vacancy, isLoading, error } = useVacancy(parseInt(id));
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Vacancy not found</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to vacancies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={`bg-white border-b border-gray-200 sticky top-16 z-40 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className={`flex gap-4 ${isScrolled ? 'items-center' : 'items-start'}`}>
            <div className={`rounded flex items-center justify-center flex-shrink-0 overflow-hidden transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-20 h-20'}`}>
              <img
                src={vacancy.company_logo || '/dicoding-square.jpg'}
                alt={vacancy.company_name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className={`font-bold text-gray-900 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>{vacancy.title}</h1>
              <p className={`text-sm text-gray-500 mb-1 transition-all duration-300 ${isScrolled ? 'hidden' : 'block'}`}>
                Sektor Bisnis: {vacancy.company_sector || 'Technology'}
              </p>
              <div className={`flex items-center gap-4 text-sm text-gray-600 transition-all duration-300 ${isScrolled ? 'hidden' : 'flex'}`}>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <a href="#" className="text-blue-600 hover:underline">
                    {vacancy.company_name}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{vacancy.company_city}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{vacancy.company_employee_count || '50-100'} Karyawan</span>
                </div>
              </div>
              <div className={`transition-all duration-300 ${isScrolled ? 'block mt-1' : 'hidden'}`}>
                <span className="inline-block px-3 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
                  {vacancy.job_type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <span className="inline-block px-4 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full">
            {vacancy.job_type}
          </span>
        </div>

        <div className="prose max-w-none">
          {renderMarkdown(vacancy.description)}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Informasi Tambahan</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-900">Pengalaman bekerja</p>
              <p className="text-sm text-gray-600">{vacancy.experience_min || '-'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Kandidat yang dibutuhkan</p>
              <p className="text-sm text-gray-600">{vacancy.candidates_needed} kandidat</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke daftar lowongan
          </Link>
        </div>
      </div>
    </div>
  );
}