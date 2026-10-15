<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PengadaanAset extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'tanggal_pengajuan' => 'date',
        'tanggal_diterima' => 'date',
        'estimasi_biaya' => 'decimal:2',
    ];
}
