<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        Permission::create(['name' => 'Index user', 'guard_name' => 'web']);
        Permission::create(['name' => 'View user', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create user', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit user', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete user', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export user', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index company', 'guard_name' => 'web']);
        Permission::create(['name' => 'View company', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create company', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit company', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete company', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export company', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'View employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export employee', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index loan', 'guard_name' => 'web']);
        Permission::create(['name' => 'View loan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create loan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit loan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete loan', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export loan', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index loan provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'View loan provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create loan provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit loan provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete loan provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export loan provider', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index notification', 'guard_name' => 'web']);
        Permission::create(['name' => 'View notification', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create notification', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit notification', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete notification', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export notification', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index remittance', 'guard_name' => 'web']);
        Permission::create(['name' => 'View remittance', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create remittance', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit remittance', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete remittance', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export remittance', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index repayments', 'guard_name' => 'web']);
        Permission::create(['name' => 'View repayments', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create repayments', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit repayments', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete repayments', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export repayments', 'guard_name' => 'web']);
    }
}
