'use client';

import { useRouter } from 'next/navigation';
import { useCreateVacancy } from '@/lib/hooks';
import VacancyForm from '@/components/VacancyForm';
import HeroBanner from '@/components/HeroBanner';
import { VacancyFormData } from '@/types/vacancy';

export default function CreateVacancyPage() {
  const router = useRouter();
  const createVacancy = useCreateVacancy();

  const handleSubmit = async (data: VacancyFormData) => {
    try {
      await createVacancy.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to create vacancy:', error);
      alert('Gagal membuat lowongan. Silakan coba lagi.');
    }
  };

  return (
    <div>
      <HeroBanner
        title="Buat lowongan pekerjaan"
        subtitle={"Dicoding Jobs menghubungkan industri dengan talenta yang tepat.\nMencari tim baru tidak harus melelahkan dan boros biaya."}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <VacancyForm onSubmit={handleSubmit} isLoading={createVacancy.isPending} />
      </div>
    </div>
  );
}