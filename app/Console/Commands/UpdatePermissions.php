<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UpdatePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update system permissions dynamically and sync them with roles';

    /**
     * List of permissions.
     *
     * @var array
     */
    protected array $permissions = [
        'Index user', 'View user', 'Create user', 'Edit user', 'Delete user', 'Export user',
        'Index company', 'View company', 'Create company', 'Edit company', 'Delete company', 'Export company',
        'Index employee', 'View employee', 'Create employee', 'Edit employee', 'Delete employee', 'Export employee',
        'Index loan', 'View loan', 'Create loan', 'Edit loan', 'Delete loan', 'Export loan',
        'Index loan provider', 'View loan provider', 'Create loan provider', 'Edit loan provider', 'Delete loan provider', 'Export loan provider',
        'Index notification', 'View notification', 'Create notification', 'Edit notification', 'Delete notification', 'Export notification',
        'Index remittance', 'View remittance', 'Create remittance', 'Edit remittance', 'Delete remittance', 'Export remittance',
        'Index repayments', 'View repayments', 'Create repayments', 'Edit repayments', 'Delete repayments', 'Export repayments',
    ];

    /**
     * Role-based permission assignments.
     *
     * @var array
     */
    protected array $rolePermissions = [
        'Nyotafund Admin' => '*', 
        'Company Admin' => [
            'user', 'employee', 'loan', 'notification', 'remittance', 'repayments'
        ],
        'HR' => [
            'user', 'employee', 'loan', 'notification', 'remittance', 'repayments'
        ],
        'Finance' => [
            'user', 'loan', 'loan provider', 'remittance', 'repayments', 'notification'
        ],
        'Employee' => [
            'user', 'loan', 'notification', 'remittance', 'repayments'
        ],
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Ensure all permissions exist
        foreach ($this->permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
            $this->info("Ensured permission: {$permission}");
        }

        // Sync roles with relevant permissions
        foreach ($this->rolePermissions as $roleName => $entities) {
            $role = Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);

            if ($entities === '*') {
                // Full access to all permissions
                $role->syncPermissions(Permission::all());
                $this->info("Synced all permissions to role: {$roleName}");
            } else {
                // Filter permissions based on assigned entities
                $permissionsToAssign = Permission::where(function ($query) use ($entities) {
                    foreach ($entities as $entity) {
                        $query->orWhere('name', 'like', "%{$entity}%");
                    }
                })->get();

                $role->syncPermissions($permissionsToAssign);
                $this->info("Synced " . $permissionsToAssign->count() . " permissions to role: {$roleName}");
            }
        }

        $this->info('Permissions and roles synced successfully!');
    }
}
