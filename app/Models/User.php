<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    public const ROLES = ['admin', 'teacher', 'student'];

    /**
     * The teacher record linked to this login account, if any.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne<Teacher, $this>
     */
    public function teacher(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Teacher::class);
    }

    /**
     * The student record linked to this login account, if any.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasOne<Student, $this>
     */
    public function student(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Determine whether the user holds any of the given roles.
     */
    public function hasRole(string ...$roles): bool
    {
        return in_array($this->role, $roles, true);
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
