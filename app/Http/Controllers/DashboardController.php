<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Asset;
use App\Models\Employee;
use App\Models\Repayment;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        // Fetching basic statistics
        $productCount = Product::count();

        $currentYear = Carbon::now()->year;

        $products = Product::all();

        $user = Auth::user();

        if($user->product_id != null){
            $motherProduct = Product::where('id','=', $user->product_id)->first();
        }

        if ($user->role_id == 3 && $user->email_verified_at == null) {
            return Inertia::render('Auth/VerifyEmail', [
                'products' => $products,
                'user' => $user
            ]);
        }


        $activeAssetsQuery = Asset::with(['assetProvider', 'employee.user', 'employee.product'])
        ->where('status', '=', 'Approved');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $activeAssetsQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $activeAssetsQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the assets and append the currentBalance
        $activeAssets = $activeAssetsQuery->get();
        $activeAssetsValue = $activeAssets->sum(function ($asset) {
            return $asset->currentBalance;
        });
        
        $activeAssetsCount = $activeAssets->count();


        $pendingAssetQuery = Asset::with(['assetProvider', 'employee.user', 'employee.product'])
        ->where('status', '=', 'Pending');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $pendingAssetQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $pendingAssetQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the assets and append the currentBalance
        $pendingAssets = $pendingAssetQuery->get();
        $pendingAssetsValue = $pendingAssets->sum(function ($asset) {
            return $asset->currentBalance;
        });
        
        $pendingAssetsCount = $pendingAssets->count();
        
    
        $inactiveAssetsQuery = Asset::where('status', '=', 'Declined');

           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $inactiveAssetsQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $inactiveAssetsQuery->whereHas('employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the declined assets and append the currentBalance
        $inactiveAssets = $inactiveAssetsQuery->get();
        $inactiveAssetsCount = $inactiveAssets->count();
        
        $inactiveAssetsValue = $inactiveAssets->sum(function ($asset) {
            return $asset->currentBalance;
        });
        
        
        $repaidAssetsQuery = Repayment::with([
            'asset',
            'asset.assetProvider',
            'asset.employee.user',
            'asset.employee.product',
        ]);
        
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $repaidAssetsQuery->whereHas('asset.employee.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $repaidAssetsQuery->whereHas('asset.employee.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        $repaidAssetsValue = $repaidAssetsQuery->sum('amount');
        

        $currentYear = Carbon::now()->year;

        // Get asset trends for all months
        $assetTrends = collect(range(1, 12))->map(function ($month) use ($currentYear, $user) {
            $assetQuery = Asset::with(['employee.user', 'employee.product'])
                ->whereYear('created_at', $currentYear)
                ->where('status', '!=', 'Declined')
                ->whereMonth('created_at', $month);

               if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
                $assetQuery->whereHas('employee.user', function ($q) use ($user) {
                    $q->where('product_id', '=', $user->product_id);
                });
            } elseif ($user->role_id == 3) {
                $assetQuery->whereHas('employee.user', function ($q) use ($user) {
                    $q->where('id', '=', $user->id);
                });
            }
        
            // Fetch assets and compute the total of eventualPay
            $assets = $assetQuery->get();
            $eventualPaySum = $assets->sum(function ($asset) {
                return $asset->amount; // Access the computed attribute
            });
        
            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'asset_count' => $eventualPaySum
            ];
        });
        

        // Get repayment trends for all months
        $repaymentTrends = collect(range(1, 12))->map(function ($month) use ($currentYear, $user) {
            $repaymentQuery = Repayment::with([
                'asset',
                'asset.assetProvider',
                'asset.employee.user',
                'asset.employee.product',
            ])->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $month);

               if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
                $repaymentQuery->whereHas('asset.employee.user', function ($q) use ($user) {
                    $q->where('product_id', '=', $user->product_id);
                });
            } elseif ($user->role_id == 3) {
                $repaymentQuery->whereHas('asset.employee.user', function ($q) use ($user) {
                    $q->where('id', '=', $user->id);
                });
            }

            $amount = $repaymentQuery->sum('amount');

            return [
                'month' => Carbon::create($currentYear, $month, 1)->format('M'), // Convert to month name
                'repayment_value' => $amount
            ];
        });

        if($user->role_id == "3" && $user->kyc == null) {
            $er = '';
            return Inertia::render('Employees/SelectProduct', [
                'user'=>$user,
                'er'=>$er
            ]);

        }else {

            $employee = Employee::where('user_id', '=', $user->id)->first();

            if (($employee && $user->role_id != "1" && $user->role_id != "2" && $employee->approved != 'Approved') || $user->status === 'Deactivated') {
                return Inertia::render('Employees/ProcessedRequest', [
                    'products' => $products,
                    'user' => $user,
                ]);
            }

            $employeesCount = 0; 

            if ($user->role_id == "2") {
                $employeesCount = Employee::where('product_id', $user->product_id)->count();
            }
            
            if ($user->role_id == "1") {
                $employeesCount = Employee::count();
            }
            
            return Inertia::render('Dashboard', [
                'productCount' => $productCount,
                'activeAssetsCount' => $activeAssetsCount,
                'activeAssetsValue'=> $activeAssetsValue,
                'pendingAssetsCount' => $pendingAssetsCount,
                'pendingAssetsValue'=> $pendingAssetsValue,
                'inactiveAssetsCount' => $inactiveAssetsCount,
                'inactiveAssetsValue'=> $inactiveAssetsValue,
                'repaidAssetsValue' => $repaidAssetsValue,
                'assetTrends' => $assetTrends,
                'repaymentTrends' => $repaymentTrends,
                'employeesCount' => $employeesCount,
                'employee'=>$employee,
                'motherProduct'=>$motherProduct ?? null
            ]);
            
        }
    }
}