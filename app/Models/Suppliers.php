<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Suppliers extends Model
{
    use SoftDeletes;
    protected $table = 'suppliers';

    protected $fillable = ['name', 'is_active', 'user_id'];

    public function brands()
    { 
        return $this->belongsToMany(Brand::class,'brands_suppliers','supplier_id','brand_id');
    }
}
