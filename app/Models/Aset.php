<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Aset extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'tanggal_perolehan' => 'date',
        'tanggal_pemeriksaan_terakhir' => 'date',
        'tanggal_penghapusan' => 'date',
        'nilai_perolehan' => 'decimal:2',
    ];

    public function perbaikans(): HasMany
    {
        return $this->hasMany(PerbaikanAset::class, 'aset_id');
    }
}
