<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Nyotafund Admin (Full access to everything)
        $nyotafundAdminRole = Role::create(['name' => 'Super Admin', 'guard_name' => 'web']);
        $nyotafundAdminRole->givePermissionTo(Permission::all());

        // Company Admin
        $companyAdminRole = Role::create(['name' => 'Company Admin', 'guard_name' => 'web']);

        $companyAdminPermissions = [
            'Index user', 'View user', 'Create user', 'Edit user', 'Export user',
            'Index employee', 'View employee', 'Create employee', 'Edit employee', 'Export employee',
            'Index loan', 'View loan', 'Edit loan', 'Export loan',
            'Index notification', 'View notification', 'Create notification', 'Edit notification', 'Export notification',
            'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments'
        ];
        $companyAdminRole->syncPermissions($companyAdminPermissions);

        // Employee Role (Limited access)
        $employeeRole = Role::create(['name' => 'Employee', 'guard_name' => 'web']);
        $employeePermissions = [
            'View user',
            'View employee', 'Create employee',
            'Create loan', 'Index loan', 'View loan',
            'Index notification', 'View notification',
            'Index remittance', 'View remittance',
            'Index repayments', 'View repayments'
        ];
        $employeeRole->syncPermissions($employeePermissions);


        // Office Admin Role
        $officeAdminRole = Role::create(['name' => 'Office Admin', 'guard_name' => 'web']);
        $officeAdminPermissions = [
            'Index user', 'View user',
            'Index company', 'View company', 'Create company', 'Edit company', 'Export company',
            'Index employee', 'View employee', 'Create employee', 'Edit employee', 'Export employee',
            'Index loan', 'View loan', 'Edit loan', 'Export loan',
            'Index loan provider', 'View loan provider', 'Create loan provider', 'Edit loan provider', 'Export loan provider',
            'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments',
            'Index notification', 'View notification', 'Create notification'
        ];
        $officeAdminRole->syncPermissions($officeAdminPermissions);

        // HR Role
        $hrRole = Role::create(['name' => 'HR', 'guard_name' => 'web']);
        $hrPermissions = [
            'Index user', 'View user',
            'Index employee', 'View employee', 'Create employee', 'Edit employee', 'Export employee',
            'Index loan', 'View loan', 'Edit loan', 'Export loan',
            'Index notification', 'View notification', 'Create notification',
            'Index remittance', 'View remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Export repayments'
        ];
        $hrRole->syncPermissions($hrPermissions);

        // Finance Role
        $financeRole = Role::create(['name' => 'Finance', 'guard_name' => 'web']);
        $financePermissions = [
            'Index user', 'View user',
            'Index employee', 'View employee', 'Create employee', 'Edit employee', 'Export employee',
            'Index loan', 'View loan', 'Edit loan', 'Export loan',
            'Index loan provider', 'View loan provider', 'Create loan provider', 'Edit loan provider', 'Export loan provider',
            'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments',
            'Index notification', 'View notification', 'Create notification'
        ];
        $financeRole->syncPermissions($financePermissions);

    }
}
