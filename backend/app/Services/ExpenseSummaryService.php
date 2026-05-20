<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ExpenseSummaryService
{
    /**
     * Monthly totals grouped by category for the authenticated user.
     *
     * @return Collection<int, object{category_id: int, category_name: string, color: string, total: string}>
     */
    public function monthlyByCategory(User $user, ?string $month = null): Collection
    {
        $date = $month
            ? Carbon::createFromFormat('Y-m', $month)->startOfMonth()
            : now()->startOfMonth();

        $start = $date->copy()->startOfMonth()->toDateString();
        $end = $date->copy()->endOfMonth()->toDateString();

        return DB::table('expenses')
            ->join('categories', 'categories.id', '=', 'expenses.category_id')
            ->where('expenses.user_id', $user->id)
            ->whereBetween('expenses.spent_on', [$start, $end])
            ->select(
                'categories.id as category_id',
                'categories.name as category_name',
                'categories.color',
                DB::raw('SUM(expenses.amount) as total')
            )
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderByDesc('total')
            ->get();
    }

    public function monthlyTotal(User $user, ?string $month = null): float
    {
        $date = $month
            ? Carbon::createFromFormat('Y-m', $month)->startOfMonth()
            : now()->startOfMonth();

        return (float) $user->expenses()
            ->whereBetween('spent_on', [
                $date->copy()->startOfMonth()->toDateString(),
                $date->copy()->endOfMonth()->toDateString(),
            ])
            ->sum('amount');
    }
}
