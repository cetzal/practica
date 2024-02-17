<?php

namespace App\Traits;

use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;

trait LogModuleTrait
{
    /**
     * 
     */
    // public function logFormat(array $previous_value, array $current_value, $movement_type)
    public function logFormat($data)
    {

        return [
            'user_id' => JWTAuth::toUser()->id,
            'module_id'  => $data['module_id'],
            'movement_type_id' => $data['movement_type_id'],
            'modified_record_id' => $data['modified_record_id'],
            'details' => $this->formatDetails($data['previous'], $data['current']),
            'movement_date' => date('Y-m-d H:i:s'),
        ];
    }

    private function formatDetails($previous_value, $current_value) 
    {
        if (isset($current_value['created_at']) && $current_value['created_at'] instanceof Carbon) {
            $current_value['created_at'] = $current_value['created_at']->toDateTimeString();
        }
        if (isset($current_value['updated_at']) && $current_value['updated_at'] instanceof Carbon) {
            $current_value['updated_at'] = $current_value['updated_at']->toDateTimeString();
        }
        $previous_value = (count($previous_value) > 0) ? $previous_value : null;
        $current_value = (count($current_value) > 0) ? $current_value : null;
        
        return json_encode(
            [
                'previous_value' => $previous_value,
                'current_value' => $current_value
            ]
        );
    }
} 