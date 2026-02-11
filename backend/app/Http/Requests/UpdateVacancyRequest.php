<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVacancyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|required|string|max:255',
            'company_name' => 'sometimes|required|string|max:255',
            'company_logo' => 'nullable|string|max:255',
            'company_city' => 'sometimes|required|string|max:255',
            'company_sector' => 'nullable|string|max:255',
            'company_employee_count' => 'nullable|integer|min:1',
            'job_type' => 'sometimes|required|in:Full-Time,Part-Time,Kontrak,Intern',
            'description' => 'sometimes|required|string',
            'salary_min' => 'nullable|integer|min:0',
            'salary_max' => 'nullable|integer|min:0|gte:salary_min',
            'show_salary' => 'nullable|boolean',
            'experience_min' => 'nullable|string|max:100',
            'candidates_needed' => 'nullable|integer|min:1',
            'is_remote' => 'nullable|boolean',
            'expired_at' => 'sometimes|required|date',
        ];
    }
}