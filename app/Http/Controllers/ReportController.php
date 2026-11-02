<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\SchoolClass;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    public function index(): Response
    {
        $classRates = SchoolClass::with('students')
            ->orderBy('name')
            ->get()
            ->map(function (SchoolClass $class) {
                $rates = $class->students->pluck('attendance_rate')->filter(fn ($rate) => $rate > 0);

                return [
                    'id' => $class->id,
                    'name' => $class->name,
                    'students_count' => $class->students->count(),
                    'average_rate' => $rates->isEmpty() ? 0 : round($rates->avg(), 1),
                ];
            });

        return Inertia::render('reports/index', [
            'classRates' => $classRates,
        ]);
    }

    /**
     * Stream every attendance record ever taken as a CSV export.
     */
    public function export(): StreamedResponse
    {
        $headers = ['Date', 'Class', 'Student', 'Admission No', 'Status', 'Remarks'];

        return response()->streamDownload(function () use ($headers) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            AttendanceRecord::with(['session.schoolClass', 'student'])
                ->chunk(200, function ($records) use ($handle) {
                    foreach ($records as $record) {
                        fputcsv($handle, [
                            $record->session->date->toDateString(),
                            $record->session->schoolClass?->name,
                            $record->student?->name,
                            $record->student?->admission_no,
                            $record->status,
                            $record->remarks,
                        ]);
                    }
                });

            fclose($handle);
        }, 'attendance.csv', ['Content-Type' => 'text/csv']);
    }
}
