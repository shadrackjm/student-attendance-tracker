<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class TeacherController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('teachers/index', [
            'teachers' => Teacher::with('user')
                ->withCount('homeroomClasses')
                ->orderBy('staff_no')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'staff_no' => ['required', 'string', 'max:50', 'unique:teachers,staff_no'],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject_specialty' => ['nullable', 'string', 'max:100'],
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'email_verified_at' => now(),
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'staff_no' => $data['staff_no'],
                'phone' => $data['phone'] ?? null,
                'subject_specialty' => $data['subject_specialty'] ?? null,
            ]);
        });

        return back();
    }

    public function update(Request $request, Teacher $teacher): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'staff_no' => ['required', 'string', 'max:50', Rule::unique('teachers', 'staff_no')->ignore($teacher->id)],
            'phone' => ['nullable', 'string', 'max:30'],
            'subject_specialty' => ['nullable', 'string', 'max:100'],
        ]);

        $teacher->update([
            'staff_no' => $data['staff_no'],
            'phone' => $data['phone'] ?? null,
            'subject_specialty' => $data['subject_specialty'] ?? null,
        ]);

        $teacher->user?->update(['name' => $data['name']]);

        return back();
    }

    public function destroy(Teacher $teacher): RedirectResponse
    {
        $teacher->delete();

        return back();
    }
}
