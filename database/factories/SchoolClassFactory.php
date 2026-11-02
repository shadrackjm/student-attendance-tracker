<?php

namespace Database\Factories;

use App\Models\SchoolClass;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SchoolClass>
 */
class SchoolClassFactory extends Factory
{
    public function definition(): array
    {
        $grade = fake()->numberBetween(1, 6);
        $section = fake()->randomElement(['A', 'B', 'C']);

        return [
            'name' => "Grade {$grade}{$section}",
            'grade_level' => "Grade {$grade}",
            'homeroom_teacher_id' => null,
            'capacity' => 35,
        ];
    }
}
