<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Asset;
use Carbon\Carbon;

class Asset extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'status',
        'disbursed_at',
        'investor_id',
        'asset_provider_id',
        'asset',
        'otp',
        'product_id'
    ];

    protected $appends = ['charges', 'currentBalance'];

    // Relationship with Investor
    public function investor()
    {
        return $this->hasOne('App\Models\Investor', 'id', 'investor_id');
    }

    // Relationship with AssetProvider
    public function assetProvider()
    {
        return $this->hasOne('App\Models\AssetProvider', 'id', 'asset_provider_id');
    }

    public function product()
    {
        return $this->hasOne('App\Models\Product', 'id', 'product_id');
    }

    // Relationship with Repayment

    public function getWithdrawalFloatAttribute()
    {
        if (!$this->investor || !$this->product || !$this->created_at) {
            return 0; 
        }
    
        // Get total repayments for the investor
        $totalRepayments = $this->investor->repayments()
            ->where('status', 'Paid')
            ->orWhere('status', 'Pending')
            ->sum('amount');
    
    
        // Fetch related assets
        $assets = Asset::with(['product'])
        ->where('investor_id', '=', $this->investor->id)
        ->whereHas('product', function ($query) {
            $query->whereRaw('DATE_ADD(assets.created_at, INTERVAL products.days DAY) > ?', [Carbon::now()]);
        })
        ->get();
    
        // Compute total asset value
        $totalAssetValue = 0;
        foreach ($assets as $asset) {
            if ($asset->product) {
                $daysSinceCreated = now()->diffInDays($asset->created_at);

                $totalAssetValue += $asset->product->payout * $daysSinceCreated;
            }
        }
    
        // Count referred users
        $userCount = User::where('referral_number', $this->investor->user->unique_number)->count();
    
        // Calculate final withdrawal float value
        return round((($totalAssetValue + ($userCount * 20)) - $totalRepayments), 2);
    }
    
    
    

    public function getChargesAttribute()
    {
        $investor = $this->investor;
        if ($investor && $this->product) {
            $payout = $this->product->payout;
            $days = $this->product->days;
            return round(($payout * $days - $this->amount), 2);
        }
    
        return round($this->amount, 2);
    }
    
    public function getCurrentBalanceAttribute()
    {
        if (!$this->investor || !$this->product) {
            return 0;
        }
    
        $totalRepayments = $this->investor->repayments()
            ->where('status', 'Paid')
            ->sum('amount');
    
        return round(($this->product->payout * $this->product->days) - $totalRepayments, 2);
    }
    
    

    protected static function boot()
    {
        parent::boot();
    
        static::creating(function ($repayment) {
            $latestRepayment = static::latest('id')->first();
            $nextNumber = 1;
    
            if ($latestRepayment && preg_match('/\d+$/', $latestRepayment->number, $matches)) {
                $nextNumber = (int) $matches[0] + 1;
            }
    
            $repayment->number = 'NY0TA-P-' . $nextNumber;
        });
    
        static::created(function ($repayment) {
            // Fetch all unpaid assets ordered by creation date
            $assets = Asset::where('investor_id', $repayment->investor_id)
                ->where('status', '!=', 'Paid') // Only consider unpaid assets
                ->orderBy('created_at', 'asc')
                ->get();
        
            $remainingAmount = $repayment->amount;
        
            foreach ($assets as $asset) {
                if ($remainingAmount <= 0) break; // Stop if no money is left to allocate
        
                // Get total repayments linked to this specific asset
                $totalPaidForAsset = Repayment::where('asset_id', $asset->id)
                    ->where('status', 'Paid')
                    ->sum('amount');
        
                // Calculate how much is still owed for this asset
                $outstandingBalance = $asset->amount - $totalPaidForAsset;
        
                // 🔥 FIX: Ensure new assets aren't mistakenly marked as "Paid"
                if ($totalPaidForAsset == 0) {
                    // If no payment exists for this asset, do not change status
                    $asset->status = 'Approved';
                } elseif ($remainingAmount >= $outstandingBalance) {
                    // Fully pay this asset
                    $asset->status = 'Paid';
                    $remainingAmount -= $outstandingBalance;
                } 
        
                $asset->save();
            }
        
            // Log remaining amount for debugging
            \Log::info("Remaining amount after asset repayment: " . $remainingAmount);
        });
        
    }
    
}
