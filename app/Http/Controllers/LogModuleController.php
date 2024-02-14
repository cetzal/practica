<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
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
        $where = [];

        if (!empty($request->search_module)) {
            $where[] = ['module', 'like', '%'.$request->search_module.'%'];
        }

        if (!empty($request->select_movement)) {
            $where[] = ['movement_type', 'like', '%'.$request->select_movement.'%'];
        }
        
        if (!empty($request->user_created)) {
            $where[] = ['user_name', 'like', '%'.$request->user_created.'%'];
        }

        if (!empty($request->range_date)) {
            list($date_from, $date_to) = explode(' - ', $request->range_date);
            $date_from = Carbon::createFromFormat('d/m/Y', $date_from)->format('Y-m-d');
            $date_to = Carbon::createFromFormat('d/m/Y', $date_to)->format('Y-m-d');
            $where[] = [DB::raw('DATE_FORMAT(movement_date,"%Y-%m-%d")'), '>=', trim($date_from)];
            $where[] = [DB::raw('DATE_FORMAT(movement_date,"%Y-%m-%d")'), '<=', trim($date_to)];
        }
        $data = DB::table('view_log_modules')
                    ->where($where)
                    ->get();
       

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
