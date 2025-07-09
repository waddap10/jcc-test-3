<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
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
            'venues' => ['required', 'array', 'min:1'],
            'venues.*' => ['integer', 'exists:venues,id'],
            'load_start' => ['required', 'date'],
            'load_end' => ['required', 'date', 'after_or_equal:load_start'],
            'show_start' => ['required', 'date'],
            'show_end' => ['required', 'date', 'after_or_equal:show_start'],
            'unload_start' => ['required', 'date'],
            'unload_end' => ['required', 'date', 'after_or_equal:unload_start'],
            'event_name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'customer.organizer' => ['required', 'string', 'max:255'],
            'customer.address' => ['required', 'string', 'max:500'],
            'customer.contact_person' => ['nullable', 'string', 'max:255'],
            'customer.email' => ['nullable', 'email', 'max:255'],
            'customer.phone' => ['required', 'string', 'max:20'],
            'beos' => ['array'],
            'beos.*.department_id' => ['nullable', 'integer', 'exists:departments,id'],
            'beos.*.description' => ['nullable', 'string'],

        ];
    }
}
