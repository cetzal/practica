<?php

namespace App\Http\Controllers;

use App\Models\LogModule;
use App\Traits\LogModuleTrait;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests, LogModuleTrait;

    public function log($previous_data = [], $current_data, $module = '', $movement_type = 'Creacion'){
        LogModule::create($this->logFormat(
            [
                'previous' => $previous_data,
                'current' => $current_data->getOriginal(),
                'module' => $module,
                'movement_type' => $movement_type
            ]
        ));
    }
}
