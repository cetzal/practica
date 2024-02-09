<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogProduct extends Model
{
    use HasFactory;

    protected $table = 'log_products';

    protected $fillable = [
        'user_id',
        'movement_type',
        'details',
        'movement_date',
    ];
}
