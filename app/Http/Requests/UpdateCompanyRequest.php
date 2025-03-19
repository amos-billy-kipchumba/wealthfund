<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCompanyRequest extends FormRequest
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
            'name' => 'nullable|string|max:255',
            'registration_number' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'sectors' => 'nullable|string|max:255',
            'county' => 'nullable|string|max:255',
            'sub_county' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:companies,email',
            'phone' => 'nullable|string|max:15',
            'percentage' => 'nullable|numeric',
            'loan_limit' => 'nullable',
            'unique_number'=> 'nullable|string|max:255',
            'certificate_of_incorporation' => 'nullable|string|max:255',
            'kra_pin' => 'nullable|string|max:255',
            'cr12_cr13' => 'nullable|string|max:255',
            'signed_agreement' => 'nullable|string|max:255',
            'additional_documents' => 'nullable|json',
        ];
    }
}
