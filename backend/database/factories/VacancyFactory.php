<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vacancy>
 */
class VacancyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jobTitles = [
            'Product Engineer',
            'Android Developer',
            'iOS Developer',
            'Code Reviewer',
            'Backend Developer',
            'Frontend Developer',
            'Full Stack Developer',
            'DevOps Engineer',
            'Data Analyst',
            'UI/UX Designer',
        ];

        return [
            'title' => fake()->randomElement($jobTitles),
            'company_name' => 'Dicoding Indonesia',
            'company_logo' => null,
            'company_city' => 'Bandung',
            'company_sector' => 'Technology',
            'company_employee_count' => fake()->numberBetween(50, 100),
            'job_type' => fake()->randomElement(['Full-Time', 'Part-Time', 'Kontrak', 'Intern']),
            'description' => $this->generateJobDescription(),
            'salary_min' => fake()->numberBetween(5000000, 10000000),
            'salary_max' => fake()->numberBetween(10000000, 20000000),
            'experience_min' => fake()->randomElement(['Kurang dari 1 tahun', '1-3 tahun', '4-5 tahun', '5+ tahun']),
            'candidates_needed' => fake()->numberBetween(1, 5),
            'is_remote' => fake()->boolean(30),
            'expired_at' => fake()->dateTimeBetween('now', '+3 months'),
        ];
    }

    private function generateJobDescription(): string
    {
        return "## Job Description\n\nAs a member of our team, you will be joining the Product & Engineering team in building impactful products for Dicoding users. With your programming skills, you will be responsible for creating great experiences for our users.\n\nWe are looking for an engineer, who not only knows how to program with good functionality, but also solves user problems. When building dicoding.com, we always try to:\n\n- Give maximum impact from the solutions we built.\n- Live a balanced life (it is important for engineers to sleep well).\n\n## Responsibilities\n\n- Collaborate with designers and other stakeholders in analyzing problems and solutions to be built.\n- Develop and manage the dicoding.com platform.\n- Ensure all systems and components on dicoding.com run properly.\n- Write well-designed, easy-to-test, efficient, and clean code on both the front-end and back-end.\n\n## Requirements\n\nWhen it comes to requirements, at Dicoding, we have no limitations on specific tools or technologies. We are open to any technology and tools that can meet the business needs and provide the best solutions for our users. With that in mind, here are the general requirements:\n\n- Proficiency in Git and Unix-based systems.\n- Good knowledge of web technologies.\n- Want to follow and learn the development culture in Dicoding: Test Driven Development.\n- Able to understand the requirements of a solution that will be built properly.\n- Having a growth mindset and high curiosity.";
    }
}
