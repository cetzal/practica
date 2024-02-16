<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suppliers extends Model
{
    use HasFactory;

    protected $table = 'suppliers';

    protected $fillable = ['name', 'is_active', 'user_id'];

    public function brands()
    { 
        return $this->belongsToMany(Brand::class,'brands_suppliers','supplier_id','brand_id');
    }
}
