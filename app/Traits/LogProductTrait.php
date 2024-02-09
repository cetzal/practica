<?php

namespace \App\Traits;

trait LogProductTrait
{
    /**
     * 
     */
    public function logProduct(array $previous_value, array $current_value, $movement_type)
    {
        return [
            'user_id' => JWTAuth::toUser()->id,
            'movement_type' => $movement_type,
            'details' => $this->formatDetails($previous_value, $current_value),
            'movement_date' => date('Y-m-d H:i:s'),
        ];
    }

    private function formatDetails($previous_value, $current_value) 
    {
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