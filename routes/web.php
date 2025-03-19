<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\LoanProviderController;
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


Route::get('/companies/search/{uniqueNumber}', [CompanyController::class, 'search'])
    ->name('companies.search');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('companies', CompanyController::class);
    
    Route::get('/companies/list', [CompanyController::class, 'list'])->name('companies.list');

    Route::resource('employees', EmployeeController::class);
    Route::get('/companies/{company}/employees', [EmployeeController::class, 'getEmployeesByCompany'])
    ->name('company.employees');
    
    Route::resource('loans', LoanController::class);
    Route::get('/loans/{loan}/approve', [LoanController::class, 'approve'])->name('loans.approval');
    Route::post('/loans/{loan}/loanApproval', [LoanController::class, 'approveLoan'])->name('loans.approveLoan');
    Route::post('/loans/bulk-update', [LoanController::class, 'bulkUpdate'])->name('loans.bulkUpdate');
    Route::post('/loans/bulk-repayment', [LoanController::class, 'bulkRepayment'])->name('loans.bulkRepayment');
    Route::resource('loanProviders', LoanProviderController::class);
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


Route::post('/mpesa/result', [LoanController::class, 'handleMpesaCallback']);


Route::post('/mpesa/timeout', [LoanController::class, 'handleTimeout'])->name('mpesa.timeout');


Route::get('/uikit/button', function () {
    return Inertia::render('main/uikit/button/page');
})->name('button');





require __DIR__.'/auth.php';
