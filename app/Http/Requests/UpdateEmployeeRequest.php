<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeRequest extends FormRequest
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
            'salary' => 'nullable',
            'loan_limit' => 'nullable',
            'user_id' => 'nullable',
            'company_id' => 'nullable',
            'passport_number' => 'nullable',
            'id_number' => 'nullable',
            'id_front' => 'nullable',
            'id_back' => 'nullable',
            'passport_front' => 'nullable',
            'passport_back' => 'nullable',
            'approved' => 'nullable',
            'unique_number'=> 'nullable'
        ];
    }
}
