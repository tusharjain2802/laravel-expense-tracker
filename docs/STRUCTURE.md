# Folder structure guide

This document explains **where code lives** and **why**, so you can navigate the project while learning.

---

## Backend (`backend/`)

Standard Laravel layout, with API-specific organization.

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/              # JSON API only — one controller per resource
│   │   │       ├── AuthController.php
│   │   │       ├── CategoryController.php
│   │   │       ├── ExpenseController.php
│   │   │       └── SummaryController.php
│   │   ├── Requests/             # Validation rules (keeps controllers thin)
│   │   │   ├── Auth/
│   │   │   ├── Category/
│   │   │   └── Expense/
│   │   └── Resources/            # Shape JSON responses for the frontend
│   │       ├── CategoryResource.php
│   │       └── ExpenseResource.php
│   ├── Models/                   # Eloquent models + database relationships
│   ├── Policies/                 # Authorization: “can this user edit this row?”
│   └── Services/                 # Business logic that doesn’t belong in controllers
│       └── ExpenseSummaryService.php
├── database/
│   └── migrations/               # Database schema (tables, columns, indexes)
├── routes/
│   └── api.php                   # All API routes — start here when debugging
└── config/
    ├── cors.php                  # Allows React (port 5173) to call the API
    └── sanctum.php               # SPA session auth settings
```

### Request flow (example: create expense)

1. `routes/api.php` — `POST /api/expenses`
2. `ExpenseController@store`
3. `StoreExpenseRequest` — validates `amount`, `category_id`, etc.
4. `Expense` model — saves to database
5. `ExpenseResource` — returns JSON to React

### Why separate folders?

| Folder | Purpose |
|--------|---------|
| `Controllers/Api` | Web controllers (Blade) could live in `Controllers/` later without mixing JSON logic |
| `Requests` | Reusable validation; same rules for API and future Blade forms |
| `Resources` | Consistent API JSON; hide internal columns |
| `Policies` | Security: users only access their own data |
| `Services` | Complex queries (monthly summary) stay testable and readable |

---

## Frontend (`frontend/`)

React SPA — only UI and API calls; no direct database access.

```
frontend/src/
├── api/                # All HTTP calls to Laravel
│   ├── client.ts       # Axios instance + CSRF cookie helper
│   ├── auth.ts
│   ├── categories.ts
│   ├── expenses.ts
│   └── summary.ts
├── components/         # Reusable UI (layout, guards)
├── context/            # Global state (logged-in user)
├── pages/              # One file per screen
│   ├── DashboardPage.tsx
│   ├── ExpensesPage.tsx
│   ├── CategoriesPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
└── types/              # TypeScript interfaces matching API JSON
```

### Page vs component

- **Pages** — tied to a route (`/expenses`, `/categories`)
- **Components** — shared pieces (`Layout`, `ProtectedRoute`)

### API layer

Never call `axios` directly from pages — use `src/api/*.ts` so:

- URLs stay in one place
- Credentials / CSRF stay configured in `client.ts`

---

## Auth between React and Laravel

1. React calls `GET /sanctum/csrf-cookie`
2. React posts to `/api/login` or `/api/register` with `withCredentials: true`
3. Laravel sets a session cookie
4. Later requests send the cookie automatically

Configured in:

- `backend/bootstrap/app.php` → `statefulApi()`
- `backend/config/cors.php` → `supports_credentials: true`
- `frontend/vite.config.ts` → proxy to Laravel in development

---

## What to build next (learning exercises)

1. **Edit expense** — `PUT /api/expenses/{id}` + form on frontend
2. **Feature test** — `tests/Feature/ExpenseTest.php`
3. **Blade page** — `CategoryController` (web) listing categories with server HTML
4. **Chart** — use dashboard `by_category` data in a React chart library

---

## Interview talking points

- Monorepo: API backend + SPA frontend
- Validation in Form Requests, authorization in Policies
- Sanctum SPA authentication
- Eloquent relationships: User → Categories → Expenses
- Service class for aggregated reporting query
