<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVacancyRequest;
use App\Http\Requests\UpdateVacancyRequest;
use App\Models\Vacancy;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VacancyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Vacancy::query();

        if ($request->has('search') && $request->search) {
            $query->search($request->search);
        }

        $vacancies = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $vacancies,
        ]);
    }

    public function store(StoreVacancyRequest $request): JsonResponse
    {
        $vacancy = Vacancy::create($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Vacancy created successfully.',
            'data' => $vacancy,
        ], 201);
    }

    public function show(Vacancy $vacancy): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $vacancy,
        ]);
    }

    public function update(UpdateVacancyRequest $request, Vacancy $vacancy): JsonResponse
    {
        $vacancy->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Vacancy updated successfully.',
            'data' => $vacancy,
        ]);
    }

    public function destroy(Vacancy $vacancy): JsonResponse
    {
        $vacancy->delete();

        return response()->json([
            'success' => true,
            'message' => 'Vacancy deleted successfully.',
        ]);
    }
}