<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // 1) Pull month/year from query (default to today)
        $today = Carbon::today();
        $month = (int) $request->query('month', $today->month);
        $year  = (int) $request->query('year',  $today->year);

        // 2) Compute the current and next‐month ranges
        $startOfMonth = Carbon::create($year, $month, 1)->startOfMonth();
        $endOfMonth   = (clone $startOfMonth)->endOfMonth();
        $startNext    = (clone $startOfMonth)->addMonth()->startOfMonth();
        $endNext      = (clone $startOfMonth)->addMonth()->endOfMonth();

        // 3) Metrics: count orders by load_start this & next month
        $eventsThisMonth = Order::whereBetween('load_start', [
            $startOfMonth, $endOfMonth,
        ])->count();

        $eventsNextMonth = Order::whereBetween('load_start', [
            $startNext, $endNext,
        ])->count();

        // 4) Segment counts within this month
        $loadCount   = Order::whereBetween('load_start',   [$startOfMonth, $endOfMonth])->count();
        $showCount   = Order::whereBetween('show_start',   [$startOfMonth, $endOfMonth])->count();
        $unloadCount = Order::whereBetween('unload_start', [$startOfMonth, $endOfMonth])->count();

        // 5) Nearest upcoming LOAD event
        $nearest = Order::where('load_start', '>=', $today)
            ->orderBy('load_start', 'asc')
            ->first();

        $nearestEvent = $nearest
            ? [
                'name'       => $nearest->event_name,
                'load_start' => $nearest->load_start->toDateString(),
                'days_until' => $today->diffInDays($nearest->load_start),
              ]
            : null;

        // 6) Render — make sure this matches your Dashboard.tsx filename
        return Inertia::render('Dashboard', [
            'month'            => $month,
            'year'             => $year,
            'eventsThisMonth'  => $eventsThisMonth,
            'eventsNextMonth'  => $eventsNextMonth,
            'loadCount'        => $loadCount,
            'showCount'        => $showCount,
            'unloadCount'      => $unloadCount,
            'nearestEvent'     => $nearestEvent,
        ]);
    }
}