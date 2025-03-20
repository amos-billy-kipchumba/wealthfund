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

        Permission::create(['name' => 'Index product', 'guard_name' => 'web']);
        Permission::create(['name' => 'View product', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create product', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit product', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete product', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export product', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'View employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete employee', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export employee', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index asset', 'guard_name' => 'web']);
        Permission::create(['name' => 'View asset', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create asset', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit asset', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete asset', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export asset', 'guard_name' => 'web']);

        Permission::create(['name' => 'Index asset provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'View asset provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Create asset provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Edit asset provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Delete asset provider', 'guard_name' => 'web']);
        Permission::create(['name' => 'Export asset provider', 'guard_name' => 'web']);

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
