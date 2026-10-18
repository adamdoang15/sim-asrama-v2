<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Model;

class KalenderAkademik extends Model
{
    use BelongsToLembaga;

    protected $guarded = [];
}
