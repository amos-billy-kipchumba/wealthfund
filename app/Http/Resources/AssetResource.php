<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssetResource extends JsonResource
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
            'amount'=>$this->amount,
            'status' => $this->status,
            'disbursed_at' => $this->disbursed_at,
            'investor_id' => $this->investor_id,
            'provider_id' => $this->provider_id,
            'investor'=>$this->investor,
            'provider'=>$this->provider
        ];
    }
}
