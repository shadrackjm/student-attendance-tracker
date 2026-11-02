<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentAttendanceController extends Controller
{
    /**
     * The signed-in student's own attendance record.
     */
    public function index(Request $request): Response
    {
        $student = $request->user()->student;

        abort_unless($student, 403, 'Your account is not linked to a student record.');

        $records = $student->attendanceRecords()
            ->with('session')
            ->get()
            ->sortByDesc(fn (AttendanceRecord $record) => $record->session->date)
            ->values()
            ->map(fn (AttendanceRecord $record) => [
                'date' => $record->session->date->format('Y-m-d'),
                'status' => $record->status,
                'remarks' => $record->remarks,
            ]);

        return Inertia::render('attendance/my', [
            'className' => $student->schoolClass?->name,
            'attendanceRate' => $student->attendance_rate,
            'records' => $records,
        ]);
    }
}
