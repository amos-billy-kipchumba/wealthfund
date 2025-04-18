<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'amount' => rand(2, 100099),
            'status' => 'Pending',
            'investor_id' => rand(1, 9),
            'disbursed_at' => now(),
            'asset_provider_id' => 1,
            'product_id'=> rand(1, 9)
        ];
    }
}
