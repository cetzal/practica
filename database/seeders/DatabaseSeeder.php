<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //User::factory(1)->create();
        \App\Models\User::create(['name' => 'omar',
        'role_id' => 1,
        'last_name' => 'cetzal',
        'email' => 'admin@hotmail.com',
        'password' => Hash::make('12345678'), //'$2y$10$TKh8H1.PfQx37YgCzwiKb.KjNyWgaHb9cbcoQgdIVFlYg7B77UdFm', // secret
        'remember_token' =>Str::random(10),
        'picture' => '']);
    }
}
