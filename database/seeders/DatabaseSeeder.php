<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed a realistic school: role accounts, classes, teachers, students,
     * and four school weeks of attendance history so the dashboard and
     * reports have something believable to show from the very first run.
     */
    public function run(): void
    {
        // ── Login accounts, one per role ────────────────────────────────────
        $admin = User::factory()->create([
            'name' => 'Alex Admin',
            'email' => 'admin@school.test',
            'role' => 'admin',
        ]);

        $teacherUser = User::factory()->create([
            'name' => 'Tara Teacher',
            'email' => 'teacher@school.test',
            'role' => 'teacher',
        ]);

        $studentUser = User::factory()->create([
            'name' => 'Sam Student',
            'email' => 'student@school.test',
            'role' => 'student',
        ]);

        // ── Teachers — the demo teacher account is one of six ───────────────
        $teacherNames = ['Tara Teacher', 'Grace Otieno', 'Brian Kamau', 'Faith Njeri', 'David Mwangi', 'Ann Wanjiru'];
        $teachers = collect();

        foreach ($teacherNames as $i => $name) {
            $teachers->push(Teacher::factory()->create([
                'user_id' => $i === 0 ? $teacherUser->id : null,
            ]));
        }

        // ── Classes — one homeroom teacher per class ────────────────────────
        $classBlueprint = ['Grade 1A', 'Grade 2A', 'Grade 3A', 'Grade 4A', 'Grade 5A', 'Grade 6A'];
        $classes = collect();

        foreach ($classBlueprint as $i => $name) {
            $grade = explode(' ', $name)[1];

            $classes->push(SchoolClass::create([
                'name' => $name,
                'grade_level' => "Grade {$grade}",
                'homeroom_teacher_id' => $teachers[$i]->id,
                'capacity' => 35,
            ]));
        }

        // ── The demo student sits in the first class ────────────────────────
        $demoStudent = Student::factory()->create([
            'user_id' => $studentUser->id,
            'name' => 'Sam Student',
            'school_class_id' => $classes->first()->id,
        ]);

        // ── The rest of the student body, ~18 per class ─────────────────────
        $allStudents = collect([$demoStudent]);

        foreach ($classes as $class) {
            $seatsLeft = $class->id === $classes->first()->id ? 17 : 18;

            $allStudents = $allStudents->merge(
                Student::factory($seatsLeft)->create(['school_class_id' => $class->id])
            );
        }

        // ── One chronic absentee per class, to make the reports meaningful ──
        $atRiskStudentIds = $classes->map(
            fn (SchoolClass $class) => $allStudents->where('school_class_id', $class->id)->last()->id
        );

        // ── Four school weeks of attendance, weekdays only ──────────────────
        $day = Carbon::now()->subWeekdays(20);
        $today = Carbon::now();

        while ($day->lessThanOrEqualTo($today)) {
            if ($day->isWeekend()) {
                $day = $day->copy()->addDay();

                continue;
            }

            foreach ($classes as $class) {
                $session = AttendanceSession::create([
                    'school_class_id' => $class->id,
                    'taken_by' => $class->homeroom_teacher_id,
                    'date' => $day->toDateString(),
                ]);

                foreach ($allStudents->where('school_class_id', $class->id) as $student) {
                    $status = $atRiskStudentIds->contains($student->id)
                        ? fake()->randomElement(['present', 'absent', 'absent', 'late', 'absent'])
                        : fake()->randomElement(['present', 'present', 'present', 'present', 'present', 'absent', 'late', 'excused']);

                    AttendanceRecord::create([
                        'attendance_session_id' => $session->id,
                        'student_id' => $student->id,
                        'status' => $status,
                    ]);
                }
            }

            $day = $day->copy()->addDay();
        }

        $this->command?->info("Seeded {$teachers->count()} teachers, {$classes->count()} classes, {$allStudents->count()} students, and 20 school days of attendance.");
    }
}
