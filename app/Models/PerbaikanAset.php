<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PerbaikanAset extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'tanggal_selesai' => 'date',
        'biaya' => 'decimal:2',
    ];

    public function aset(): BelongsTo
    {
        return $this->belongsTo(Aset::class, 'aset_id');
    }
}
