<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExpenseSummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    public function __construct(private ExpenseSummaryService $summaryService) {}

    public function monthly(Request $request): JsonResponse
    {
        $request->validate([
            'month' => ['sometimes', 'date_format:Y-m'],
        ]);

        $user = $request->user();
        $month = $request->string('month')->toString() ?: null;

        return response()->json([
            'month' => $month ?? now()->format('Y-m'),
            'total' => $this->summaryService->monthlyTotal($user, $month),
            'by_category' => $this->summaryService->monthlyByCategory($user, $month),
        ]);
    }
}
