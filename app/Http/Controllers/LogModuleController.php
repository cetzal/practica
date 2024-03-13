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
        $modules_list = DB::table('view_modules_combo')->get();
        $movement_types_list = DB::table('view_movement_types_combo')->get();
        return view('log-module.index', compact('modules_list', 'movement_types_list'));
    }

    public function list(Request $request)
    {
        $where = [];

        if (!empty($request->module_id)) {
            $where[] = ['module_id', 'like', '%'.$request->module_id.'%'];
        }

        if (!empty($request->movement_type_id)) {
            $where[] = ['movement_type_id', 'like', '%'.$request->movement_type_id.'%'];
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
                    ->orderByDesc('movement_date')
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

    public function edit($id) 
    {
        $log_data = DB::table('view_log_modules')->select(['details', 'movement_date' ])
                    ->find($id);
        return $log_data;
    }

    public function showRecord(Request $request, $id) 
    {
        $record_id = $id;
        $record_name = $request->record_name;
        $module_name = '';

        
        $logs = DB::table('view_log_modules')
            ->select([
                'id', 'module_id','module_name', 
                'movement_type_name', 'user_name','movement_date'
            ])
            ->where('modified_record_id',$id)
            ->get();
        
        
        if ($logs->count()) {
            $module_name = $logs->first()->module_name;
        }

        $totalData = $logs->count();
        $totalFiltered = $logs->count();
      
        $draw            = intval($request->draw);
        $recordsTotal    = intval($totalData);
        $recordsFiltered = intval($totalFiltered);
        $data            = $logs;

        return view('log-module.log-record', compact(
            'record_id',
            'record_name',
            'module_name', 
            'draw',
            'recordsTotal',
            'recordsFiltered',
            'data',
        ));
    }
}
