<?php

use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function makeSchool(): array
{
    $admin = User::factory()->create(['role' => 'admin']);
    $teacherUser = User::factory()->create(['role' => 'teacher']);
    $studentUser = User::factory()->create(['role' => 'student']);

    $teacher = Teacher::factory()->create(['user_id' => $teacherUser->id]);
    $class = SchoolClass::create([
        'name' => 'Grade 1A',
        'grade_level' => 'Grade 1',
        'homeroom_teacher_id' => $teacher->id,
        'capacity' => 35,
    ]);

    $student = Student::factory()->create([
        'user_id' => $studentUser->id,
        'school_class_id' => $class->id,
    ]);
    Student::factory(4)->create(['school_class_id' => $class->id]);

    return compact('admin', 'teacherUser', 'studentUser', 'teacher', 'class', 'student');
}

test('admin can view dashboard, directories, and reports', function () {
    $school = makeSchool();
    $this->actingAs($school['admin']);

    $this->get(route('dashboard'))->assertOk();
    $this->get('/teachers')->assertOk();
    $this->get('/classes')->assertOk();
    $this->get('/students')->assertOk();
    $this->get('/reports')->assertOk();
    $this->get('/reports/attendance.csv')->assertOk();
});

test('non-admin roles are blocked from admin-only pages', function () {
    $school = makeSchool();
    $this->actingAs($school['teacherUser']);

    $this->get('/teachers')->assertForbidden();
    $this->get('/students')->assertForbidden();
});

test('teacher can take attendance for their class and see it in history', function () {
    $school = makeSchool();
    $this->actingAs($school['teacherUser']);

    $this->get(route('dashboard'))->assertOk();
    $this->get('/attendance')->assertOk();

    $roster = $school['class']->students()->get();

    $response = $this->post("/attendance/{$school['class']->id}", [
        'date' => today()->toDateString(),
        'records' => $roster->map(fn ($student, $i) => [
            'student_id' => $student->id,
            'status' => $i === 0 ? 'absent' : 'present',
            'remarks' => null,
        ])->values()->all(),
    ]);

    $response->assertRedirect();

    expect(AttendanceSession::where('school_class_id', $school['class']->id)->count())->toBe(1);

    $this->get("/attendance/{$school['class']->id}/history")->assertOk();
    $this->get("/attendance/{$school['class']->id}/take")->assertOk();
});

test('teacher cannot take attendance for a class they do not lead', function () {
    $school = makeSchool();
    $otherClass = SchoolClass::create([
        'name' => 'Grade 2A',
        'grade_level' => 'Grade 2',
        'capacity' => 35,
    ]);

    $this->actingAs($school['teacherUser']);

    $this->get("/attendance/{$otherClass->id}/take")->assertForbidden();
});

test('student can view their own attendance and dashboard', function () {
    $school = makeSchool();
    $this->actingAs($school['studentUser']);

    $this->get(route('dashboard'))->assertOk();
    $this->get('/my-attendance')->assertOk();
});

test('a class attendance session is unique per day', function () {
    $school = makeSchool();
    $this->actingAs($school['teacherUser']);

    $roster = $school['class']->students()->get();
    $records = $roster->map(fn ($student) => [
        'student_id' => $student->id,
        'status' => 'present',
        'remarks' => null,
    ])->values()->all();

    $this->post("/attendance/{$school['class']->id}", ['date' => today()->toDateString(), 'records' => $records]);
    $this->post("/attendance/{$school['class']->id}", ['date' => today()->toDateString(), 'records' => $records]);

    expect(AttendanceSession::where('school_class_id', $school['class']->id)->count())->toBe(1);
});
