<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LogModuleController extends Controller
{
    //
    public function index()
    {
        return view('log-module.index');
    }

    public function list(Request $request)
    {
        $query = DB::table('view_log_products');

        $data = $query->get();
        $totalData = $data->count();
        $totalFiltered = $data->count();
        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($totalData),  
            "recordsFiltered" => intval($totalFiltered), 
            "data"            => $data   
        );
            
        echo json_encode($json_data);
    }

    public function edit() {

    }
}
