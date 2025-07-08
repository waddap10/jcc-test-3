<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'event_name',
        'load_start',
        'load_end',
        'show_start',
        'show_end',
        'unload_start',
        'unload_end',
        'status',
        'customer_id',
    ];

    protected $casts = [
        'load_start'  => 'date',
        'load_end'    => 'date',
        'show_start'  => 'date',
        'show_end'    => 'date',
        'unload_start' => 'date',
        'unload_end'   => 'date',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function venue()
    {
        return $this->belongsToMany(Venue::class, 'order_details');
    }

    public function beos()
    {
        return $this->hasMany(Beo::class);
    }
}
