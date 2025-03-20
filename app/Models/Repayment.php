<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Repayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'payment_date',
        'asset_id',
        'number',
        'remittance_id',
        'status'
    ];

    public function asset(){
        return $this->hasOne('App\Models\Asset', 'id', 'asset_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($repayment) {
            // Generate the asset number
            $latestRepayment = static::latest('id')->first();
            $nextNumber = $latestRepayment ? ((int) substr($latestRepayment->number, strrpos($latestRepayment->number, '-') + 1)) + 1 : 1;

            $repayment->number = '4hB-P-' . $nextNumber;
        });
    }
}
