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


    // in app/Http/Controllers/BeoController.php

public function edit(Beo $beo)
    {
        // Eager‐load its order and department (only the fields we need)
        $beo->load([
            'order:id,event_name',
            'department:id,name',
        ]);

        return Inertia::render('beos/edit', [
            'beo' => [
                'id'               => $beo->id,
                'order_id'         => $beo->order_id,
                'order_name'       => $beo->order->event_name,
                'department_id'    => $beo->department_id,
                'department_name'  => $beo->department->name,
                'description'      => $beo->description,
            ],
            'flash' => ['message' => session('success')],
        ]);
    }

    public function update(BeoRequest $request, Beo $beo)
{
    $validated = $request->validated();

    // Only update the description
    $beo->update(['description' => $validated['description']]);

    // Redirect back to the assignments‐for‐order page,
    // using the parent order's ID instead of the BEO id:
    return redirect()
        ->route('beos.show', $beo->order_id)
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
