<?php

namespace App\Http\Controllers;

use App\Http\Requests\CustomerRequest;
use Illuminate\Http\Request;
use App\Models\Customer;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = Customer::all();

        return Inertia::render('customers/index', compact('customers'));
    }

    public function create()
    {
        return Inertia::render('customers/create', []);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:customers',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:500',
        ]);

       Customer::create($request->all());

        return redirect()->route('customers.index')->with('message', 'Customer created successfully.');
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('customers/edit', compact('customer')); 
    }

    public function update(CustomerRequest $request, Customer $customer)
    {
        $data = $request->validated();
        $customer->update($data);

        return redirect()->route('customers.index')->with('message', 'Customer updated successfully.');
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();

        return redirect()->route('customers.index')->with('message', 'Customer deleted successfully.');
    }
}
