<?php

namespace App\Models;

use Database\Factories\StudentFactory;
use Illuminate\Database\Eloquent\Attributes\Appends;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'user_id', 'school_class_id', 'admission_no', 'name',
    'guardian_name', 'guardian_phone', 'date_of_birth', 'gender',
])]
#[Appends(['attendance_rate'])]
class Student extends Model
{
    /** @use HasFactory<StudentFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<SchoolClass, $this>
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    /**
     * @return HasMany<AttendanceRecord, $this>
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    /**
     * The percentage of school days this student was marked present or late.
     *
     * Excused absences are left out of the denominator entirely — an excused
     * day is not a strike against a student, so it should not drag the rate
     * down the way an unexplained absence does. A late arrival still counts
     * as half credit, since it is better than missing the day outright.
     *
     * @return Attribute<float, never>
     */
    protected function attendanceRate(): Attribute
    {
        return Attribute::get(function (): float {
            $records = $this->relationLoaded('attendanceRecords')
                ? $this->attendanceRecords
                : $this->attendanceRecords()->get();

            $countable = $records->where('status', '!=', 'excused');

            if ($countable->isEmpty()) {
                return 0.0;
            }

            $credit = $countable->sum(fn (AttendanceRecord $record) => match ($record->status) {
                'present' => 1,
                'late' => 0.5,
                default => 0,
            });

            return round(($credit / $countable->count()) * 100, 1);
        });
    }
}
