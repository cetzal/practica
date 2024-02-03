<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BrandView extends Model
{
    use HasFactory,
        SoftDeletes;

    protected $table = 'view_brands';

    public function scopeFilter($query, $request)
    {
        $where = [];
        if (!empty($request->brand)) {
            $where[] = ['name', '=', $request->brand];
        }

        if (!empty($request->brand)) {
            $where[] = ['name', '=', $request->brand];
        }

       return $query->where($where);
    }
}
