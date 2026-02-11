'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useVacancy, useUpdateVacancy } from '@/lib/hooks';
import VacancyForm from '@/components/VacancyForm';
import HeroBanner from '@/components/HeroBanner';
import { VacancyFormData } from '@/types/vacancy';
import Link from 'next/link';

export default function EditVacancyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: vacancy, isLoading, error } = useVacancy(parseInt(id));
  const updateVacancy = useUpdateVacancy();

  const handleSubmit = async (data: VacancyFormData) => {
    try {
      await updateVacancy.mutateAsync({ id: parseInt(id), data });
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to update vacancy:', error);
      alert('Gagal memperbarui lowongan. Silakan coba lagi.');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !vacancy) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Lowongan tidak ditemukan</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroBanner
        title="Edit lowongan pekerjaan"
        subtitle="Perbarui informasi lowongan Anda."
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <VacancyForm
          initialData={vacancy}
          onSubmit={handleSubmit}
          isLoading={updateVacancy.isPending}
        />
      </div>
    </div>
  );
}