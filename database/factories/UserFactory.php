<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $name = $this->faker->name;
        $last_name = $this->faker->lastName;
        return [
            'name' => $name,
            'role_id' => \App\Models\Role::all()->random()->id,
            'last_name' => $last_name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('12345678'), //'$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', // secret
            'remember_token' =>Str::random(10),
            'picture' => \Faker\Provider\Image::image(storage_path() . '/app/public/users', 200, 200, 'people', false),
        ];
    }
}
