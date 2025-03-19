<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLoanRequest extends FormRequest
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
            'employee_id' => 'nullable',
            'loan_provider_id' => 'nullable',
            'reason'=>'reason'
        ];
    }
}
