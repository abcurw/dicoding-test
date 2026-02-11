<?php

namespace Tests\Feature;

use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VacancyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_get_all_vacancies(): void
    {
        Vacancy::factory()->count(3)->create();

        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    '*' => [
                        'id',
                        'title',
                        'company_name',
                        'company_city',
                        'job_type',
                        'description',
                        'expired_at',
                    ],
                ],
            ])
            ->assertJsonCount(3, 'data');
    }

    public function test_can_search_vacancies_by_title(): void
    {
        Vacancy::factory()->create(['title' => 'Android Developer']);
        Vacancy::factory()->create(['title' => 'iOS Developer']);
        Vacancy::factory()->create(['title' => 'Product Manager']);

        $response = $this->getJson('/api/vacancies?search=Developer');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    public function test_can_get_single_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();

        $response = $this->getJson("/api/vacancies/{$vacancy->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'company_name',
                    'company_city',
                    'job_type',
                    'description',
                ],
            ])
            ->assertJsonPath('data.id', $vacancy->id);
    }

    public function test_returns_404_for_non_existent_vacancy(): void
    {
        $response = $this->getJson('/api/vacancies/999');

        $response->assertStatus(404);
    }

    public function test_can_create_vacancy(): void
    {
        $vacancyData = [
            'title' => 'Backend Developer',
            'company_name' => 'Tech Corp',
            'company_city' => 'Jakarta',
            'company_sector' => 'Technology',
            'job_type' => 'Full-Time',
            'description' => 'We are looking for a talented backend developer.',
            'salary_min' => 10000000,
            'salary_max' => 20000000,
            'experience_min' => '2-3 tahun',
            'candidates_needed' => 2,
            'is_remote' => true,
            'expired_at' => now()->addMonth()->format('Y-m-d'),
        ];

        $response = $this->postJson('/api/vacancies', $vacancyData);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Backend Developer');

        $this->assertDatabaseHas('vacancies', [
            'title' => 'Backend Developer',
            'company_name' => 'Tech Corp',
        ]);
    }

    public function test_create_vacancy_validates_required_fields(): void
    {
        $response = $this->postJson('/api/vacancies', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'company_name', 'company_city', 'job_type', 'description', 'expired_at']);
    }

    public function test_create_vacancy_validates_job_type(): void
    {
        $vacancyData = [
            'title' => 'Backend Developer',
            'company_name' => 'Tech Corp',
            'company_city' => 'Jakarta',
            'job_type' => 'Invalid-Type',
            'description' => 'Description here.',
            'expired_at' => now()->addMonth()->format('Y-m-d'),
        ];

        $response = $this->postJson('/api/vacancies', $vacancyData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['job_type']);
    }

    public function test_create_vacancy_validates_expired_at_must_be_future(): void
    {
        $vacancyData = [
            'title' => 'Backend Developer',
            'company_name' => 'Tech Corp',
            'company_city' => 'Jakarta',
            'job_type' => 'Full-Time',
            'description' => 'Description here.',
            'expired_at' => now()->subDay()->format('Y-m-d'),
        ];

        $response = $this->postJson('/api/vacancies', $vacancyData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['expired_at']);
    }

    public function test_can_update_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();

        $updateData = [
            'title' => 'Updated Title',
            'description' => 'Updated description.',
        ];

        $response = $this->putJson("/api/vacancies/{$vacancy->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.title', 'Updated Title');

        $this->assertDatabaseHas('vacancies', [
            'id' => $vacancy->id,
            'title' => 'Updated Title',
        ]);
    }

    public function test_can_delete_vacancy(): void
    {
        $vacancy = Vacancy::factory()->create();

        $response = $this->deleteJson("/api/vacancies/{$vacancy->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $this->assertDatabaseMissing('vacancies', [
            'id' => $vacancy->id,
        ]);
    }

    public function test_vacancies_are_ordered_by_created_at_desc(): void
    {
        $older = Vacancy::factory()->create(['created_at' => now()->subDay()]);
        $newer = Vacancy::factory()->create(['created_at' => now()]);

        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertEquals($newer->id, $data[0]['id']);
        $this->assertEquals($older->id, $data[1]['id']);
    }
}