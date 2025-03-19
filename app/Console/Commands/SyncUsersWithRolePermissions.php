<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class SyncUsersWithRolePermissions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permissions:sync-users-with-roles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync all users with their respective role permissions in model_has_permissions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Syncing users with their respective role permissions...");

        // Fetch all roles
        $roles = Role::all();

        foreach ($roles as $role) {
            // Get permissions assigned to the role
            $permissions = $role->permissions()->pluck('id');

            if ($permissions->isEmpty()) {
                continue; // Skip if the role has no permissions
            }

            // Get all users with this role
            $users = User::where('role_id', $role->id)->get();

            foreach ($users as $user) {
                foreach ($permissions as $permissionId) {
                    DB::table('model_has_permissions')->updateOrInsert(
                        ['model_id' => $user->id, 'model_type' => User::class, 'permission_id' => $permissionId]
                    );
                }
            }
        }

        $this->info("User permissions have been successfully synced.");
    }
}
