import { useEffect, useState, type FormEvent } from 'react'
import { createExpense, deleteExpense, fetchExpenses } from '../api/expenses'
import { fetchCategories } from '../api/categories'
import type { Category, Expense } from '../types'

function currentMonth(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function ExpensesPage() {
  const [month, setMonth] = useState(currentMonth())
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const [categoryId, setCategoryId] = useState('')
  const [amount, setAmount] = useState('')
  const [spentOn, setSpentOn] = useState(today())
  const [note, setNote] = useState('')

  async function loadData() {
    setLoading(true)
    const [expenseList, categoryList] = await Promise.all([
      fetchExpenses({ month }),
      fetchCategories(),
    ])
    setExpenses(expenseList)
    setCategories(categoryList)
    if (!categoryId && categoryList[0]) {
      setCategoryId(String(categoryList[0].id))
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [month])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createExpense({
      category_id: Number(categoryId),
      amount: Number(amount),
      spent_on: spentOn,
      note: note || undefined,
    })
    setAmount('')
    setNote('')
    await loadData()
  }

  async function handleDelete(id: number) {
    await deleteExpense(id)
    await loadData()
  }

  return (
    <section>
      <div className="page-header">
        <h2>Expenses</h2>
        <label>
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
      </div>

      <form onSubmit={handleSubmit} className="form inline-form">
        <label>
          Category
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Amount
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <label>
          Date
          <input
            type="date"
            value={spentOn}
            onChange={(e) => setSpentOn(e.target.value)}
            required
          />
        </label>
        <label>
          Note
          <input value={note} onChange={(e) => setNote(e.target.value)} />
        </label>
        <button type="submit">Add expense</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="muted">No expenses for this month.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Note</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.spent_on}</td>
                <td>
                  <span
                    className="dot"
                    style={{ backgroundColor: expense.category?.color }}
                  />
                  {expense.category?.name}
                </td>
                <td>${Number(expense.amount).toFixed(2)}</td>
                <td>{expense.note ?? '—'}</td>
                <td>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => handleDelete(expense.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
