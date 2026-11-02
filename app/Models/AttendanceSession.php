<?php

namespace App\Models;

use Database\Factories\AttendanceSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

#[Fillable(['school_class_id', 'taken_by', 'date', 'note'])]
class AttendanceSession extends Model
{
    /** @use HasFactory<AttendanceSessionFactory> */
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date:Y-m-d',
        ];
    }

    /**
     * Store the bare date (Y-m-d), the same string updateOrCreate() looks a day up by.
     * With the plain date cast SQLite stored "Y-m-d 00:00:00", so re-saving a day
     * missed the existing session and hit the unique constraint.
     */
    protected function date(): Attribute
    {
        return Attribute::set(fn ($value) => Carbon::parse($value)->toDateString());
    }

    /**
     * @return BelongsTo<SchoolClass, $this>
     */
    public function schoolClass(): BelongsTo
    {
        return $this->belongsTo(SchoolClass::class, 'school_class_id');
    }

    /**
     * @return BelongsTo<Teacher, $this>
     */
    public function takenBy(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'taken_by');
    }

    /**
     * @return HasMany<AttendanceRecord, $this>
     */
    public function records(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }
}
