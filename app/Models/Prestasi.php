<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Model;

class Prestasi extends Model
{
    use BelongsToLembaga;

    protected $guarded = ['id'];
}
