<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ProductSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            EmployeeSeeder::class,
            AssetProviderSeeder::class,
            AssetSeeder::class,
            NotificationSeeder::class,
            RepaymentSeeder::class,
        ]);
    }
}