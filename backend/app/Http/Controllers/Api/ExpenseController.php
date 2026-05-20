<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Expense\StoreExpenseRequest;
use App\Http\Requests\Expense\UpdateExpenseRequest;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ExpenseController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Expense::class);

        $query = auth()->user()
            ->expenses()
            ->with('category')
            ->orderByDesc('spent_on')
            ->orderByDesc('id');

        if ($request->filled('month')) {
            [$year, $month] = explode('-', $request->string('month')->toString());
            $query->whereYear('spent_on', $year)->whereMonth('spent_on', $month);
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        return ExpenseResource::collection($query->get());
    }

    public function store(StoreExpenseRequest $request): ExpenseResource
    {
        $this->authorize('create', Expense::class);

        $expense = auth()->user()->expenses()->create($request->validated());
        $expense->load('category');

        return new ExpenseResource($expense);
    }

    public function show(Expense $expense): ExpenseResource
    {
        $this->authorize('view', $expense);

        $expense->load('category');

        return new ExpenseResource($expense);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense): ExpenseResource
    {
        $expense->update($request->validated());
        $expense->load('category');

        return new ExpenseResource($expense);
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return response()->json(null, 204);
    }
}
