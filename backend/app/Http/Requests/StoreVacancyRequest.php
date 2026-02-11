<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'company_logo' => 'nullable|string|max:255',
            'company_city' => 'required|string|max:255',
            'company_sector' => 'nullable|string|max:255',
            'company_employee_count' => 'nullable|integer|min:1',
            'job_type' => 'required|in:Full-Time,Part-Time,Kontrak,Intern',
            'description' => 'required|string',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'show_salary' => 'nullable|boolean',
            'experience_min' => 'nullable|string|max:100',
            'candidates_needed' => 'nullable|integer|min:1',
            'is_remote' => 'nullable|boolean',
            'expired_at' => 'required|date|after:today',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Job title is required.',
            'company_name.required' => 'Company name is required.',
            'company_city.required' => 'Company city/location is required.',
            'job_type.required' => 'Job type is required.',
            'job_type.in' => 'Job type must be Full-Time, Part-Time, Kontrak, or Intern.',
            'description.required' => 'Job description is required.',
            'expired_at.required' => 'Expiry date is required.',
            'expired_at.after' => 'Expiry date must be a future date.',
            'salary_max.gte' => 'Maximum salary must be greater than or equal to minimum salary.',
        ];
    }
}