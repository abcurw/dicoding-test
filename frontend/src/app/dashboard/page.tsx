'use client';

import { useVacancies, useDeleteVacancy } from '@/lib/hooks';
import Link from 'next/link';

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function DashboardPage() {
  const { data: vacancies, isLoading, error } = useVacancies();
  const deleteVacancy = useDeleteVacancy();

  const handleDelete = async (id: number, title: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus lowongan "${title}"?`)) {
      deleteVacancy.mutate(id);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="hidden md:flex w-[27%] min-w-[250px] bg-white border-r border-gray-200 pt-8 pb-6 flex-col items-end">
        <div className="mb-6 w-60 pr-4 h-8 flex items-center">
          <span className="font-medium text-xl text-gray-900 ml-2">Jobs</span>
        </div>
        <nav className="w-60">
          <div className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-900 bg-gray-100 whitespace-nowrap">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Lowongan Saya
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 pr-48 bg-gray-50">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Lowongan Saya</h1>
          <Link
            href="/dashboard/create"
            className="inline-flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buat lowongan
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">Error loading vacancies</p>
          </div>
        ) : vacancies && vacancies.length > 0 ? (
          <div className="space-y-4">
            {vacancies.map((vacancy) => (
              <div
                key={vacancy.id}
                className="bg-white border border-gray-200 rounded p-5 pb-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded flex-shrink-0 bg-slate-800 flex items-center justify-center">
                    <img
                      src={vacancy.company_logo || '/white-g.png'}
                      alt={vacancy.company_name}
                      className={vacancy.company_logo ? 'w-full h-full object-cover' : 'w-3.5 h-[18px]'}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{vacancy.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        Dibuat: {formatDate(vacancy.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Aktif hingga: {formatDate(vacancy.expired_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-5">
                      <Link
                        href={`/dashboard/edit/${vacancy.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(vacancy.id, vacancy.title)}
                        disabled={deleteVacancy.isPending}
                        className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <svg className="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Belum ada lowongan yang dibuat</p>
            <Link
              href="/dashboard/create"
              className="inline-flex items-center px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded hover:bg-slate-700 transition-colors"
            >
              Buat lowongan pertama Anda
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}