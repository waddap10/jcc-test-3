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
            'customer:id,organizer',
            'venues:id,name'
        ])->get();

        return Inertia::render('orders/index', compact('orders'));
    }


    public function create(Request $request)
    {
        // load all venues & departments
        $venues = Venue::select('id', 'name')->get();
        $departments = Department::select('id', 'name')->get();

        // figure out which venue IDs were pre‐selected
        $ids = $request->query('venues', []);
        $bookings = [];

        foreach ($ids as $vid) {
            // grab every existing order that uses this venue
            $orders = Order::whereHas('venues', fn($q) => $q->where('venues.id', $vid))
                ->get([
                    'load_start',
                    'load_end',
                    'show_start',
                    'show_end',
                    'unload_start',
                    'unload_end',
                ]);

            // map each order’s three windows into a single array
            foreach ($orders as $o) {
                $bookings[] = [
                    'venue_id' => (int) $vid,
                    'load_start' => optional($o->load_start)->toDateString(),
                    'load_end' => optional($o->load_end)->toDateString(),
                    'show_start' => optional($o->show_start)->toDateString(),
                    'show_end' => optional($o->show_end)->toDateString(),
                    'unload_start' => optional($o->unload_start)->toDateString(),
                    'unload_end' => optional($o->unload_end)->toDateString(),
                ];
            }
        }

        return Inertia::render('orders/create', [
            'venues' => $venues,
            'departments' => $departments,
            'bookings' => $bookings,
            'flash' => session('flash', []),
        ]);
    }


    public function store(OrderRequest $request)
{
    $data = $request->validated();

    DB::transaction(function () use ($data) {
        // 1. Create customer
        $customer = Customer::create($data['customer']);

        // 2. Create order
        $order = $customer
            ->orders()
            ->create([
                'event_name'   => $data['event_name'],
                'load_start'   => $data['load_start'],
                'load_end'     => $data['load_end'],
                'show_start'   => $data['show_start'],
                'show_end'     => $data['show_end'],
                'unload_start' => $data['unload_start'],
                'unload_end'   => $data['unload_end'],
            ]);

        // 3. Sync venues
        $order->venues()->sync($data['venues'] ?? []);

        // 4. Prepare and create BEOs
        foreach ($data['beos'] as $b) {
            // only create when a vendor was chosen
            if (!empty($b['department_id'])) {
                Beo::create([
                    'order_id'    => $order->id,
                    'department_id'   => $b['department_id'],
                    'description' => $b['description'] ?? null,
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
                'event_name' => $data['event_name'],
                'load_start' => $data['load_start'],
                'load_end' => $data['load_end'],
                'show_start' => $data['show_start'],
                'show_end' => $data['show_end'],
                'unload_start' => $data['unload_start'],
                'unload_end' => $data['unload_end'],
            ]);

            // 2. Sync venues
            $order->venues()->sync($data['venues']);
            // 3. Refresh BEOs
            $order->beos()->delete();
            foreach ($data['beos'] as $b) {
                if (!empty($b['department_id'])) {
                    Beo::create([
                        'order_id' => $order->id,
                        'department_id' => $b['department_id'],
                        'description' => $b['description'] ?? null,
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
        $order->update(['status' => 1]);

        return redirect()
            ->route('orders.index')
            ->with('flash', ['message' => "Order #{$order->id} status confirm."]);
    }

    // app/Http/Controllers/OrderController.php

    public function calendar(Request $request)
{
    // 1. Determine target month/year
    $month = (int) $request->query('month', now()->month);
    $year  = (int) $request->query('year',  now()->year);

    // 2. Calculate the month’s date range
    $startOfMonth = \Carbon\Carbon::create($year, $month, 1)->startOfMonth();
    $endOfMonth   = $startOfMonth->copy()->endOfMonth();

    // 3. Fetch venues once
    $venues = Venue::select('id', 'name')->get();

    // 4. Fetch all orders that have any of their three windows overlapping this month
    $orders = Order::with('venues')
        ->where(function ($q) use ($startOfMonth, $endOfMonth) {
            $q->whereBetween('load_start',   [$startOfMonth, $endOfMonth])
              ->orWhereBetween('load_end',     [$startOfMonth, $endOfMonth])
              ->orWhereBetween('show_start',   [$startOfMonth, $endOfMonth])
              ->orWhereBetween('show_end',     [$startOfMonth, $endOfMonth])
              ->orWhereBetween('unload_start', [$startOfMonth, $endOfMonth])
              ->orWhereBetween('unload_end',   [$startOfMonth, $endOfMonth]);
        })
        ->get();

    // 5. Build a per-venue schedule matrix
    $calendarData = [];
    foreach ($venues as $venue) {
        $calendarData[$venue->id] = [
            'name'  => $venue->name,
            'slots' => [],    // will hold all load/show/unload events
        ];
    }

    foreach ($orders as $order) {
    foreach ($order->venues as $venue) {
        $vid = $venue->id;

        $push = function ($type, $start, $end) use (&$calendarData, $vid, $order) {
            if ($start && $end) {
                $calendarData[$vid]['slots'][] = [
                    'order_id'   => $order->id,
                    'event_name' => $order->event_name,
                    'type'       => $type,
                    'start'      => $start,
                    'end'        => $end,
                    // ← add this line:
                    'status'     => $order->status,
                ];
            }
        };

        $push('load',   $order->load_start,   $order->load_end);
        $push('show',   $order->show_start,   $order->show_end);
        $push('unload', $order->unload_start, $order->unload_end);
    }
}

    // 6. Render with Inertia
    return Inertia::render('orders/calendar', [
        'venues'       => $venues,
        'calendarData' => $calendarData,
        'month'        => $month,
        'year'         => $year,
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
