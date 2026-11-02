<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // ── School administration (admin only) ─────────────────────────────────
    Route::middleware('role:admin')->group(function () {
        Route::get('teachers', [TeacherController::class, 'index'])->name('teachers.index');
        Route::post('teachers', [TeacherController::class, 'store'])->name('teachers.store');
        Route::patch('teachers/{teacher}', [TeacherController::class, 'update'])->name('teachers.update');
        Route::delete('teachers/{teacher}', [TeacherController::class, 'destroy'])->name('teachers.destroy');

        Route::get('classes', [SchoolClassController::class, 'index'])->name('classes.index');
        Route::post('classes', [SchoolClassController::class, 'store'])->name('classes.store');
        Route::patch('classes/{class}', [SchoolClassController::class, 'update'])->name('classes.update');
        Route::delete('classes/{class}', [SchoolClassController::class, 'destroy'])->name('classes.destroy');

        Route::get('students', [StudentController::class, 'index'])->name('students.index');
        Route::post('students', [StudentController::class, 'store'])->name('students.store');
        Route::patch('students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');

        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/attendance.csv', [ReportController::class, 'export'])->name('reports.export');
    });

    // ── Taking attendance (homeroom teachers only) ──────────────────────────
    Route::middleware('role:teacher')->group(function () {
        Route::get('attendance', [AttendanceController::class, 'index'])->name('attendance.index');
        Route::get('attendance/{class}/take', [AttendanceController::class, 'take'])->name('attendance.take');
        Route::post('attendance/{class}', [AttendanceController::class, 'store'])->name('attendance.store');
        Route::get('attendance/{class}/history', [AttendanceController::class, 'history'])->name('attendance.history');
    });

    // ── A student's own record (student only) ───────────────────────────────
    Route::middleware('role:student')->group(function () {
        Route::get('my-attendance', [StudentAttendanceController::class, 'index'])->name('attendance.my');
    });
});

require __DIR__.'/settings.php';
