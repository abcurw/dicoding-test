'use client';

import Link from 'next/link';
import { Vacancy } from '@/types/vacancy';

interface JobCardProps {
  vacancy: Vacancy;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatSalary(min?: number | null, max?: number | null): string | null {
  if (!min && !max) return null;

  const format = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1)} jt`;
    }
    return num.toLocaleString('id-ID');
  };

  if (min && max) {
    return `Rp ${format(min)} - ${format(max)}`;
  } else if (min) {
    return `Rp ${format(min)}`;
  } else if (max) {
    return `Rp ${format(max)}`;
  }
  return null;
}

export default function JobCard({ vacancy }: JobCardProps) {
  return (
    <Link href={`/vacancies/${vacancy.id}`} className="block mb-3 last:mb-0">
      <div className="bg-white border border-gray-200 rounded p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start gap-5">
          <div className="w-24 h-24 rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img
              src={vacancy.company_logo || '/dicoding-square.jpg'}
              alt={vacancy.company_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base mb-2">
              {vacancy.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>{vacancy.company_name}</span>
              <span className="text-gray-400">|</span>
              <span>{vacancy.job_type}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{vacancy.company_city}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{vacancy.experience_min || '-'}</span>
              </div>
              {vacancy.show_salary && formatSalary(vacancy.salary_min, vacancy.salary_max) && (
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formatSalary(vacancy.salary_min, vacancy.salary_max)}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right text-sm text-gray-500 flex-shrink-0 space-y-1">
            <p>Dibuat pada {formatDate(vacancy.created_at)}</p>
            <p>Lamar sebelum {formatDate(vacancy.expired_at)}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}