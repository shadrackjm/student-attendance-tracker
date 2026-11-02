# Student Attendance Tracker — Laravel 13 + React 19

Source code for the **Code with SJM** YouTube series *Student Attendance Tracker with Laravel 13 + React 19*.

One login screen, three different apps: **admins** manage the school, **teachers** take the register for their own
class, and **students** see their own attendance. Built with Laravel 13, Inertia.js, React 19, TypeScript,
Tailwind CSS and shadcn/ui, on SQLite.

## Episodes

| # | Episode | What you build |
|---|---|---|
| 1 | Intro & Data Model | Create the project, design six tables on paper |
| 2 | Migrations & Models | Migrations, models, composite unique constraints, the attendance-rate accessor |
| 3 | Roles & Seeding | `hasRole()`, role middleware, routes grouped by role, a believable seeder |
| 4 | Teachers & Classes | Login + teacher record in one transaction, dialogs, homeroom-teacher dropdown |
| 5 | Students | Optional portal logins with `required_if` and a conditional field |
| 6 | Taking Attendance | Authorising "your own class", one request per roster, `updateOrCreate` |
| 7 | Attendance History | Four counts in one query with `withCount`, every row opens the register |
| 8 | Student Portal | What a student sees |
| 9 | Dashboard | The admin dashboard and "students to watch" |
| 10 | Reports & CSV | Reports and CSV export |
| 11 | Landing Page & Capstone | The landing page and wrap-up |

### Which code to look at
- **`ep01` tag** — the project at the end of Episode 1: a fresh `laravel new student-attendance --react` starter kit.
- **`main`** (tag `final`) — the finished app from Episode 11. Every episode's code is in here; the episode
  shows which files it touches (for example Episode 6: `app/Http/Controllers/AttendanceController.php` and
  `resources/js/pages/attendance/take.tsx`).

Compare the two to see everything the series adds:
```bash
git diff ep01 final --stat
```

## Run it

Requires PHP 8.3+, Composer and Node.js (Laravel Herd works out of the box).

```bash
composer install
cp .env.example .env
php artisan key:generate
php -r "touch('database/database.sqlite');"
php artisan migrate:fresh --seed
npm install
npm run build
```

Then open the site (with Herd: `http://student-attendance.test`) and sign in with one of the demo accounts
(password `password` for all three):

| Role | Email |
|---|---|
| Admin | `admin@school.test` |
| Teacher (Grade 1A) | `teacher@school.test` |
| Student | `student@school.test` |

The seeder creates 6 teachers, 6 classes, 108 students and a month of attendance, including one struggling
student per class.

## Notes
- New teachers and students get the password `password` — fine for a demo; a real school system would email an
  invite link instead.
- Small fix compared to the videos: `AttendanceSession` stores its date as `Y-m-d`, so saving a day's register
  again updates it instead of failing on SQLite, and dates display as `2026-11-02`.
