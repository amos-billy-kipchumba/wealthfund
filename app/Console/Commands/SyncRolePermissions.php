<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;

class SyncUserRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'roles:sync {roleId}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure all users with a specific role_id exist in model_has_roles';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $roleId = $this->argument('roleId');

        // Check if the role exists in Spatie roles table
        $role = Role::find($roleId);
        if (!$role) {
            $this->error("Role with ID $roleId not found.");
            return;
        }

        $this->info("Syncing users with role ID: $roleId into model_has_roles...");

        // Get all users with the given role_id
        $users = User::where('role_id', $roleId)->get();

        foreach ($users as $user) {
            DB::table('model_has_roles')->updateOrInsert(
                ['model_id' => $user->id, 'model_type' => User::class],
                ['role_id' => $roleId]
            );
        }

        $this->info("Synced " . count($users) . " users with role ID: $roleId.");
    }
}
