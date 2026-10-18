<?php

namespace App\Models;

use App\Models\Concerns\BelongsToLembaga;
use Illuminate\Database\Eloquent\Model;

class KelasMapel extends Model
{
    use BelongsToLembaga;

    protected $guarded = ['id'];

    protected $casts = [
        'mapels' => 'array',
        'kkm' => 'float',
    ];
}
