<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'name' => 'nullable',
            'phone' => 'nullable',
            'role_id' => 'nullable',
            'email' => 'nullable',
            'password' => 'nullable',
            'status' => 'nullable',
            'staff_number' => 'nullable',
            'kyc'=> 'nullable',
            'referral_number'=>'nullable'
        ];
    }
}
