<?php

namespace App\Http\Controllers;

use App\Models\LogModule;
use App\Traits\DataTableResponse;
use App\Traits\LogModuleTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, LogModuleTrait, DataTableResponse;

    public function log($previous_data = [], $current_data, $modified_record_id, $module_id, $movement_type_id){
        LogModule::create($this->logFormat(
            [
                'previous' => $previous_data,
                'current' => $current_data,
                'modified_record_id' => $modified_record_id,
                'module_id' => $module_id,
                'movement_type_id' => $movement_type_id
            ]
        ));
    }
}
