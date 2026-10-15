<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DailyActivity extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date' => 'date',
        'activities' => 'array',
    ];

    public function gelara()
    {
        return $this->belongsTo(Gelara::class);
    }
}
