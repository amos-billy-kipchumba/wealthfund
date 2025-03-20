<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssetProvider>
 */
class AssetProviderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Nyotafund Product Limited',
            'email' => 'info@nyotafund.com',
            'phone' => '0700000000',
            'api_url' => 'https://google.com', 
        ];
    }
}
