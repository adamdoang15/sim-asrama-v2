<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RaporPelengkap extends Model
{
    use BelongsToLembaga, HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'ekskul' => 'array',
        'absensi_sakit' => 'integer',
        'absensi_izin' => 'integer',
        'absensi_alpha' => 'integer',
    ];

    public function gelara(): BelongsTo
    {
        return $this->belongsTo(Gelara::class);
    }
}
