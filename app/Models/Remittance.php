<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remittance extends Model
{
    use HasFactory;

    protected $fillable = [
        'remittance_number',
        'product_id'
    ];

    public function product(){
        return $this->hasOne('App\Models\Product', 'id', 'product_id');
    }

    public function repayments()
    {
        return $this->hasMany('App\Models\Repayment', 'remittance_id');
    }
    
}
