<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => null,
            'school_class_id' => null,
            'admission_no' => 'ADM-'.fake()->unique()->numerify('#####'),
            'name' => fake()->name(),
            'guardian_name' => fake()->name(),
            'guardian_phone' => fake()->phoneNumber(),
            'date_of_birth' => fake()->dateTimeBetween('-13 years', '-6 years')->format('Y-m-d'),
            'gender' => fake()->randomElement(['male', 'female']),
        ];
    }
}
