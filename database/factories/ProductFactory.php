<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition()
    {
        return [
            'name' => $this->faker->company,
            'amount' => rand(500, 1000),
            'days' => rand(30, 40),
            'payout' => rand(30, 100),
            'logo' => '/icon/1.jpg'
        ];
    }
}
