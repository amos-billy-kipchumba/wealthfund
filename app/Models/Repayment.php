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
        'user_id',
        'number',
        'remittance_id',
        'status',
        'investor_id'
    ];

    public function investor()
    {
        return $this->belongsTo('App\Models\Investor', 'investor_id');
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
    }
}

