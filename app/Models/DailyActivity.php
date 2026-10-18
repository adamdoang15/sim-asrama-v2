<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Model;

class DailyActivity extends Model
{
    use BelongsToLembaga;

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
