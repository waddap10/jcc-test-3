<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrderRequest;
use App\Models\Beo;
use App\Models\Order;
use App\Models\Venue;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Customer;
use App\Models\Department;

class OrderController extends Controller
{

    public function index()
    {
        $orders = Order::with([
            'customer:id,name',
            'venues:id,name'
        ])->get();

        return Inertia::render('orders/index', compact('orders'));
    }


    public function create(Request $request)
    {
        $venues = Venue::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();

        // your existing bookings logic…
        $ids = $request->query('venues', []);
        $bookings = [];
        foreach ($ids as $vid) {
            $orders = Order::whereHas('venues', fn($q) => $q->where('venues.id', $vid))
                ->get(['started_at', 'ended_at']);
            foreach ($orders as $o) {
                $bookings[] = [
                    'venue_id' => (int) $vid,
                    'start' => $o->started_at->toDateString(),
                    'end' => $o->ended_at->toDateString(),
                ];
            }
        }

        return Inertia::render('orders/create', [
            'venues' => $venues,
            'bookings' => $bookings,
            'departments' => $departments,
            'flash' => session('flash', []),
        ]);
    }


    public function store(OrderRequest $request)
{
    $data = $request->validated();

    DB::transaction(function () use ($data) {
        // 1. Customer
        $customer = Customer::create($data['customer']);

        // 2. Order (with 3 windows)
        $order = $customer->order()->create([
            'event_name'   => $data['event_name'],
            'load_start'   => $data['load_start'],
            'load_end'     => $data['load_end'],
            'show_start'   => $data['show_start'],
            'show_end'     => $data['show_end'],
            'unload_start' => $data['unload_start'],
            'unload_end'   => $data['unload_end'],
        ]);

        // 3. Venues & BEOs
        $order->venues()->sync($data['venues']);
        foreach ($data['beos'] as $b) {
            if (!empty($b['department_id'])) {
                Beo::create([
                    'order_id'   => $order->id,
                    'department_id'  => $b['department_id'],
                    'description'=> $b['description'] ?? null,
                ]);
            }
        }
    });

    return redirect()
        ->route('orders.index')
        ->with('flash', ['message' => 'Reservation created successfully.']);
}




    // app/Http/Controllers/OrderController.php

    public function edit(Request $request, Order $order)
    {
        // 1) load all venues
        $venues = Venue::select('id', 'name')->get();

        // 2) which venues were originally selected
        $selected = $order->venues->pluck('id')->toArray();

        // 3) gather bookings for each selected venue (excluding this order)
        $bookings = [];
        foreach ($selected as $vid) {
            $past = Order::whereHas('venues', fn($q) => $q->where('venues.id', $vid))
                ->where('id', '!=', $order->id)
                ->get(['started_at', 'ended_at']);

            foreach ($past as $o) {
                $bookings[] = [
                    'venue_id' => $vid,
                    'start' => $o->started_at->toDateString(),
                    'end' => $o->ended_at->toDateString(),
                ];
            }
        }

        // 4) seed your form
        $initialData = [
            'venues' => $selected,
            'started_at' => $order->started_at->toDateString(),
            'ended_at' => $order->ended_at->toDateString(),
            'event_name' => $order->event_name,
            'description' => $order->description,
            'customer' => [
                'name' => $order->customer->name,
                'address' => $order->customer->address,
                'email' => $order->customer->email,
                'phone' => $order->customer->phone,
            ],
        ];

        return Inertia::render('orders/edit', [
            'venues' => $venues,
            'bookings' => $bookings,
            'initialData' => $initialData,
            'orderId' => $order->id,
            'flash' => session('flash', []),
        ]);
    }

    public function update(OrderRequest $request, Order $order)
{
    $data = $request->validated();

    DB::transaction(function () use ($order, $data) {
        // 1. Update customer & order fields
        $order->customer->update($data['customer']);

        $order->update([
            'event_name'   => $data['event_name'],
            'load_start'   => $data['load_start'],
            'load_end'     => $data['load_end'],
            'show_start'   => $data['show_start'],
            'show_end'     => $data['show_end'],
            'unload_start' => $data['unload_start'],
            'unload_end'   => $data['unload_end'],
        ]);

        // 2. Sync venues
        $order->venues()->sync($data['venues']);
        // 3. Refresh BEOs
        $order->beos()->delete();
        foreach ($data['beos'] as $b) {
            if (!empty($b['department_id'])) {
                Beo::create([
                    'order_id'   => $order->id,
                    'department_id'  => $b['department_id'],
                    'description'=> $b  ['description'] ?? null,
                ]);
            }
        }
    });

    return redirect()
        ->route('orders.index')
        ->with('flash', ['message' => 'Reservation updated successfully.']);
}



    /**
     * Remove an order (and its pivot records).
     */
    public function destroy(Order $order)
    {
        DB::transaction(function () use ($order) {
            // Detach all venues
            $order->venues()->detach();

            // Optionally delete the customer if unused elsewhere:
            // $order->customer()->delete();

            // Delete the order itself
            $order->delete();
        });

        return redirect()
            ->route('orders.index')
            ->with('flash', ['message' => 'Reservation deleted successfully.']);
    }

    public function updateStatus(Order $order)
    {
        // toggle or set to “wait”
        $order->update(['status' => 'paid']);

        return redirect()
            ->route('orders.index')
            ->with('flash', ['message' => "Order #{$order->id} status paid."]);
    }

    // app/Http/Controllers/OrderController.php

    public function calendar(Request $request)
    {
        // pull month/year from query (default to today)
        $month = (int) $request->query('month', now()->month);
        $year = (int) $request->query('year', now()->year);

        // return props including the month/year you clicked
        return Inertia::render('orders/calendar', [
            'venues' => Venue::select('id', 'name')->get(),
            'calendarData' => $this->buildMatrix($month, $year),
            'month' => $month,
            'year' => $year,
        ]);
    }

    /**
     * Generate date×venue matrix for any month/year
     */
    protected function buildMatrix(int $month, int $year)
    {
        $start = now()->setYear($year)->setMonth($month)->startOfMonth();
        $end = $start->copy()->endOfMonth();
        $venues = Venue::pluck('id');
        $orders = Order::with('venues')->get();
        $dates = collect();

        for ($d = $start->copy(); $d->lte($end); $d->addDay()) {
            $row = ['date' => $d->toDateString()];
            foreach ($venues as $vid) {
                $row[$vid] = null;
            }
            foreach ($orders as $order) {
                if ($d->between($order->started_at, $order->ended_at)) {
                    foreach ($order->venues as $v) {
                        $row[$v->id] = $order->event_name;
                    }
                }
            }
            $dates->push($row);
        }

        return $dates;
    }

}
