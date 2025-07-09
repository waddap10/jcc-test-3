<?php

use App\Http\Controllers\BeoController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\VenueController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::get('customers/{customer}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    Route::get('departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::get('departments/create', [DepartmentController::class, 'create'])->name('departments.create');
    Route::post('departments', [DepartmentController::class, 'store'])->name('departments.store');
    Route::get('departments/{department}', [DepartmentController::class, 'show'])->name('departments.show');
    Route::get('departments/{department}/edit', [DepartmentController::class, 'edit'])->name(name: 'departments.edit');
    Route::put('departments/{department}', [DepartmentController::class, 'update'])->name('departments.update');
    Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

    Route::get('venues', [VenueController::class, 'index'])->name('venues.index');
    Route::get('venues/create', [VenueController::class, 'create'])->name('venues.create');
    Route::post('venues', [VenueController::class, 'store'])->name('venues.store');
    Route::get('venues/{venue}', [VenueController::class, 'show'])->name('venues.show');
    Route::get('venues/{venue}/edit', [VenueController::class, 'edit'])->name('venues.edit');
    Route::put('venues/{venue}', [VenueController::class, 'update'])->name('venues.update');
    Route::delete('venues/{venue}', [VenueController::class, 'destroy'])->name('venues.destroy');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::get('orders/{order}/edit', [OrderController::class, 'edit'])->name('orders.edit');
    Route::put('orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::delete('orders/{order}', [OrderController::class, 'destroy'])->name('orders.destroy');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])
        ->name('orders.status.update');

    Route::get('beos', [BeoController::class, 'index'])->name('beos.index');
    Route::get('beos/{order}/create', [BeoController::class, 'create'])->name('beos.create');
    Route::post('orders/{order}/beos', [BeoController::class, 'store'])->name('beos.store');
    Route::get('beos/{beo}', [BeoController::class, 'show'])->name('beos.show');
    Route::get('beos/{beo}/edit', [BeoController::class, 'edit'])->name('beos.edit');
    Route::put('beos/{beo}', [BeoController::class, 'update'])->name('beos.update');
    Route::delete('beos/{beo}', [BeoController::class, 'destroy'])->name('beos.destroy');

    

    Route::get('calendars', [OrderController::class, 'calendar'])->name('orders.calendar');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
