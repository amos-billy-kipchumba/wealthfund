<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
        'otp'
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

    // Relationship with Repayment
    public function repayments()
    {
        return $this->hasMany('App\Models\Repayment', 'asset_id');
    }

    public function getChargesAttribute()
    {
        $investor = $this->investor;
        if ($investor && $investor->product) {
            $percentage = $investor->product->percentage;
            return round(($this->amount * $percentage / 100), 2);
        }
    
        return round($this->amount, 2);
    }
    
    public function getCurrentBalanceAttribute()
    {
        $totalRepayments = $this->repayments()->where('status','!=','Pending Paid')->sum('amount');
    
        return round($this->amount - $totalRepayments, 2);
    }
    

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($asset) {
            $latestAsset = static::latest('id')->first();
            $nextNumber = $latestAsset ? ((int) substr($latestAsset->number, strrpos($latestAsset->number, '-') + 1)) + 1 : 1;

            $asset->number = '4hB-L-' . $nextNumber;
        });
    }
}