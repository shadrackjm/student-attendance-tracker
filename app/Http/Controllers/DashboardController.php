<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return match ($user->role) {
            'admin' => $this->adminDashboard(),
            'teacher' => $this->teacherDashboard($user->teacher),
            default => $this->studentDashboard($user->student),
        };
    }

    protected function adminDashboard(): Response
    {
        $trend = collect(range(13, 0))->map(function (int $daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);

            $records = AttendanceRecord::whereHas(
                'session',
                fn ($query) => $query->whereDate('date', $date)
            )->get();

            $countable = $records->where('status', '!=', 'excused');

            return [
                'date' => $date->format('M j'),
                'rate' => $countable->isEmpty() ? null : round(
                    $countable->where('status', 'present')->count() / $countable->count() * 100,
                    1
                ),
            ];
        });

        $classBreakdown = SchoolClass::withCount('students')
            ->with('homeroomTeacher.user')
            ->orderBy('name')
            ->get()
            ->map(fn (SchoolClass $class) => [
                'id' => $class->id,
                'name' => $class->name,
                'students_count' => $class->students_count,
                'teacher' => $class->homeroomTeacher?->user?->name ?? $class->homeroomTeacher?->staff_no,
            ]);

        $atRiskStudents = Student::with('schoolClass')
            ->get()
            ->map(fn (Student $student) => [
                'id' => $student->id,
                'name' => $student->name,
                'class' => $student->schoolClass?->name,
                'attendance_rate' => $student->attendance_rate,
            ])
            ->filter(fn (array $row) => $row['attendance_rate'] > 0)
            ->sortBy('attendance_rate')
            ->take(5)
            ->values();

        return Inertia::render('dashboard', [
            'role' => 'admin',
            'stats' => [
                'classes' => SchoolClass::count(),
                'teachers' => Teacher::count(),
                'students' => Student::count(),
                'sessions_today' => AttendanceSession::whereDate('date', today())->count(),
            ],
            'trend' => $trend,
            'classBreakdown' => $classBreakdown,
            'atRiskStudents' => $atRiskStudents,
        ]);
    }

    protected function teacherDashboard(?Teacher $teacher): Response
    {
        $classes = $teacher
            ? SchoolClass::withCount('students')
                ->where('homeroom_teacher_id', $teacher->id)
                ->orderBy('name')
                ->get()
                ->map(fn (SchoolClass $class) => [
                    'id' => $class->id,
                    'name' => $class->name,
                    'students_count' => $class->students_count,
                    'taken_today' => AttendanceSession::where('school_class_id', $class->id)
                        ->whereDate('date', today())
                        ->exists(),
                ])
            : collect();

        return Inertia::render('dashboard', [
            'role' => 'teacher',
            'hasTeacherRecord' => (bool) $teacher,
            'classes' => $classes,
        ]);
    }

    protected function studentDashboard(?Student $student): Response
    {
        $recent = $student
            ? $student->attendanceRecords()
                ->with('session')
                ->latest('id')
                ->limit(10)
                ->get()
                ->map(fn (AttendanceRecord $record) => [
                    'date' => $record->session->date->format('Y-m-d'),
                    'status' => $record->status,
                ])
            : collect();

        return Inertia::render('dashboard', [
            'role' => 'student',
            'hasStudentRecord' => (bool) $student,
            'attendanceRate' => $student?->attendance_rate ?? 0,
            'className' => $student?->schoolClass?->name,
            'recent' => $recent,
        ]);
    }
}
