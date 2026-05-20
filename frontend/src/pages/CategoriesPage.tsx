import { useEffect, useState, type FormEvent } from 'react'
import { createCategory, deleteCategory, fetchCategories } from '../api/categories'
import type { Category } from '../types'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    setCategories(await fetchCategories())
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await createCategory({ name, color })
    setName('')
    await load()
  }

  async function handleDelete(id: number) {
    await deleteCategory(id)
    await load()
  }

  return (
    <section>
      <h2>Categories</h2>

      <form onSubmit={handleSubmit} className="form inline-form">
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Color
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>
        <button type="submit">Add category</button>
      </form>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.id}>
              <span className="dot" style={{ backgroundColor: category.color }} />
              <span>{category.name}</span>
              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(category.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
