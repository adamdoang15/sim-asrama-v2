<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Database\Factories\PegawaiFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    /** @use HasFactory<PegawaiFactory> */
    use BelongsToLembaga, HasFactory;

    protected $guarded = [];

    protected $appends = ['status_berkas'];

    public function getStatusBerkasAttribute()
    {
        $isValid = ! empty($this->niy) && ! empty($this->foto) && $this->foto !== 'Belum Ada Foto';

        return $isValid ? 'Berkas Lengkap' : 'Belum Valid';
    }
}
