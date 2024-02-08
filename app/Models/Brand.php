<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    protected $fillable =[
        "name", "description", "is_active", "created_by","deleted_at"
    ];

    public function product()
    {
    	return $this->hasMany('App/Product');
    	
    }
}
