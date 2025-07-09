<?php

namespace App\Http\Controllers;

use App\Http\Requests\BeoRequest;
use App\Models\Beo;
use App\Models\Department;
use App\Models\Order;
use Inertia\Inertia;

use function Pest\Laravel\get;

class BeoController extends Controller
{
    public function index()
    {
        $orders = Order::get();

        return Inertia::render('beos/index', compact('orders'));
    }

    public function show($id)
{
    $order = Order::with('beos.department')->findOrFail($id);


    return Inertia::render('beos/show', [
        'order' => $order,
        'flash' => session('flash', []),
    ]);
}

    public function create(Order $order)
{
    $departments = Department::select('id','name')->get();

    return Inertia::render('beos/create', [
      'order'       => $order->only('id','event_name'),
      'departments' => $departments,
      'flash'       => session('success') ? ['message' => session('success')] : [],
    ]);
}


    // STEP 2: store under that $order
    public function store(BeoRequest $request, Order $order)
    {
        $data = $request->validated();

        // ensure the BEO is tied to this order
        $data['order_id'] = $order->id;

        Beo::create($data);

        return redirect()
            ->route('beos.show', $order->id)
            ->with('success', 'Assignment created successfully.');
    }


    public function edit(Beo $beo)
    {
        $orders = Order::orderBy('name')->pluck('name', 'id');
        $departments = Department::orderBy('name')->pluck('name', 'id');

        return Inertia::render('beos/edit', compact('beo', 'orders', 'departments'));
    }

    public function update(BeoRequest $request, Beo $beo)
    {
        $data = $request->validated();

        $beo->update($data);

        return redirect()
            ->route('beos.index')
            ->with('success', 'Assignment updated successfully.');
    }

    public function destroy(Beo $beo)
    {
        $beo->delete();

        return redirect()
            ->route('beos.index')
            ->with('success', 'Assignment deleted successfully.');
    }

}
