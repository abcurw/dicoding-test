<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vacancies', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->string('company_city');
            $table->string('company_sector')->nullable();
            $table->integer('company_employee_count')->nullable();
            $table->enum('job_type', ['Full-Time', 'Part-Time', 'Kontrak', 'Intern']);
            $table->text('description');
            $table->integer('salary_min')->nullable();
            $table->integer('salary_max')->nullable();
            $table->string('experience_min')->nullable();
            $table->integer('candidates_needed')->default(1);
            $table->boolean('is_remote')->default(false);
            $table->date('expired_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vacancies');
    }
};
