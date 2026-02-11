<?php

namespace Database\Seeders;

use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class VacancySeeder extends Seeder
{
    public function run(): void
    {
        $vacancies = [
            [
                'title' => 'Product Engineer',
                'company_name' => 'Dicoding Indonesia',
                'company_city' => 'Bandung',
                'company_sector' => 'Technology',
                'company_employee_count' => 75,
                'job_type' => 'Full-Time',
                'description' => $this->getProductEngineerDescription(),
                'salary_min' => 8000000,
                'salary_max' => 15000000,
                'experience_min' => '1-3 tahun',
                'candidates_needed' => 1,
                'is_remote' => false,
                'expired_at' => now()->addDays(15),
            ],
            [
                'title' => 'Android Developer',
                'company_name' => 'Dicoding Indonesia',
                'company_city' => 'Bandung',
                'company_sector' => 'Technology',
                'company_employee_count' => 75,
                'job_type' => 'Full-Time',
                'description' => $this->getAndroidDeveloperDescription(),
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'experience_min' => '4-5 tahun',
                'candidates_needed' => 2,
                'is_remote' => false,
                'expired_at' => now()->addDays(15),
            ],
            [
                'title' => 'iOS Developer',
                'company_name' => 'Dicoding Indonesia',
                'company_city' => 'Bandung',
                'company_sector' => 'Technology',
                'company_employee_count' => 75,
                'job_type' => 'Full-Time',
                'description' => $this->getiOSDeveloperDescription(),
                'salary_min' => 10000000,
                'salary_max' => 18000000,
                'experience_min' => '1-3 tahun',
                'candidates_needed' => 1,
                'is_remote' => false,
                'expired_at' => now()->addDays(15),
            ],
            [
                'title' => 'Code Reviewer',
                'company_name' => 'Dicoding Indonesia',
                'company_city' => 'Bandung',
                'company_sector' => 'Technology',
                'company_employee_count' => 75,
                'job_type' => 'Full-Time',
                'description' => $this->getCodeReviewerDescription(),
                'salary_min' => 6000000,
                'salary_max' => 12000000,
                'experience_min' => 'Kurang dari 1 tahun',
                'candidates_needed' => 3,
                'is_remote' => true,
                'expired_at' => now()->addDays(15),
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancy::create($vacancy);
        }
    }

    private function getProductEngineerDescription(): string
    {
        return "## Job Description\n\nAs a Product Engineer, you will be joining the Product & Engineering team in building impactful products for Dicoding users. With your programming skills, you will be responsible for creating great experiences for our users.\n\nWe are looking for an engineer, who not only knows how to program with good functionality, but also solves user problems. When building dicoding.com, we always try to:\n\n- Give maximum impact from the solutions we built.\n- Live a balanced life (it is important for engineers to sleep well).\n\n## Responsibilities\n\n- Collaborate with designers and other stakeholders in analyzing problems and solutions to be built.\n- Develop and manage the dicoding.com platform.\n- Ensure all systems and components on dicoding.com run properly.\n- Write well-designed, easy-to-test, efficient, and clean code on both the front-end and back-end.\n\n## Requirements\n\nWhen it comes to requirements, at Dicoding, we have no limitations on specific tools or technologies. We are open to any technology and tools that can meet the business needs and provide the best solutions for our users. With that in mind, here are the general requirements for a Product Engineer at Dicoding:\n\n- Proficiency in Git and Unix-based systems.\n- Good knowledge of web technologies.\n- Want to follow and learn the development culture in Dicoding: Test Driven Development.\n- Able to understand the requirements of a solution that will be built properly.\n- Having a growth mindset and high curiosity.";
    }

    private function getAndroidDeveloperDescription(): string
    {
        return "## Job Description\n\nAs an Android Developer, you will develop and maintain Android applications for Dicoding's learning platform. You will work closely with the product team to implement new features and improve existing functionality.\n\n## Responsibilities\n\n- Develop and maintain Android applications using Kotlin.\n- Collaborate with cross-functional teams to define and implement new features.\n- Ensure the performance, quality, and responsiveness of applications.\n- Identify and fix bugs and performance bottlenecks.\n\n## Requirements\n\n- Strong proficiency in Kotlin and Android SDK.\n- Experience with Android Jetpack components.\n- Familiarity with RESTful APIs and mobile architecture patterns (MVVM, Clean Architecture).\n- Understanding of Google's design principles and guidelines.\n- Experience with version control systems (Git).";
    }

    private function getiOSDeveloperDescription(): string
    {
        return "## Job Description\n\nAs an iOS Developer, you will develop and maintain iOS applications for Dicoding's learning platform. You will work closely with the product team to implement new features and improve existing functionality.\n\n## Responsibilities\n\n- Develop and maintain iOS applications using Swift.\n- Collaborate with cross-functional teams to define and implement new features.\n- Ensure the performance, quality, and responsiveness of applications.\n- Identify and fix bugs and performance bottlenecks.\n\n## Requirements\n\n- Strong proficiency in Swift and iOS SDK.\n- Experience with iOS frameworks such as UIKit, SwiftUI, Core Data.\n- Familiarity with RESTful APIs and mobile architecture patterns (MVVM, Clean Architecture).\n- Understanding of Apple's design principles and guidelines.\n- Experience with version control systems (Git).";
    }

    private function getCodeReviewerDescription(): string
    {
        return "## Job Description\n\nAs a Code Reviewer, you will review submissions from Dicoding Academy students. You will provide constructive feedback to help students improve their coding skills and understanding of best practices.\n\n## Responsibilities\n\n- Review student code submissions thoroughly and provide detailed feedback.\n- Ensure submissions meet the required standards and criteria.\n- Help students understand best practices in software development.\n- Maintain consistency in review quality across all submissions.\n\n## Requirements\n\n- Good understanding of programming fundamentals.\n- Experience with at least one programming language (JavaScript, Python, Kotlin, Swift, etc.).\n- Ability to communicate feedback clearly and constructively.\n- Attention to detail and commitment to quality.\n- Self-motivated and able to work independently.";
    }
}
