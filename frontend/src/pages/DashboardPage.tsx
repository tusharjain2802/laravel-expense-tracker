import { useEffect, useState } from 'react'
import { fetchMonthlySummary } from '../api/summary'
import type { MonthlySummary } from '../types'

function currentMonth(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

export function DashboardPage() {
  const [month, setMonth] = useState(currentMonth())
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMonthlySummary(month)
      .then(setSummary)
      .finally(() => setLoading(false))
  }, [month])

  return (
    <section>
      <div className="page-header">
        <h2>Dashboard</h2>
        <label>
          Month
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
      </div>

      {loading && <p>Loading summary…</p>}

      {!loading && summary && (
        <>
          <div className="stat-card">
            <span className="muted">Total spent</span>
            <strong>${Number(summary.total).toFixed(2)}</strong>
          </div>

          <h3>By category</h3>
          {summary.by_category.length === 0 ? (
            <p className="muted">No expenses this month yet.</p>
          ) : (
            <ul className="summary-list">
              {summary.by_category.map((row) => (
                <li key={row.category_id}>
                  <span
                    className="dot"
                    style={{ backgroundColor: row.color }}
                  />
                  <span>{row.category_name}</span>
                  <strong>${Number(row.total).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
