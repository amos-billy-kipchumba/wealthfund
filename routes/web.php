<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\ProductController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetProviderController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RepaymentController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RemittanceController;
use App\Http\Controllers\DashboardController;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/forbidden', function () {
    return Inertia::render('Auth/Forbidden');
})->name('forbidden');

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');


Route::get('/products/search/{uniqueNumber}', [ProductController::class, 'search'])
    ->name('products.search');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('products', ProductController::class);
    
    Route::get('/products/list', [ProductController::class, 'list'])->name('products.list');

    Route::resource('employees', EmployeeController::class);
    Route::get('/products/{product}/employees', [EmployeeController::class, 'getEmployeesByProduct'])
    ->name('product.employees');
    
    Route::resource('assets', AssetController::class);
    Route::get('/assets/{asset}/approve', [AssetController::class, 'approve'])->name('assets.approval');
    Route::post('/assets/{asset}/assetApproval', [AssetController::class, 'approveAsset'])->name('assets.approveAsset');
    Route::post('/assets/bulk-update', [AssetController::class, 'bulkUpdate'])->name('assets.bulkUpdate');
    Route::post('/assets/bulk-repayment', [AssetController::class, 'bulkRepayment'])->name('assets.bulkRepayment');
    Route::resource('assetProviders', AssetProviderController::class);
    Route::resource('notifications', NotificationController::class);
    Route::resource('repayments', RepaymentController::class);
    Route::resource('remittances', RemittanceController::class);
    Route::resource('users', UserController::class);

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::post('/update-permissions/{user}', function (Request $request, User $user) {
        $permissions = $request->input('permissions', []);
    
        // Ensure permissions exist before syncing
        $validPermissions = Permission::whereIn('name', $permissions)->pluck('id')->toArray();
    
        // Manually update model_has_permissions to ensure model_type is set
        DB::table('model_has_permissions')->where('model_id', $user->id)->delete();
        foreach ($validPermissions as $permissionId) {
            DB::table('model_has_permissions')->insert([
                'model_id' => $user->id,
                'permission_id' => $permissionId,
                'model_type' => User::class, // Explicitly setting model_type
            ]);
        }
    
        return redirect()->back()->with('success', 'Permissions updated successfully');
    });
});


Route::post('/mpesa/result', [AssetController::class, 'handleMpesaCallback']);


Route::post('/mpesa/timeout', [AssetController::class, 'handleTimeout'])->name('mpesa.timeout');


Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');





require __DIR__.'/auth.php';
