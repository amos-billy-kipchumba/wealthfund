<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Asset;
use App\Models\Investor;
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

        if ($user->role_id == 3 && $user->email_verified_at == null) {
            return Inertia::render('Auth/VerifyEmail', [
                'products' => $products,
                'user' => $user
            ]);
        }


        $activeAssetsQuery = Asset::with(['assetProvider', 'investor.user', 'investor.product'])
        ->where('status', '=', 'Approved');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $activeAssetsQuery->whereHas('investor.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $activeAssetsQuery->whereHas('investor.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        // Fetch the assets and append the currentBalance
        $activeAssets = $activeAssetsQuery->get();
        $activeAssetsValue = $activeAssets->sum(function ($asset) {
            return $asset->currentBalance;
        });
        
        $activeAssetsCount = $activeAssets->count();


        $pendingAssetQuery = Asset::with(['assetProvider', 'investor.user', 'investor.product'])
        ->where('status', '=', 'Pending');
    
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $pendingAssetQuery->whereHas('investor.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $pendingAssetQuery->whereHas('investor.user', function ($q) use ($user) {
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
            $inactiveAssetsQuery->whereHas('investor.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $inactiveAssetsQuery->whereHas('investor.user', function ($q) use ($user) {
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
            'asset.investor.user',
            'asset.investor.product',
        ]);
        
           if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
            $repaidAssetsQuery->whereHas('asset.investor.user', function ($q) use ($user) {
                $q->where('product_id', '=', $user->product_id);
            });
        } elseif ($user->role_id == 3) {
            $repaidAssetsQuery->whereHas('asset.investor.user', function ($q) use ($user) {
                $q->where('id', '=', $user->id);
            });
        }
        
        $repaidAssetsValue = $repaidAssetsQuery->sum('amount');
        

        $currentYear = Carbon::now()->year;

        // Get asset trends for all months
        $assetTrends = collect(range(1, 12))->map(function ($month) use ($currentYear, $user) {
            $assetQuery = Asset::with(['investor.user', 'investor.product'])
                ->whereYear('created_at', $currentYear)
                ->where('status', '!=', 'Declined')
                ->whereMonth('created_at', $month);

               if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
                $assetQuery->whereHas('investor.user', function ($q) use ($user) {
                    $q->where('product_id', '=', $user->product_id);
                });
            } elseif ($user->role_id == 3) {
                $assetQuery->whereHas('investor.user', function ($q) use ($user) {
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
                'asset.investor.user',
                'asset.investor.product',
            ])->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $month);

               if ($user->role_id == 2 || $user->role_id == 5 || $user->role_id == 6) {
                $repaymentQuery->whereHas('asset.investor.user', function ($q) use ($user) {
                    $q->where('product_id', '=', $user->product_id);
                });
            } elseif ($user->role_id == 3) {
                $repaymentQuery->whereHas('asset.investor.user', function ($q) use ($user) {
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
            return Inertia::render('Investors/SelectProduct', [
                'user'=>$user,
                'er'=>$er
            ]);

        }else {

            $investor = Investor::where('user_id', '=', $user->id)->first();

            if (($investor && $user->role_id != "1" && $user->role_id != "2" && $investor->approved != 'Approved') || $user->status === 'Deactivated') {
                return Inertia::render('Investors/ProcessedRequest', [
                    'products' => $products,
                    'user' => $user,
                ]);
            }

            $investorsCount = 0; 

            if ($user->role_id == "2") {
                $investorsCount = Investor::where('product_id', $user->product_id)->count();
            }
            
            if ($user->role_id == "1") {
                $investorsCount = Investor::count();
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
                'investorsCount' => $investorsCount,
                'investor'=>$investor
            ]);
            
        }
    }
}