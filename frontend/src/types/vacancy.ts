export interface Vacancy {
  id: number;
  title: string;
  company_name: string;
  company_logo: string | null;
  company_city: string;
  company_sector: string | null;
  company_employee_count: number | null;
  job_type: 'Full-Time' | 'Part-Time' | 'Kontrak' | 'Intern';
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  show_salary: boolean;
  experience_min: string | null;
  candidates_needed: number;
  is_remote: boolean;
  expired_at: string;
  created_at: string;
  updated_at: string;
}

export interface VacancyFormData {
  title: string;
  company_name: string;
  company_logo?: string;
  company_city: string;
  company_sector?: string;
  company_employee_count?: number;
  job_type: 'Full-Time' | 'Part-Time' | 'Kontrak' | 'Intern';
  description: string;
  salary_min?: number;
  salary_max?: number;
  show_salary?: boolean;
  experience_min?: string;
  candidates_needed?: number;
  is_remote?: boolean;
  expired_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}