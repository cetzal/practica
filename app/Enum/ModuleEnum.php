<?php

namespace App\Enum;

class ModuleEnum
{
    const USERS = 1;
    const BRANDS = 2;
    const PRODUCTS = 3;
    const SUPPLIERS = 5;
    const CLIENTS = 6;
    const ACCOUNTS = 6;

    public static function getValueConstant($constante)
    {
        if (defined("self::$constante")) {
            return constant("self::$constante");
        }

        return null;
    }
}