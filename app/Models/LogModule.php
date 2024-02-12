<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogModule extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'logs';

    protected $fillable = [
        'user_id',
        'module',
        'movement_type',
        'details',
        'movement_date',
    ];
}
