import { Vacancy, VacancyFormData, ApiResponse } from '@/types/vacancy';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getVacancies(search?: string): Promise<Vacancy[]> {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  const response = await fetchApi<ApiResponse<Vacancy[]>>(`/vacancies${params}`);
  return response.data;
}

export async function getVacancy(id: number): Promise<Vacancy> {
  const response = await fetchApi<ApiResponse<Vacancy>>(`/vacancies/${id}`);
  return response.data;
}

export async function createVacancy(data: VacancyFormData): Promise<Vacancy> {
  const response = await fetchApi<ApiResponse<Vacancy>>('/vacancies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function updateVacancy(id: number, data: Partial<VacancyFormData>): Promise<Vacancy> {
  const response = await fetchApi<ApiResponse<Vacancy>>(`/vacancies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response.data;
}

export async function deleteVacancy(id: number): Promise<void> {
  await fetchApi<ApiResponse<null>>(`/vacancies/${id}`, {
    method: 'DELETE',
  });
}