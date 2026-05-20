# Expense Tracker — Laravel + React

A beginner-friendly monorepo for learning **Laravel (API)** and **React (SPA)** with a clear folder structure.

## Project layout

```
├── backend/          # Laravel 13 API (PHP)
├── frontend/         # React + TypeScript (Vite)
└── docs/
    └── STRUCTURE.md  # What each folder is for
```

## Requirements

- PHP 8.2+ and Composer
- Node.js 18+
- MySQL (optional — SQLite is configured by default)

## Quick start

### 1. Backend

```bash
cd backend
composer install
cp .env.example .env   # if needed
php artisan key:generate
php artisan migrate
php artisan serve
```

API runs at **http://localhost:8000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173** (proxies API calls to Laravel).

### 3. Use the app

1. Open http://localhost:5173
2. **Register** — you get default categories (Food, Transport, …)
3. Add **expenses** and view the **dashboard** summary

## Switch to MySQL

Edit `backend/.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=expense_tracker
DB_USERNAME=root
DB_PASSWORD=your_password
```

Create the database, then:

```bash
php artisan migrate
```

## API overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Create account |
| POST | `/api/login` | Log in (session) |
| POST | `/api/logout` | Log out |
| GET | `/api/me` | Current user |
| CRUD | `/api/categories` | Categories |
| CRUD | `/api/expenses` | Expenses |
| GET | `/api/summary/monthly?month=2026-05` | Monthly totals |

Auth uses **Laravel Sanctum** (cookie-based SPA sessions).

## Learning path

1. Read `docs/STRUCTURE.md`
2. Trace a request: `frontend/src/api/expenses.ts` → `backend/routes/api.php` → `ExpenseController`
3. Add Blade pages later reusing the same models (full-stack PHP)

## License

MIT — for learning use.
