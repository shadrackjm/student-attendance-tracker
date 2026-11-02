<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('students/index', [
            'students' => Student::with('schoolClass')
                ->orderBy('name')
                ->get(),
            'classes' => SchoolClass::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'admission_no' => ['required', 'string', 'max:50', 'unique:students,admission_no'],
            'school_class_id' => ['nullable', 'exists:school_classes,id'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female'],
            'create_login' => ['boolean'],
            'email' => ['required_if:create_login,true', 'nullable', 'email', 'unique:users,email'],
        ]);

        DB::transaction(function () use ($data) {
            $userId = null;

            if (! empty($data['create_login'])) {
                $userId = User::create([
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'email_verified_at' => now(),
                ])->id;
            }

            Student::create([
                'user_id' => $userId,
                'name' => $data['name'],
                'admission_no' => $data['admission_no'],
                'school_class_id' => $data['school_class_id'] ?? null,
                'guardian_name' => $data['guardian_name'] ?? null,
                'guardian_phone' => $data['guardian_phone'] ?? null,
                'date_of_birth' => $data['date_of_birth'] ?? null,
                'gender' => $data['gender'] ?? null,
            ]);
        });

        return back();
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'admission_no' => ['required', 'string', 'max:50', Rule::unique('students', 'admission_no')->ignore($student->id)],
            'school_class_id' => ['nullable', 'exists:school_classes,id'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_phone' => ['nullable', 'string', 'max:30'],
            'date_of_birth' => ['nullable', 'date'],
            'gender' => ['nullable', 'in:male,female'],
        ]);

        $student->update($data);
        $student->user?->update(['name' => $data['name']]);

        return back();
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return back();
    }
}
