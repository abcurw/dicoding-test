<?php

namespace Tests\Unit;

use App\Models\Vacancy;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_vacancy_has_fillable_attributes(): void
    {
        $vacancy = new Vacancy();

        $this->assertEquals([
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
        ], $vacancy->getFillable());
    }

    public function test_vacancy_casts_expired_at_to_date(): void
    {
        $vacancy = Vacancy::factory()->create([
            'expired_at' => '2026-12-31',
        ]);

        $this->assertInstanceOf(Carbon::class, $vacancy->expired_at);
    }

    public function test_vacancy_casts_is_remote_to_boolean(): void
    {
        $vacancy = Vacancy::factory()->create([
            'is_remote' => 1,
        ]);

        $this->assertTrue($vacancy->is_remote);
        $this->assertIsBool($vacancy->is_remote);
    }

    public function test_vacancy_is_expired_returns_true_for_past_date(): void
    {
        $vacancy = Vacancy::factory()->create([
            'expired_at' => Carbon::yesterday(),
        ]);

        $this->assertTrue($vacancy->isExpired());
    }

    public function test_vacancy_is_expired_returns_false_for_future_date(): void
    {
        $vacancy = Vacancy::factory()->create([
            'expired_at' => Carbon::tomorrow(),
        ]);

        $this->assertFalse($vacancy->isExpired());
    }

    public function test_vacancy_search_scope_filters_by_title(): void
    {
        Vacancy::factory()->create(['title' => 'Software Engineer']);
        Vacancy::factory()->create(['title' => 'Product Manager']);
        Vacancy::factory()->create(['title' => 'Senior Engineer']);

        $results = Vacancy::search('Engineer')->get();

        $this->assertCount(2, $results);
    }

    public function test_vacancy_search_scope_returns_all_when_empty(): void
    {
        Vacancy::factory()->count(3)->create();

        $results = Vacancy::search('')->get();

        $this->assertCount(3, $results);
    }

    public function test_vacancy_search_scope_returns_all_when_null(): void
    {
        Vacancy::factory()->count(3)->create();

        $results = Vacancy::search(null)->get();

        $this->assertCount(3, $results);
    }
}