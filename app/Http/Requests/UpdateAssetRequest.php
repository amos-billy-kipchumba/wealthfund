<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAssetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => 'nullable',
            'status' => 'nullable',
            'otp' => 'nullable',
            'disbursed_at' => 'nullable',
            'investor_id' => 'nullable',
            'asset_provider_id' => 'nullable',
            'reason'=>'reason',
            'product_id'=> 'nullable'
        ];
    }
}
