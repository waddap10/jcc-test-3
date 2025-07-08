<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Beo extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_id',
        'department_id',
        'description',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
