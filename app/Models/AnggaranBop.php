<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnggaranBop extends Model
{
    use BelongsToLembaga, HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'plan' => 'decimal:2',
        'aktual' => 'decimal:2',
    ];

    protected $appends = ['selisih'];

    public function getSelisihAttribute(): float
    {
        return (float) ($this->plan ?? 0) - (float) ($this->aktual ?? 0);
    }
}
