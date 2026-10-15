<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Gelara extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function nilaiAkademiks(): HasMany
    {
        return $this->hasMany(NilaiAkademik::class);
    }

    public function raporPelengkaps(): HasMany
    {
        return $this->hasMany(RaporPelengkap::class);
    }

    public function kesehatans(): HasMany
    {
        return $this->hasMany(Kesehatan::class);
    }

    public function prestasis(): HasMany
    {
        return $this->hasMany(Prestasi::class, 'nim', 'nig');
    }
}
