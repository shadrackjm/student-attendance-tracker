<?php

namespace Database\Factories;

use App\Models\Teacher;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Teacher>
 */
class TeacherFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => null,
            'staff_no' => 'STF-'.fake()->unique()->numerify('####'),
            'phone' => fake()->phoneNumber(),
            'subject_specialty' => fake()->randomElement([
                'Mathematics', 'English', 'Science', 'Social Studies', 'Art', 'Physical Education',
            ]),
        ];
    }
}
