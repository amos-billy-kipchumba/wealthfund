<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'amount',
        'days',
        'payout',
        'logo',
        'unique_number'
    ];

    protected $casts = [
        'additional_documents' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            do {
                $letter = strtoupper(chr(rand(65, 90))); 
                $randomNumber = rand(10000, 99999);
                $uniqueNumber = $letter . $randomNumber;
            } while (self::where('unique_number', $uniqueNumber)->exists()); 

            $product->unique_number = $uniqueNumber;
        });
    }
}
