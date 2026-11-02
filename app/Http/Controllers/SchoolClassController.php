<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\Teacher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SchoolClassController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('classes/index', [
            'classes' => SchoolClass::with('homeroomTeacher.user')
                ->withCount('students')
                ->orderBy('name')
                ->get(),
            'teachers' => Teacher::with('user')->orderBy('staff_no')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:school_classes,name'],
            'grade_level' => ['required', 'string', 'max:50'],
            'homeroom_teacher_id' => ['nullable', 'exists:teachers,id'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        SchoolClass::create($data);

        return back();
    }

    public function update(Request $request, SchoolClass $class): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', Rule::unique('school_classes', 'name')->ignore($class->id)],
            'grade_level' => ['required', 'string', 'max:50'],
            'homeroom_teacher_id' => ['nullable', 'exists:teachers,id'],
            'capacity' => ['required', 'integer', 'min:1', 'max:100'],
        ]);

        $class->update($data);

        return back();
    }

    public function destroy(SchoolClass $class): RedirectResponse
    {
        $class->delete();

        return back();
    }
}
