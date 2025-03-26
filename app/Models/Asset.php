<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Asset;

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
            ->sum('amount');
    
        // Calculate days since created
        $daysSinceCreated = now()->diffInDays($this->created_at);
    
        // Fetch related assets
        $assets = Asset::with(['product'])->where('investor_id', '=', $this->investor->id)->get();
    
        // Compute total asset value
        $totalAssetValue = 0;
        foreach ($assets as $asset) {
            if ($asset->product) {
                $totalAssetValue += $asset->product->payout * $daysSinceCreated;
            }
        }
    
        // Count referred users
        $userCount = User::where('referral_number', $this->investor->user->unique_number)->count();
    
        // Calculate final withdrawal float value
        return round($totalAssetValue - $totalRepayments + ($userCount * 20), 2);
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
                ->where('status', '!=', 'Paid')
                ->orderBy('created_at', 'asc')
                ->get();
    
            $remainingAmount = $repayment->amount;
    
            foreach ($assets as $asset) {
                $assetBalance = $asset->amount - Repayment::where('investor_id', $repayment->investor_id)
                    ->where('status', 'Paid')
                    ->sum('amount');
    
                if ($remainingAmount <= 0) break; // Stop if there's no more amount to allocate
    
                if ($remainingAmount >= $assetBalance) {
                    // Fully pay this asset
                    $asset->status = 'Paid';
                    $remainingAmount -= $assetBalance;
                } else {
                    // Partially pay this asset
                    $asset->status = 'Approved';
                    $remainingAmount = 0;
                }
    
                $asset->save();
            }
        });
    }
    
}