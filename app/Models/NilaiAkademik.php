<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NilaiAkademik extends Model
{
    use BelongsToLembaga, HasFactory;

    protected $guarded = ['id'];

    public function gelara(): BelongsTo
    {
        return $this->belongsTo(Gelara::class);
    }
}
