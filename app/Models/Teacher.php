<?php

namespace App\Models;

use Database\Factories\TeacherFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['user_id', 'staff_no', 'phone', 'subject_specialty'])]
class Teacher extends Model
{
    /** @use HasFactory<TeacherFactory> */
    use HasFactory;

    /**
     * The login account linked to this teacher, if any.
     *
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Classes where this teacher is the homeroom teacher.
     *
     * @return HasMany<SchoolClass, $this>
     */
    public function homeroomClasses(): HasMany
    {
        return $this->hasMany(SchoolClass::class, 'homeroom_teacher_id');
    }

    /**
     * Attendance sessions this teacher has taken.
     *
     * @return HasMany<AttendanceSession, $this>
     */
    public function attendanceSessions(): HasMany
    {
        return $this->hasMany(AttendanceSession::class, 'taken_by');
    }
}
