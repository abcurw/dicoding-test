<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'company_name',
        'company_logo',
        'company_city',
        'company_sector',
        'company_employee_count',
        'job_type',
        'description',
        'salary_min',
        'salary_max',
        'show_salary',
        'experience_min',
        'candidates_needed',
        'is_remote',
        'expired_at',
    ];

    protected $casts = [
        'is_remote' => 'boolean',
        'show_salary' => 'boolean',
        'expired_at' => 'date',
        'salary_min' => 'integer',
        'salary_max' => 'integer',
        'company_employee_count' => 'integer',
        'candidates_needed' => 'integer',
    ];

    public function scopeSearch($query, $term)
    {
        if ($term) {
            return $query->where('title', 'like', '%' . $term . '%');
        }
        return $query;
    }

    public function isExpired(): bool
    {
        return $this->expired_at->isPast();
    }
}