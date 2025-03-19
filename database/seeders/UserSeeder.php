<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Artisan;

class UserSeeder extends Seeder
{
    public function run()
    {
        $roleMap = [
            1 => 'Super Admin',
            2 => 'Company Admin',
            3 => 'Employee',
            4 => 'Office Admin',
            5 => 'HR',
            6 => 'Finance',
        ];

        // Create 50 random users and assign roles + permissions
        User::factory(50)->create()->each(function ($user) use ($roleMap) {
            $roleName = $roleMap[$user->role_id] ?? null;
            if ($roleName) {
                $role = Role::where('name', $roleName)->first();
                if ($role) {
                    $user->assignRole($role);
                    $user->syncPermissions($role->permissions);
                }
            }
        });

        // Create one user for each role (for testing)
        foreach ($roleMap as $roleId => $roleName) {
            $user = User::factory()->create([
                'role_id' => $roleId,
                'email' => strtolower(str_replace(' ', '', $roleName)) . '@nyotafund.com',
                'name' => $roleName . ' User',
            ]);

            $role = Role::where('name', $roleName)->first();
            if ($role) {
                $user->assignRole($role);
                $user->syncPermissions($role->permissions);
            }
        }

        // Run the permissions sync command
        Artisan::call('permissions:sync-users-with-roles');
    }
}
