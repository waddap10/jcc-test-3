<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VenueRequest extends FormRequest
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
        $venue = $this->route('venue');

        // Get the actual ID (fall back to null if it wasn’t bound yet)
        $id = $venue instanceof \App\Models\Venue
            ? $venue->id
            : $venue;


        return [
            'name' => 'required|string|unique:venues,name,' . $id,
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string',
            'dimension_m' => 'nullable|string',
            'dimension_f' => 'nullable|string',
            'setup_banquet' => 'nullable|integer|min:0',
            'setup_classroom' => 'nullable|integer|min:0',
            'setup_theater' => 'nullable|integer|min:0',
            'setup_reception' => 'nullable|integer|min:0',
            'floor_plan' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ];
    }
}
