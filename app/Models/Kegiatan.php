<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Model;

class Kegiatan extends Model
{
    use BelongsToLembaga;

    protected $guarded = [];
}
