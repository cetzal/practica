<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LogModule extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'log_modules';

    protected $fillable = [
        'user_id',
        'module_id',
        'movement_type_id',
        'modified_record_id',
        'details',
        'movement_date',
    ];
}
