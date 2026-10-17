<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KelasMapel extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'mapels' => 'array',
        'kkm' => 'float',
    ];
}
