<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Storage;

class Venue extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'photo',
        'description',
        'dimension_m',
        'dimension_f',
        'setup_banquet',
        'setup_classroom',
        'setup_theater',
        'setup_reception',
        'floor_plan'
    ];

    public function order()
    {
        return $this->belongsToMany(Order::class, 'order_details');
    }
    
    public function getPhotoAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return url(Storage::url($value));
    }

    public function getFloorPlanAttribute($value)
    {
        if (!$value) {
            return null;
        }

        return url(Storage::url($value));
    }
}
