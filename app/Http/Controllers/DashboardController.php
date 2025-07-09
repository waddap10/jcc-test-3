<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today       = Carbon::today();
        $startOfMonth = $today->copy()->startOfMonth();
        $endOfMonth   = $today->copy()->endOfMonth();
        $startNext    = $startOfMonth->copy()->addMonth();
        $endNext      = $endOfMonth->copy()->addMonth();

        // 1. Events this month
        $eventsThisMonth = Order::whereBetween('started_at', [$startOfMonth, $endOfMonth])->count();

        // 2. Events next month
        $eventsNextMonth = Order::whereBetween('ended_at', [$startNext, $endNext])->count();

        // 3. Nearest upcoming event
        $nearest = Order::where('started_at', '>=', $today)
            ->orderBy('started_at', 'asc')
            ->first();

        $nearestEvent = $nearest
            ? [
                'name'       => $nearest->name,
                'started_at' => $nearest->start_date->toDateString(),
                'days_until' => $today->diffInDays($nearest->start_date),
            ]
            : null;

        return Inertia::render('dashboard', [
            'eventsThisMonth' => $eventsThisMonth,
            'eventsNextMonth' => $eventsNextMonth,
            'nearestEvent'    => $nearestEvent,
        ]);
    }

}
