<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Enum\ModuleEnum;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class LogRecordController extends Controller
{
    public function index(Request $request, $id)
    {
        $record_id = $id;
        $record_name = $request->record_name;
        $module_name = $request->module_name;
        $movement_types_list = DB::table('view_movement_types_combo')->get();

        return view(
            'log-record.index', 
            compact('record_id', 'record_name', 'module_name', 'movement_types_list')
        );
    }

    public function list(Request $request, $id)
    {
        $module_id = ModuleEnum::getValueConstant(strtoupper($request->module_name));
        $where = [];
        
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

        $where[]=['module_id', $module_id];
        $where[]=['modified_record_id',$id];

        $data = DB::table('view_log_modules')
                ->select([
                    'id', 'module_id','module_name', 
                    'movement_type_name', 'user_name','movement_date'
                ])
                ->where($where)
                ->orderBy('movement_date', 'DESC')
                ->get();

        $totalData = $data->count();
        $totalFiltered = $data->count();
        $json_data = array(
            "draw"            => intval($request->input('draw')),  
            "recordsTotal"    => intval($totalData),  
            "recordsFiltered" => intval($totalFiltered), 
            "data"            => $data   
        );
        
        return response()->json($json_data);
    }

    public function show(Request $request, $id, $id_log)
    {
        $module_id = ModuleEnum::getValueConstant(strtoupper($request->module_name));
        $where = [
            ['module_id', $module_id],
            ['modified_record_id',$id],
            ['id', $id_log]
        ];

        $log_data = DB::table('view_log_modules')
                ->select([
                    'details'
                ])
                ->where($where)
                ->first();
        return $log_data;
    }
}
