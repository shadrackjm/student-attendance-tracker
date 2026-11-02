<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    /**
     * The signed-in teacher's list of homeroom classes, with today's status.
     */
    public function index(Request $request): Response
    {
        $teacher = $this->currentTeacher($request);

        $classes = SchoolClass::withCount('students')
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
            ]);

        return Inertia::render('attendance/index', [
            'classes' => $classes,
        ]);
    }

    /**
     * Show the roster for a class on a given day, pre-filled with whatever
     * was already recorded so a teacher can safely revisit and correct a day.
     */
    public function take(Request $request, SchoolClass $class): Response
    {
        $this->authorizeClass($request, $class);

        $date = $request->filled('date') ? Carbon::parse($request->input('date')) : today();

        $session = AttendanceSession::where('school_class_id', $class->id)
            ->whereDate('date', $date)
            ->with('records')
            ->first();

        $existing = $session?->records->keyBy('student_id') ?? collect();

        $roster = $class->students()->orderBy('name')->get()->map(fn ($student) => [
            'id' => $student->id,
            'name' => $student->name,
            'admission_no' => $student->admission_no,
            'status' => $existing->get($student->id)?->status ?? 'present',
            'remarks' => $existing->get($student->id)?->remarks,
        ]);

        return Inertia::render('attendance/take', [
            'class' => ['id' => $class->id, 'name' => $class->name],
            'date' => $date->toDateString(),
            'alreadyTaken' => (bool) $session,
            'roster' => $roster,
        ]);
    }

    /**
     * Save (or update) a whole day's attendance for a class in one request.
     */
    public function store(Request $request, SchoolClass $class): RedirectResponse
    {
        $teacher = $this->authorizeClass($request, $class);

        $data = $request->validate([
            'date' => ['required', 'date'],
            'records' => ['required', 'array', 'min:1'],
            'records.*.student_id' => ['required', 'exists:students,id'],
            'records.*.status' => ['required', 'in:present,absent,late,excused'],
            'records.*.remarks' => ['nullable', 'string', 'max:255'],
        ]);

        $session = AttendanceSession::updateOrCreate(
            ['school_class_id' => $class->id, 'date' => $data['date']],
            ['taken_by' => $teacher->id]
        );

        foreach ($data['records'] as $record) {
            AttendanceRecord::updateOrCreate(
                ['attendance_session_id' => $session->id, 'student_id' => $record['student_id']],
                ['status' => $record['status'], 'remarks' => $record['remarks'] ?? null]
            );
        }

        return to_route('attendance.take', ['class' => $class->id, 'date' => $data['date']]);
    }

    /**
     * A class's attendance history — one row per school day taken so far.
     */
    public function history(Request $request, SchoolClass $class): Response
    {
        $this->authorizeClass($request, $class);

        $sessions = AttendanceSession::where('school_class_id', $class->id)
            ->withCount([
                'records as present_count' => fn ($query) => $query->where('status', 'present'),
                'records as absent_count' => fn ($query) => $query->where('status', 'absent'),
                'records as late_count' => fn ($query) => $query->where('status', 'late'),
                'records as excused_count' => fn ($query) => $query->where('status', 'excused'),
            ])
            ->orderByDesc('date')
            ->limit(30)
            ->get();

        return Inertia::render('attendance/history', [
            'class' => ['id' => $class->id, 'name' => $class->name],
            'sessions' => $sessions,
        ]);
    }

    protected function currentTeacher(Request $request)
    {
        $teacher = $request->user()->teacher;

        abort_unless($teacher, 403, 'Your account is not linked to a teacher record.');

        return $teacher;
    }

    protected function authorizeClass(Request $request, SchoolClass $class)
    {
        $teacher = $this->currentTeacher($request);

        abort_unless($class->homeroom_teacher_id === $teacher->id, 403, 'You are not the homeroom teacher for this class.');

        return $teacher;
    }
}
