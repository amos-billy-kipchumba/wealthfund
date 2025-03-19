<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Remittance extends Model
{
    use HasFactory;

    protected $fillable = [
        'remittance_number',
        'company_id'
    ];

    public function company(){
        return $this->hasOne('App\Models\Company', 'id', 'company_id');
    }

    public function repayments()
    {
        return $this->hasMany('App\Models\Repayment', 'remittance_id');
    }
    
}
