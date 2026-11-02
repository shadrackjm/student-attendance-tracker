<?php

namespace Database\Factories;

use App\Models\AttendanceSession;
use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttendanceSession>
 */
class AttendanceSessionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'school_class_id' => SchoolClass::factory(),
            'taken_by' => null,
            'date' => fake()->date(),
            'note' => null,
        ];
    }
}
