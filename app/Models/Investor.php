<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investor extends Model
{
    use HasFactory;

    protected $fillable = [
        'salary',
        'asset_limit',
        'user_id',
        'product_id',
        'passport_number',
        'id_number',
        'id_front',
        'id_back',
        'passport_front',
        'passport_back',
        'approved',
    ];

    // Relationship with Product
    public function product()
    {
        return $this->hasOne('App\Models\Product', 'id', 'product_id');
    }

    // Relationship with User
    public function user()
    {
        return $this->hasOne('App\Models\User', 'id', 'user_id');
    }

    // Relationship with Asset
    public function assets()
    {
        return $this->hasMany('App\Models\Asset', 'investor_id');
    }

    public function repayments()
    {
        return $this->hasMany('App\Models\Repayment', 'investor_id');
    }

    // Accessor for the number of unpaid assets
    public function getUnpaidAssetsCountAttribute()
    {
        return $this->assets()
            ->where('status', '!=', 'paid')
            ->where('status', '!=', 'rejected')
            ->count();
    }

    public function getTotalAssetBalanceAttribute()
    {
        if (!$this->assets()->exists()) {
            return 0; 
        }
    
        return round(
            $this->assets()
                ->whereNotIn('status', ['paid', 'rejected'])
                ->get()
                ->sum(fn($asset) => $asset->currentBalance),
            2
        );
    }
    
    
}
