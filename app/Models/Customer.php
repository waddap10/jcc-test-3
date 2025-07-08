<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'organizer',
        'address',
        'contact_person',
        'phone',
        'email',
    ];

    public function order()
    {
        return $this->hasMany(Order::class);
    }

}
