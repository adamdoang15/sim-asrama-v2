<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransaksiKeuangan extends Model
{
    use BelongsToLembaga, HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'tanggal' => 'date',
        'nominal' => 'decimal:2',
    ];

    public const POS_LIST = [
        'BOP OT Mandiri',
        'Bansos LKP',
        'Tabungan Gelara',
        'Tabungan Umum',
        'Tabungan Qurban Sapi Civitas Asrama',
        'Hasil Pertanian dll',
        'Infak Gelara',
    ];
}
