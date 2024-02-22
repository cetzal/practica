<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable =[

        "date", "reference_no", "user_id","supplier_id", "item", "total_qty",  "total", "status", "payment_status", "note"
    ];
}
