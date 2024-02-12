<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LogModuleController extends Controller
{
    //
    public function index()
    {
        return view('log-module.index');
    }

    public function list(Request $request)
    {
        $query = DB::table('view_log_modules');
        $data = $query->get();
        Log::emergency('list logs');
        Log::emergency(print_r($data, true));

        $totalData = $data->count();
        $totalFiltered = $data->count();
        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($totalData),  
            "recordsFiltered" => intval($totalFiltered), 
            "data"            => $data   
        );
            
        // echo json_encode($json_data);
        return response()->json($json_data);
    }

    public function edit($id) {
        $log_data = DB::table('view_log_modules')->select(['details', 'movement_date' ])
                    ->find($id);
        return $log_data;
    }
}
