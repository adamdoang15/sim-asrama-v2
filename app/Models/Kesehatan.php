<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Kesehatan extends Model
{
    use BelongsToLembaga, HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'berat_badan' => 'float',
        'tinggi_badan' => 'float',
        'imt' => 'float',
        'riwayat_sakit' => 'array',
    ];

    public function gelara(): BelongsTo
    {
        return $this->belongsTo(Gelara::class);
    }
}
