<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'salary'=>$this->salary,
            'asset_limit' => $this->asset_limit,
            'user_id' => $this->user_id,
            'product_id' => $this->product_id,
            'user'=>$this->user,
            'product'=>$this->product
        ];
    }
}
