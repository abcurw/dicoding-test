'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVacancies, getVacancy, createVacancy, updateVacancy, deleteVacancy } from './api';
import { VacancyFormData } from '@/types/vacancy';

export function useVacancies(search?: string) {
  return useQuery({
    queryKey: ['vacancies', search],
    queryFn: () => getVacancies(search),
  });
}

export function useVacancy(id: number) {
  return useQuery({
    queryKey: ['vacancy', id],
    queryFn: () => getVacancy(id),
    enabled: !!id,
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VacancyFormData) => createVacancy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<VacancyFormData> }) =>
      updateVacancy(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
      queryClient.invalidateQueries({ queryKey: ['vacancy', variables.id] });
    },
  });
}

export function useDeleteVacancy() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVacancy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vacancies'] });
    },
  });
}