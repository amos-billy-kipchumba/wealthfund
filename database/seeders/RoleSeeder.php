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

        // Product Admin
        $productAdminRole = Role::create(['name' => 'Product Admin', 'guard_name' => 'web']);

        $productAdminPermissions = [
            'Index user', 'View user', 'Create user', 'Edit user', 'Export user',
            'Index investor', 'View investor', 'Create investor', 'Edit investor', 'Export investor',
            'Index asset', 'View asset', 'Edit asset', 'Export asset',
            'Index notification', 'View notification', 'Create notification', 'Edit notification', 'Export notification',
            'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments'
        ];
        $productAdminRole->syncPermissions($productAdminPermissions);

        // Investor Role (Limited access)
        $investorRole = Role::create(['name' => 'Investor', 'guard_name' => 'web']);
        $investorPermissions = [
            'View user',
            'View investor', 'Create investor',
            'Create asset', 'Index asset', 'View asset',
            'Index notification', 'View notification',
            'Index remittance', 'View remittance',
            'Index repayments', 'View repayments', 'Create repayments'
        ];
        $investorRole->syncPermissions($investorPermissions);


        // Office Admin Role
        $officeAdminRole = Role::create(['name' => 'Office Admin', 'guard_name' => 'web']);
        $officeAdminPermissions = [
            'Index user', 'View user',
            'Index product', 'View product', 'Create product', 'Edit product', 'Export product',
            'Index investor', 'View investor', 'Create investor', 'Edit investor', 'Export investor',
            'Index asset', 'View asset', 'Edit asset', 'Export asset',
            'Index asset provider', 'View asset provider', 'Create asset provider', 'Edit asset provider', 'Export asset provider',
            'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments',
            'Index notification', 'View notification', 'Create notification'
        ];
        $officeAdminRole->syncPermissions($officeAdminPermissions);

        // HR Role
        $hrRole = Role::create(['name' => 'HR', 'guard_name' => 'web']);
        $hrPermissions = [
            'Index user', 'View user',
            'Index investor', 'View investor', 'Create investor', 'Edit investor', 'Export investor',
            'Index asset', 'View asset', 'Edit asset', 'Export asset',
            'Index notification', 'View notification', 'Create notification',
            'Index remittance', 'View remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Export repayments'
        ];
        $hrRole->syncPermissions($hrPermissions);

        // Finance Role
        $financeRole = Role::create(['name' => 'Finance', 'guard_name' => 'web']);
        $financePermissions = [
            'Index user', 'View user',
            'Index investor', 'View investor', 'Create investor', 'Edit investor', 'Export investor',
            'Index asset', 'View asset', 'Edit asset', 'Export asset',
            'Index asset provider', 'View asset provider', 'Create asset provider', 'Edit asset provider', 'Export asset provider',
            'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Export remittance',
            'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Export repayments',
            'Index notification', 'View notification', 'Create notification'
        ];
        $financeRole->syncPermissions($financePermissions);

    }
}
