<?php

namespace App\Traits;

use Carbon\Carbon;
use Facade\FlareClient\Http\Response;

trait DataTableResponse
{
    public function formatResponse($draw, $total_records, $total_filter, $data){
        
        return response()->json([
            "draw"            => intval($draw),  
            "recordsTotal"    => intval($total_records),  
            "recordsFiltered" => intval($total_filter), 
            "data"            => $data
        ]);
    }
}
