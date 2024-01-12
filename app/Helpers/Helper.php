<?php
namespace App\Helpers;

class Helper {
    public static function navigation_selected ($navigation) {
        var_dump($navigation);
        // exit;
        return request()->route()->getName() === $navigation ? 'active' : '';
    }
}