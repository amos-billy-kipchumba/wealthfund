<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCompanyRequest extends FormRequest
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
             'name' => 'required|string|max:255',
             'registration_number' => 'nullable|string|max:255',
             'industry' => 'nullable|string|max:255',
             'sectors' => 'nullable|string|max:255',
             'county' => 'nullable|string|max:255',
             'loan_limit' => 'nullable',
             'sub_county' => 'nullable|string|max:255',
             'location' => 'nullable|string|max:255',
             'address' => 'nullable|string|max:255',
             'email' => 'required|email|unique:companies,email',
             'phone' => 'required|string|max:15',
             'percentage' => 'required|numeric',
             'unique_number' => 'nullable|string|max:255',
     
             // Fix: Allow file uploads instead of string
             'certificate_of_incorporation' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
             'kra_pin' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
             'cr12_cr13' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
             'signed_agreement' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
     
             // Fix: Allow multiple file uploads for additional documents
             'additional_documents.*' => 'nullable|file|mimes:pdf,jpg,png|max:2048',
         ];
     }
     
}
